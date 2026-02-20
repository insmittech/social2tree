<?php
include_once __DIR__ . '/../../utils.php';

// Admin check
require_admin();
json_response();

include_once __DIR__ . '/../../db.php';

try {
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    json_response([
        "settings" => $settings
    ]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
