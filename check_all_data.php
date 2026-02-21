<?php
include_once __DIR__ . '/public/api/db.php';

try {
    echo "--- DATABASE STATUS ---\n";
    $tables = ['users', 'pages', 'links', 'analytics'];
    foreach ($tables as $t) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM $t");
        echo "Table $t: " . $stmt->fetchColumn() . " rows\n";
    }

    echo "\n--- LAST 10 ANALYTICS ROWS ---\n";
    $stmt = $pdo->query("SELECT * FROM analytics ORDER BY id DESC LIMIT 10");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }

    echo "\n--- RECENT LINKS ---\n";
    $stmt = $pdo->query("SELECT id, user_id, title, clicks FROM links ORDER BY id DESC LIMIT 5");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
