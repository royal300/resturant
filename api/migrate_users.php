<?php
require_once 'db.php';

try {
    // Users Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // OTPs Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // Add user_phone column to orders if it doesn't exist
    $result = $pdo->query("SHOW COLUMNS FROM orders LIKE 'user_phone'");
    if ($result->rowCount() == 0) {
        $pdo->exec("ALTER TABLE orders ADD COLUMN user_phone VARCHAR(15) AFTER id;");
        echo "Added user_phone column to orders table.\n";
    }

    echo "Database migrated successfully for user authentication.\n";
} catch (PDOException $e) {
    echo "Migration Error: " . $e->getMessage() . "\n";
}
?>
