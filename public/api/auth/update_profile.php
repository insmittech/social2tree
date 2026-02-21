<?php
include_once __DIR__ . '/../utils.php';

// Auth check
$user_id = require_auth();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!$data) {
    json_response(["message" => "No changes provided."], 400);
    exit();
}

try {
    // 1. Fetch current user data
    $stmt = $pdo->prepare("SELECT username, email FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $current_user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$current_user) {
        json_response(["message" => "User record not found."], 404);
        exit();
    }

    $updates = [];
    $params = [];

    // Fields to update
    $allowed_fields = [
        'username' => 'username',
        'email' => 'email',
        'displayName' => 'display_name',
        'bio' => 'bio',
        'avatarUrl' => 'avatar_url',
        'timezone' => 'timezone',
        'timeFormat' => 'time_format'
    ];

    foreach ($allowed_fields as $json_key => $db_column) {
        if (isset($data[$json_key])) {
            $value = sanitize_input($data[$json_key]);

            // Unique constraint checks for username and email
            if ($json_key === 'username' && $value !== $current_user['username']) {
                $check = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
                $check->execute([$value, $user_id]);
                if ($check->rowCount() > 0) {
                    json_response(["message" => "Username already taken."], 400);
                    exit();
                }
            }

            if ($json_key === 'email' && $value !== $current_user['email']) {
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    json_response(["message" => "Invalid email format."], 400);
                    exit();
                }
                $check = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $check->execute([$value, $user_id]);
                if ($check->rowCount() > 0) {
                    json_response(["message" => "Email already registered."], 400);
                    exit();
                }
            }

            $updates[] = "$db_column = :$db_column";
            $params[":$db_column"] = $value;
        }
    }

    // Handle Password Update
    if (!empty($data['password'])) {
        if (strlen($data['password']) < 8) {
            json_response(["message" => "New password must be at least 8 characters long."], 400);
            exit();
        }
        $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $updates[] = "password_hash = :password_hash";
        $params[":password_hash"] = $password_hash;
    }

    if (empty($updates)) {
        json_response(["message" => "No valid changes provided."], 400);
        exit();
    }

    // Execute update
    $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = :id";
    $params[':id'] = $user_id;

    $stmt = $pdo->prepare($query);
    if ($stmt->execute($params)) {
        json_response(["message" => "Profile updated successfully."]);
    } else {
        json_response(["message" => "Unable to update profile. Please try again later."], 500);
    }

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
