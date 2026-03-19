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
            $stmt = $pdo->query("SELECT * FROM categories ORDER BY name ASC");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "categories" => $categories]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Handle both JSON and FormData
        $id = $_POST['id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? '';
        
        // If content-type is application/json
        if (!$name && empty($_FILES)) {
            $input = json_decode(file_get_contents("php://input"), true);
            if ($input) {
                $id = $input['id'] ?? $id;
                $name = $input['name'] ?? $name;
                $description = $input['description'] ?? $description;
            }
        }

        if (!$name) {
            echo json_encode(["status" => "error", "message" => "Category name is required"]);
            break;
        }

        if ($id) {
            // Update
            try {
                $sql = "UPDATE categories SET name=?, description=?";
                $params = [$name, $description];
                
                if (isset($_FILES['image'])) {
                    if ($_FILES['image']['error'] == 0) {
                        $target_dir = "../assets/categories/";
                        if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                        $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                            $sql .= ", image_url=?";
                            $params[] = "/assets/categories/" . $file_name;
                        } else {
                            echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
                            break;
                        }
                    } else if ($_FILES['image']['error'] != 4) { // 4 means NO_FILE
                        echo json_encode(["status" => "error", "message" => "Image upload error code: " . $_FILES['image']['error']]);
                        break;
                    }
                }
                
                $sql .= " WHERE id=?";
                $params[] = $id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                echo json_encode(["status" => "success", "message" => "Category updated successfully"]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            // Create
            $image_url = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                $target_dir = "../assets/categories/";
                if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                    $image_url = "/assets/categories/" . $file_name;
                }
            }
            try {
                $stmt = $pdo->prepare("INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)");
                $stmt->execute([$name, $description, $image_url]);
                echo json_encode(["status" => "success", "message" => "Category created successfully", "id" => $pdo->lastInsertId()]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Category ID is required"]);
            break;
        }
        try {
            // Delete image file if exists
            $stmt = $pdo->prepare("SELECT image_url FROM categories WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $cat = $stmt->fetch();
            if ($cat && $cat['image_url']) {
                $file_path = ".." . $cat['image_url'];
                if (file_exists($file_path)) unlink($file_path);
            }

            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Category deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
