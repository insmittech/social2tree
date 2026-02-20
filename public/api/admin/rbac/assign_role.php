<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../rbac.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../../db.php';

// Only those with users:edit or rbac:manage can assign roles
if (!has_permission($pdo, $_SESSION['user_id'], 'rbac:manage') && !has_permission($pdo, $_SESSION['user_id'], 'users:edit')) {
    json_response(["message" => "Forbidden: Insufficient permissions."], 403);
    exit;
}

$data = get_json_input();

if (!empty($data['user_id']) && isset($data['roles'])) {
    $user_id = (int)$data['user_id'];
    $role_names = $data['roles']; // Array of role names

    try {
        $pdo->beginTransaction();

        // 1. Clear existing user roles
        $stmt = $pdo->prepare("DELETE FROM user_roles WHERE user_id = ?");
        $stmt->execute([$user_id]);

        // 2. Add new roles
        if (!empty($role_names)) {
            $stmt = $pdo->prepare("INSERT INTO user_roles (user_id, role_id) 
                                 SELECT ?, id FROM roles WHERE name = ?");
            foreach ($role_names as $r_name) {
                $stmt->execute([$user_id, $r_name]);
            }
        }

        $pdo->commit();
        
        // Clear permission cache
        clear_permission_cache();

        json_response(["message" => "User roles updated successfully."]);

    } catch (PDOException $e) {
        $pdo->rollBack();
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "User ID and roles are required."], 400);
}
