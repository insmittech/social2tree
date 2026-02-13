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

    try {
        $query = "DELETE FROM links WHERE id = ? AND user_id = ?";
        $stmt = $pdo->prepare($query);

        if ($stmt->execute([$id, $user_id])) {
            if ($stmt->rowCount() > 0) {
                json_response(["message" => "Link deleted."]);
            } else {
                json_response(["message" => "Link not found."], 404);
            }
        } else {
            json_response(["message" => "Unable to delete link."], 503);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>