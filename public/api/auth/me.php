<?php
include_once __DIR__ . '/../utils.php';

// Determine 'secure' flag consistently
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
json_response();
include_once __DIR__ . '/../db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    try {
        // 1. Fetch User Details
        $stmt = $pdo->prepare("SELECT id, username, email, display_name, bio, theme, button_style, avatar_url, role, plan, status, created_at FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // CamelCase conversion for consistency with frontend types if needed, 
            // but let's try to match what frontend expects or adjust frontend.
            // Frontend expects: displayName, avatarUrl, buttonStyle.
            // DB has: display_name, avatar_url, button_style.
            // Let's map it.

            $profile = [
                'id' => (string) $user['id'],
                'username' => $user['username'],
                'displayName' => $user['display_name'] ?? $user['username'],
                'bio' => $user['bio'] ?? '',
                'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
                'theme' => $user['theme'] ?? 'default',
                'buttonStyle' => $user['button_style'] ?? 'rounded-lg',
                'role' => $user['role'],
                'plan' => $user['plan'],
                'status' => $user['status'],
                'createdAt' => $user['created_at'],
                // Analytics defaults
                'views' => 0, // aggregate query needed if we want real stats here
                'qrScans' => 0
            ];

            // 2. Fetch Links
            $stmt = $pdo->prepare("SELECT * FROM links WHERE user_id = ? ORDER BY sort_order ASC, created_at DESC");
            $stmt->execute([$user_id]);
            $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Map links to frontend structure
            $profile['links'] = array_map(function ($link) {
                return [
                    'id' => (string) $link['id'],
                    'title' => $link['title'],
                    'url' => $link['url'],
                    'active' => (bool) $link['is_active'],
                    'clicks' => (int) $link['clicks'],
                    'type' => $link['type'] ?? 'social',
                    'scheduledStart' => $link['scheduled_start'] ?? null,
                    'scheduledEnd' => $link['scheduled_end'] ?? null
                ];
            }, $links);

            // 3. Fetch Analytics Counts (Optional, for dashboard stats)
            // Total views
            $stmt = $pdo->prepare("SELECT count(*) as total FROM analytics WHERE user_id = ? AND link_id IS NULL");
            $stmt->execute([$user_id]);
            $profile['views'] = (int) $stmt->fetchColumn();

            json_response(["user" => $profile]);
        } else {
            // User ID in session but not in DB? Weird.
            session_destroy();
            json_response(["message" => "User not found."], 401);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    // No session
    echo json_encode(["user" => null]);
}
?>