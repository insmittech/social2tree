<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['url']) && !empty($data['title']) && !empty($data['pageId'])) {
    $page_id = (int)$data['pageId'];
    $title = sanitize_input($data['title']);
    $url = sanitize_input($data['url']);
    $type = isset($data['type']) ? sanitize_input($data['type']) : 'social';
    $scheduled_start = !empty($data['scheduledStart']) ? sanitize_input($data['scheduledStart']) : null;
    $scheduled_end = !empty($data['scheduledEnd']) ? sanitize_input($data['scheduledEnd']) : null;

    try {
        // 1. Verify page ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE id = ? AND user_id = ?");
        $check->execute([$page_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Access denied or invalid page."], 403);
            exit();
        }

        // 2. Insert link
        $query = "INSERT INTO links (user_id, page_id, title, url, type, sort_order, scheduled_start, scheduled_end) VALUES (:user_id, :page_id, :title, :url, :type, 0, :scheduled_start, :scheduled_end)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_id' => $user_id,
            ':page_id' => $page_id,
            ':title' => $title,
            ':url' => $url,
            ':type' => $type,
            ':scheduled_start' => $scheduled_start,
            ':scheduled_end' => $scheduled_end
        ]);

        $link_id = $pdo->lastInsertId();

        json_response([
            "message" => "Link created successfully.",
            "link" => [
                "id" => (string) $link_id,
                "title" => $title,
                "url" => $url,
                "type" => $type,
                "active" => true,
                "clicks" => 0,
                "scheduledStart" => $scheduled_start,
                "scheduledEnd" => $scheduled_end
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide title, url, and page ID."], 400);
}
?>