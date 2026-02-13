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

if (!empty($data['ids']) && is_array($data['ids'])) {
    $user_id = $_SESSION['user_id'];
    $ids = $data['ids'];

    try {
        $pdo->beginTransaction();
        
        $query = "UPDATE links SET sort_order = ? WHERE id = ? AND user_id = ?";
        $stmt = $pdo->prepare($query);

        foreach ($ids as $index => $id) {
            $stmt->execute([$index, $id, $user_id]);
        }

        $pdo->commit();
        json_response(["message" => "Links reordered successfully."]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Invalid data. Expected an array of IDs."], 400);
}
?>
