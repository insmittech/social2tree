<?php
// Simple diagnostic to check PHP and environment
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Server Diagnostics</h1>";

// 1. PHP Version
echo "<h2>✓ PHP Version</h2>";
echo "PHP Version: " . phpversion() . "<br>";

// 2. Check if .env file exists
echo "<h2>🔍 .env File Check</h2>";
$env_paths = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env'
];

foreach ($env_paths as $path) {
    if (file_exists($path)) {
        echo "✅ Found .env at: " . $path . "<br>";
        echo "File size: " . filesize($path) . " bytes<br>";
        echo "Readable: " . (is_readable($path) ? "Yes" : "No") . "<br>";
        break;
    } else {
        echo "❌ Not found at: " . $path . "<br>";
    }
}

// 3. Test environment variables
echo "<h2>🔑 Environment Variables</h2>";
include_once __DIR__ . '/env_loader.php';

$vars = ['DB_HOST', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD'];
foreach ($vars as $var) {
    $value = getenv($var);
    if ($value) {
        echo "✅ $var: " . substr($value, 0, 3) . "***<br>";
    } else {
        echo "❌ $var: NOT SET<br>";
    }
}

// 4. Test database connection
echo "<h2>🗄️ Database Connection</h2>";
try {
    $host = getenv('DB_HOST');
    $db = getenv('DB_DATABASE');
    $user = getenv('DB_USERNAME');
    $pass = getenv('DB_PASSWORD');

    if (!$host || !$db || !$user) {
        throw new Exception("Missing database credentials from .env");
    }

    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "✅ Database connection successful!<br>";
    echo "Connected to: $db on $host<br>";

    // 5. Check Table Schema
    echo "<h2>📊 Table Schema Check (users)</h2>";
    $stmt = $pdo->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    foreach ($columns as $column) {
        echo "<tr>";
        foreach ($column as $value) {
            echo "<td>" . ($value === null ? 'NULL' : htmlspecialchars($value)) . "</td>";
        }
        echo "</tr>";
    }
    echo "</table>";

} catch (Exception $e) {
    echo "❌ Database connection failed!<br>";
    echo "Error: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<p>Current directory: " . __DIR__ . "</p>";
?>