<?php
include_once __DIR__ . '/../../utils.php';

// Auth check - Admin only for overriding SEO
$user_id = require_auth();
if (!is_admin()) {
    json_response(["message" => "Admin access required."], 403);
    exit();
}

include_once __DIR__ . '/../../db.php';

$page_id = $_GET['page_id'] ?? null;

if (!$page_id) {
    json_response(["message" => "Page ID is required."], 400);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM seo_metadata WHERE page_id = ?");
    $stmt->execute([$page_id]);
    $seo = $stmt->fetch();

    if ($seo) {
        $seo['is_indexed'] = (bool)$seo['is_indexed'];
        $seo['include_in_sitemap'] = (bool)$seo['include_in_sitemap'];
        $seo['structured_data'] = json_decode($seo['structured_data']);
        json_response($seo);
    } else {
        // Return defaults if no entry exists
        json_response([
            "page_id" => $page_id,
            "title_tag" => "",
            "meta_description" => "",
            "meta_keywords" => "",
            "og_image" => "",
            "is_indexed" => true,
            "include_in_sitemap" => true,
            "canonical_url" => "",
            "structured_data" => null
        ]);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
