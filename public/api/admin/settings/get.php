<?php
include_once __DIR__ . '/../../utils.php';
session_start();
json_response();
include_once __DIR__ . '/../../db.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    json_response(["message" => "Unauthorized."], 401);
    exit();
}

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
