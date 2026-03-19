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
            if (isset($_GET['category_id'])) {
                $stmt = $pdo->prepare("SELECT d.*, c.name as category_name FROM dishes d LEFT JOIN categories c ON d.category_id = c.id WHERE d.category_id = ? ORDER BY d.name ASC");
                $stmt->execute([$_GET['category_id']]);
            } else {
                $stmt = $pdo->query("SELECT d.*, c.name as category_name FROM dishes d LEFT JOIN categories c ON d.category_id = c.id ORDER BY d.created_at DESC");
            }
            $dishes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "dishes" => $dishes]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'POST':
        // If 'id' is present, treat as update
        $id = $_POST['id'] ?? null;
        $name = $_POST['name'] ?? null;
        $description = $_POST['description'] ?? '';
        $category_id = $_POST['category_id'] ?: null;
        $original_price = !empty($_POST['original_price']) ? $_POST['original_price'] : null;
        $selling_price = !empty($_POST['selling_price']) ? $_POST['selling_price'] : 0;
        $offer_price = !empty($_POST['offer_price']) ? $_POST['offer_price'] : null;
        $is_trending = isset($_POST['is_trending']) ? ($_POST['is_trending'] === 'true' || $_POST['is_trending'] === '1' ? 1 : 0) : 0;
        $is_veg = isset($_POST['is_veg']) ? ($_POST['is_veg'] === 'true' || $_POST['is_veg'] === '1' ? 1 : 0) : 1;
        $status = $_POST['status'] ?? 'Available';

        if (!$name || !$selling_price) {
            echo json_encode(["status" => "error", "message" => "Name and selling price are required"]);
            break;
        }

        if ($id) {
            // Update
            try {
                $sql = "UPDATE dishes SET name=?, description=?, category_id=?, original_price=?, selling_price=?, offer_price=?, is_veg=?, is_trending=?, status=?";
                $params = [$name, $description, $category_id, $original_price, $selling_price, $offer_price, $is_veg, $is_trending, $status];
                
                if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                    $target_dir = "../assets/dishes/";
                    if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                    $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                        $sql .= ", image_url=?";
                        $params[] = "/assets/dishes/" . $file_name;
                    }
                }
                
                $sql .= " WHERE id=?";
                $params[] = $id;
                
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                echo json_encode(["status" => "success", "message" => "Dish updated successfully"]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        } else {
            // Create
            $image_url = '';
            if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
                $target_dir = "../assets/dishes/";
                if (!file_exists($target_dir)) mkdir($target_dir, 0777, true);
                $file_name = uniqid() . "." . pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_dir . $file_name)) {
                    $image_url = "/assets/dishes/" . $file_name;
                }
            }
            try {
                $stmt = $pdo->prepare("INSERT INTO dishes (name, description, category_id, original_price, selling_price, offer_price, image_url, is_veg, is_trending, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $description, $category_id, $original_price, $selling_price, $offer_price, $image_url, $is_veg, $is_trending, $status]);
                echo json_encode(["status" => "success", "message" => "Dish created successfully", "id" => $pdo->lastInsertId()]);
            } catch (PDOException $e) {
                echo json_encode(["status" => "error", "message" => $e->getMessage()]);
            }
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            echo json_encode(["status" => "error", "message" => "Dish ID is required"]);
            break;
        }
        try {
            // Optional: delete image file from server
            $stmt = $pdo->prepare("SELECT image_url FROM dishes WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $dish = $stmt->fetch();
            if ($dish && $dish['image_url']) {
                $file_path = ".." . $dish['image_url'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }

            $stmt = $pdo->prepare("DELETE FROM dishes WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Dish deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    default:
        // Note: For simplicity, I'm skipping PATCH for now. In a full app, I'd implement it here.
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
?>
