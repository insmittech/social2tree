<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

if (!isset($_GET['username'])) {
    json_response(["message" => "Username required."], 400);
    exit();
}

$username = sanitize_input($_GET['username']);

try {
    // 1. Fetch User Data
    $query = "SELECT id, username, display_name, bio, avatar_url, theme, button_style, plan, role FROM users WHERE username = ? LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$username]);

    if ($stmt->rowCount() == 0) {
        json_response(["message" => "User not found."], 404);
        exit();
    }

    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $user_id = $user['id'];

    // 2. Fetch Links
    $query = "SELECT id, title, url, type, is_active, clicks FROM links WHERE user_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Track View
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
    
    try {
        $track_sql = "INSERT INTO analytics (user_id, visitor_id, ip_address, user_agent) VALUES (?, ?, ?, ?)";
        $track_stmt = $pdo->prepare($track_sql);
        $track_stmt->execute([$user_id, $visitor_id, $ip, $ua]);
    } catch (PDOException $e) {
        // Silently fail analytics
    }

    // 4. Map Data to standard structure
    $profile = [
        'id' => (string) $user['id'],
        'username' => $user['username'],
        'displayName' => $user['display_name'] ?? $user['username'],
        'bio' => $user['bio'] ?? '',
        'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
        'theme' => $user['theme'] ?? 'default',
        'buttonStyle' => $user['button_style'] ?? 'rounded-lg',
        'plan' => $user['plan'],
        'role' => $user['role'],
        'links' => array_map(function ($link) {
            return [
                'id' => (string) $link['id'],
                'title' => $link['title'],
                'url' => $link['url'],
                'active' => (bool) $link['is_active'],
                'clicks' => (int) $link['clicks'],
                'type' => $link['type'] ?? 'social'
            ];
        }, $links)
    ];
    json_response($profile);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>