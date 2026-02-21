<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

try {
    // Top countries
    // We group by the raw columns to be safe with older MySQL versions, but select the COALESCE'd version
    // Top countries
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
        WHERE user_id = ?
        GROUP BY 1, 2
        ORDER BY clicks DESC
        LIMIT 15
    ");
    $country_stmt->execute([$user_id]);
    $countries = $country_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Top cities
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
        WHERE user_id = ?
        GROUP BY 1, 2, 3
        ORDER BY clicks DESC
        LIMIT 10
    ");
    $city_stmt->execute([$user_id]);
    $cities = $city_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Total tracked interactions (Views + Clicks)
    $total_stmt = $pdo->prepare("SELECT COUNT(*) FROM analytics WHERE user_id = ?");
    $total_stmt->execute([$user_id]);
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
