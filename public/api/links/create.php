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

if (!empty($data['url']) && !empty($data['title']) && !empty($data['pageId'])) {
    $user_id = $_SESSION['user_id'];
    $page_id = (int)$data['pageId'];
    $title = sanitize_input($data['title']);
    $url = sanitize_input($data['url']);
    $type = isset($data['type']) ? sanitize_input($data['type']) : 'social';
    $scheduled_start = !empty($data['scheduledStart']) ? sanitize_input($data['scheduledStart']) : null;
    $scheduled_end = !empty($data['scheduledEnd']) ? sanitize_input($data['scheduledEnd']) : null;
    $password = !empty($data['password']) ? sanitize_input($data['password']) : null;

    try {
        // 1. Verify page ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE id = ? AND user_id = ?");
        $check->execute([$page_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Invalid page ID or access denied."], 403);
            exit();
        }

        // 2. Insert link
        $query = "INSERT INTO links (user_id, page_id, title, url, type, sort_order, scheduled_start, scheduled_end, password) VALUES (:user_id, :page_id, :title, :url, :type, 0, :scheduled_start, :scheduled_end, :password)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_id' => $user_id,
            ':page_id' => $page_id,
            ':title' => $title,
            ':url' => $url,
            ':type' => $type,
            ':scheduled_start' => $scheduled_start,
            ':scheduled_end' => $scheduled_end,
            ':password' => $password
        ]);

        $link_id = $pdo->lastInsertId();

        json_response([
            "message" => "Link created.",
            "link" => [
                "id" => (string) $link_id,
                "title" => $title,
                "url" => $url,
                "type" => $type,
                "active" => true,
                "clicks" => 0,
                "scheduledStart" => $scheduled_start,
                "scheduledEnd" => $scheduled_end,
                "password" => $password
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>