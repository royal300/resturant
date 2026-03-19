<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$code = $input['code'] ?? '';
$totalPrice = $input['totalPrice'] ?? 0;

if (!$code) {
    echo json_encode(["status" => "error", "message" => "Coupon code is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM coupons WHERE code = ? AND status = 'Active'");
    $stmt->execute([$code]);
    $coupon = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$coupon) {
        echo json_encode(["status" => "error", "message" => "Invalid or inactive coupon code"]);
        exit;
    }

    // Check Expiry
    if ($coupon['expiry_date'] && strtotime($coupon['expiry_date']) < strtotime(date('Y-m-d'))) {
        echo json_encode(["status" => "error", "message" => "This coupon has expired"]);
        exit;
    }

    // Check Min Order Value
    if ($totalPrice < $coupon['min_order_value']) {
        echo json_encode(["status" => "error", "message" => "Minimum order of ₹" . $coupon['min_order_value'] . " required for this coupon"]);
        exit;
    }

    // Check Usage Limit
    if ($coupon['usage_limit'] !== null && $coupon['used_count'] >= $coupon['usage_limit']) {
        echo json_encode(["status" => "error", "message" => "This coupon usage limit has been reached"]);
        exit;
    }

    echo json_encode([
        "status" => "success", 
        "coupon" => [
            "id" => $coupon['id'],
            "code" => $coupon['code'],
            "type" => $coupon['type'],
            "value" => $coupon['value']
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
