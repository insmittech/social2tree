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

try {
    $query = "SELECT * FROM links WHERE user_id = ? ORDER BY sort_order ASC, created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_id]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response(["links" => $links]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>