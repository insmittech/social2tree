<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Database Sync | Social2Tree</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f8fafc; color: #1e293b; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
        h1 { margin-top: 0; color: #0f172a; font-weight: 800; font-size: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
        h2 { color: #4f46e5; border-left: 4px solid #4f46e5; padding-left: 15px; font-size: 1.25rem; margin-top: 30px; }
        .success { color: #059669; font-weight: 700; }
        .info { color: #64748b; font-size: 0.9rem; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        .footer { margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-weight: 700; }
        a { color: #4f46e5; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
<div class="container">
    <h1>Database Synchronization</h1>
<?php
include_once __DIR__ . '/utils.php';
// We don't call json_response() here because we want HTML output
include_once __DIR__ . '/db.php';

try {
    // 1. Ensure users table structure is correct
    echo "<h2>1. Synchronizing 'users' table...</h2>";
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
            echo "Adding missing column <code>$column</code>... ";
            $pdo->exec("ALTER TABLE users ADD $column $definition");
            echo "<span class='success'>✅ Fixed</span><br>";
        } else {
            echo "Column <code>$column</code>... <span class='info'>Already proper</span><br>";
        }
    }

    // 2. Ensure missing tables exist
    echo "<h2>2. Checking for missing tables...</h2>";
    
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
        echo "Table <code>$tableName</code>... ";
        $pdo->exec($sql);
        echo "<span class='success'>✅ Proper</span><br>";
    }

    // 3. Ensure default Admin exists
    echo "<h2>3. Verifying Administrator account...</h2>";
    $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    $adminCount = $stmt->fetchColumn();

    if ($adminCount == 0) {
        echo "Creating default admin (admin@social2tree.com)... ";
        $passHash = password_hash('password123', PASSWORD_BCRYPT);
        $pdo->exec("INSERT INTO users (username, email, password_hash, role, display_name) VALUES ('admin', 'admin@social2tree.com', '$passHash', 'admin', 'System Admin')");
        echo "<span class='success'>✅ Created</span><br>";
        echo "<span class='info'>(Login: <code>admin</code> / <code>password123</code>)</span><br>";
    } else {
        echo "Admin account... <span class='info'>Already exists</span><br>";
    }

    // 4. Seed default settings
    echo "<h2>4. Seeding system settings...</h2>";
    $seedSql = "INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
        ('site_name', 'SocialTree'), 
        ('maintenance_mode', 'false'),
        ('free_link_limit', '5'),
        ('pro_price', '15.00')";
    $pdo->exec($seedSql);
    echo "System settings... <span class='success'>✅ Synchronized</span><br>";

    echo "<div class='footer'><span class='success'>🎉 Database is now fully proper!</span><br><br>";
    echo "<a href='diagnostic.php'>Go to Diagnostics</a> | <a href='/'>Return to Site</a></div>";

} catch (PDOException $e) {
    echo "<h3 style='color:red;'>Synchronization failed!</h3>";
    echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Please ensure your <code>db.php</code> settings are correct.</p>";
}
?>
</div>
</body>
</html>
