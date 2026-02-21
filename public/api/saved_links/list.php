<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

try {
    $stmt = $pdo->prepare("SELECT * FROM saved_links WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        "links" => array_map(function($l) {
            return [
                "id" => (string) $l['id'],
                "folderId" => $l['folder_id'] ? (string)$l['folder_id'] : null,
                "title" => $l['title'],
                "url" => $l['url'],
                "icon" => $l['icon']
            ];
        }, $links)
    ]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
