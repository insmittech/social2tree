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

if (!empty($data['url']) && !empty($data['title'])) {
    $user_id = $_SESSION['user_id'];
    $title = sanitize_input($data['title']);
    $url = sanitize_input($data['url']);
    $type = isset($data['type']) ? sanitize_input($data['type']) : 'social';

    // Auto-calculate sort order (append to end)
    // Could optionally query MAX(sort_order) + 1

    try {
        $query = "INSERT INTO links (user_id, title, url, type, sort_order) VALUES (:user_id, :title, :url, :type, 0)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_id' => $user_id,
            ':title' => $title,
            ':url' => $url,
            ':type' => $type
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
                "clicks" => 0
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>