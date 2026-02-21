<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();

// Filtering logic
$page_id = isset($_GET['page_id']) && !empty($_GET['page_id']) ? (int)$_GET['page_id'] : null;
$link_id = isset($_GET['link_id']) && !empty($_GET['link_id']) ? (int)$_GET['link_id'] : null;
$start_date = $_GET['start_date'] ?? null;
$end_date = $_GET['end_date'] ?? null;

function build_filters($page_id, $link_id, $start_date, $end_date, &$params) {
    $sql = "";
    if ($page_id) {
        $sql .= " AND page_id = ?";
        $params[] = $page_id;
    }
    if ($link_id) {
        $sql .= " AND link_id = ?";
        $params[] = $link_id;
    }
    if ($start_date) {
        $sql .= " AND created_at >= ?";
        $params[] = $start_date . ' 00:00:00';
    }
    if ($end_date) {
        $sql .= " AND created_at <= ?";
        $params[] = $end_date . ' 23:59:59';
    }
    return $sql;
}

try {
    $stats = [
        'timeline' => [],
        'devices'  => [],
        'browsers' => [],
        'referrers'=> [],
        'activity' => [],
        'totals'   => [
            'total_events' => 0,
            'unique_visitors' => 0,
            'node_interactions' => 0,
            'total_cities' => 0
        ]
    ];

    // 1. Timeline (Default last 7 days if no dates provided)
    $t_params = [$user_id];
    $t_filters = build_filters($page_id, $link_id, $start_date, $end_date, $t_params);
    $t_range = ($start_date || $end_date) ? "" : " AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";

    $timeline_stmt = $pdo->prepare("
        SELECT DATE(created_at) as date, 
               COUNT(CASE WHEN link_id IS NULL THEN 1 END) as views,
               COUNT(CASE WHEN link_id IS NOT NULL THEN 1 END) as clicks
        FROM analytics 
        WHERE user_id = ? $t_filters $t_range
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ");
    $timeline_stmt->execute($t_params);
    $stats['timeline'] = $timeline_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Browser & Device Analysis
    $ua_params = [$user_id];
    $ua_filters = build_filters($page_id, $link_id, $start_date, $end_date, $ua_params);
    $ua_stmt = $pdo->prepare("SELECT user_agent FROM analytics WHERE user_id = ? $ua_filters");
    $ua_stmt->execute($ua_params);
    $user_agents = $ua_stmt->fetchAll(PDO::FETCH_COLUMN);

    $browsers = ['Chrome' => 0, 'Safari' => 0, 'Firefox' => 0, 'Edge' => 0, 'Other' => 0];
    $devices = ['Mobile' => 0, 'Desktop' => 0, 'Tablet' => 0];

    foreach ($user_agents as $ua) {
        if (strpos($ua, 'Edg') !== false) $browsers['Edge']++;
        elseif (strpos($ua, 'Chrome') !== false) $browsers['Chrome']++;
        elseif (strpos($ua, 'Safari') !== false) $browsers['Safari']++;
        elseif (strpos($ua, 'Firefox') !== false) $browsers['Firefox']++;
        else $browsers['Other']++;

        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) $devices['Tablet']++;
        elseif (preg_match('/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i', $ua)) $devices['Mobile']++;
        else $devices['Desktop']++;
    }
    
    foreach ($browsers as $name => $count) if($count > 0) $stats['browsers'][] = ['name' => $name, 'value' => $count];
    foreach ($devices as $name => $count) if($count > 0) $stats['devices'][] = ['name' => $name, 'value' => $count];

    // 3. Referrer Sources
    $ref_params = [$user_id];
    $ref_filters = build_filters($page_id, $link_id, $start_date, $end_date, $ref_params);
    $ref_stmt = $pdo->prepare("
        SELECT COALESCE(NULLIF(referrer, ''), 'Direct/Organic') as name, COUNT(*) as value 
        FROM analytics 
        WHERE user_id = ? $ref_filters
        GROUP BY name 
        ORDER BY value DESC 
        LIMIT 5
    ");
    $ref_stmt->execute($ref_params);
    $stats['referrers'] = $ref_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Live Activity Feed (Filtered)
    $act_params = [$user_id];
    $act_filters = build_filters($page_id, $link_id, $start_date, $end_date, $act_params);
    $act_stmt = $pdo->prepare("
        SELECT 
            id, 
            COALESCE(NULLIF(country, ''), 'Unknown Origin') as country,
            COALESCE(NULLIF(city, ''), 'Unknown Sector') as city,
            COALESCE(NULLIF(country_code, ''), 'UN') as country_code,
            COALESCE(NULLIF(isp, ''), 'Unknown Sector') as isp,
            COALESCE(NULLIF(org, ''), 'Unknown Sector') as org,
            user_agent,
            created_at,
            CASE WHEN link_id IS NOT NULL THEN 'link_click' ELSE 'page_view' END as event_type
        FROM analytics 
        WHERE user_id = ? $act_filters
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $act_stmt->execute($act_params);
    $stats['activity'] = $act_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Advanced Totals
    $tot_params = [$user_id];
    $tot_filters = build_filters($page_id, $link_id, $start_date, $end_date, $tot_params);
    $total_stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total_events,
            COUNT(DISTINCT visitor_id) as unique_visitors,
            COUNT(CASE WHEN link_id IS NOT NULL THEN 1 END) as node_interactions,
            COUNT(CASE WHEN link_id IS NULL THEN 1 END) as page_views
        FROM analytics 
        WHERE user_id = ? $tot_filters
    ");
    $total_stmt->execute($tot_params);
    $res = $total_stmt->fetch(PDO::FETCH_ASSOC);
    
    $total_events = (int)($res['total_events'] ?? 0);
    $unique_visitors = (int)($res['unique_visitors'] ?? 0);
    $node_interactions = (int)($res['node_interactions'] ?? 0);
    $page_views = (int)($res['page_views'] ?? 0);

    $stats['totals']['total_events'] = $total_events;
    $stats['totals']['unique_visitors'] = $unique_visitors;
    $stats['totals']['node_interactions'] = $node_interactions;
    
    // Average Session Duration (approximate by visitor timeframe)
    $session_stmt = $pdo->prepare("
        SELECT AVG(duration) FROM (
            SELECT (UNIX_TIMESTAMP(MAX(created_at)) - UNIX_TIMESTAMP(MIN(created_at))) as duration 
            FROM analytics 
            WHERE user_id = ? $tot_filters 
            GROUP BY visitor_id
        ) as t
    ");
    $session_stmt->execute($tot_params);
    $avg_duration = (int)$session_stmt->fetchColumn();
    
    $stats['totals']['avg_session_seconds'] = $avg_duration;
    $stats['totals']['avg_session_display'] = floor($avg_duration / 60) . 'm ' . ($avg_duration % 60) . 's';
    
    // Urban Coverage count
    $city_params = [$user_id];
    $city_filters = build_filters($page_id, $link_id, $start_date, $end_date, $city_params);
    $city_count_stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT city_name) FROM (
            SELECT COALESCE(NULLIF(city, ''), 'Unknown Sector') as city_name 
            FROM analytics 
            WHERE user_id = ? $city_filters
        ) as t
    ");
    $city_count_stmt->execute($city_params);
    $stats['totals']['total_cities'] = (int)$city_count_stmt->fetchColumn();

    // 6. Behavioral Metrics
    // Conversion Rate: Clicks / Views
    $stats['totals']['conversion_rate'] = $page_views > 0 ? round(($node_interactions / $page_views) * 100, 2) : 0;

    // Active Nodes: Links that received at least one click in the period
    $active_nodes_stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT link_id) 
        FROM analytics 
        WHERE user_id = ? AND link_id IS NOT NULL $tot_filters
    ");
    $active_nodes_stmt->execute($tot_params);
    $stats['totals']['active_nodes'] = (int)$active_nodes_stmt->fetchColumn();

    // Bounce Rate: Percentage of visitors with only one event in the period
    $bounce_stmt = $pdo->prepare("
        SELECT COUNT(*) as single_event_visitors FROM (
            SELECT visitor_id FROM analytics 
            WHERE user_id = ? $tot_filters 
            GROUP BY visitor_id HAVING COUNT(*) = 1
        ) as sub
    ");
    $bounce_stmt->execute($tot_params);
    $single_event_count = (int)$bounce_stmt->fetchColumn();
    $stats['totals']['bounce_rate'] = $unique_visitors > 0 ? round(($single_event_count / $unique_visitors) * 100, 2) : 0;

    // User Loyalty: Percentage of returning visitors (more than 1 visit in any period, but let's define as returning within OUR filter)
    $loyalty_stmt = $pdo->prepare("
        SELECT COUNT(*) as returning_visitors FROM (
            SELECT visitor_id FROM analytics 
            WHERE user_id = ? $tot_filters 
            GROUP BY visitor_id HAVING COUNT(*) > 1
        ) as sub
    ");
    $loyalty_stmt->execute($tot_params);
    $returning_count = (int)$loyalty_stmt->fetchColumn();
    $stats['totals']['user_loyalty'] = $unique_visitors > 0 ? round(($returning_count / $unique_visitors) * 100, 2) : 0;

    // Traffic Sources Breakdown for CircularProgress
    $stats['sources'] = [];
    $total_ref = 0;
    foreach($stats['referrers'] as $ref) $total_ref += (int)$ref['value'];
    foreach($stats['referrers'] as $ref) {
        $stats['sources'][] = [
            'name' => $ref['name'],
            'value' => (int)$ref['value'],
            'percent' => $total_events > 0 ? round(((int)$ref['value'] / $total_events) * 100) : 0
        ];
    }

    json_response($stats);

} catch (Exception $e) {
    json_response(["message" => "Error: " . $e->getMessage()], 500);
}
?>
