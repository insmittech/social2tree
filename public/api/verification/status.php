<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

try {
    // Fetch the most recent request
    $stmt = $pdo->prepare("SELECT status, details, rejection_reason, created_at, updated_at 
                           FROM verification_requests 
                           WHERE user_id = ? 
                           ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $request = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$request) {
        json_response(["status" => "none"]);
    } else {
        json_response([
            "status" => $request['status'],
            "details" => $request['details'],
            "rejectionReason" => $request['rejection_reason'],
            "createdAt" => $request['created_at'],
            "updatedAt" => $request['updated_at']
        ]);
    }

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
