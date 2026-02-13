<?php
include_once __DIR__ . '/utils.php';
session_start();
$_SESSION['user_id'] = 1;

include_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare("SELECT * FROM links WHERE user_id = ?");
    $stmt->execute([1]);
    $links = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(["links" => $links]);
} catch (PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>
