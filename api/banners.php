<?php
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Add CORS headers for preflight requests
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if ($method === 'GET') {
        // Fetch all specific or active banners
        $status = $_GET['status'] ?? null;
        
        if ($status) {
            $stmt = $pdo->prepare("SELECT * FROM banners WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status]);
        } else {
            $stmt = $pdo->query("SELECT * FROM banners ORDER BY created_at DESC");
        }
        
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "banners" => $banners]);
    } 
    elseif ($method === 'POST') {
        // For file uploads and creating new banners
        if (isset($_FILES['image'])) {
            $target_dir = "../public/assets/banners/";
            // On production, it will be ../assets/banners/ so let's handle both or use an absolute approach
            // Wait, this PHP script runs inside api/. Locally, upload dir is `../public/assets/banners/`. On prod it's `../assets/banners/`.
            $is_local = strpos(__DIR__, 'Desktop') !== false;
            $uploadPath = $is_local ? "../public/assets/banners/" : "../assets/banners/";
            
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $file_ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
            $file_name = uniqid('banner_') . '.' . $file_ext;
            $target_file = $uploadPath . $file_name;

            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $image_url = '/assets/banners/' . $file_name;
                $stmt = $pdo->prepare("INSERT INTO banners (image_url, status) VALUES (?, ?)");
                $stmt->execute([$image_url, $_POST['status'] ?? 'Active']);
                echo json_encode(["status" => "success", "message" => "Banner added successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
            }
            exit;
        }

        $data = json_decode(file_get_contents("php://input"));
        if (isset($data->action)) {
            if ($data->action === 'update_status') {
                $stmt = $pdo->prepare("UPDATE banners SET status = ? WHERE id = ?");
                $stmt->execute([$data->status, $data->id]);
                echo json_encode(["status" => "success", "message" => "Banner status updated"]);
            } elseif ($data->action === 'delete') {
                // Fetch image url to delete file
                $stmt = $pdo->prepare("SELECT image_url FROM banners WHERE id = ?");
                $stmt->execute([$data->id]);
                $banner = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($banner) {
                    $is_local = strpos(__DIR__, 'Desktop') !== false;
                    $uploadPath = $is_local ? "../public" : "..";
                    $filePath = $uploadPath . $banner['image_url'];
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }

                $stmt = $pdo->prepare("DELETE FROM banners WHERE id = ?");
                $stmt->execute([$data->id]);
                echo json_encode(["status" => "success", "message" => "Banner deleted successfully"]);
            }
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
