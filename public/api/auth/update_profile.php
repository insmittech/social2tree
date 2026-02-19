<?php
include_once __DIR__ . '/../utils.php';

// Handle CORS and preflight
json_response();

include_once __DIR__ . '/../db.php';

// Session check
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

if (!isset($_SESSION['user_id'])) {
    json_response(["message" => "Unauthorized"], 401);
    exit();
}

$user_id = $_SESSION['user_id'];
$data = get_json_input();

if (!$data) {
    json_response(["message" => "Invalid input"], 400);
    exit();
}

try {
    // 1. Fetch current user data
    $stmt = $pdo->prepare("SELECT username, email FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $current_user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$current_user) {
        json_response(["message" => "User not found"], 404);
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
        'avatarUrl' => 'avatar_url'
    ];

    foreach ($allowed_fields as $json_key => $db_column) {
        if (isset($data[$json_key])) {
            $value = sanitize_input($data[$json_key]);

            // Unique constraint checks for username and email
            if ($json_key === 'username' && $value !== $current_user['username']) {
                $check = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
                $check->execute([$value, $user_id]);
                if ($check->rowCount() > 0) {
                    json_response(["message" => "Username already taken"], 400);
                    exit();
                }
            }

            if ($json_key === 'email' && $value !== $current_user['email']) {
                $check = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $check->execute([$value, $user_id]);
                if ($check->rowCount() > 0) {
                    json_response(["message" => "Email already registered"], 400);
                    exit();
                }
            }

            $updates[] = "$db_column = :$db_column";
            $params[":$db_column"] = $value;
        }
    }

    // Handle Password Update
    if (!empty($data['password'])) {
        $password_hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $updates[] = "password_hash = :password_hash";
        $params[":password_hash"] = $password_hash;
    }

    if (empty($updates)) {
        json_response(["message" => "No changes provided"], 400);
        exit();
    }

    // Execute update
    $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = :id";
    $params[':id'] = $user_id;

    $stmt = $pdo->prepare($query);
    if ($stmt->execute($params)) {
        json_response(["message" => "Profile updated successfully"]);
    } else {
        json_response(["message" => "Failed to update profile"], 500);
    }

} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
