<?php
header('Content-Type: application/xml; charset=utf-8');
include_once __DIR__ . '/../db.php';
include_once __DIR__ . '/../utils.php';

$baseUrl = get_env_var('APP_URL', 'https://social2tree.com');

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

// In a real large-scale app, we would paginate sitemaps here.
// For now, we point to our dynamic sitemap.php
echo '<sitemap>';
echo '<loc>' . $baseUrl . '/api/public/sitemap.php</loc>';
echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
echo '</sitemap>';

echo '</sitemapindex>';
?>
