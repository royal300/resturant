<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db.php';
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->phone) || !isset($data->otp)) {
    echo json_encode(["status" => "error", "message" => "Phone and OTP are required"]);
    exit;
}

$phone = $data->phone;
$otp = $data->otp;

try {
    // Verify OTP
    $sql = "SELECT * FROM otps WHERE phone = ? AND otp = ? AND created_at >= NOW() - INTERVAL " . (int)OTP_EXPIRY_MINUTES . " MINUTE";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$phone, $otp]);
    $user_otp = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user_otp) {
        // Valid OTP - Delete it so it can't be reused
        $stmt = $pdo->prepare("DELETE FROM otps WHERE phone = ?");
        $stmt->execute([$phone]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Logged in successfully",
            "user" => [
                "phone" => $phone,
                "name" => "Customer"
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid or expired OTP"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
