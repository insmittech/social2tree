<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

try {
    $stmt = $pdo->prepare("SELECT id, name FROM folders WHERE user_id = ? ORDER BY name ASC");
    $stmt->execute([$user_id]);
    $folders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        "folders" => array_map(function($f) {
            return [
                "id" => (string) $f['id'],
                "name" => $f['name']
            ];
        }, $folders)
    ]);
} catch (PDOException $e) {
    json_response(["message" => "Database error: " . $e->getMessage()], 500);
}
?>
