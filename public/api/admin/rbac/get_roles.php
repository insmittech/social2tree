<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../rbac.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../../db.php';

// Only SuperAdmin can manage RBAC
require_permission($pdo, 'rbac:manage');

try {
    // Fetch all roles
    $stmt = $pdo->query("SELECT * FROM roles ORDER BY name ASC");
    $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // For each role, fetch its permissions
    foreach ($roles as &$role) {
        $p_stmt = $pdo->prepare("SELECT p.name FROM permissions p 
                               JOIN role_permissions rp ON p.id = rp.permission_id 
                               WHERE rp.role_id = ?");
        $p_stmt->execute([$role['id']]);
        $role['permissions'] = $p_stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Fetch all available permissions grouped by module
    $p_stmt = $pdo->query("SELECT * FROM permissions ORDER BY module ASC, name ASC");
    $all_permissions = $p_stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        "roles" => $roles,
        "available_permissions" => $all_permissions
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
