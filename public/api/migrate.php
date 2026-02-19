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
        'status' => "ENUM('active', 'suspended') DEFAULT 'active' AFTER role",
        'custom_domain' => "VARCHAR(255) NULL AFTER status"
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
        'pages' => "CREATE TABLE IF NOT EXISTS pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            slug VARCHAR(100) NOT NULL UNIQUE,
            display_name VARCHAR(100),
            bio TEXT,
            avatar_url VARCHAR(255),
            theme VARCHAR(50) DEFAULT 'default',
            button_style VARCHAR(50) DEFAULT 'rounded-lg',
            custom_domain VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'links' => "CREATE TABLE IF NOT EXISTS links (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            page_id INT NULL,
            title VARCHAR(255) NOT NULL,
            url TEXT NOT NULL,
            icon VARCHAR(50) NULL,
            is_active TINYINT(1) DEFAULT 1,
            clicks INT DEFAULT 0,
            type VARCHAR(50) DEFAULT 'social',
            sort_order INT DEFAULT 0,
            scheduled_start DATETIME NULL,
            scheduled_end DATETIME NULL,
            password VARCHAR(100) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_links (user_id, sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'analytics' => "CREATE TABLE IF NOT EXISTS analytics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            page_id INT NULL,
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

    // 3. Refining table structures
    echo "<h2>3. Refining table structures...</h2>";
    $stmt = $pdo->query("DESCRIBE links");
    $link_columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $links_refinements = [
        'page_id' => "INT NULL AFTER user_id",
        'icon' => "VARCHAR(50) NULL AFTER url",
        'type' => "VARCHAR(50) DEFAULT 'social' AFTER clicks",
        'sort_order' => "INT DEFAULT 0 AFTER type",
        'scheduled_start' => "DATETIME NULL AFTER sort_order",
        'scheduled_end' => "DATETIME NULL AFTER scheduled_start",
        'password' => "VARCHAR(100) NULL AFTER scheduled_end"
    ];

    foreach ($links_refinements as $column => $definition) {
        if (!in_array($column, $link_columns)) {
            echo "Adding missing column <code>$column</code> to <code>links</code>... ";
            $pdo->exec("ALTER TABLE links ADD $column $definition");
            echo "<span class='success'>✅ Fixed</span><br>";
        }
    }
    
    // Ensure indices and foreign keys
    try {
        $pdo->exec("ALTER TABLE links ADD INDEX idx_page_links (page_id)");
        $pdo->exec("ALTER TABLE links ADD CONSTRAINT fk_page_links FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE");
    } catch (Exception $e) { /* Probably already exists */ }

    $stmt = $pdo->query("DESCRIBE analytics");
    $ana_columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('page_id', $ana_columns)) {
        echo "Adding missing column <code>page_id</code> to <code>analytics</code>... ";
        $pdo->exec("ALTER TABLE analytics ADD page_id INT NULL AFTER user_id");
        echo "<span class='success'>✅ Fixed</span><br>";
    }
    
    try {
        $pdo->exec("ALTER TABLE analytics ADD CONSTRAINT fk_page_analytics FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE");
    } catch (Exception $e) { /* Probably already exists */ }

    // 4. Data Migration to Pages
    echo "<h2>4. Migrating profile data to 'pages' table...</h2>";
    $stmt = $pdo->query("SELECT id, username, display_name, bio, avatar_url, theme, button_style, custom_domain FROM users");
    $all_users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($all_users as $user) {
        // Check if user already has at least one page
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE user_id = ?");
        $check->execute([$user['id']]);
        if ($check->fetchColumn() == 0) {
            echo "Migrating user <code>{$user['username']}</code> to pages... ";
            $insert = $pdo->prepare("INSERT INTO pages (user_id, slug, display_name, bio, avatar_url, theme, button_style, custom_domain) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $insert->execute([
                $user['id'], 
                $user['username'], 
                $user['display_name'] ?? $user['username'], 
                $user['bio'] ?? '', 
                $user['avatar_url'] ?? '', 
                $user['theme'] ?? 'default', 
                $user['button_style'] ?? 'rounded-lg', 
                $user['custom_domain'] ?? null
            ]);
            $page_id = $pdo->lastInsertId();

            // Link existing data to this new page
            $pdo->prepare("UPDATE links SET page_id = ? WHERE user_id = ?")->execute([$page_id, $user['id']]);
            $pdo->prepare("UPDATE analytics SET page_id = ? WHERE user_id = ?")->execute([$page_id, $user['id']]);

            echo "<span class='success'>✅ Done</span><br>";
        }
    }

    // 5. Seed default settings
    echo "<h2>5. Seeding system settings...</h2>";
    $seedSql = "INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
        ('site_name', 'Social2Tree'), 
        ('maintenance_mode', 'false'),
        ('free_link_limit', '3'),
        ('pro_link_limit', '100'),
        ('pro_price', '15.00'),
        ('enable_custom_domains', 'true'),
        ('available_themes', '[\"default\", \"dark\", \"glass\", \"minimal\"]')";
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
