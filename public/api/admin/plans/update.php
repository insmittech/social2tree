<?php
include_once __DIR__ . '/../../utils.php';
include_once __DIR__ . '/../../db.php';
include_once __DIR__ . '/../../rbac.php';

// Require granular permission
require_permission($pdo, 'billing:manage');
json_response();

$data = get_post_data();
$id = $data['id'] ?? null;
$name = $data['name'] ?? '';
$price_monthly = $data['priceMonthly'] ?? 0;
$price_yearly = $data['priceYearly'] ?? 0;
$description = $data['description'] ?? '';
$features = json_encode($data['features'] ?? []);
$is_popular = ($data['isPopular'] ?? false) ? 1 : 0;
$is_visible = ($data['isVisible'] ?? true) ? 1 : 0;
$sort_order = $data['sortOrder'] ?? 0;

if (empty($name)) {
    json_response(["message" => "Plan name is required"], 400);
}

try {
    if ($id) {
        $stmt = $pdo->prepare("UPDATE plans SET 
            name = ?, 
            price_monthly = ?, 
            price_yearly = ?, 
            description = ?, 
            features = ?, 
            is_popular = ?, 
            is_visible = ?, 
            sort_order = ?
            WHERE id = ?");
        $stmt->execute([$name, $price_monthly, $price_yearly, $description, $features, $is_popular, $is_visible, $sort_order, $id]);
        json_response(["message" => "Plan updated successfully"]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO plans (name, price_monthly, price_yearly, description, features, is_popular, is_visible, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $price_monthly, $price_yearly, $description, $features, $is_popular, $is_visible, $sort_order]);
        json_response(["message" => "Plan created successfully", "id" => $pdo->lastInsertId()]);
    }
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
