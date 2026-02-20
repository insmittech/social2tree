<?php
include_once __DIR__ . '/../utils.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    try {
        // Fetch User Details
        $stmt = $pdo->prepare("SELECT id, username, email, display_name, bio, avatar_url, role, plan, status, created_at FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $profile = [
                'id' => (string) $user['id'],
                'username' => $user['username'],
                'displayName' => $user['display_name'] ?? $user['username'],
                'bio' => $user['bio'] ?? '',
                'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
                'role' => $user['role'],
                'plan' => $user['plan'],
                'status' => $user['status'],
                'createdAt' => $user['created_at'],
                'views' => 0,
                'pages' => []
            ];

            // Fetch Pages
            $stmt = $pdo->prepare("SELECT * FROM pages WHERE user_id = ? ORDER BY created_at ASC");
            $stmt->execute([$user_id]);
            $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $profile['pages'] = array_map(function ($page) use ($pdo) {
                // Fetch links for each page
                $stmt = $pdo->prepare("SELECT * FROM links WHERE page_id = ? ORDER BY sort_order ASC, created_at DESC");
                $stmt->execute([$page['id']]);
                $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'id' => (string)$page['id'],
                    'slug' => $page['slug'],
                    'displayName' => $page['display_name'],
                    'bio' => $page['bio'],
                    'avatarUrl' => $page['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($page['slug']),
                    'theme' => $page['theme'],
                    'buttonStyle' => $page['button_style'],
                    'customDomain' => $page['custom_domain'],
                    'links' => array_map(function ($link) {
                        return [
                            'id' => (string)$link['id'],
                            'title' => $link['title'],
                            'url' => $link['url'],
                            'active' => (bool)$link['is_active'],
                            'clicks' => (int)$link['clicks'],
                            'type' => $link['type'] ?? 'social',
                            'scheduledStart' => $link['scheduled_start'] ?? null,
                            'scheduledEnd' => $link['scheduled_end'] ?? null
                        ];
                    }, $links)
                ];
            }, $pages);

            // Fetch views count
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM analytics WHERE user_id = ? AND link_id IS NULL");
            $stmt->execute([$user_id]);
            $profile['views'] = (int)$stmt->fetchColumn();

            json_response(["user" => $profile]);
        } else {
            session_destroy();
            json_response(["user" => null], 401);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["user" => null]);
}
?>