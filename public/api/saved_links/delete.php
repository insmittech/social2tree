<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (!empty($data['id'])) {
    $link_id = (int)$data['id'];

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM saved_links WHERE id = ? AND user_id = ?");
        $check->execute([$link_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Access denied or link not found."], 403);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM saved_links WHERE id = ?");
        $stmt->execute([$link_id]);

        json_response(["message" => "Link deleted successfully."]);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide a link ID."], 400);
}
?>
