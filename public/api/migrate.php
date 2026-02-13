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

    // 2. Ensure missing tables exist
    echo "<h2>Checking for missing tables...</h2>";
    
    $tables = [
        'links' => "CREATE TABLE IF NOT EXISTS links (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            url TEXT NOT NULL,
            is_active TINYINT(1) DEFAULT 1,
            clicks INT DEFAULT 0,
            type VARCHAR(50) DEFAULT 'social',
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_links (user_id, sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'analytics' => "CREATE TABLE IF NOT EXISTS analytics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            link_id INT NULL,
            visitor_id VARCHAR(64),
            ip_address VARCHAR(45),
            user_agent VARCHAR(255),
            referrer VARCHAR(255),
            country_code VARCHAR(3),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_analytics_user (user_id, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'settings' => "CREATE TABLE IF NOT EXISTS settings (
            setting_key VARCHAR(50) PRIMARY KEY,
            setting_value TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    ];

    foreach ($tables as $tableName => $sql) {
        echo "Checking table <strong>$tableName</strong>... ";
        $pdo->exec($sql);
        echo "✅ OK<br>";
    }

    // 3. Seed default settings
    echo "<h2>Seeding default settings...</h2>";
    $seedSql = "INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
        ('site_name', 'Social2Tree'), 
        ('maintenance_mode', 'false'),
        ('free_link_limit', '5'),
        ('pro_price', '15.00')";
    $pdo->exec($seedSql);
    echo "✅ Done<br>";

    echo "<h3>Migration completed successfully!</h3>";
    echo "<p><a href='diagnostic.php'>Go to Diagnostics</a> | <a href='auth/me.php'>Check API</a></p>";

} catch (PDOException $e) {
    echo "<h3 style='color:red;'>Migration failed!</h3>";
    echo "Error: " . $e->getMessage();
}
?>
