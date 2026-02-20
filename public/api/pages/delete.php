<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['id'])) {
    $page_id = $data['id'];

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE id = ? AND user_id = ?");
        $check->execute([$page_id, $user_id]);
        
        if ($check->fetchColumn() > 0) {
            // Transaction to delete links too? 
            // Assume DB has cascade delete or do it manually
            $pdo->beginTransaction();
            
            $pdo->prepare("DELETE FROM links WHERE page_id = ?")->execute([$page_id]);
            $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
            
            if ($stmt->execute([$page_id])) {
                $pdo->commit();
                json_response(["message" => "Page deleted successfully."]);
            } else {
                $pdo->rollBack();
                json_response(["message" => "Unable to delete page."], 500);
            }
        } else {
            json_response(["message" => "Access denied or page not found."], 403);
        }
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Page ID is required."], 400);
}
?>
