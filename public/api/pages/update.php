<?php
include_once __DIR__ . '/../utils.php';
session_start();
json_response();
include_once __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id'])) {
    json_response(["message" => "Unauthorized."], 401);
    exit();
}

$data = get_json_input();
$user_id = $_SESSION['user_id'];

if (!empty($data['id'])) {
    $id = (int)$data['id'];
    
    // 1. Verify ownership
    $stmt = $pdo->prepare("SELECT user_id, slug FROM pages WHERE id = ?");
    $stmt->execute([$id]);
    $page = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$page || $page['user_id'] != $user_id) {
        json_response(["message" => "Page not found or access denied."], 403);
        exit();
    }

    $updates = [];
    $params = [];

    if (isset($data['slug'])) {
        $new_slug = strtolower(sanitize_input($data['slug']));
        // Check uniqueness if slug changed
        if ($new_slug !== $page['slug']) {
            $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ?");
            $check->execute([$new_slug]);
            if ($check->fetchColumn() > 0) {
                json_response(["message" => "Slug already taken."], 400);
                exit();
            }
        }
        $updates[] = "slug = ?";
        $params[] = $new_slug;
    }

    if (isset($data['displayName'])) {
        $updates[] = "display_name = ?";
        $params[] = sanitize_input($data['displayName']);
    }

    if (isset($data['bio'])) {
        $updates[] = "bio = ?";
        $params[] = sanitize_input($data['bio']);
    }

    if (isset($data['theme'])) {
        $updates[] = "theme = ?";
        $params[] = sanitize_input($data['theme']);
    }

    if (isset($data['buttonStyle'])) {
        $updates[] = "button_style = ?";
        $params[] = sanitize_input($data['buttonStyle']);
    }

    if (isset($data['customDomain'])) {
        $updates[] = "custom_domain = ?";
        $params[] = sanitize_input($data['customDomain']);
    }

    if (empty($updates)) {
        json_response(["message" => "No changes provided."], 400);
        exit();
    }

    $params[] = $id;
    $sql = "UPDATE pages SET " . implode(", ", $updates) . " WHERE id = ?";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        json_response(["message" => "Page updated successfully."]);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Page ID required."], 400);
}
?>
