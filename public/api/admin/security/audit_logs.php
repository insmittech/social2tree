<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

require_permission($pdo, 'settings:view');
json_response();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $stmt = $pdo->prepare("SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?");
        $stmt->execute([$limit, $offset]);
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count
        $total = $pdo->query("SELECT COUNT(*) FROM audit_logs")->fetchColumn();
        
        json_response([
            "logs" => $logs,
            "total" => $total
        ]);
        
    } else if ($method === 'DELETE') {
        require_permission($pdo, 'settings:manage'); // Higher permission to clear
        $pdo->exec("DELETE FROM audit_logs");
        log_audit_event($pdo, "Audit logs cleared", "warning", $_SESSION['user_id']);
        json_response(["message" => "Audit logs cleared successfully."]);
    } else {
        json_response(["message" => "Method not allowed."], 405);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
