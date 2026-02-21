<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();

try {
    $stats = [
        'timeline' => [],
        'devices'  => [],
        'browsers' => [],
        'referrers'=> [],
        'activity' => [],
        'totals'   => [
            'total_views' => 0,
            'total_cities' => 0,
            'unique_visitors' => 0
        ]
    ];

    // 1. Timeline (Last 7 Days)
    $timeline_stmt = $pdo->prepare("
        SELECT DATE(created_at) as date, 
               COUNT(CASE WHEN link_id IS NULL THEN 1 END) as views,
               COUNT(CASE WHEN link_id IS NOT NULL THEN 1 END) as clicks
        FROM analytics 
        WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
    ");
    $timeline_stmt->execute([$user_id]);
    $stats['timeline'] = $timeline_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Browser & Device Analysis (Helper to parse UA)
    $ua_stmt = $pdo->prepare("SELECT user_agent FROM analytics WHERE user_id = ?");
    $ua_stmt->execute([$user_id]);
    $user_agents = $ua_stmt->fetchAll(PDO::FETCH_COLUMN);

    $browsers = ['Chrome' => 0, 'Safari' => 0, 'Firefox' => 0, 'Edge' => 0, 'Other' => 0];
    $devices = ['Mobile' => 0, 'Desktop' => 0, 'Tablet' => 0];

    foreach ($user_agents as $ua) {
        // Browser Detection
        if (strpos($ua, 'Edg') !== false) $browsers['Edge']++;
        elseif (strpos($ua, 'Chrome') !== false) $browsers['Chrome']++;
        elseif (strpos($ua, 'Safari') !== false) $browsers['Safari']++;
        elseif (strpos($ua, 'Firefox') !== false) $browsers['Firefox']++;
        else $browsers['Other']++;

        // Device Detection
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) $devices['Tablet']++;
        elseif (preg_match('/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i', $ua)) $devices['Mobile']++;
        else $devices['Desktop']++;
    }
    
    foreach ($browsers as $name => $count) if($count > 0) $stats['browsers'][] = ['name' => $name, 'value' => $count];
    foreach ($devices as $name => $count) if($count > 0) $stats['devices'][] = ['name' => $name, 'value' => $count];

    // 3. Referrer Sources
    $ref_stmt = $pdo->prepare("
        SELECT COALESCE(NULLIF(referrer, ''), 'Direct/Organic') as name, COUNT(*) as value 
        FROM analytics 
        WHERE user_id = ? 
        GROUP BY name 
        ORDER BY value DESC 
        LIMIT 5
    ");
    $ref_stmt->execute([$user_id]);
    $stats['referrers'] = $ref_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Live Activity Feed (Handle NULLs)
    $act_stmt = $pdo->prepare("
        SELECT 
            id, 
            COALESCE(NULLIF(country, ''), 'Unknown Origin') as country,
            COALESCE(NULLIF(city, ''), 'Unknown Sector') as city,
            COALESCE(NULLIF(country_code, ''), 'UN') as country_code,
            created_at,
            CASE WHEN link_id IS NOT NULL THEN 'link_click' ELSE 'page_view' END as event_type
        FROM analytics 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 10
    ");
    $act_stmt->execute([$user_id]);
    $stats['activity'] = $act_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Advanced Totals (Handle legacy NULL data & ensure integers)
    $total_stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total_events,
            COUNT(DISTINCT COALESCE(visitor_id, ip_address)) as unique_visitors
        FROM analytics 
        WHERE user_id = ?
    ");
    $total_stmt->execute([$user_id]);
    $res = $total_stmt->fetch(PDO::FETCH_ASSOC);
    
    $stats['totals'] = [
        'total_events' => (int)($res['total_events'] ?? 0),
        'unique_visitors' => (int)($res['unique_visitors'] ?? 0)
    ];
    
    // Explicit Urban Coverage count
    $city_count_stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT city_name) FROM (
            SELECT COALESCE(NULLIF(city, ''), 'Unknown Sector') as city_name 
            FROM analytics 
            WHERE user_id = ?
        ) as t
    ");
    $city_count_stmt->execute([$user_id]);
    $stats['totals']['total_cities'] = (int)$city_count_stmt->fetchColumn();
    
    // Add node interactions (total link clicks)
    $click_stmt = $pdo->prepare("SELECT SUM(clicks) FROM links WHERE user_id = ?");
    $click_stmt->execute([$user_id]);
    $stats['totals']['node_interactions'] = (int)$click_stmt->fetchColumn();

    // Fetch total views from users table for fallback
    $u_stmt = $pdo->prepare("SELECT views FROM users WHERE id = ?");
    $u_stmt->execute([$user_id]);
    $stats['totals']['total_views'] = (int)$u_stmt->fetchColumn();

    json_response($stats);

} catch (Exception $e) {
    json_response(["message" => "Error: " . $e->getMessage()], 500);
}
?>
