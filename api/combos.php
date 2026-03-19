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
            $stmt = $pdo->query("SELECT * FROM combos ORDER BY created_at DESC");
            $combos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "combos" => $combos]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        $id = $_POST['id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? '';
        $items = $_POST['items'] ?? '[]'; // JSON array of dish IDs
        $original_price = !empty($_POST['original_price']) ? $_POST['original_price'] : 0;
        $combo_price = !empty($_POST['combo_price']) ? $_POST['combo_price'] : 0;
        $status = $_POST['status'] ?? 'Active';

        if (!$name || !$combo_price) {
            echo json_encode(["status" => "error", "message" => "Name and combo price are required"]);
            break;
        }

        if ($id) {
            // Update
            try {
                $sql = "UPDATE combos SET name=?, description=?, items=?, original_price=?, combo_price=?, status=?";
                $params = [$name, $description, $items, $original_price, $combo_price, $status];
                
                if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                    $target_dir = "../assets/combos/";
                    if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                    $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                        $sql .= ", image_url=?";
                        $params[] = "/assets/combos/" . $file_name;
                    }
                }
                
                $sql .= " WHERE id=?";
                $params[] = $id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                echo json_encode(["status" => "success", "message" => "Combo updated successfully"]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            // Create
            $image_url = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                $target_dir = "../assets/combos/";
                if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                    $image_url = "/assets/combos/" . $file_name;
                }
            }
            try {
                $stmt = $pdo->prepare("INSERT INTO combos (name, description, items, original_price, combo_price, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $description, $items, $original_price, $combo_price, $image_url, $status]);
                echo json_encode(["status" => "success", "message" => "Combo created successfully", "id" => $pdo->lastInsertId()]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Combo ID is required"]);
            break;
        }
        try {
            // Optional: delete image file from server
            $stmt = $pdo->prepare("SELECT image_url FROM combos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $combo = $stmt->fetch();
            if ($combo && $combo['image_url']) {
                $file_path = ".." . $combo['image_url'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }

            $stmt = $pdo->prepare("DELETE FROM combos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Combo deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
