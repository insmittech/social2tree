<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data)) {
    // Map frontend keys to database fields
    $mapping = [
        'displayName' => 'display_name',
        'bio' => 'bio',
        'theme' => 'theme',
        'buttonStyle' => 'button_style',
        'avatarUrl' => 'avatar_url'
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
        json_response(["message" => "No valid fields provided."], 400);
        exit();
    }

    // Add User ID for WHERE clause
    $params[] = $user_id;

    try {
        $query = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);

        if ($stmt->execute($params)) {
            // Fetch updated user data in standard format
            $stmt = $pdo->prepare("SELECT id, username, email, display_name, bio, theme, button_style, avatar_url, role, plan, status, created_at FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                $profile = [
                    'id' => (string) $user['id'],
                    'username' => $user['username'],
                    'displayName' => $user['display_name'] ?? $user['username'],
                    'bio' => $user['bio'] ?? '',
                    'avatarUrl' => $user['avatar_url'] ?? 'https://ui-avatars.com/api/?name=' . urlencode($user['username']),
                    'theme' => $user['theme'] ?? 'default',
                    'buttonStyle' => $user['button_style'] ?? 'rounded-lg',
                    'role' => $user['role'],
                    'plan' => $user['plan'],
                    'status' => $user['status'],
                    'createdAt' => $user['created_at']
                ];
                json_response([
                    "message" => "Profile updated successfully.",
                    "user" => $profile
                ]);
            } else {
                json_response(["message" => "Update successful but profile re-fetch failed."], 500);
            }
        } else {
            json_response(["message" => "Unable to update profile."], 503);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "No data provided."], 400);
}
?>