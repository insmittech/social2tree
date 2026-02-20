<?php
include_once __DIR__ . '/../utils.php';
start_secure_session();
json_response();

include_once __DIR__ . '/../db.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $profile = get_user_profile($pdo, $user_id);

    if ($profile) {
        json_response(["user" => $profile]);
    } else {
        session_destroy();
        json_response(["user" => null], 401);
    }
} else {
    json_response(["user" => null]);
}
?>
