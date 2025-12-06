<?php
include '../../../conn.php';
session_id("sessionadmin");
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['admin_email'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Admin not logged in']);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Invalid request method']);
  exit();
}

if (isset($_SESSION['admin_last_signin_time']) && (time() - $_SESSION['admin_last_signin_time']) > 10000) {
  http_response_code(401);
  echo json_encode(['error' => 'Session expired']);
  exit();
}

$_SESSION['admin_last_signin_time'] = time();

$orderId = $_POST['orderId'] ?? '';
$itemId = $_POST['itemId'] ?? '';
$itemQuantity = $_POST['itemQuantity'] ?? '';

$stmt = $conn->prepare("SELECT price FROM total_products WHERE id = ? AND is_active = 1 AND is_deleted IS NULL;");
$stmt->bind_param("s", $itemId);
$stmt->execute();
$stmt->bind_result($productPrice);
$stmt->fetch();
$stmt->close();

if (empty($orderId)) {
  http_response_code(400);
  echo json_encode(['error' => 'Order ID is required']);
  exit();
}
$updatedPrice = $productPrice * $itemQuantity;
$stmt = $conn->prepare("UPDATE order_items SET quantity = ?, price = ? WHERE order_id = ? AND product_id = ?");
$stmt->bind_param("ssss", $itemQuantity, $updatedPrice, $orderId, $itemId);
$stmt->execute();
$stmt->close();
echo json_encode(['success' => true]);
exit();
