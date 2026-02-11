<?php
include 'db.php';

$schemaFile = __DIR__ . '/../../server/schema.sql';

if (!file_exists($schemaFile)) {
    die(json_encode(['status' => 'error', 'message' => 'Schema file not found.']));
}

$sql = file_get_contents($schemaFile);

try {
    $pdo->exec($sql);
    echo json_encode(['status' => 'success', 'message' => 'Database initialized successfully.']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database initialization failed: ' . $e->getMessage()]);
}
?>