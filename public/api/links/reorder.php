<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['ids']) && is_array($data['ids'])) {
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("UPDATE links SET sort_order = ? WHERE id = ? AND user_id = ?");
        
        foreach ($data['ids'] as $index => $id) {
            $stmt->execute([$index, $id, $user_id]);
        }
        
        $pdo->commit();
        json_response(["message" => "Link order updated successfully."]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Invalid link IDs provided."], 400);
}
?>
