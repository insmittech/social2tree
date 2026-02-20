<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RBAC Migration | Social2Tree</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 20px; background: #f8fafc; color: #1e293b; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0; }
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
    <h1>RBAC System Migration</h1>
<?php
include_once __DIR__ . '/utils.php';
include_once __DIR__ . '/db.php';

try {
    // 1. Create tables
    echo "<h2>1. Creating RBAC tables...</h2>";

    $tables = [
        'roles' => "CREATE TABLE IF NOT EXISTS roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            description VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'permissions' => "CREATE TABLE IF NOT EXISTS permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            module VARCHAR(50) NOT NULL,
            description VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'role_permissions' => "CREATE TABLE IF NOT EXISTS role_permissions (
            role_id INT NOT NULL,
            permission_id INT NOT NULL,
            PRIMARY KEY (role_id, permission_id),
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
            FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'user_roles' => "CREATE TABLE IF NOT EXISTS user_roles (
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            PRIMARY KEY (user_id, role_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    ];

    foreach ($tables as $tableName => $sql) {
        echo "Creating table <code>$tableName</code>... ";
        $pdo->exec($sql);
        echo "<span class='success'>✅ Done</span><br>";
    }

    // 2. Seed permissions
    echo "<h2>2. Seeding default permissions...</h2>";
    $permissions_list = [
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
        ['rbac:manage', 'rbac', 'Full control over Roles and Permissions']
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO permissions (name, module, description) VALUES (?, ?, ?)");
    foreach ($permissions_list as $p) {
        $stmt->execute($p);
    }
    echo "Permissions seeded... <span class='success'>✅ Done</span><br>";

    // 3. Seed default roles
    echo "<h2>3. Seeding default roles...</h2>";
    $roles_list = [
        ['SuperAdmin', 'Unrestricted administrative access.'],
        ['Manager', 'Can manage users, links, and billing but not system RBAC.'],
        ['Support', 'Can view users and links, but cannot delete or change system settings.'],
        ['Editor', 'Can manage links and pages, but no administrative access.'],
        ['User', 'Default end-user role with access to their own dashboard.']
    ];

    $role_stmt = $pdo->prepare("INSERT IGNORE INTO roles (name, description) VALUES (?, ?)");
    foreach ($roles_list as $r) {
        $role_stmt->execute($r);
    }
    echo "Roles seeded... <span class='success'>✅ Done</span><br>";

    // 4. Assign permissions to roles
    echo "<h2>4. Mapping permissions to roles...</h2>";
    
    // SuperAdmin gets everything
    $pdo->exec("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                SELECT (SELECT id FROM roles WHERE name='SuperAdmin'), id FROM permissions");
    
    // Manager permissions
    $manager_perms = ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage', 'users:view', 'users:edit', 'billing:view', 'billing:manage', 'settings:view'];
    foreach ($manager_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Manager'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }

    // Support permissions
    $support_perms = ['links:view', 'users:view', 'billing:view', 'settings:view'];
    foreach ($support_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Support'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }

    // Editor permissions
    $editor_perms = ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage'];
    foreach ($editor_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Editor'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }

    // User permissions
    $user_perms = ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage'];
    foreach ($user_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='User'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }
    echo "Role-Permission mappings... <span class='success'>✅ Done</span><br>";

    // 5. Migrate existing users
    echo "<h2>5. Migrating users to new role system...</h2>";
    
    // Assign SuperAdmin to existing admins
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='SuperAdmin') FROM users WHERE role = 'admin'");
    
    // Assign User role to existing users
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='User') FROM users WHERE role = 'user'");
    
    echo "Existing users migrated... <span class='success'>✅ Done</span><br>";

    echo "<div class='footer'><span class='success'>🎉 RBAC System is now active!</span><br><br>";
    echo "<a href='/'>Return to Site</a></div>";

} catch (PDOException $e) {
    echo "<h3 style='color:red;'>Migration failed!</h3>";
    echo "<p>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
</div>
</body>
</html>
