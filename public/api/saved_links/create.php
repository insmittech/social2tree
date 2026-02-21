<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (!empty($data['url']) && !empty($data['title'])) {
    $title = sanitize_input($data['title']);
    $url = sanitize_input($data['url']);
    $folder_id = !empty($data['folderId']) ? (int)$data['folderId'] : null;
    $icon = !empty($data['icon']) ? sanitize_input($data['icon']) : null;

    try {
        // If folder_id is provided, verify ownership
        if ($folder_id) {
            $check = $pdo->prepare("SELECT COUNT(*) FROM folders WHERE id = ? AND user_id = ?");
            $check->execute([$folder_id, $user_id]);
            if ($check->fetchColumn() == 0) {
                json_response(["message" => "Access denied or invalid folder."], 403);
                exit();
            }
        }

        $stmt = $pdo->prepare("INSERT INTO saved_links (user_id, folder_id, title, url, icon) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $folder_id, $title, $url, $icon]);
        
        $link_id = $pdo->lastInsertId();

        json_response([
            "message" => "Link saved successfully.",
            "link" => [
                "id" => (string) $link_id,
                "folderId" => $folder_id ? (string)$folder_id : null,
                "title" => $title,
                "url" => $url,
                "icon" => $icon
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide title and url."], 400);
}
?>
