<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Database Sync & RBAC Setup | Social2Tree</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f8fafc; color: #1e293b; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
        h1 { margin-top: 0; color: #0f172a; font-weight: 800; font-size: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
        h2 { color: #4f46e5; border-left: 4px solid #4f46e5; padding-left: 15px; font-size: 1.25rem; margin-top: 30px; }
        .success { color: #059669; font-weight: 700; }
        .info { color: #64748b; font-size: 0.9rem; }
        .warning { color: #d97706; font-weight: 700; }
        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        .footer { margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px; font-weight: 700; }
        a { color: #4f46e5; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .section { margin-bottom: 20px; padding: 15px; border-radius: 12px; border: 1px solid #f1f5f9; }
    </style>
</head>
<body>
<div class="container">
    <h1>System Database Synchronization</h1>
    <p class="info">This file is the single source of truth for the Social2Tree database schema and RBAC configuration.</p>

<?php
/**
 * Database Synchronization & RBAC Setup
 * 
 * This file handles:
 * 1. Base table creation (users, pages, links, analytics, settings)
 * 2. Column additions and schema refinements
 * 3. RBAC System implementation (roles, permissions, mappings)
 * 4. Initial data seeding and user migrations
 */

include_once __DIR__ . '/utils.php';
include_once __DIR__ . '/db.php';

try {
    // -------------------------------------------------------------------------
    // PHASE 1: Base Tables and Users Refinement
    // -------------------------------------------------------------------------
    echo "<h2>1. Core Schema Synchronization</h2>";
    
    // Check users table columns
    $stmt = $pdo->query("DESCRIBE users");
    $existingUserCols = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    $userColsToAdd = [
        'display_name' => "VARCHAR(100) AFTER password_hash",
        'bio' => "TEXT AFTER display_name",
        'avatar_url' => "VARCHAR(255) AFTER bio",
        'theme' => "VARCHAR(50) DEFAULT 'default' AFTER avatar_url",
        'button_style' => "VARCHAR(50) DEFAULT 'rounded-lg' AFTER theme",
        'plan' => "ENUM('free', 'pro', 'business', 'vip') DEFAULT 'free' AFTER button_style",
        'role' => "ENUM('user', 'admin') DEFAULT 'user' AFTER plan",
        'status' => "ENUM('active', 'suspended') DEFAULT 'active' AFTER role",
        'custom_domain' => "VARCHAR(255) NULL AFTER status",
        'is_verified' => "TINYINT(1) DEFAULT 0 AFTER custom_domain"
    ];

    foreach ($userColsToAdd as $col => $def) {
        if (!in_array($col, $existingUserCols)) {
            echo "Adding <code>users.$col</code>... ";
            $pdo->exec("ALTER TABLE users ADD $col $def");
            echo "<span class='success'>✅ Done</span><br>";
        }
    }

    // Check if VIP is in plan enum (if column already exists)
    if (in_array('plan', $existingUserCols)) {
        $pdo->exec("ALTER TABLE users MODIFY plan ENUM('free', 'pro', 'business', 'vip') DEFAULT 'free'");
    }

    // Core Tables
    $coreTables = [
        'verification_requests' => "CREATE TABLE IF NOT EXISTS verification_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            status ENUM('pending', 'approved', 'rejected', 'more_info') DEFAULT 'pending',
            details TEXT,
            rejection_reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

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
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        
        'settings' => "CREATE TABLE IF NOT EXISTS settings (
            setting_key VARCHAR(50) PRIMARY KEY,
            setting_value TEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'plans' => "CREATE TABLE IF NOT EXISTS plans (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            price_monthly DECIMAL(10,2) DEFAULT 0.00,
            price_yearly DECIMAL(10,2) DEFAULT 0.00,
            description TEXT,
            features JSON,
            is_popular TINYINT(1) DEFAULT 0,
            is_visible TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    ];

    foreach ($coreTables as $name => $sql) {
        echo "Validating core table <code>$name</code>... ";
        $pdo->exec($sql);
        echo "<span class='success'>✅ Proper</span><br>";
    }

    // -------------------------------------------------------------------------
    // PHASE 2: RBAC Implementation
    // -------------------------------------------------------------------------
    echo "<h2>2. RBAC System Setup</h2>";

    $rbacTables = [
        'roles' => "CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            description VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

        'permissions' => "CREATE TABLE IF NOT EXISTS permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            module VARCHAR(50) NOT NULL,
            description VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

        'role_permissions' => "CREATE TABLE IF NOT EXISTS role_permissions (
            role_id INT NOT NULL,
            permission_id INT NOT NULL,
            PRIMARY KEY (role_id, permission_id),
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

        'user_roles' => "CREATE TABLE IF NOT EXISTS user_roles (
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            PRIMARY KEY (user_id, role_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    ];

    foreach ($rbacTables as $name => $sql) {
        echo "Setting up RBAC table <code>$name</code>... ";
        $pdo->exec($sql);
        echo "<span class='success'>✅ Done</span><br>";
    }

    // RBAC Seeding
    $permsList = [
        ['links:create', 'links', 'Create new bio-tree links'],
        ['links:view', 'links', 'View existing bio-tree links'],
        ['links:edit', 'links', 'Edit existing bio-tree links'],
        ['links:delete', 'links', 'Delete bio-tree links'],
        ['pages:manage', 'pages', 'Full management of bio-tree pages'],
        ['users:view', 'user_management', 'View user list and details'],
        ['users:edit', 'user_management', 'Edit user profiles and roles'],
        ['users:delete', 'user_management', 'Delete or suspend users'],
        ['billing:view', 'billing', 'View billing and subscriptions'],
        ['billing:manage', 'billing', 'Manage plan settings and prices'],
        ['settings:view', 'system_settings', 'View system settings'],
        ['settings:manage', 'system_settings', 'Edit system configurations'],
        ['analytics:view', 'analytics', 'View platform-wide analytics'],
        ['rbac:manage', 'rbac', 'Full control over Roles and Permissions']
    ];

    $pStmt = $pdo->prepare("INSERT IGNORE INTO permissions (name, module, description) VALUES (?, ?, ?)");
    foreach ($permsList as $p) $pStmt->execute($p);

    $rolesList = [
        ['SuperAdmin', 'Unrestricted administrative access.'],
        ['Manager', 'Can manage users, links, and billing but not system RBAC.'],
        ['Support', 'Can view users and links, but cannot delete or change system settings.'],
        ['Editor', 'Can manage links and pages, but no administrative access.'],
        ['User', 'Default end-user role with access to their own dashboard.']
    ];

    $rStmt = $pdo->prepare("INSERT IGNORE INTO roles (name, description) VALUES (?, ?)");
    foreach ($rolesList as $r) $rStmt->execute($r);

    // Default Perm Mappings
    echo "Synchronizing Permission Mappings... ";
    $pdo->exec("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                SELECT (SELECT id FROM roles WHERE name='SuperAdmin'), id FROM permissions");
    
    $mappings = [
        'User' => ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage'],
        'Editor' => ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage'],
        'Support' => ['links:view', 'users:view', 'billing:view', 'settings:view', 'analytics:view'],
        'Manager' => ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage', 'users:view', 'users:edit', 'billing:view', 'billing:manage', 'settings:view', 'analytics:view']
    ];

    foreach ($mappings as $roleName => $perms) {
        foreach ($perms as $pName) {
            $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                           SELECT (SELECT id FROM roles WHERE name=?), id FROM permissions WHERE name = ?")
                ->execute([$roleName, $pName]);
        }
    }
    echo "<span class='success'>✅ Synchronized</span><br>";

    // -------------------------------------------------------------------------
    // PHASE 3: Data Integrity and Migrations
    // -------------------------------------------------------------------------
    echo "<h2>3. Data Migration and Defaults</h2>";

    // Migrate Legacy Roles to RBAC
    echo "Migrating user roles... ";
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='SuperAdmin') FROM users WHERE role = 'admin'");
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='User') FROM users WHERE role = 'user'");
    echo "<span class='success'>✅ Done</span><br>";

    // Initial Bio-Tree Page Creation for existing users
    echo "Verifying bio-tree pages... ";
    $usersWithoutPages = $pdo->query("SELECT id, username, display_name FROM users WHERE id NOT IN (SELECT user_id FROM pages)")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($usersWithoutPages as $u) {
        $slug = $u['username'];
        $pdo->prepare("INSERT IGNORE INTO pages (user_id, slug, display_name) VALUES (?, ?, ?)")
            ->execute([$u['id'], $slug, $u['display_name'] ?? $u['username']]);
    }
    echo "<span class='success'>✅ Done</span><br>";

    // Seed Settings
    echo "Validating system settings... ";
    $sysSettings = [
        'site_name' => 'Social2Tree',
        'maintenance_mode' => 'false',
        'free_link_limit' => '3',
        'pro_link_limit' => '100',
        'auto_verify_on_upgrade' => 'true',
        'available_themes' => '["default", "dark", "glass", "minimal"]'
    ];
    $sStmt = $pdo->prepare("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)");
    foreach ($sysSettings as $k => $v) $sStmt->execute([$k, $v]);
    echo "<span class='success'>✅ Proper</span><br>";

    // Seed Plans
    echo "Seeding initial subscription plans... ";
    $defaultPlans = [
        [
            'name' => 'Free',
            'price_monthly' => 0.00,
            'price_yearly' => 0.00,
            'description' => 'For individuals starting out.',
            'features' => json_encode(['1 Bio Tree', '3 Links', 'Basic Stats']),
            'is_popular' => 0,
            'is_visible' => 1,
            'sort_order' => 1
        ],
        [
            'name' => 'Pro',
            'price_monthly' => 15.00,
            'price_yearly' => 144.00,
            'description' => 'For serious creators.',
            'features' => json_encode(['Unlimited Trees', 'Unlimited Links', 'Advanced Stats', 'Custom Domain']),
            'is_popular' => 1,
            'is_visible' => 1,
            'sort_order' => 2
        ],
        [
            'name' => 'Agency',
            'price_monthly' => 59.00,
            'price_yearly' => 588.00,
            'description' => 'For teams and brands.',
            'features' => json_encode(['Everything in Pro', 'Team Access', 'API Access', 'Priority Support']),
            'is_popular' => 0,
            'is_visible' => 1,
            'sort_order' => 3
        ]
    ];

    $planInsert = $pdo->prepare("INSERT IGNORE INTO plans (name, price_monthly, price_yearly, description, features, is_popular, is_visible, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($defaultPlans as $p) {
        // Check if plan already exists by name
        $check = $pdo->prepare("SELECT COUNT(*) FROM plans WHERE name = ?");
        $check->execute([$p['name']]);
        if ($check->fetchColumn() == 0) {
            $planInsert->execute([
                $p['name'], $p['price_monthly'], $p['price_yearly'], $p['description'], $p['features'], $p['is_popular'], $p['is_visible'], $p['sort_order']
            ]);
        }
    }
    echo "<span class='success'>✅ Done</span><br>";
    
    // Clear permission cache to reflect changes immediately
    clear_permission_cache();
    echo "Permission cache cleared.<br>";

    echo "<div class='footer'><span class='success'>🎉 All systems synchronized successfully!</span><br><br>";
    echo "<a href='/'>Go to Landing Page</a> | <a href='/dashboard'>Go to Dashboard</a></div>";

} catch (PDOException $e) {
    echo "<div class='section' style='background:#fef2f2; border-color:#fecaca;'>";
    echo "<h3 style='color:#dc2626;'>Critical Synchronizaton Error</h3>";
    echo "<p><code>" . htmlspecialchars($e->getMessage()) . "</code></p>";
    echo "<p class='warning'>⚠️ Please check your database connection in <code>db.php</code>.</p>";
    echo "</div>";
}
?>
</div>
</body>
</html>
