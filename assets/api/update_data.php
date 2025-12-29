<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
  http_response_code(401);
  echo json_encode(['error' => 'User not logged in']);
  exit();
}

// Check for session timeout (optional logic)
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > 10000) {
  http_response_code(401);
  echo json_encode(['error' => 'Session expired']);
  exit();
}
$_SESSION['last_activity'] = time();

$userEmail = $_SESSION['email'];
$result = mysqli_query($conn, "SELECT id FROM user_sign_in WHERE email = '$userEmail'");

if (!$result || mysqli_num_rows($result) === 0) {
  http_response_code(403);
  echo json_encode(['error' => 'Unauthorized user']);
  exit();
}
$row = mysqli_fetch_assoc($result);
$userId = $row['id'];

$UserName = $_POST['UserName'] ?? '';
if (trim($UserName) === '') {
  header("Location: dashboard.php");
  exit();
}
$email = $_POST['email'] ?? '';
$contactNumber = $_POST['contactNumber'] ?? '';
$deliveryAddress = $_POST['deliveryAddress'] ?? '';
$billingAddress = $_POST['billingAddress'] ?? '';
$city = $_POST['city'] ?? '';
$state = $_POST['state'] ?? '';
$zipCode = $_POST['zipCode'] ?? '';
$paymentType = $_POST['paymentType'] ?? '';
$totalPrice = isset($_POST['totalPrice']) ? floatval($_POST['totalPrice']) : 0.0;
$couponCode = $_POST['couponCodeValue'] ?? '';
$couponCode = (isset($couponCode) && trim($couponCode) !== '') ? trim($couponCode) : null;
$cartJson = $_POST['cart'] ?? '[]';

if (trim($UserName) === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Username is required']);
  exit();
}

$cartProducts = json_decode($cartJson, true);

if (!is_array($cartProducts)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid cart data', "error" => $cartJson]);
  exit();
}

if (count($cartProducts) === 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Cart is empty. Please add at least one product before submitting.', "Message" => $cartJson]);
  exit();
}

$sqlUserDetails = "INSERT INTO user_details (username, email, contact_number, delivery_address, billing_address, city, state_name, zip_code, payment_type)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sqlUserDetails);
// Bind contact as string to preserve formatting
$stmt->bind_param("sssssssss", $UserName, $userEmail, $contactNumber, $deliveryAddress, $billingAddress, $city, $state, $zipCode, $paymentType);

if (!$stmt->execute()) {
  http_response_code(500);
  error_log('update_data.php: Failed to save user details: ' . $stmt->error);
  echo json_encode(['error' => 'Failed to save user details']);
  $stmt->close();
  $conn->close();
  exit();
}
$userDetailsId = $stmt->insert_id;
$stmt->close();

$sqlOrder = "INSERT INTO orders (user_id, username_id, user_email, username, contact_number, delivery_address, billing_address, city, state_name, zip_code, payment_type, total_amount, coupon_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sqlOrder);
// 13 params: ii + 9s + d + s
$stmt->bind_param("iisssssssssds", $userId, $userDetailsId, $userEmail, $UserName, $contactNumber, $deliveryAddress, $billingAddress, $city, $state, $zipCode, $paymentType, $totalPrice, $couponCode);

if (!$stmt->execute()) {
  http_response_code(500);
  error_log('update_data.php: Failed to save order: ' . $stmt->error);
  echo json_encode(['error' => 'Failed to save order']);
  $stmt->close();
  $conn->close();
  exit();
}
$orderId = $stmt->insert_id;
$stmt->close();

$sqlItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
$stmtItem = $conn->prepare($sqlItem);


foreach ($cartProducts as $item) {
  $productId = $item['id'] ?? 0;
  $quantity = $item['productQuantity'] ?? 1;
  $price = $item['productPrice'] ?? 0.0;

  $stmtItem->bind_param("iiid", $orderId, $productId, $quantity, $price);
  if (!$stmtItem->execute()) {
    http_response_code(500);
    error_log('update_data.php: Failed to save order item: ' . $stmtItem->error);
    echo json_encode(['error' => 'Failed to save order item']);
    $stmtItem->close();
    $conn->close();
    exit();
  }
}

$stmtItem->close();

$sqlCart = "UPDATE cart_products SET is_deleted = NOW() WHERE user_id = ?";
$stmtCart = $conn->prepare($sqlCart);
$stmtCart->bind_param('i', $userId);
$stmtCart->execute();
$stmtCart->close();

http_response_code(200);
echo json_encode(['orderId' => $orderId, 'userId' => $userId]);
exit();