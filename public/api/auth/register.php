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
    $email = sanitize_input($data['email']);
    $password = $data['password']; // Don't sanitize password before hashing

    try {
        // Check if user exists
        $query = "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $email]);

        if ($stmt->rowCount() > 0) {
            json_response(["message" => "User already exists."], 400);
            exit();
        }

        // Create user
        $query = "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)";
        $stmt = $pdo->prepare($query);

        // Hash password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password_hash", $password_hash);

        if ($stmt->execute()) {
            json_response(["message" => "User registered successfully."], 201);
        } else {
            json_response(["message" => "Unable to register user."], 503);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Incomplete data."], 400);
}
?>