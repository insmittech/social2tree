<?php
include_once __DIR__ . '/../utils.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../db.php';

$data = get_json_input();
$identifier = !empty($data['username']) ? $data['username'] : (!empty($data['email']) ? $data['email'] : null);

if ($identifier && !empty($data['password'])) {
    $username = sanitize_input($identifier);
    $password = $data['password'];

    try {
        $query = "SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ? LIMIT 1";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $username]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (password_verify($password, $row['password_hash'])) {
                // Regenerate session ID for security
                session_regenerate_id(true);
                
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['username'] = $row['username'];
                $_SESSION['role'] = $row['role'];

                // RBAC Sync Hook: Ensure admins have the SuperAdmin role entry
                if ($row['role'] === 'admin') {
                    try {
                        // Check if user has any role in user_roles
                        $roleCheck = $pdo->prepare("SELECT COUNT(*) FROM user_roles WHERE user_id = ?");
                        $roleCheck->execute([$row['id']]);
                        if ($roleCheck->fetchColumn() == 0) {
                            // Assign SuperAdmin role (ID 1 as per db_sync.php)
                            $assign = $pdo->prepare("INSERT IGNORE INTO user_roles (user_id, role_id) 
                                                   SELECT ?, id FROM roles WHERE name = 'SuperAdmin' LIMIT 1");
                            $assign->execute([$row['id']]);
                        }
                    } catch (Exception $e) {
                        error_log("RBAC Sync Error: " . $e->getMessage());
                    }
                }

                $profile = get_user_profile($pdo, $row['id']);

                json_response([
                    "message" => "Login successful.",
                    "user" => $profile
                ]);
            } else {
                json_response(["message" => "Invalid username or password."], 401);
            }
        } else {
            json_response(["message" => "Invalid username or password."], 401);
        }
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide both username and password."], 400);
}
?>