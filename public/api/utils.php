<?php
// Set headers for CORS and JSON response
function json_response($data = null, $status = 200)
{
    header_remove();
    http_response_code($status);
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

function sanitize_input($data)
{
    return htmlspecialchars(stripslashes(trim($data)));
}

function get_json_input()
{
    $json = file_get_contents('php://input');
    return json_decode($json, true);
}
?>