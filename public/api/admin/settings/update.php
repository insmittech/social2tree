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

$data = get_json_input();

if (empty($data)) {
    json_response(["message" => "No data provided."], 400);
    exit();
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE setting_value = :value2");

    foreach ($data as $key => $value) {
        $stmt->execute([
            ':key' => $key,
            ':value' => $value,
            ':value2' => $value
        ]);
    }

    $pdo->commit();

    json_response([
        "message" => "Settings updated successfully."
    ]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
