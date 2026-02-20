<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['slug']) && !empty($data['displayName'])) {
    $slug = sanitize_input($data['slug']);
    $display_name = sanitize_input($data['displayName']);
    
    // Simple slug validation
    if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
        json_response(["message" => "Slug can only contain lowercase letters, numbers, and hyphens."], 400);
        exit();
    }

    try {
        // Check if slug taken
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE slug = ?");
        $check->execute([$slug]);
        if ($check->fetchColumn() > 0) {
            json_response(["message" => "This slug is already taken."], 400);
            exit();
        }

        $query = "INSERT INTO pages (user_id, slug, display_name, theme, button_style) VALUES (:user_id, :slug, :display_name, 'default', 'rounded-lg')";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ':user_id' => $user_id,
            ':slug' => $slug,
            ':display_name' => $display_name
        ]);

        $page_id = $pdo->lastInsertId();
        
        json_response([
            "message" => "Page created successfully.",
            "page" => [
                "id" => (string)$page_id,
                "slug" => $slug,
                "displayName" => $display_name,
                "theme" => "default",
                "buttonStyle" => "rounded-lg",
                "links" => []
            ]
        ], 201);

    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Slug and display name are required."], 400);
}
?>
