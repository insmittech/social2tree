<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';

// Auth Check
$is_secure = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $is_secure,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    json_response(["message" => "Unauthorized access."], 403);
    exit;
}

try {
    // Fetch users with their primary stats
    // We aggregate views from the analytics table
    $query = "
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.display_name, 
            u.avatar_url, 
            u.role, 
            u.plan, 
            u.status, 
            u.created_at,
            (SELECT COUNT(*) FROM analytics a WHERE a.user_id = u.id AND a.link_id IS NULL) as views,
            (SELECT COUNT(*) FROM analytics a WHERE a.user_id = u.id AND a.link_id IS NOT NULL) as total_clicks
        FROM users u
        ORDER BY u.created_at DESC
    ";
    
    $stmt = $pdo->query($query);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Map to camelCase for frontend consistency
    $results = array_map(function ($user) {
        return [
            'id' => (string)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'displayName' => $user['display_name'] ?? $user['username'],
            'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
            'role' => $user['role'],
            'plan' => $user['plan'],
            'status' => $user['status'],
            'createdAt' => $user['created_at'],
            'views' => (int)$user['views'],
            'totalClicks' => (int)$user['total_clicks']
        ];
    }, $users);

    json_response(["users" => $results]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
