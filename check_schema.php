<?php
include 'public/api/db.php';

function check_table($pdo, $table) {
    echo "Checking table: $table\n";
    try {
        $stmt = $pdo->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $col) {
            echo " - {$col['Field']}\n";
        }
    } catch (Exception $e) {
        echo " Error: " . $e->getMessage() . "\n";
    }
}

check_table($pdo, 'pages');
check_table($pdo, 'links');
check_table($pdo, 'analytics');
check_table($pdo, 'settings');