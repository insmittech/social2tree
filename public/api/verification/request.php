<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (empty($data['details'])) {
    json_response(["message" => "Please provide details for verification."], 400);
    exit();
}

try {
    // Check if there is already a pending or approved request
    $stmt = $pdo->prepare("SELECT status FROM verification_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $last_request = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($last_request) {
        if ($last_request['status'] === 'pending') {
            json_response(["message" => "You already have a pending verification request."], 400);
            exit();
        }
        if ($last_request['status'] === 'approved') {
            json_response(["message" => "You are already verified."], 400);
            exit();
        }
    }

    // Insert new request
    $stmt = $pdo->prepare("INSERT INTO verification_requests (user_id, status, details) VALUES (?, 'pending', ?)");
    $stmt->execute([$user_id, $data['details']]);

    json_response([
        "message" => "Verification request submitted successfully. Our team will review it soon.",
        "status" => "pending"
    ], 201);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
