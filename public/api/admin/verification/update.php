<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

require_permission($pdo, 'users:edit');
json_response();

$data = get_json_input();

if (empty($data['id']) || empty($data['status'])) {
    json_response(["message" => "Request ID and status are required."], 400);
    exit();
}

$id = (int)$data['id'];
$status = sanitize_input($data['status']);
$reason = isset($data['reason']) ? sanitize_input($data['reason']) : null;

try {
    $pdo->beginTransaction();

    // Fetch the request to get user_id
    $stmt = $pdo->prepare("SELECT user_id FROM verification_requests WHERE id = ?");
    $stmt->execute([$id]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        json_response(["message" => "Verification request not found."], 404);
        exit();
    }

    $user_id = $request['user_id'];

    // Update request status
    $stmt = $pdo->prepare("UPDATE verification_requests SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([$status, $reason, $id]);

    // If approved, update user's is_verified status
    if ($status === 'approved') {
        $stmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
        $stmt->execute([$user_id]);
    } else if ($status === 'rejected') {
        // If rejected, ensure is_verified is 0 (though it should be already)
        $stmt = $pdo->prepare("UPDATE users SET is_verified = 0 WHERE id = ?");
        $stmt->execute([$user_id]);
        
        // Mock email sending for rejection/info
        // In a real app: mail($user_email, "Verification Update", "Reason: " . $reason);
    }

    $pdo->commit();

    json_response([
        "message" => "Verification request " . $status . " successfully.",
        "status" => $status
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
