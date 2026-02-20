<?php
include_once __DIR__ . '/../../utils.php';

// Admin check
require_admin();
json_response();

include_once __DIR__ . '/../../db.php';

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
