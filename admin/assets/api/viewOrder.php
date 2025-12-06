<?php
include "../../../conn.php";

header("Content-Type: application/json");

$response = [];

if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$order_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($order_id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid or missing order_id']);
  exit;
}

$sql = "SELECT 
    tp.*, 
    oi.order_id, 
    oi.quantity, 
    oi.order_date, 
    oi.id AS num,
    o.order_status,
    c.coupon_code,
    c.discount_type,
    c.discount_value,
    ct.name AS category
FROM order_items oi
JOIN total_products tp ON oi.product_id = tp.id
JOIN orders o ON oi.order_id = o.id
JOIN categories ct ON tp.category_id = ct.id 
LEFT JOIN coupons c ON o.coupon_code = c.coupon_code  
WHERE oi.deleted_at IS NULL AND oi.order_id = ?;";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to prepare statement']);
  exit;
}

mysqli_stmt_bind_param($stmt, "i", $order_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!$result) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to fetch products']);
  exit;
}

while ($row = mysqli_fetch_assoc($result)) {
  $response[] = [
    'order_no' => $row['num'],
    'order_id' => $row['order_id'],
    'quantity' => $row['quantity'],
    'order_date' => $row['order_date'],
    'coupon_code' => $row['coupon_code'],
    'order_status' => $row['order_status'],
    'discount_type' => $row['discount_type'],
    'discount_value' => $row['discount_value'],
    'id' => $row['id'],
    'name' => $row['name'],
    'category' => $row['category'],
    'brand' => $row['brand'],
    'price' => $row['price'],
    'stock' => $row['stock'],
    'description' => $row['description'],
    'image' => $row['image'],
    'color' => $row['color']
  ];
}

echo json_encode($response, JSON_PRETTY_PRINT);

mysqli_stmt_close($stmt);
