<?php
/**
 * Force Database Fix - Analytics Columns
 * Visit this file directly in your browser to fix the 'Missing Country/City' issue.
 */
include_once __DIR__ . '/db.php';
header('Content-Type: application/json');

try {
    $results = [];
    
    // 1. Add views to users
    $existingUserCols = $pdo->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('views', $existingUserCols)) {
        $pdo->exec("ALTER TABLE users ADD views INT DEFAULT 0 AFTER is_verified");
        $results[] = "Added 'views' to users table.";
    }

    // 2. Add columns to analytics
    $existingAnCols = $pdo->query("DESCRIBE analytics")->fetchAll(PDO::FETCH_COLUMN);
    
    $toAdd = [
        'country' => "VARCHAR(100) AFTER referrer",
        'country_code' => "VARCHAR(3) AFTER country",
        'city' => "VARCHAR(100) AFTER country_code"
    ];

    foreach ($toAdd as $col => $def) {
        if (!in_array($col, $existingAnCols)) {
            $pdo->exec("ALTER TABLE analytics ADD $col $def");
            $results[] = "Added '$col' to analytics table.";
        }
    }

    if (empty($results)) {
        echo json_encode(["status" => "success", "message" => "Database schema is already correct."]);
    } else {
        echo json_encode(["status" => "success", "message" => "Schema updated.", "details" => $results]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
