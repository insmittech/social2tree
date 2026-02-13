<?php
include_once __DIR__ . '/utils.php';
json_response();
include_once __DIR__ . '/db.php';

echo "<h1>Database Migration</h1>";

try {
    // 1. Check users table
    echo "<h2>Checking 'users' table...</h2>";
    $stmt = $pdo->query("DESCRIBE users");
    $existing_columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $needed_columns = [
        'display_name' => "VARCHAR(100) AFTER password_hash",
        'bio' => "TEXT AFTER display_name",
        'avatar_url' => "VARCHAR(255) AFTER bio",
        'theme' => "VARCHAR(50) DEFAULT 'default' AFTER avatar_url",
        'button_style' => "VARCHAR(50) DEFAULT 'rounded-lg' AFTER theme",
        'plan' => "ENUM('free', 'pro', 'business') DEFAULT 'free' AFTER button_style",
        'role' => "ENUM('user', 'admin') DEFAULT 'user' AFTER plan",
        'status' => "ENUM('active', 'suspended') DEFAULT 'active' AFTER role"
    ];

    foreach ($needed_columns as $column => $definition) {
        if (!in_array($column, $existing_columns)) {
            echo "Adding missing column: <strong>$column</strong>... ";
            $pdo->exec("ALTER TABLE users ADD $column $definition");
            echo "✅ Done<br>";
        } else {
            echo "Column <strong>$column</strong> already exists.<br>";
        }
    }

    echo "<h3>Migration completed successfully!</h3>";
    echo "<p><a href='diagnostic.php'>Go to Diagnostics</a> | <a href='auth/me.php'>Check API</a></p>";

} catch (PDOException $e) {
    echo "<h3 style='color:red;'>Migration failed!</h3>";
    echo "Error: " . $e->getMessage();
}
?>
