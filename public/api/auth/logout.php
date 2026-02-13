<?php
include_once __DIR__ . '/../utils.php';

session_start();
session_unset();
session_destroy();

json_response(["message" => "Logged out successfully."]);
?>