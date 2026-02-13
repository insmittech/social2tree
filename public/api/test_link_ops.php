<?php
include_once __DIR__ . '/utils.php';
session_start();
// Mock a user session for testing
$_SESSION['user_id'] = 1; // Assuming user ID 1 exists

include_once __DIR__ . '/db.php';

try {
    echo "Testing Link Create...\n";
    $stmt = $pdo->prepare("INSERT INTO links (user_id, title, url, type, sort_order) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([1, 'Test Link', 'https://example.com', 'social', 0]);
    $newId = $pdo->lastInsertId();
    echo "Success! Created link ID: $newId\n\n";

    echo "Testing Link Update...\n";
    $stmt = $pdo->prepare("UPDATE links SET is_active = ? WHERE id = ? AND user_id = ?");
    $stmt->execute([0, $newId, 1]);
    echo "Success! Updated link ID: $newId to inactive.\n\n";

    echo "Cleaning up...\n";
    $stmt = $pdo->prepare("DELETE FROM links WHERE id = ?");
    $stmt->execute([$newId]);
    echo "Cleanup done.\n";

} catch (PDOException $e) {
    echo "DATABASE ERROR: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "GENERAL ERROR: " . $e->getMessage() . "\n";
}
?>
