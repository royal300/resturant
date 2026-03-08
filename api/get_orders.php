<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch orders that are not Completed
        $stmt = $pdo->query("SELECT * FROM orders WHERE status != 'Completed' ORDER BY created_at ASC");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode JSON items for frontend structure
        foreach ($orders as &$order) {
            $order['items'] = json_decode($order['items'], true);
        }
        
        echo json_encode(["success" => true, "orders" => $orders]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
