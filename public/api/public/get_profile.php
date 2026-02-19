<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

$slug = isset($_GET['username']) ? sanitize_input($_GET['username']) : null;
$host = $_SERVER['HTTP_HOST'] ?? '';

try {
    // 1. Fetch Page and Owner Data
    if ($slug) {
        $query = "SELECT p.*, u.plan, u.role FROM pages p JOIN users u ON p.user_id = u.id WHERE p.slug = ? LIMIT 1";
        $params = [$slug];
    } else {
        // Try identifying by custom domain
        $query = "SELECT p.*, u.plan, u.role FROM pages p JOIN users u ON p.user_id = u.id WHERE p.custom_domain = ? LIMIT 1";
        $params = [$host];
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() == 0) {
        json_response(["message" => "Profile not found."], 404);
        exit();
    }

    $page = $stmt->fetch(PDO::FETCH_ASSOC);
    $page_id = $page['id'];
    $user_id = $page['user_id'];

    // 2. Fetch Links
    $query = "SELECT id, title, url, type, is_active, clicks, scheduled_start, scheduled_end, password FROM links WHERE page_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$page_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Track View
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
    
    try {
        $track_sql = "INSERT INTO analytics (user_id, page_id, visitor_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)";
        $track_stmt = $pdo->prepare($track_sql);
        $track_stmt->execute([$user_id, $page_id, $visitor_id, $ip, $ua]);
    } catch (PDOException $e) {
        // Silently fail analytics
    }

    // 4. Map Data to standard structure
    $profile = [
        'id' => (string) $page['id'],
        'username' => $page['slug'], // For backward compatibility in frontend
        'displayName' => $page['display_name'] ?? $page['slug'],
        'bio' => $page['bio'] ?? '',
        'avatarUrl' => $page['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($page['slug']),
        'theme' => $page['theme'] ?? 'default',
        'buttonStyle' => $page['button_style'] ?? 'rounded-lg',
        'plan' => $page['plan'],
        'role' => $page['role'],
        'links' => array_map(function ($link) {
            return [
                'id' => (string) $link['id'],
                'title' => $link['title'],
                'url' => $link['url'],
                'active' => (bool) $link['is_active'],
                'clicks' => (int) $link['clicks'],
                'type' => $link['type'] ?? 'social',
                'scheduledStart' => $link['scheduled_start'] ?? null,
                'scheduledEnd' => $link['scheduled_end'] ?? null,
                'password' => $link['password'] ?? null
            ];
        }, $links)
    ];
    json_response($profile);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>