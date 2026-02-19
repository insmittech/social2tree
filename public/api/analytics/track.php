<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (isset($data['link_id'])) {
    $link_id = (int)$data['link_id'];
    
    try {
        // 1. Get the user_id and page_id for this link
        $query = "SELECT user_id, page_id FROM links WHERE id = ? LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$link_id]);
        $link = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($link) {
            $user_id = $link['user_id'];
            $page_id = $link['page_id'];

            // 2. Increment clicks in links table
            $update_sql = "UPDATE links SET clicks = clicks + 1 WHERE id = ?";
            $update_stmt = $pdo->prepare($update_sql);
            $update_stmt->execute([$link_id]);

            // 3. Track in analytics table
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
            $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
            $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
            
            $track_sql = "INSERT INTO analytics (user_id, page_id, link_id, visitor_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)";
            $track_stmt = $pdo->prepare($track_sql);
            $track_stmt->execute([$user_id, $page_id, $link_id, $visitor_id, $ip, $ua]);

            json_response(["message" => "Click tracked."]);
        } else {
            json_response(["message" => "Link not found."], 404);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "link_id required."], 400);
}
?>
