<?php
include_once __DIR__ . '/../utils.php';
include_once __DIR__ . '/../db.php';

$user_id = require_auth();
json_response();

$data = get_json_input();

if (!empty($data['name'])) {
    $name = sanitize_input($data['name']);

    try {
        $stmt = $pdo->prepare("INSERT INTO folders (user_id, name) VALUES (?, ?)");
        $stmt->execute([$user_id, $name]);
        
        $folder_id = $pdo->lastInsertId();

        json_response([
            "message" => "Folder created successfully.",
            "folder" => [
                "id" => (string) $folder_id,
                "name" => $name
            ]
        ], 201);
    } catch (PDOException $e) {
        json_response(["message" => "Database error: " . $e->getMessage()], 500);
    }
} else {
    json_response(["message" => "Please provide a folder name."], 400);
}
?>
