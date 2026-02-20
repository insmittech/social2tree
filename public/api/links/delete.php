<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['id'])) {
    $link_id = $data['id'];

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM links WHERE id = ? AND user_id = ?");
        $check->execute([$link_id, $user_id]);
        
        if ($check->fetchColumn() > 0) {
            $stmt = $pdo->prepare("DELETE FROM links WHERE id = ?");
            if ($stmt->execute([$link_id])) {
                json_response(["message" => "Link deleted successfully."]);
            } else {
                json_response(["message" => "Unable to delete link."], 500);
            }
        } else {
            json_response(["message" => "Access denied or link not found."], 403);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Link ID is required."], 400);
}
?>