<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

require_permission($pdo, 'users:edit');
json_response();

$status = isset($_GET['status']) ? sanitize_input($_GET['status']) : null;

try {
    $query = "SELECT vr.*, u.username, u.display_name, u.email 
              FROM verification_requests vr 
              JOIN users u ON vr.user_id = u.id";
    
    if ($status) {
        $query .= " WHERE vr.status = :status";
    }
    
    $query .= " ORDER BY vr.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    if ($status) {
        $stmt->execute([':status' => $status]);
    } else {
        $stmt->execute();
    }
    
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        "requests" => array_map(function($r) {
            return [
                "id" => (string)$r['id'],
                "userId" => (string)$r['user_id'],
                "username" => $r['username'],
                "displayName" => $r['display_name'] ?? $r['username'],
                "email" => $r['email'],
                "status" => $r['status'],
                "details" => $r['details'],
                "rejectionReason" => $r['rejection_reason'],
                "createdAt" => $r['created_at'],
                "updatedAt" => $r['updated_at']
            ];
        }, $requests)
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
