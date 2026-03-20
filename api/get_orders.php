<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $all = isset($_GET['all']) && $_GET['all'] == '1';
        $phone = isset($_GET['phone']) ? $_GET['phone'] : null;
        $sql = "SELECT * FROM orders WHERE 1=1";
        if (!$all) {
            $sql .= " AND status != 'Completed'";
        }
        if ($phone) {
            $sql .= " AND user_phone = " . $pdo->quote($phone);
        }
        $sql .= " ORDER BY created_at DESC";
        
        $stmt = $pdo->query($sql);
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
