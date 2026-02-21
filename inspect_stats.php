<?php
include_once __DIR__ . '/public/api/db.php';

try {
    $username = 'admin';
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user) {
        die("User $username not found\n");
    }
    
    $user_id = $user['id'];
    echo "Inspecting stats for user_id: $user_id (@$username)\n";
    
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(*) as total,
            COUNT(visitor_id) as v_id_present,
            COUNT(DISTINCT visitor_id) as unique_v,
            COUNT(city) as city_present,
            COUNT(DISTINCT city) as unique_city
        FROM analytics 
        WHERE user_id = ?
    ");
    $stmt->execute([$user_id]);
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);
    print_r($stats);
    
    echo "\nSample records:\n";
    $stmt = $pdo->prepare("SELECT id, visitor_id, ip_address, country, city, created_at FROM analytics WHERE user_id = ? ORDER BY id DESC LIMIT 5");
    $stmt->execute([$user_id]);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
