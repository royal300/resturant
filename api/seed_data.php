<?php
include 'db.php';

$categories = [
    ['name' => 'Tandoor', 'description' => 'Juicy tandoori items'],
    ['name' => 'Rice', 'description' => 'Fragrant rice and biryani'],
    ['name' => 'Noodles', 'description' => 'Stir-fried noodles'],
    ['name' => 'Pizza', 'description' => 'Classic and custom pizzas'],
    ['name' => 'Burger', 'description' => 'Crispy and juicy burgers'],
    ['name' => 'Chinese', 'description' => 'Indo-Chinese specialties'],
    ['name' => 'Beverages', 'description' => 'Refreshing drinks and coffees']
];

$dishes = [
    ['name' => 'Tandoori Chicken', 'category' => 'Tandoor', 'price' => 320, 'veg' => 0, 'popular' => 1, 'desc' => 'Juicy chicken marinated in yogurt and spices, cooked in tandoor'],
    ['name' => 'Paneer Tikka', 'category' => 'Tandoor', 'price' => 280, 'veg' => 1, 'popular' => 1, 'desc' => 'Grilled cottage cheese cubes with bell peppers and onions'],
    ['name' => 'Seekh Kebab', 'category' => 'Tandoor', 'price' => 350, 'veg' => 0, 'popular' => 0, 'desc' => 'Minced lamb kebabs with aromatic spices'],
    ['name' => 'Chicken Biryani', 'category' => 'Rice', 'price' => 300, 'veg' => 0, 'popular' => 1, 'desc' => 'Fragrant basmati rice layered with spiced chicken'],
    ['name' => 'Veg Pulao', 'category' => 'Rice', 'price' => 220, 'veg' => 1, 'popular' => 0, 'desc' => 'Aromatic rice cooked with mixed vegetables and whole spices'],
    ['name' => 'Egg Fried Rice', 'category' => 'Rice', 'price' => 200, 'veg' => 0, 'popular' => 0, 'desc' => 'Wok-tossed rice with eggs, vegetables and soy sauce'],
    ['name' => 'Hakka Noodles', 'category' => 'Noodles', 'price' => 220, 'veg' => 1, 'popular' => 1, 'desc' => 'Stir-fried noodles with vegetables in Indo-Chinese style'],
    ['name' => 'Chicken Chow Mein', 'category' => 'Noodles', 'price' => 260, 'veg' => 0, 'popular' => 0, 'desc' => 'Classic stir-fried noodles with chicken and vegetables'],
    ['name' => 'Schezwan Noodles', 'category' => 'Noodles', 'price' => 240, 'veg' => 1, 'popular' => 0, 'desc' => 'Spicy noodles tossed in schezwan sauce with vegetables'],
    ['name' => 'Margherita Pizza', 'category' => 'Pizza', 'price' => 350, 'veg' => 1, 'popular' => 1, 'desc' => 'Classic pizza with fresh mozzarella, tomato sauce and basil'],
    ['name' => 'Pepperoni Pizza', 'category' => 'Pizza', 'price' => 420, 'veg' => 0, 'popular' => 0, 'desc' => 'Loaded with spicy pepperoni and melted cheese'],
    ['name' => 'BBQ Chicken Pizza', 'category' => 'Pizza', 'price' => 450, 'veg' => 0, 'popular' => 0, 'desc' => 'Smoky BBQ chicken with onions and mozzarella'],
    ['name' => 'Classic Chicken Burger', 'category' => 'Burger', 'price' => 220, 'veg' => 0, 'popular' => 1, 'desc' => 'Crispy chicken patty with lettuce, tomato and mayo'],
    ['name' => 'Veggie Burger', 'category' => 'Burger', 'price' => 180, 'veg' => 1, 'popular' => 0, 'desc' => 'Crunchy veggie patty with fresh greens and special sauce'],
    ['name' => 'Double Cheese Burger', 'category' => 'Burger', 'price' => 300, 'veg' => 0, 'popular' => 0, 'desc' => 'Double patty loaded with melted cheese and pickles'],
    ['name' => 'Manchurian', 'category' => 'Chinese', 'price' => 240, 'veg' => 1, 'popular' => 0, 'desc' => 'Vegetable balls in spicy Indo-Chinese gravy'],
    ['name' => 'Chilli Chicken', 'category' => 'Chinese', 'price' => 280, 'veg' => 0, 'popular' => 1, 'desc' => 'Crispy chicken tossed with peppers in chilli sauce'],
    ['name' => 'Spring Rolls', 'category' => 'Chinese', 'price' => 180, 'veg' => 1, 'popular' => 0, 'desc' => 'Crispy rolls stuffed with vegetables and glass noodles'],
    ['name' => 'Mango Lassi', 'category' => 'Beverages', 'price' => 120, 'veg' => 1, 'popular' => 0, 'desc' => 'Creamy yogurt drink blended with fresh mango'],
    ['name' => 'Fresh Lime Soda', 'category' => 'Beverages', 'price' => 80, 'veg' => 1, 'popular' => 0, 'desc' => 'Refreshing lime soda – sweet or salted'],
    ['name' => 'Cold Coffee', 'category' => 'Beverages', 'price' => 150, 'veg' => 1, 'popular' => 1, 'desc' => 'Chilled coffee blended with ice cream and cream'],
];

try {
    // Clear existing
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE dishes;");
    $pdo->exec("TRUNCATE TABLE categories;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    $cat_ids = [];
    $stmt = $pdo->prepare("INSERT INTO categories (name, description) VALUES (?, ?)");
    foreach ($categories as $cat) {
        $stmt->execute([$cat['name'], $cat['description']]);
        $cat_ids[$cat['name']] = $pdo->lastInsertId();
    }

    $stmt = $pdo->prepare("INSERT INTO dishes (name, category_id, original_price, selling_price, description, is_veg, is_trending, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Available')");
    foreach ($dishes as $dish) {
        $stmt->execute([
            $dish['name'],
            $cat_ids[$dish['category']],
            $dish['price'] + 50,
            $dish['price'],
            $dish['desc'],
            $dish['veg'],
            $dish['popular']
        ]);
    }

    echo json_encode(["status" => "success", "message" => "Data seeded successfully"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
