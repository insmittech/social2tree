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

    // Automatically set timezone if user is logged in
    if (session_status() !== PHP_SESSION_NONE && isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("SELECT timezone FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $tz = $stmt->fetchColumn();
        if ($tz) {
            date_default_timezone_set($tz);
            try {
                $pdo->exec("SET time_zone = '$tz'");
            } catch (Exception $e) {
                // Some MySQL setups might not have timezone data populated
            }
        }
    }
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