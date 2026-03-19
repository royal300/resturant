<?php
require 'db.php';

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['email']) || !isset($input['password'])) {
    echo json_encode(["status" => "error", "message" => "Email and password are required"]);
    exit;
}

$email = $input['email'];
$password = $input['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // In a real production app, we would generate a JWT here.
        // For this version, we will return a success status and user info.
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid email or password"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
