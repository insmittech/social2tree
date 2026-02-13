<?php
include_once __DIR__ . '/../utils.php';
json_response();
include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (!empty($data['username']) && !empty($data['password'])) {
    $username = sanitize_input($data['username']);
    $password = $data['password'];

    try {
        $query = "SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ? LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $username]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $id = $row['id'];
            $username = $row['username'];
            $password_hash = $row['password_hash'];
            $role = $row['role'];

            if (password_verify($password, $password_hash)) {
                // Determine 'secure' flag based on server protocol and proxies
                $is_secure = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || 
                            (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

                // Set session token
                session_set_cookie_params([
                    'lifetime' => 0, // Session cookie
                    'path' => '/',
                    'domain' => '', // Current domain
                    'secure' => $is_secure,
                    'httponly' => true,
                    'samesite' => 'Lax' // Changed from Strict for better site navigation
                ]);
                session_start();
                $_SESSION['user_id'] = $id;
                $_SESSION['username'] = $username;
                $_SESSION['role'] = $role;

                json_response([
                    "message" => "Login successful.",
                    "user" => [
                        "id" => $id,
                        "username" => $username,
                        "role" => $role
                    ]
                ]);
            } else {
                json_response(["message" => "Invalid password."], 401);
            }
        } else {
            json_response(["message" => "User not found."], 404);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>