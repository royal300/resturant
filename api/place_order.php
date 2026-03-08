<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO orders (id, customer_name, phone, table_number, items, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    try {
        $stmt->execute([
            $data['id'],
            $data['customerName'] ?? 'Guest',
            $data['phone'] ?? '',
            $data['tableNumber'] ?? '',
            json_encode($data['items']),
            $data['totalPrice'],
            'Pending'
        ]);
        echo json_encode(["success" => true, "id" => $data['id']]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
