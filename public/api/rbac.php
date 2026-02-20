<?php
include_once __DIR__ . '/utils.php';

/**
 * RBAC Helper for Social2Tree
 */

/**
 * Fetches all permissions for a given user.
 * Results are cached in the session for performance if a session is active.
 */
function get_user_permissions($pdo, $user_id) {
    if (session_status() === PHP_SESSION_NONE) {
        start_secure_session();
    }

    // Return cached permissions if available
    if (isset($_SESSION['permissions']) && $_SESSION['permission_user_id'] == $user_id) {
        return $_SESSION['permissions'];
    }

    try {
        $sql = "SELECT DISTINCT p.name 
                FROM permissions p
                JOIN role_permissions rp ON p.id = rp.permission_id
                JOIN user_roles ur ON rp.role_id = ur.role_id
                WHERE ur.user_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user_id]);
        $permissions = $stmt->fetchAll(PDO::FETCH_COLUMN);

        // Cache in session
        $_SESSION['permissions'] = $permissions;
        $_SESSION['permission_user_id'] = $user_id;

        return $permissions;
    } catch (PDOException $e) {
        error_log("RBAC Error: " . $e->getMessage());
        return [];
    }
}

/**
 * Checks if a user has a specific permission.
 */
function has_permission($pdo, $user_id, $permission_name) {
    $permissions = get_user_permissions($pdo, $user_id);
    return in_array($permission_name, $permissions);
}

/**
 * Middleware: Requires a specific permission to continue.
 */
function require_permission($pdo, $permission_name) {
    $user_id = require_auth();
    if (!has_permission($pdo, $user_id, $permission_name)) {
        json_response(["message" => "Forbidden: You do not have the required permission ($permission_name)."], 403);
        exit;
    }
    return $user_id;
}

/**
 * Fetches all roles assigned to a user.
 */
function get_user_roles($pdo, $user_id) {
    try {
        $stmt = $pdo->prepare("SELECT r.name FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        return [];
    }
}

/**
 * Clears the permission cache for a user.
 * Should be called when roles/permissions are updated.
 */
function clear_permission_cache() {
    if (session_status() !== PHP_SESSION_NONE) {
        unset($_SESSION['permissions']);
        unset($_SESSION['permission_user_id']);
    }
}
