<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../rbac.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../../db.php';

// Only SuperAdmin can manage RBAC
require_permission($pdo, 'rbac:manage');

$data = get_json_input();

if (!empty($data['name'])) {
    $name = sanitize_input($data['name']);
    $description = sanitize_input($data['description'] ?? '');
    $permissions = $data['permissions'] ?? []; // Array of permission names
    $role_id = isset($data['id']) ? (int)$data['id'] : null;

    try {
        $pdo->beginTransaction();

        if ($role_id) {
            // Update existing role
            $stmt = $pdo->prepare("UPDATE roles SET name = ?, description = ? WHERE id = ?");
            $stmt->execute([$name, $description, $role_id]);
        } else {
            // Create new role
            $stmt = $pdo->prepare("INSERT INTO roles (name, description) VALUES (?, ?)");
            $stmt->execute([$name, $description]);
            $role_id = $pdo->lastInsertId();
        }

        // Update permissions
        // 1. Clear existing
        $stmt = $pdo->prepare("DELETE FROM role_permissions WHERE role_id = ?");
        $stmt->execute([$role_id]);

        // 2. Add new
        if (!empty($permissions)) {
            $p_stmt = $pdo->prepare("INSERT INTO role_permissions (role_id, permission_id) 
                                   SELECT ?, id FROM permissions WHERE name = ?");
            foreach ($permissions as $p_name) {
                $p_stmt->execute([$role_id, $p_name]);
            }
        }

        $pdo->commit();
        
        // Clear cache for all users (simplest approach for now)
        clear_permission_cache();

        json_response(["message" => "Role saved successfully.", "role_id" => $role_id]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Role name is required."], 400);
}
