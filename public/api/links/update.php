<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['id'])) {
    $link_id = $data['id'];
    
    // Whitelist updateable fields
    $mapping = [
        'title' => 'title',
        'url' => 'url',
        'is_active' => 'is_active',
        'active' => 'is_active',
        'type' => 'type',
        'scheduledStart' => 'scheduled_start',
        'scheduledEnd' => 'scheduled_end'
    ];

    $updates = [];
    $params = [];

    foreach ($mapping as $frontendKey => $dbField) {
        if (isset($data[$frontendKey])) {
            $updates[] = "$dbField = ?";
            $val = $data[$frontendKey];
            if ($dbField === 'is_active') $val = (int)$val;
            $params[] = sanitize_input($val);
        }
    }

    if (empty($updates)) {
        json_response(["message" => "No valid changes provided."], 400);
        exit();
    }

    try {
        // Verify ownership
        $check = $pdo->prepare("SELECT COUNT(*) FROM links WHERE id = ? AND user_id = ?");
        $check->execute([$link_id, $user_id]);
        
        if ($check->fetchColumn() > 0) {
            $params[] = $link_id;
            $query = "UPDATE links SET " . implode(", ", $updates) . " WHERE id = ?";
            $stmt = $pdo->prepare($query);
            if ($stmt->execute($params)) {
                json_response(["message" => "Link updated successfully."]);
            } else {
                json_response(["message" => "Unable to update link."], 500);
            }
        } else {
            json_response(["message" => "Access denied or link not found."], 403);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Link ID is required."], 400);
}
?>