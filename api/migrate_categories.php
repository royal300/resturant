<?php
require 'db.php';
try {
    // Check if column exists first
    $stmt = $pdo->query("SHOW COLUMNS FROM categories LIKE 'image_url'");
    if ($stmt->rowCount() == 0) {
        $pdo->exec("ALTER TABLE categories ADD COLUMN image_url VARCHAR(255) AFTER description;");
        echo "Migration successful: image_url added to categories table.\n";
    } else {
        echo "Migration skipped: image_url already exists.\n";
    }
} catch (PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
