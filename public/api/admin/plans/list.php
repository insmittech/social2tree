<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require granular permission
require_permission($pdo, 'billing:manage');
json_response();

try {
    $stmt = $pdo->query("SELECT * FROM plans ORDER BY sort_order ASC, id ASC");
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format for frontend
    $results = array_map(function($plan) {
        return [
            'id' => (string)$plan['id'],
            'name' => $plan['name'],
            'priceMonthly' => (float)$plan['price_monthly'],
            'priceYearly' => (float)$plan['price_yearly'],
            'description' => $plan['description'],
            'features' => json_decode($plan['features'] ?: '[]'),
            'isPopular' => (bool)$plan['is_popular'],
            'isVisible' => (bool)$plan['is_visible'],
            'sortOrder' => (int)$plan['sort_order'],
            'updatedAt' => $plan['updated_at']
        ];
    }, $plans);

    json_response(["plans" => $results]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
