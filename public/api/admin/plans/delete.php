<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require granular permission
require_permission($pdo, 'billing:manage');
json_response();

$data = get_post_data();
$id = $data['id'] ?? null;

if (!$id) {
    json_response(["message" => "Plan ID is required"], 400);
}

try {
    $stmt = $pdo->prepare("DELETE FROM plans WHERE id = ?");
    $stmt->execute([$id]);
    json_response(["message" => "Plan deleted successfully"]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
