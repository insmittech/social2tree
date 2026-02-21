<?php
// Set headers for CORS and JSON response
function json_response($data = null, $status = 200)
{
    http_response_code($status);
    
    // Security Headers
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: DENY");
    header("X-XSS-Protection: 1; mode=block");
    header("Referrer-Policy: strict-origin-when-cross-origin");
    // header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;");

    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
    header('Content-Type: application/json');

    // CORS headers - adjust Access-Control-Allow-Origin in production!
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        exit(0);
    }

    if ($data !== null) {
        echo json_encode($data);
    }
}

function start_secure_session() {
    if (session_status() === PHP_SESSION_NONE) {
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
    }
}

function require_auth() {
    start_secure_session();
    if (!isset($_SESSION['user_id'])) {
        json_response(["message" => "Unauthorized access. Please log in."], 401);
        exit;
    }
    return $_SESSION['user_id'];
}

function require_admin() {
    $user_id = require_auth();
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        json_response(["message" => "Forbidden. Admin access required."], 403);
        exit;
    }
    return $user_id;
}

function sanitize_input($data)
{
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    return htmlspecialchars(stripslashes(trim($data)));
}

function get_user_profile($pdo, $user_id) {
    try {
        // Fetch User Details
        $stmt = $pdo->prepare("SELECT id, username, email, display_name, bio, avatar_url, role, plan, status, is_verified, views, created_at FROM users WHERE id = ?");
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
                'isVerified' => (bool)$user['is_verified'],
                'createdAt' => $user['created_at'],
                'views' => (int)($user['views'] ?? 0),
                'pages' => [],
                'roles' => [],
                'permissions' => []
            ];

            // Fetch Roles (Defensive check if table exists)
            try {
                $stmt = $pdo->prepare("SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?");
                $stmt->execute([$user_id]);
                $profile['roles'] = $stmt->fetchAll(PDO::FETCH_COLUMN);

                // Fetch Permissions
                $stmt = $pdo->prepare("SELECT DISTINCT p.name FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id JOIN user_roles ur ON rp.role_id = ur.role_id WHERE ur.user_id = ?");
                $stmt->execute([$user_id]);
                $profile['permissions'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
            } catch (Exception $e) {
                // Roles table might not exist yet if migration hasn't run
                // Fallback to basic role from users table
                $profile['roles'] = [$user['role']];
            }

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

            // Page views are now fetched directly from the users.views column above

            return $profile;
        }
        return null;
    } catch (PDOException $e) {
        error_log("Profile Fetch Error: " . $e->getMessage());
        return null;
    }
}

function get_json_input()
{
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}
?>