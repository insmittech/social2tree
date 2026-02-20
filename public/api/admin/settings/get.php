<?php
include_once __DIR__ . '/../../utils.php';

include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require granular permission
require_permission($pdo, 'settings:view');
json_response();

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
