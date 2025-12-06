<?php
session_start();
include '../../conn.php';
header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
  http_response_code(401);
  echo json_encode(['error' => 'User not logged in']);
  exit;
}
$userEmail = $_SESSION['email'];
$stmt = $conn->prepare("SELECT id FROM user_sign_in WHERE email = ?");
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$stmt->bind_result($userId);
$stmt->fetch();
$stmt->close();
$input = json_decode(file_get_contents('php://input'), true);
$productId = (int)$input['product_id'];
$quantity = (int)$input['quantity'];

$stmt = $conn->prepare("SELECT price FROM total_products WHERE id = ? AND is_deleted IS NULL");
$stmt->bind_param("s", $productId);
$stmt->execute();
$stmt->bind_result($productPrice);
$stmt->fetch();
$stmt->close();

$sql = "SELECT COUNT(*) FROM cart_products WHERE user_id = ? AND product_id = ? AND is_deleted IS NULL";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
  die('Prepare failed: ' . $conn->error);
}
$stmt->bind_param('ii', $userId, $productId);
$stmt->execute();
$stmt->bind_result($row);
$stmt->fetch();
$stmt->close();

if ($row === 0) {
  $sql = "INSERT INTO cart_products (user_id, product_id, quantity, product_price) VALUES (?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('iiii', $userId, $productId, $quantity, $productPrice);
} else {
  $sql = "UPDATE cart_products SET quantity = (quantity + ?), product_price = (quantity * ?) WHERE user_id = ? AND product_id = ? AND is_deleted IS NULL";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('iiii', $quantity, $productPrice, $userId, $productId);
}

$stmt->execute();
$stmt->close();


$stmt = $conn->prepare("SELECT * FROM cart_products WHERE user_id = ? AND is_deleted IS NULL");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$cartItems = [];
while ($row = $result->fetch_assoc()) {
  $cartItems[] = $row;
}
$stmt->close();

echo json_encode([
  'id' => $userId,
  'productPrice' => $quantity * $productPrice,
  'productQuantity' => $quantity,
  'cartItems' => $cartItems
]);
