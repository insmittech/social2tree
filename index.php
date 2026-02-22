<?php
include_once __DIR__ . '/public/api/db.php';

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$slug = trim($path, '/');

// Default SEO
$seo_title = "Social2Tree | Everything you are in one link";
$seo_desc = "Social2Tree - The ultimate bio link tool for creators.";
$seo_image = "https://social2tree.com/og-default.png"; // Fallback OG image
$seo_keywords = "bio link, social link, creators, portfolio";
$is_indexed = true;

// 1. Check if it's a specific page/profile
$is_system_route = false;
foreach (['api', 'dashboard', 'admin', 'login', 'register'] as $prefix) {
    if ($slug === $prefix || strpos($slug, $prefix . '/') === 0) {
        $is_system_route = true;
        break;
    }
}

if (!$is_system_route) {
    $search_slug = empty($slug) ? 'home' : $slug;
    try {
        $stmt = $pdo->prepare("SELECT p.id, p.display_name, p.bio, p.avatar_url, s.* 
                               FROM pages p 
                               LEFT JOIN seo_metadata s ON p.id = s.page_id 
                               WHERE p.slug = ? LIMIT 1");
        $stmt->execute([$search_slug]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            $seo_title = $data['title_tag'] ?: ($data['display_name'] . " | Social2Tree");
            $seo_desc = $data['meta_description'] ?: ($data['bio'] ?: $seo_desc);
            $img = $data['og_image'] ?: ($data['avatar_url'] ?: $seo_image);
            
            // Ensure absolute URL for image
            if (!empty($img) && strpos($img, 'http') !== 0) {
                $seo_image = "https://" . $_SERVER['HTTP_HOST'] . "/" . ltrim($img, '/');
            } else {
                $seo_image = $img;
            }
            
            $seo_keywords = $data['meta_keywords'] ?: $seo_keywords;
            $is_indexed = (bool)($data['is_indexed'] ?? 1);
        }
    } catch (PDOException $e) {
        // Silent fail, use defaults
    }
}
// 2. Production Asset Detection
$is_production = false;
$js_bundle = '/index.tsx';
$css_bundle = '/index.css';

// Check common production locations
$locations = ['/dist/assets', '/assets'];

foreach ($locations as $loc) {
    if (is_dir(__DIR__ . $loc)) {
        // Look for 'main' (from our new app.html build) or 'index' bundles
        $js_files = array_merge(
            glob(__DIR__ . $loc . '/main-*.js'),
            glob(__DIR__ . $loc . '/index-*.js')
        );
        $css_files = array_merge(
            glob(__DIR__ . $loc . '/main-*.css'),
            glob(__DIR__ . $loc . '/index-*.css')
        );
        
        // Final fallback: just find any .js and .css if the above fail
        if (empty($js_files)) $js_files = glob(__DIR__ . $loc . '/*.js');
        if (empty($css_files)) $css_files = glob(__DIR__ . $loc . '/*.css');

        if (!empty($js_files)) {
            $is_production = true;
            $js_bundle = $loc . '/' . basename($js_files[0]);
            if (!empty($css_files)) {
                $css_bundle = $loc . '/' . basename($css_files[0]);
            }
            break; 
        }
    }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    
    <!-- Dynamic SEO Tags -->
    <title><?php echo htmlspecialchars($seo_title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($seo_desc); ?>" />
    <?php if ($seo_keywords): ?>
    <meta name="keywords" content="<?php echo htmlspecialchars($seo_keywords); ?>" />
    <?php endif; ?>
    <?php if (!$is_indexed): ?>
    <meta name="robots" content="noindex, nofollow" />
    <?php endif; ?>

    <!-- Social / OpenGraph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="<?php echo htmlspecialchars($seo_title); ?>" />
    <meta property="og:description" content="<?php echo htmlspecialchars($seo_desc); ?>" />
    <meta property="og:image" content="<?php echo htmlspecialchars($seo_image); ?>" />
    <meta property="og:url" content="https://<?php echo $_SERVER['HTTP_HOST'] . $request_uri; ?>" />
    <?php if ($data && isset($data['canonical_url']) && $data['canonical_url']): ?>
    <link rel="canonical" href="<?php echo htmlspecialchars($data['canonical_url']); ?>" />
    <?php else: ?>
    <link rel="canonical" href="https://<?php echo $_SERVER['HTTP_HOST'] . $path; ?>" />
    <?php endif; ?>

    <?php if ($data && !empty($data['structured_data'])): ?>
    <!-- Structured Data -->
    <script type="application/ld+json">
      <?php echo $data['structured_data']; ?>
    </script>
    <?php endif; ?>

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo htmlspecialchars($seo_title); ?>" />
    <meta name="twitter:description" content="<?php echo htmlspecialchars($seo_desc); ?>" />
    <meta name="twitter:image" content="<?php echo htmlspecialchars($seo_image); ?>" />

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {},
        },
      };
    </script>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Inter", sans-serif;
        overflow-x: hidden;
      }
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    </style>
    <script type="importmap">
      {
        "imports": {
          "lucide-react": "https://esm.sh/lucide-react@^0.563.0",
          "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
          "recharts": "https://esm.sh/recharts@^3.7.0",
          "@google/genai": "https://esm.sh/@google/genai@^1.40.0",
          "react-router-dom": "https://esm.sh/react-router-dom@^7.13.0",
          "react/": "https://esm.sh/react@^19.2.4/",
          "react": "https://esm.sh/react@^19.2.4"
        }
      }
    </script>
    <link rel="stylesheet" href="<?php echo $css_bundle; ?>" />
  </head>
  <body
    class="bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-50 transition-colors duration-300"
  >
    <div id="root"></div>
    <script type="module" src="<?php echo $js_bundle; ?>"></script>
  </body>
</html>
