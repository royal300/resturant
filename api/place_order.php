<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
        exit;
    }
    
    $stmt = $pdo->prepare("INSERT INTO orders (id, user_phone, customer_name, phone, table_number, items, total_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    try {
        $pdo->beginTransaction();
        $stmt->execute([
            $data['id'],
            $data['phone'] ?? '', // Mapping phone to user_phone for filtering
            $data['customerName'] ?? 'Guest',
            $data['phone'] ?? '',
            $data['tableNumber'] ?? '',
            json_encode($data['items']),
            $data['totalPrice'],
            'Pending'
        ]);

        if (isset($data['couponId']) && !empty($data['couponId'])) {
            $stmtCoupon = $pdo->prepare("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?");
            $stmtCoupon->execute([$data['couponId']]);
        }

        $pdo->commit();
        echo json_encode(["success" => true, "id" => $data['id']]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
