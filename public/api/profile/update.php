<?php
include_once '../utils.php';
session_start();
json_response();
include_once '../db.php';

if (!isset($_SESSION['user_id'])) {
    json_response(["message" => "Unauthorized."], 401);
    exit();
}

$user_id = $_SESSION['user_id'];
$data = get_json_input();

if (!empty($data)) {
    // Build dynamic update query
    $fields = [];
    $params = [];

    // Allowed fields to update
    $allowed_fields = ['display_name', 'bio', 'theme', 'button_style', 'avatar_url'];

    foreach ($allowed_fields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            $params[] = sanitize_input($data[$field]);
        }
    }

    if (empty($fields)) {
        json_response(["message" => "No fields to update."], 400);
        exit();
    }

    // Add User ID for WHERE clause
    $params[] = $user_id;

    try {
        $query = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($query);

        if ($stmt->execute($params)) {
            // Fetch updated user data to return
            $stmt = $pdo->prepare("SELECT id, username, email, display_name, bio, theme, button_style, avatar_url, role, plan FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $updated_user = $stmt->fetch(PDO::FETCH_ASSOC);

            json_response([
                "message" => "Profile updated.",
                "user" => $updated_user
            ]);
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