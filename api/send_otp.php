<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

require_once 'db.php';
require_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->phone) || empty($data->phone)) {
    echo json_encode(["status" => "error", "message" => "Phone number is required"]);
    exit;
}

$phone = $data->phone; // Using PDO prepared statements, no manual escaping needed

// Generate a 6-digit OTP
$otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

try {
    // Ensure table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS otps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(15) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;");

    // Clean up old OTPs for this phone
    $stmt = $pdo->prepare("DELETE FROM otps WHERE phone = ?");
    $stmt->execute([$phone]);

    // Check if user exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();
    $is_new = !$user;

    // Insert new OTP
    $stmt = $pdo->prepare("INSERT INTO otps (phone, otp) VALUES (?, ?)");
    if ($stmt->execute([$phone, $otp])) {
        // Call Fast2SMS API
        $url = "https://www.fast2sms.com/dev/bulkV2?authorization=" . urlencode(F2S_AUTH_KEY) . "&route=" . F2S_ROUTE . "&sender_id=" . F2S_SENDER_ID . "&message=" . F2S_MESSAGE_ID . "&variables_values=" . urlencode($otp) . "&flash=0&numbers=" . urlencode($phone);
        
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache"
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            echo json_encode(["status" => "error", "message" => "CURL Error: " . $err]);
        } else {
            $res = json_decode($response);
            if ($res && isset($res->return) && $res->return) {
                echo json_encode([
                    "status" => "success", 
                    "message" => "OTP sent successfully",
                    "is_new" => $is_new
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => "Fast2SMS Error: " . ($res->message ?? "Unknown error")]);
            }
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
