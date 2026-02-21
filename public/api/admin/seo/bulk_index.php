<?php
include_once __DIR__ . '/../../utils.php';

// Auth check - Admin only
require_auth();
if (!is_admin()) {
    json_response(["message" => "Admin access required."], 403);
    exit();
}

include_once __DIR__ . '/../../db.php';

try {
    // 1. Get all public pages that allow indexing
    $query = "SELECT p.id, p.slug FROM pages p 
              LEFT JOIN seo_metadata s ON p.id = s.page_id 
              WHERE (s.is_indexed IS NULL OR s.is_indexed = 1)";
    $stmt = $pdo->query($query);
    $pages = $stmt->fetchAll();

    if (empty($pages)) {
        json_response(["message" => "No indexable pages found."]);
        exit();
    }

    // 2. Ping search engines with the sitemap
    // This is the most efficient way to "bulk index" without hitting 
    // per-URL API quotas immediately.
    ping_search_engines();

    // 3. Log the action
    log_audit_event($pdo, "Bulk indexing request triggered for " . count($pages) . " pages", "info", $_SESSION['user_id']);

    json_response([
        "message" => "Bulk indexing request sent successfully.",
        "pages_count" => count($pages)
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
