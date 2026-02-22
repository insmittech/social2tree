<?php
include_once __DIR__ . '/../db.php';
include_once __DIR__ . '/../utils.php';

$slug = $_GET['slug'] ?? 'home';

try {
    // 1. Find the page by slug
    // We handle 'home' explicitly if necessary, but assume it exists in 'pages'
    $stmt = $pdo->prepare("SELECT p.id, p.display_name, p.bio, p.avatar_url, s.* 
                           FROM pages p 
                           LEFT JOIN seo_metadata s ON p.id = s.page_id 
                           WHERE p.slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        $response = [
            "title" => $data['title_tag'] ?: ($data['display_name'] . " | Social2Tree"),
            "description" => $data['meta_description'] ?: ($data['bio'] ?: "Social2Tree - The ultimate bio link tool for creators."),
            "keywords" => $data['meta_keywords'] ?: "bio link, social link, creators, portfolio",
            "og_image" => $data['og_image'] ?: ($data['avatar_url'] ?: "https://social2tree.com/og-default.png"),
            "is_indexed" => (bool)($data['is_indexed'] ?? 1),
            "canonical_url" => $data['canonical_url'] ?: ("https://social2tree.com/" . ($slug === 'home' ? '' : $slug)),
            "structured_data" => $data['structured_data'] ? json_decode($data['structured_data']) : null
        ];
        json_response($response);
    } else {
        // Fallback for system pages or if slug doesn't exist
        json_response([
            "title" => "Social2Tree | Everything you are in one link",
            "description" => "Social2Tree - The ultimate bio link tool for creators.",
            "keywords" => "bio link, social link, creators, portfolio",
            "og_image" => "https://social2tree.com/og-default.png",
            "is_indexed" => true,
            "canonical_url" => "https://social2tree.com/",
            "structured_data" => null
        ]);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
