<?php
include_once __DIR__ . '/../utils.php';
session_start();
json_response();
include_once __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id'])) {
    json_response(["message" => "Unauthorized."], 401);
    exit();
}

$data = get_json_input();
$user_id = $_SESSION['user_id'];

if (!empty($data['id'])) {
    $id = (int)$data['id'];

    // 1. Verify ownership and ensure it's not the last page
    $stmt = $pdo->prepare("SELECT user_id FROM pages WHERE id = ?");
    $stmt->execute([$id]);
    $page = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$page || $page['user_id'] != $user_id) {
        json_response(["message" => "Page not found or access denied."], 403);
        exit();
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE user_id = ?");
    $stmt->execute([$user_id]);
    if ($stmt->fetchColumn() <= 1) {
        json_response(["message" => "Cannot delete your only page."], 400);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
        $stmt->execute([$id]);
        json_response(["message" => "Page deleted successfully."]);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Page ID required."], 400);
}
?>
