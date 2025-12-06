<?php
include '../../../conn.php';
session_start();  // Start the session normally without fixed session_id

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

// Check for session timeout (example: 10,000 seconds)
if (isset($_SESSION['admin_last_signin_time']) && (time() - $_SESSION['admin_last_signin_time']) > 10000) {
  http_response_code(401);
  echo json_encode(['error' => 'Session expired']);
  exit();
}

$_SESSION['admin_last_signin_time'] = time();

$orderId = $_POST['orderId'] ?? '';
$itemId = $_POST['itemId'] ?? '';

if (empty($orderId)) {
  http_response_code(400);
  echo json_encode(['error' => 'Order ID is required']);
  exit();
}

if (empty($itemId)) {
  http_response_code(400);
  echo json_encode(['error' => 'Item ID is required']);
  exit();
}

// Assuming orderId and itemId are integers, change bind_param accordingly
$stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ? AND product_id = ?");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $conn->error]);
  exit();
}
$stmt->bind_param("ii", $orderId, $itemId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
  // No rows deleted - item/order might not exist
  http_response_code(404);
  echo json_encode(['error' => 'No matching order item found to delete']);
  $stmt->close();
  exit();
}

$stmt->close();

$stmt = $conn->prepare("SELECT COUNT(*)
    FROM order_items
    WHERE order_id = ?;
");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $conn->error]);
  exit();
}

$stmt->bind_param("i", $orderId);
$stmt->execute();
$stmt->bind_result($remainingItems);
$stmt->fetch();
$stmt->close();

echo json_encode(['remaining_items' => $remainingItems]);
exit();
