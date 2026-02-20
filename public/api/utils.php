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

function get_json_input()
{
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}
?>