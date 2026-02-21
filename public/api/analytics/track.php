<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

/**
 * Resolve geo info from an IP using ip-api.com.
 * Handles proxy headers and provides mock data for local IPs.
 */
function resolve_geo(string $ip): array {
    // Check for proxy/Cloudflare headers
    if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }

    // Handle private/local IPs for developer testing
    $is_local = in_array($ip, ['127.0.0.1', '::1']) || 
                str_starts_with($ip, '192.168.') || 
                str_starts_with($ip, '10.') || 
                str_starts_with($ip, '172.16.');

    if ($is_local) {
        return [
            'country'      => 'Local Access',
            'country_code' => 'LO',
            'city'         => 'Internals'
        ];
    }

    try {
        $url = "http://ip-api.com/json/{$ip}?fields=country,countryCode,city";
        
        if (function_exists('curl_version')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 3);
            curl_setopt($ch, CURLOPT_USERAGENT, 'Social2Tree/1.0');
            $raw = curl_exec($ch);
            curl_close($ch);
        } else {
            $ctx = stream_context_create(['http' => ['timeout' => 3]]);
            $raw = @file_get_contents($url, false, $ctx);
        }

        if ($raw) {
            $geo = json_decode($raw, true);
            if (isset($geo['country'])) {
                return [
                    'country'      => $geo['country'],
                    'country_code' => $geo['countryCode'] ?? 'UN',
                    'city'         => $geo['city'] ?? 'Unknown'
                ];
            }
        }
    } catch (\Throwable $e) { /* background task silent */ }

    return ['country' => 'Unknown Origin', 'country_code' => 'UN', 'city' => 'Unknown Sector'];
}

$data = get_json_input();

if (isset($data['link_id']) || isset($data['page_id'])) {
    $link_id = isset($data['link_id']) ? (int)$data['link_id'] : null;
    $page_id = isset($data['page_id']) ? (int)$data['page_id'] : null;

    try {
        $user_id = null;
        $final_page_id = null;

        if ($link_id) {
            // Get user_id and page_id for this link
            $stmt = $pdo->prepare("SELECT user_id, page_id FROM links WHERE id = ? LIMIT 1");
            $stmt->execute([$link_id]);
            $link = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($link) {
                $user_id = $link['user_id'];
                $final_page_id = $link['page_id'];
                // Increment link clicks
                $pdo->prepare("UPDATE links SET clicks = clicks + 1 WHERE id = ?")->execute([$link_id]);
            }
        } 
        
        if (!$user_id && $page_id) {
            // Get user_id for this page
            $stmt = $pdo->prepare("SELECT user_id FROM pages WHERE id = ? LIMIT 1");
            $stmt->execute([$page_id]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($page) {
                $user_id = $page['user_id'];
                $final_page_id = $page_id;
            }
        }

        if ($user_id) {
            // Geo lookup
            $ip         = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
            $ua         = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
            $visitor_id = hash('sha256', $ip . $ua . date('Y-m-d'));
            $geo        = resolve_geo($ip);

            // Store analytics row
            $track_sql = "INSERT INTO analytics
                          (user_id, page_id, link_id, visitor_id, ip_address, user_agent, country, country_code, city)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $pdo->prepare($track_sql)->execute([
                $user_id, $final_page_id, $link_id, $visitor_id, $ip, $ua,
                $geo['country'], $geo['country_code'], $geo['city']
            ]);

            json_response(["message" => "Tracked successfully."]);
        } else {
            json_response(["message" => "Target not found."], 404);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "link_id or page_id required."], 400);
}
?>
