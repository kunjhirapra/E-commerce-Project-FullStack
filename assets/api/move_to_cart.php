<?php 
include "../../conn.php";
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');
header('Content-Type: application/json');

// Decode JSON body
$input = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION["userLogId"];
$productId = $input['product_id'];


if ($conn) {

  $sql = "INSERT INTO cart_products (user_id, product_id, quantity, product_price) SELECT user_id, product_id, quantity, price FROM wishlist WHERE user_id = ? AND product_id = ? ON DUPLICATE KEY UPDATE quantity = cart_products.quantity + VALUES(quantity), product_price = VALUES(product_price);";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("ii", $userId, $productId);

  if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save user details'])  ;
    $stmt->close();
    $conn->close();
    exit(); 
  }
  $stmt->close();  
  
  $query = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?;";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("ii", $userId, $productId);
  $stmt->execute();
  $stmt->close(); 

} else {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
}
?>