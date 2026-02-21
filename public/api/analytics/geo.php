<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

try {
    // Top countries
    $country_stmt = $pdo->prepare("
        SELECT country, country_code, COUNT(*) as clicks
        FROM analytics
        WHERE user_id = ? AND country IS NOT NULL AND country != ''
        GROUP BY country, country_code
        ORDER BY clicks DESC
        LIMIT 15
    ");
    $country_stmt->execute([$user_id]);
    $countries = $country_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Top cities
    $city_stmt = $pdo->prepare("
        SELECT city, country, country_code, COUNT(*) as clicks
        FROM analytics
        WHERE user_id = ? AND city IS NOT NULL AND city != ''
        GROUP BY city, country, country_code
        ORDER BY clicks DESC
        LIMIT 10
    ");
    $city_stmt->execute([$user_id]);
    $cities = $city_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Total geo-tracked clicks (for percentage calc on frontend)
    $total_stmt = $pdo->prepare("
        SELECT COUNT(*) as total FROM analytics
        WHERE user_id = ? AND country IS NOT NULL AND country != ''
    ");
    $total_stmt->execute([$user_id]);
    $total = (int)($total_stmt->fetchColumn());

    json_response([
        'countries' => $countries,
        'cities'    => $cities,
        'total'     => $total,
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
