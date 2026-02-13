<?php
include_once __DIR__ . '/utils.php';
json_response();
include_once __DIR__ . '/db.php';

try {
    $tables = ['users', 'links', 'analytics', 'settings'];
    $report = [];

    foreach ($tables as $table) {
        $stmt = $pdo->query("DESCRIBE $table");
        $report[$table] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    json_response(["schema" => $report]);
} catch (PDOException $e) {
    json_response(["error" => $e->getMessage()], 500);
}
?>
