<?php
header('Content-Type: application/xml; charset=utf-8');

include_once __DIR__ . '/../db.php';
include_once __DIR__ . '/../utils.php';

$baseUrl = get_env_var('APP_URL', 'https://social2tree.com');

// Get all indexed pages
try {
    // Join with seo_metadata to filter out noindex and sitemap=false
    $query = "SELECT p.slug, p.updated_at 
              FROM pages p 
              LEFT JOIN seo_metadata s ON p.id = s.page_id 
              WHERE (s.is_indexed IS NULL OR s.is_indexed = 1) 
              AND (s.include_in_sitemap IS NULL OR s.include_in_sitemap = 1)";
    
    $stmt = $pdo->query($query);
    $pages = $stmt->fetchAll();

    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    // Static home page
    echo '<url>';
    echo '<loc>' . $baseUrl . '/</loc>';
    echo '<changefreq>daily</changefreq>';
    echo '<priority>1.0</priority>';
    echo '</url>';

    foreach ($pages as $p) {
        $lastmod = date('Y-m-d', strtotime($p['updated_at']));
        echo '<url>';
        echo '<loc>' . $baseUrl . '/' . htmlspecialchars($p['slug']) . '</loc>';
        echo '<lastmod>' . $lastmod . '</lastmod>';
        echo '<changefreq>weekly</changefreq>';
        echo '<priority>0.8</priority>';
        echo '</url>';
    }

    echo '</urlset>';
} catch (Exception $e) {
    // Basic fallback or empty sitemap on error
}
?>
