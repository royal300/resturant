<?php
require 'db.php';

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM coupons ORDER BY created_at DESC");
            $coupons = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "coupons" => $coupons]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['code']) || !isset($input['type']) || !isset($input['value'])) {
            echo json_encode(["status" => "error", "message" => "Code, type, and value are required"]);
            break;
        }
        try {
            if (isset($input['id']) && !empty($input['id'])) {
                // Update
                $stmt = $pdo->prepare("UPDATE coupons SET code=?, type=?, value=?, usage_limit=?, expiry_date=?, min_order_value=?, status=? WHERE id=?");
                $stmt->execute([
                    $input['code'], 
                    $input['type'], 
                    $input['value'], 
                    $input['usage_limit'] ?? null, 
                    $input['expiry_date'] ?? null, 
                    $input['min_order_value'] ?? 0, 
                    $input['status'] ?? 'Active',
                    $input['id']
                ]);
                echo json_encode(["status" => "success", "message" => "Coupon updated successfully"]);
            } else {
                // Create
                $stmt = $pdo->prepare("INSERT INTO coupons (code, type, value, usage_limit, used_count, expiry_date, min_order_value, status) VALUES (?, ?, ?, ?, 0, ?, ?, ?)");
                $stmt->execute([
                    $input['code'], 
                    $input['type'], 
                    $input['value'], 
                    $input['usage_limit'] ?? null, 
                    $input['expiry_date'] ?? null, 
                    $input['min_order_value'] ?? 0, 
                    $input['status'] ?? 'Active'
                ]);
                echo json_encode(["status" => "success", "message" => "Coupon created successfully", "id" => $pdo->lastInsertId()]);
            }
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Coupon ID is required"]);
            break;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM coupons WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Coupon deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
