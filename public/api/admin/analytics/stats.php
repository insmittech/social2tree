<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';

// Auth Check
$is_secure = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '',
    'secure' => $is_secure,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    json_response(["message" => "Unauthorized access."], 403);
    exit;
}

try {
    // 1. Core Metrics
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $proUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE plan IN ('pro', 'business')")->fetchColumn();
    
    // Revenue calculation (stub based on pro price)
    $stmt = $pdo->query("SELECT setting_value FROM settings WHERE setting_key = 'pro_price'");
    $proPrice = (float)($stmt->fetchColumn() ?: 15.00);
    $totalRevenue = $proUsers * $proPrice;

    // Total analytics (profile views + link clicks)
    $totalViews = $pdo->query("SELECT COUNT(*) FROM analytics WHERE link_id IS NULL")->fetchColumn();
    $totalClicks = $pdo->query("SELECT COUNT(*) FROM analytics WHERE link_id IS NOT NULL")->fetchColumn();

    // 2. Growth Data (Last 6 months)
    $growthData = [];
    for ($i = 5; $i >= 0; $i--) {
        $month = date('Y-m', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));
        
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE DATE_FORMAT(created_at, '%Y-%m') = ?");
        $stmt->execute([$month]);
        $userCount = $stmt->fetchColumn();

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM analytics WHERE DATE_FORMAT(created_at, '%Y-%m') = ? AND link_id IS NULL");
        $stmt->execute([$month]);
        $viewCount = $stmt->fetchColumn();

        // Revenue for that month (approx based on creators joined/billing - keeping it simple)
        $monthlyRevenue = $pdo->prepare("SELECT COUNT(*) FROM users WHERE DATE_FORMAT(created_at, '%Y-%m') <= ? AND plan IN ('pro', 'business')");
        $monthlyRevenue->execute([$month]);
        $monthlyProCount = $monthlyRevenue->fetchColumn();
        $rev = $monthlyProCount * $proPrice;

        $growthData[] = [
            'name' => $monthName,
            'users' => (int)$userCount,
            'views' => (int)$viewCount,
            'revenue' => (float)$rev
        ];
    }

    // 3. Plan Distribution
    $plans = $pdo->query("SELECT plan, COUNT(*) as count FROM users GROUP BY plan")->fetchAll(PDO::FETCH_ASSOC);
    $planDist = [];
    $colors = ['free' => '#94a3b8', 'pro' => '#f59e0b', 'business' => '#8b5cf6'];
    foreach ($plans as $p) {
        $planDist[] = [
            'name' => ucfirst($p['plan']),
            'value' => (int)$p['count'],
            'color' => $colors[$p['plan']] ?? '#cbd5e1'
        ];
    }

    json_response([
        "stats" => [
            "totalUsers" => (int)$totalUsers,
            "proUsers" => (int)$proUsers,
            "totalRevenue" => (float)$totalRevenue,
            "totalViews" => (int)$totalViews,
            "totalClicks" => (int)$totalClicks
        ],
        "growthData" => $growthData,
        "planDistribution" => $planDist
    ]);

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
