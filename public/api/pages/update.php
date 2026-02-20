<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['id'])) {
    $page_id = $data['id'];

    // Whitelist
    $mapping = [
        'displayName' => 'display_name',
        'bio' => 'bio',
        'theme' => 'theme',
        'buttonStyle' => 'button_style',
        'customDomain' => 'custom_domain'
    ];

    $fields = [];
    $params = [];

    foreach ($mapping as $frontendKey => $dbField) {
        if (isset($data[$frontendKey])) {
            $fields[] = "$dbField = ?";
            $params[] = sanitize_input($data[$frontendKey]);
        }
    }

    if (empty($fields)) {
        json_response(["message" => "No valid fields to update."], 400);
        exit();
    }

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM pages WHERE id = ? AND user_id = ?");
        $check->execute([$page_id, $user_id]);
        
        if ($check->fetchColumn() > 0) {
            $params[] = $page_id;
            $params[] = $user_id;
            $query = "UPDATE pages SET " . implode(", ", $fields) . " WHERE id = ? AND user_id = ?";
            $stmt = $pdo->prepare($query);
            if ($stmt->execute($params)) {
                json_response(["message" => "Page updated successfully."]);
            } else {
                json_response(["message" => "Unable to update page."], 500);
            }
        } else {
            json_response(["message" => "Access denied or page not found."], 403);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Page ID is required."], 400);
}
?>
