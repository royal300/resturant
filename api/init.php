<?php
require 'db.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(100),
        phone VARCHAR(20),
        table_number VARCHAR(10),
        items JSON,
        total_price DECIMAL(10, 2),
        status ENUM('Pending', 'Preparing', 'Ready', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo json_encode(["success" => "Database and tables initialized successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
