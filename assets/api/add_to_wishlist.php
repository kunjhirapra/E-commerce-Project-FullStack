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
$inWishlist = 1;

$stmt = $conn->prepare("SELECT price FROM total_products WHERE id = ? AND is_deleted IS NULL");
$stmt->bind_param("i", $productId);
$stmt->execute();
$stmt->bind_result($productPrice);
$stmt->fetch();
$stmt->close();

$sql = "SELECT COUNT(*) FROM wishlist WHERE user_id = ? AND product_id = ?;";
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
  $sql = "INSERT INTO wishlist (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('iiii', $userId, $productId, $quantity, $productPrice);
} else {
  $updatedPrice = $productPrice * $quantity;
  $sql = "UPDATE wishlist SET quantity = ? , price = ? WHERE user_id = ? AND product_id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param('iiii', $quantity, $updatedPrice, $userId, $productId);
}

$stmt->execute();
$stmt->close();


$stmt = $conn->prepare("SELECT * FROM wishlist WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$wishlistItems = [];
while ($row = $result->fetch_assoc()) {
  $wishlistItems[] = $row;
}
$stmt->close();

echo json_encode(["success" => true]);
exit();