<?php
include_once __DIR__ . '/../../utils.php';

include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require granular permission
require_permission($pdo, 'users:view');
json_response();

try {
    // Fetch users with their primary stats
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
    $results = array_map(function ($user) use ($pdo) {
        // Fetch granular roles for this user
        $stmt = $pdo->prepare("SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?");
        $stmt->execute([$user['id']]);
        $roles = $stmt->fetchAll(PDO::FETCH_COLUMN);

        return [
            'id' => (string)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'displayName' => $user['display_name'] ?? $user['username'],
            'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
            'role' => $user['role'],
            'roles' => $roles,
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
?>
