<?php
$ip = '2409:40f2:16:5a91:89af:5f66:9565:db2e';

$providers = [
    "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,city",
    "https://ipapi.co/{$ip}/json/",
    "https://freeipapi.com/api/json/{$ip}"
];

foreach ($providers as $url) {
    echo "Testing URL: $url\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Social2Tree/1.2');
    if (strpos($url, 'https') === 0) {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    }
    $raw = curl_exec($ch);
    $info = curl_getinfo($ch);
    curl_close($ch);
    
    echo "HTTP Status: " . $info['http_code'] . "\n";
    if ($raw) {
        echo "Response: $raw\n";
        $geo = json_decode($raw, true);
        $is_success = (isset($geo['status']) && $geo['status'] === 'success') || 
                     (isset($geo['country']) && !isset($geo['error'])) ||
                     (isset($geo['countryName']) && !empty($geo['countryName']));
        echo "Success Detection: " . ($is_success ? "YES" : "NO") . "\n";
    } else {
        echo "No response.\n";
    }
    echo "-----------------------------------\n";
}
