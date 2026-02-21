<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

require_permission($pdo, 'settings:view');
json_response();

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT i.*, u.username as blocked_by_user FROM ip_blacklist i LEFT JOIN users u ON i.blocked_by = u.id ORDER BY i.created_at DESC");
        $blockedIps = $stmt->fetchAll(PDO::FETCH_ASSOC);
        json_response(["blocked_ips" => $blockedIps]);
        
    } else if ($method === 'POST') {
        require_permission($pdo, 'settings:manage');
        $data = get_json_input();
        
        if (empty($data['ip_address'])) {
            json_response(["message" => "IP address is required."], 400);
            exit;
        }
        
        $ip = $data['ip_address'];
        $reason = $data['reason'] ?? 'No reason provided';
        $blocked_by = $_SESSION['user_id'];
        
        $stmt = $pdo->prepare("INSERT INTO ip_blacklist (ip_address, reason, blocked_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reason = ?, blocked_by = ?");
        $stmt->execute([$ip, $reason, $blocked_by, $reason, $blocked_by]);
        
        log_audit_event($pdo, "IP Blocked: $ip", "warning", $blocked_by);
        json_response(["message" => "IP address blocked successfully."]);
        
    } else if ($method === 'DELETE') {
        require_permission($pdo, 'settings:manage');
        $ip = $_GET['ip'] ?? null;
        
        if (!$ip) {
            json_response(["message" => "IP address is required."], 400);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM ip_blacklist WHERE ip_address = ?");
        $stmt->execute([$ip]);
        
        log_audit_event($pdo, "IP Unblocked: $ip", "info", $_SESSION['user_id']);
        json_response(["message" => "IP address unblocked successfully."]);
    } else {
        json_response(["message" => "Method not allowed."], 405);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
