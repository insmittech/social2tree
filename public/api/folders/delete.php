<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (!empty($data['id'])) {
    $folder_id = (int)$data['id'];

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM folders WHERE id = ? AND user_id = ?");
        $check->execute([$folder_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Access denied or folder not found."], 403);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM folders WHERE id = ?");
        $stmt->execute([$folder_id]);

        json_response(["message" => "Folder deleted successfully."]);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide a folder ID."], 400);
}
?>
