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

if (!empty($data['slug']) && !empty($data['displayName'])) {
    $slug = strtolower(sanitize_input($data['slug']));
    $displayName = sanitize_input($data['displayName']);
    $bio = isset($data['bio']) ? sanitize_input($data['bio']) : '';
    $theme = isset($data['theme']) ? sanitize_input($data['theme']) : 'default';
    $customDomain = isset($data['customDomain']) ? sanitize_input($data['customDomain']) : null;

    // ... (Checks)

    try {
        $query = "INSERT INTO pages (user_id, slug, display_name, bio, theme, custom_domain) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$user_id, $slug, $displayName, $bio, $theme, $customDomain]);

        $page_id = $pdo->lastInsertId();

        json_response([
            "message" => "Page created successfully.",
            "page" => [
                "id" => (string)$page_id,
                "slug" => $slug,
                "displayName" => $displayName,
                "bio" => $bio,
                "theme" => $theme,
                "customDomain" => $customDomain,
                "links" => []
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Slug and Display Name are required."], 400);
}
?>
