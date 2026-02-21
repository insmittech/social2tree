<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (!empty($data['id'])) {
    $link_id = (int)$data['id'];
    $title = isset($data['title']) ? sanitize_input($data['title']) : null;
    $url = isset($data['url']) ? sanitize_input($data['url']) : null;
    $folder_id = isset($data['folderId']) ? ($data['folderId'] === null ? null : (int)$data['folderId']) : 'STAY';
    $icon = isset($data['icon']) ? sanitize_input($data['icon']) : 'STAY';

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM saved_links WHERE id = ? AND user_id = ?");
        $check->execute([$link_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Access denied or link not found."], 403);
            exit();
        }

        // Verify folder ownership if changing
        if ($folder_id !== 'STAY' && $folder_id !== null) {
            $checkFolder = $pdo->prepare("SELECT COUNT(*) FROM folders WHERE id = ? AND user_id = ?");
            $checkFolder->execute([$folder_id, $user_id]);
            if ($checkFolder->fetchColumn() == 0) {
                json_response(["message" => "Invalid folder ID."], 403);
                exit();
            }
        }

        $fields = [];
        $params = [];
        if ($title !== null) { $fields[] = "title = ?"; $params[] = $title; }
        if ($url !== null) { $fields[] = "url = ?"; $params[] = $url; }
        if ($folder_id !== 'STAY') { $fields[] = "folder_id = ?"; $params[] = $folder_id; }
        if ($icon !== 'STAY') { $fields[] = "icon = ?"; $params[] = $icon; }

        if (empty($fields)) {
            json_response(["message" => "Nothing to update."], 400);
            exit();
        }

        $params[] = $link_id;
        $stmt = $pdo->prepare("UPDATE saved_links SET " . implode(", ", $fields) . " WHERE id = ?");
        $stmt->execute($params);

        json_response(["message" => "Link updated successfully."]);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide a link ID."], 400);
}
?>
