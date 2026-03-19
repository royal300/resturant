<?php
require 'db.php';

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Get dates from request or default to last 30 days
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-d', strtotime('-30 days'));
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d');

// Append times to make them inclusive for the day
$start_datetime = $start_date . ' 00:00:00';
$end_datetime = $end_date . ' 23:59:59';

try {
    // 1. Total Orders
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM orders WHERE created_at >= ? AND created_at <= ?");
    $stmt->execute([$start_datetime, $end_datetime]);
    $totalOrders = $stmt->fetch()['total'];

    // 2. Pending Orders
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM orders WHERE status = 'Pending' AND created_at >= ? AND created_at <= ?");
    $stmt->execute([$start_datetime, $end_datetime]);
    $pendingOrders = $stmt->fetch()['total'];

    // 3. Completed Orders
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM orders WHERE status = 'Completed' AND created_at >= ? AND created_at <= ?");
    $stmt->execute([$start_datetime, $end_datetime]);
    $completedOrders = $stmt->fetch()['total'];

    // 4. Total Revenue
    $stmt = $pdo->prepare("SELECT SUM(total_price) as total FROM orders WHERE status = 'Completed' AND created_at >= ? AND created_at <= ?");
    $stmt->execute([$start_datetime, $end_datetime]);
    $totalRevenue = $stmt->fetch()['total'] ?? 0;

    // 5. Total Dishes (Catalog - Not date restricted)
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM dishes");
    $totalDishes = $stmt->fetch()['total'];

    // 6. Daily Sales (within the requested range)
    $stmt = $pdo->prepare("
        SELECT DATE(created_at) as date, SUM(total_price) as revenue 
        FROM orders 
        WHERE status = 'Completed' AND created_at >= ? AND created_at <= ?
        GROUP BY date
        ORDER BY date ASC
    ");
    $stmt->execute([$start_datetime, $end_datetime]);
    $dailySales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 7. Order Trend (All statuses within date range)
    $stmt = $pdo->prepare("
        SELECT status, COUNT(*) as count 
        FROM orders 
        WHERE created_at >= ? AND created_at <= ?
        GROUP BY status
    ");
    $stmt->execute([$start_datetime, $end_datetime]);
    $orderTrend = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 8. Most Ordered Dishes & Food Wise Sales
    $stmt = $pdo->prepare("SELECT items FROM orders WHERE status = 'Completed' AND created_at >= ? AND created_at <= ?");
    $stmt->execute([$start_datetime, $end_datetime]);
    $allOrders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $dishStats = [];
    foreach ($allOrders as $order) {
        $items = json_decode($order['items'], true);
        if (is_array($items)) {
            foreach ($items as $item) {
                if (isset($item['name']) && isset($item['quantity'])) {
                    $name = $item['name'];
                    $qty = (int)$item['quantity'];
                    $price = isset($item['price']) ? (float)$item['price'] : 0;
                    $itemRevenue = $qty * $price;
                    
                    if (isset($dishStats[$name])) {
                        $dishStats[$name]['orders'] += $qty;
                        $dishStats[$name]['revenue'] += $itemRevenue;
                    } else {
                        $dishStats[$name] = [
                            'name' => $name,
                            'orders' => $qty,
                            'revenue' => $itemRevenue
                        ];
                    }
                }
            }
        }
    }
    
    // Sort array by highest count for popular dishes
    $dishList = array_values($dishStats);
    usort($dishList, function($a, $b) {
        return $b['orders'] <=> $a['orders'];
    });
    
    // Take top 5 for "Popular Dishes"
    $popularDishes = array_slice($dishList, 0, 5);
    
    // Full Food Wise Sales list (sorted by revenue descending for Analytics view)
    $foodWiseSales = array_values($dishStats);
    usort($foodWiseSales, function($a, $b) {
        return $b['revenue'] <=> $a['revenue'];
    });

    echo json_encode([
        "status" => "success",
        "data" => [
            "summary" => [
                "totalOrders" => $totalOrders,
                "pendingOrders" => $pendingOrders,
                "completedOrders" => $completedOrders,
                "totalRevenue" => $totalRevenue,
                "totalDishes" => $totalDishes
            ],
            "dailySales" => $dailySales,
            "orderTrend" => $orderTrend,
            "popularDishes" => $popularDishes,
            "foodWiseSales" => $foodWiseSales
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
