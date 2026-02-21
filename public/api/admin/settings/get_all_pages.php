<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require admin permission
require_permission($pdo, 'settings:view');
json_response();

try {
    // Fetch all bio-tree pages (users who have a public slug/username)
    $stmt = $pdo->query("SELECT username AS slug, display_name AS displayName FROM users WHERE username IS NOT NULL AND username != '' ORDER BY display_name ASC");
    $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["pages" => $pages]);
} catch (PDOException $e) {
    // Return empty array on error so AdminMenus doesn't crash
    json_response(["pages" => []]);
}
?>
