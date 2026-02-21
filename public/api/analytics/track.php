<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

/**
 * Resolve geo info from an IP using ip-api.com (free, no key needed).
 * Returns ['country'=>..., 'country_code'=>..., 'city'=>...] or nulls on failure.
 */
function resolve_geo(string $ip): array {
    // Skip private/local IPs
    if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
        return ['country' => null, 'country_code' => null, 'city' => null];
    }
    try {
        $ctx = stream_context_create(['http' => ['timeout' => 2]]);
        $raw = @file_get_contents("http://ip-api.com/json/{$ip}?fields=country,countryCode,city", false, $ctx);
        if ($raw) {
            $geo = json_decode($raw, true);
            return [
                'country'      => $geo['country']     ?? null,
                'country_code' => $geo['countryCode'] ?? null,
                'city'         => $geo['city']         ?? null,
            ];
        }
    } catch (\Throwable $e) { /* silent fail */ }
    return ['country' => null, 'country_code' => null, 'city' => null];
}

$data = get_json_input();

if (isset($data['link_id'])) {
    $link_id = (int)$data['link_id'];

    try {
        // 1. Get the user_id and page_id for this link
        $stmt = $pdo->prepare("SELECT user_id, page_id FROM links WHERE id = ? LIMIT 1");
        $stmt->execute([$link_id]);
        $link = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($link) {
            $user_id = $link['user_id'];
            $page_id = $link['page_id'];

            // 2. Increment clicks
            $pdo->prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?")->execute([$link_id]);

            // 3. Geo lookup
            $ip         = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
            $ua         = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
            $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
            $geo        = resolve_geo($ip);

            // 4. Store analytics row with geo
            $track_sql = "INSERT INTO analytics
                          (user_id, page_id, link_id, visitor_id, ip_address, user_agent, country, country_code, city)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $pdo->prepare($track_sql)->execute([
                $user_id, $page_id, $link_id, $visitor_id, $ip, $ua,
                $geo['country'], $geo['country_code'], $geo['city']
            ]);

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
