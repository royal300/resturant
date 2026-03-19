<?php
require_once 'db.php';

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(255) NOT NULL,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    $stmt = $pdo->prepare("INSERT INTO banners (image_url) VALUES (?)");
    $stmt->execute(['/assets/banners/pizza.png']);
    $stmt->execute(['/assets/banners/burger.png']);
    $stmt->execute(['/assets/banners/noodles.png']);

    echo "Banners seeded successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
