<?php
include_once __DIR__ . '/env_loader.php';

function get_env_var($name, $default = null) {
    $value = getenv($name);
    if ($value !== false) return $value;
    if (isset($_ENV[$name])) return $_ENV[$name];
    if (isset($_SERVER[$name])) return $_SERVER[$name];
    return $default;
}

$host = get_env_var('DB_HOST');
$db = get_env_var('DB_DATABASE');
$user = get_env_var('DB_USERNAME');
$pass = get_env_var('DB_PASSWORD');
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    if (function_exists('json_response')) {
        json_response(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
    } else {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    }
    exit;
}
?>