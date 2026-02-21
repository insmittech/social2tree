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
    // 1. Top countries
    $c_params = [$user_id];
    $c_filters = build_filters($page_id, $link_id, $start_date, $end_date, $c_params);
    $country_stmt = $pdo->prepare("
        SELECT 
            CASE 
                WHEN country IS NULL OR country = '' OR country = 'Legacy/Untracked' OR country = 'Unknown Origin' THEN 'Unknown Origin'
                ELSE country 
            END as country,
            CASE 
                WHEN country_code IS NULL OR country_code = '' OR country_code = 'LO' THEN 'UN'
                ELSE country_code 
            END as country_code,
            COUNT(*) as clicks
        FROM analytics
        WHERE user_id = ? $c_filters
        GROUP BY 1, 2
        ORDER BY clicks DESC
        LIMIT 15
    ");
    $country_stmt->execute($c_params);
    $countries = $country_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Top cities
    $ct_params = [$user_id];
    $ct_filters = build_filters($page_id, $link_id, $start_date, $end_date, $ct_params);
    $city_stmt = $pdo->prepare("
        SELECT 
            CASE 
                WHEN city IS NULL OR city = '' OR city = 'Legacy Sector' OR city = 'Unknown Sector' THEN 'Unknown Sector'
                ELSE city 
            END as city,
            CASE 
                WHEN country IS NULL OR country = '' OR country = 'Legacy Origin' OR country = 'Unknown Origin' THEN 'Unknown Origin'
                ELSE country 
            END as country,
            CASE 
                WHEN country_code IS NULL OR country_code = '' OR country_code = 'LO' THEN 'UN'
                ELSE country_code 
            END as country_code,
            COUNT(*) as clicks
        FROM analytics
        WHERE user_id = ? $ct_filters
        GROUP BY 1, 2, 3
        ORDER BY clicks DESC
        LIMIT 10
    ");
    $city_stmt->execute($ct_params);
    $cities = $city_stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Total tracked interactions (Filtered)
    $tot_params = [$user_id];
    $tot_filters = build_filters($page_id, $link_id, $start_date, $end_date, $tot_params);
    $total_stmt = $pdo->prepare("SELECT COUNT(*) FROM analytics WHERE user_id = ? $tot_filters");
    $total_stmt->execute($tot_params);
    $total = (int)$total_stmt->fetchColumn();

    json_response([
        'countries' => $countries,
        'cities'    => $cities,
        'total'     => $total,
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
