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

if (!empty($data['id'])) {
    $user_id = $_SESSION['user_id'];
    $id = $data['id'];

    // Build dynamic update query
    $fields = [];
    $params = [];

    if (isset($data['title'])) {
        $fields[] = "title = ?";
        $params[] = sanitize_input($data['title']);
    }
    if (isset($data['url'])) {
        $fields[] = "url = ?";
        $params[] = sanitize_input($data['url']);
    }
    if (isset($data['is_active'])) {
        $fields[] = "is_active = ?";
        $params[] = (int) $data['is_active'];
    }
    if (isset($data['sort_order'])) {
        $fields[] = "sort_order = ?";
        $params[] = (int) $data['sort_order'];
    }
    if (isset($data['type'])) {
        $fields[] = "type = ?";
        $params[] = sanitize_input($data['type']);
    }

    if (empty($fields)) {
        json_response(["message" => "No fields to update."], 400);
        exit();
    }

    // Add ID and User ID to params for WHERE clause
    $params[] = $id;
    $params[] = $user_id;

    try {
        $query = "UPDATE links SET " . implode(", ", $fields) . " WHERE id = ? AND user_id = ?";
        $stmt = $pdo->prepare($query);

        if ($stmt->execute($params)) {
            if ($stmt->rowCount() > 0) {
                json_response(["message" => "Link updated."]);
            } else {
                json_response(["message" => "Link not found or no changes made."], 404);
            }
        } else {
            json_response(["message" => "Unable to update link."], 503);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>