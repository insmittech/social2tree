<?php
include_once __DIR__ . '/../../utils.php';

// Auth check - Admin or Page Owner
$user_id = require_auth();
$is_admin = is_admin();

include_once __DIR__ . '/../../db.php';

$data = get_json_input();
$page_id = $data['page_id'] ?? null;

if (!$page_id) {
    json_response(["message" => "Page ID is required."], 400);
    exit();
}

try {
    // Check access
    if (!$is_admin) {
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE id = ? AND user_id = ?");
        $check->execute([$page_id, $user_id]);
        if ($check->fetchColumn() == 0) {
            json_response(["message" => "Access denied."], 403);
            exit();
        }
    }

    $title_tag = sanitize_input($data['title_tag'] ?? null);
    $meta_description = sanitize_input($data['meta_description'] ?? null);
    $meta_keywords = sanitize_input($data['meta_keywords'] ?? null);
    $og_image = sanitize_input($data['og_image'] ?? null);
    $is_indexed = isset($data['is_indexed']) ? (int)$data['is_indexed'] : 1;
    $include_in_sitemap = isset($data['include_in_sitemap']) ? (int)$data['include_in_sitemap'] : 1;
    $canonical_url = sanitize_input($data['canonical_url'] ?? null);
    $structured_data = isset($data['structured_data']) ? json_encode($data['structured_data']) : null;

    $stmt = $pdo->prepare("INSERT INTO seo_metadata (
        page_id, title_tag, meta_description, meta_keywords, og_image, 
        is_indexed, include_in_sitemap, canonical_url, structured_data
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        title_tag = VALUES(title_tag),
        meta_description = VALUES(meta_description),
        meta_keywords = VALUES(meta_keywords),
        og_image = VALUES(og_image),
        is_indexed = VALUES(is_indexed),
        include_in_sitemap = VALUES(include_in_sitemap),
        canonical_url = VALUES(canonical_url),
        structured_data = VALUES(structured_data)");

    if ($stmt->execute([
        $page_id, $title_tag, $meta_description, $meta_keywords, $og_image,
        $is_indexed, $include_in_sitemap, $canonical_url, $structured_data
    ])) {
        // Auto-ping Google (if indexer is active)
        if ($is_indexed) {
            // ping_search_engines($page_id);
        }
        json_response(["message" => "SEO settings saved successfully."]);
    } else {
        json_response(["message" => "Unable to save SEO settings."], 500);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
