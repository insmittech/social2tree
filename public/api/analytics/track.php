<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

/**
 * Resolve geo info from an IP using multiple providers.
 * Handles proxy headers and provides mock data for local IPs.
 */
function resolve_geo(string $ip): array {
    // Check for proxy/Cloudflare headers
    if (isset($_SERVER['HTTP_CF_CONNECTING_IP']) && filter_var($_SERVER['HTTP_CF_CONNECTING_IP'], FILTER_VALIDATE_IP)) {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($ips[0]);
    }

    // Comprehensive private/local IP check
    $is_local = !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    
    // Explicit localhost check
    if ($ip === '127.0.0.1' || $ip === '::1' || $is_local) {
        return [
            'country'      => 'Local Access',
            'country_code' => 'LO',
            'city'         => 'Internals'
        ];
    }

    $providers = [
        "http://ip-api.com/php/{$ip}", // User suggested PHP format
        "https://demo.ip-api.com/json/{$ip}?fields=66842623", 
        "http://ipwho.is/{$ip}", 
        "https://ipapi.co/{$ip}/json/",
        "https://freeipapi.com/api/json/{$ip}"
    ];

    foreach ($providers as $url) {
        try {
            $raw = null;
            if (function_exists('curl_version')) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 5);
                curl_setopt($ch, CURLOPT_USERAGENT, 'Social2Tree/1.4');
                if (str_starts_with($url, 'https')) {
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                }
                $raw = curl_exec($ch);
                curl_close($ch);
            } else {
                $ctx = stream_context_create(['http' => ['timeout' => 5]]);
                $raw = @file_get_contents($url, false, $ctx);
            }

            if ($raw) {
                // Support both JSON and PHP Serialized formats
                if (str_contains($url, '/php/')) {
                    $geo = @unserialize($raw);
                } else {
                    $geo = json_decode($raw, true);
                }
                
                if (!$geo) continue;

                // Flexible success detection
                $is_success = (isset($geo['status']) && $geo['status'] === 'success') || // ip-api
                             (isset($geo['success']) && $geo['success'] === true) || // ipwho.is
                             (isset($geo['country']) && !isset($geo['error'])) || // ipapi.co
                             (isset($geo['countryName']) && !empty($geo['countryName'])); // freeipapi

                if ($is_success) {
                    return [
                        'country'      => $geo['country'] ?? $geo['country_name'] ?? $geo['countryName'] ?? 'Unknown Origin',
                        'country_code' => $geo['countryCode'] ?? $geo['country_code'] ?? (isset($geo['country']) && strlen($geo['country']) === 2 ? $geo['country'] : 'UN'),
                        'city'         => $geo['city'] ?? $geo['cityName'] ?? $geo['city_name'] ?? 'Unknown Sector'
                    ];
                }
            }
        } catch (\Throwable $e) { continue; }
    }

    // Final Fallback
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
