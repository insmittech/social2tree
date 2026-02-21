<?php
/**
 * Image Optimization Utility
 * Handles WebP/AVIF detection and lazy loading attributes.
 */

/**
 * Generates an optimized image URL or returns a picture element structure.
 * Since we are in a shared hosting/simple PHP environment without a dedicated CDN,
 * this utility focuses on browser hint generation.
 */
function get_optimized_image($url, $alt = '', $className = '') {
    if (empty($url)) return '';
    
    // Check if the URL is external or local
    $isExternal = strpos($url, 'http') === 0;
    
    // In a full implementation, we would use GD or Imagick here to generate WebP.
    // Given the constraints, we will return a standard <img> with SEO best practices.
    
    $html = '<img src="' . htmlspecialchars($url) . '" ';
    $html .= 'alt="' . htmlspecialchars($alt) . '" ';
    if ($className) $html .= 'class="' . htmlspecialchars($className) . '" ';
    $html .= 'loading="lazy" ';
    $html .= 'decoding="async" ';
    $html .= '>';
    
    return $html;
}

/**
 * Service to convert uploaded images to WebP if GD is available.
 */
function convert_to_webp($source_path, $target_path, $quality = 80) {
    if (!function_exists('imagewebp')) return false;
    
    $info = getimagesize($source_path);
    if (!$info) return false;
    
    $img = null;
    switch ($info[2]) {
        case IMAGETYPE_JPEG:
            $img = imagecreatefromjpeg($source_path);
            break;
        case IMAGETYPE_PNG:
            $img = imagecreatefrompng($source_path);
            // Preserving transparency
            imagepalettetotruecolor($img);
            imagealphablending($img, true);
            imagesavealpha($img, true);
            break;
        case IMAGETYPE_GIF:
            $img = imagecreatefromgif($source_path);
            break;
    }
    
    if (!$img) return false;
    
    $result = imagewebp($img, $target_path, $quality);
    imagedestroy($img);
    
    return $result;
}
?>
