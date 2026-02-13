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
    $query = "SELECT id, title, url, type FROM links WHERE user_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Track View (Async-ish)
    // We log the view but don't hold up the response if it fails
    // Using INSERT DELAYED is deprecated, so we just do a standard insert.
    // In high traffic, this should be queued.
    $ip = $_SERVER['REMOTE_ADDR'];
    $ua = $_SERVER['HTTP_USER_AGENT'];

    // Check if we should track (simple spam prevention could go here)
    $track_sql = "INSERT INTO analytics (user_id, visitor_id, ip_address, user_agent) VALUES (?, ?, ?, ?)";
    $track_stmt = $pdo->prepare($track_sql);
    // Simple visitor ID hash
    $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
    $track_stmt->execute([$user_id, $visitor_id, $ip, $ua]);

    // Return Data
    $user['links'] = $links;
    json_response($user);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>