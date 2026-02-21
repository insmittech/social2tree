<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

$slug = isset($_GET['username']) ? sanitize_input($_GET['username']) : null;
$host = $_SERVER['HTTP_HOST'] ?? '';

try {
    // 1. Fetch Page and Owner Data
    if ($slug) {
        // Redirection Manager: Check if this is an old slug
        $redirStmt = $pdo->prepare("SELECT new_slug, redirect_type FROM redirects WHERE old_slug = ? ORDER BY created_at DESC LIMIT 1");
        $redirStmt->execute([$slug]);
        $redir = $redirStmt->fetch();
        if ($redir) {
            json_response([
                "redirect" => true,
                "new_path" => "/" . $redir['new_slug'],
                "status" => (int)$redir['redirect_type']
            ]);
            exit();
        }

        $query = "SELECT p.*, u.plan, u.role, u.is_verified FROM pages p JOIN users u ON p.user_id = u.id WHERE p.slug = ? LIMIT 1";
        $params = [$slug];
    } else {
        // Try identifying by custom domain
        $query = "SELECT p.*, u.plan, u.role, u.is_verified FROM pages p JOIN users u ON p.user_id = u.id WHERE p.custom_domain = ? LIMIT 1";
        $params = [$host];
    }
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() == 0) {
        json_response(["message" => "Profile not found."], 404);
        exit();
    }

    $page = $stmt->fetch(PDO::FETCH_ASSOC);
    $page_id = $page['id'];
    $user_id = $page['user_id'];

    // 2. Fetch Links
    $query = "SELECT id, title, url, type, is_active, clicks, scheduled_start, scheduled_end, password FROM links WHERE page_id = ? AND is_active = 1 ORDER BY sort_order ASC, created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$page_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2.1 Fetch SEO Metadata
    $seoStmt = $pdo->prepare("SELECT * FROM seo_metadata WHERE page_id = ?");
    $seoStmt->execute([$page_id]);
    $seo = $seoStmt->fetch(PDO::FETCH_ASSOC);

    // 3. Increment views
    // Increment User views (legacy/overview)
    $pdo->prepare("UPDATE users SET views = views + 1 WHERE id = ?")->execute([$user_id]);
    // Increment Page views (granular)
    $pdo->prepare("UPDATE pages SET views = views + 1 WHERE id = ?")->execute([$page_id]);

    // 4. Map Data to standard structure
    $profile = [
        'id' => (string) $page['id'],
        'username' => $page['slug'], // For backward compatibility in frontend
        'displayName' => $page['display_name'] ?? $page['slug'],
        'bio' => $page['bio'] ?? '',
        'avatarUrl' => $page['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($page['slug']),
        'theme' => $page['theme'] ?? 'default',
        'buttonStyle' => $page['button_style'] ?? 'rounded-lg',
        'plan' => $page['plan'],
        'role' => $page['role'],
        'isVerified' => (bool)$page['is_verified'],
        'links' => array_map(function ($link) {
            return [
                'id' => (string) $link['id'],
                'title' => $link['title'],
                'url' => $link['url'],
                'active' => (bool) $link['is_active'],
                'clicks' => (int) $link['clicks'],
                'type' => $link['type'] ?? 'social',
                'scheduledStart' => $link['scheduled_start'] ?? null,
                'scheduledEnd' => $link['scheduled_end'] ?? null,
                'password' => $link['password'] ?? null
            ];
        }, $links),
        'seo' => $seo ? [
            'title_tag' => $seo['title_tag'],
            'meta_description' => $seo['meta_description'],
            'meta_keywords' => $seo['meta_keywords'],
            'og_image' => $seo['og_image'],
            'is_indexed' => (bool)$seo['is_indexed'],
            'canonical_url' => $seo['canonical_url'],
            'structured_data' => json_decode($seo['structured_data'])
        ] : null
    ];
    json_response($profile);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>