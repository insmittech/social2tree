<?php
include_once __DIR__ . '/../utils.php';

// Handle CORS and preflight
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();

if (
    !empty($data['username']) &&
    !empty($data['email']) &&
    !empty($data['password'])
) {
    // Sanitization
    $username = sanitize_input($data['username']);
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    $password = $data['password'];

    // Validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(["message" => "Invalid email format."], 400);
        exit();
    }

    if (strlen($password) < 8) {
        json_response(["message" => "Password must be at least 8 characters long."], 400);
        exit();
    }

    if (strlen($username) < 3) {
        json_response(["message" => "Username must be at least 3 characters long."], 400);
        exit();
    }

    try {
        // Check if user exists
        $query = "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $email]);

        if ($stmt->rowCount() > 0) {
            json_response(["message" => "Username or email already exists."], 400);
            exit();
        }

        // Hash password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        // Create user
        $query = "INSERT INTO users (username, email, password_hash, role, plan, status) VALUES (:username, :email, :password_hash, 'user', 'free', 'active')";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password_hash", $password_hash);

        if ($stmt->execute()) {
            json_response(["message" => "Registration successful. Welcome to Social2Tree!"], 201);
        } else {
            json_response(["message" => "Registration failed. Please try again later."], 503);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide username, email, and password."], 400);
}
?>