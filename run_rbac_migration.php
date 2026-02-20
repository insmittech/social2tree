<?php
include 'public/api/db.php';

try {
    echo "Starting RBAC Migration...\n";

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
        echo "Creating table $tableName... ";
        $pdo->exec($sql);
        echo "Done.\n";
    }

    echo "Seeding permissions... ";
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
    echo "Done.\n";

    echo "Seeding roles... ";
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
    echo "Done.\n";

    echo "Mapping permissions to roles... ";
    $pdo->exec("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                SELECT (SELECT id FROM roles WHERE name='SuperAdmin'), id FROM permissions");
    
    $manager_perms = ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage', 'users:view', 'users:edit', 'billing:view', 'billing:manage', 'settings:view'];
    foreach ($manager_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Manager'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }

    $support_perms = ['links:view', 'users:view', 'billing:view', 'settings:view'];
    foreach ($support_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Support'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }

    $user_perms = ['links:create', 'links:view', 'links:edit', 'links:delete', 'pages:manage'];
    foreach ($user_perms as $p_name) {
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='User'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
        $pdo->prepare("INSERT IGNORE INTO role_permissions (role_id, permission_id) 
                       SELECT (SELECT id FROM roles WHERE name='Editor'), id FROM permissions WHERE name = ?")
            ->execute([$p_name]);
    }
    echo "Done.\n";

    echo "Migrating users... ";
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='SuperAdmin') FROM users WHERE role = 'admin'");
    $pdo->exec("INSERT IGNORE INTO user_roles (user_id, role_id) 
                SELECT id, (SELECT id FROM roles WHERE name='User') FROM users WHERE role = 'user'");
    echo "Done.\n";

    echo "Migration completed successfully!\n";

} catch (Exception $e) {
    echo "Fatal Error: " . $e->getMessage() . "\n";
}
