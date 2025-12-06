<?php
include '../../../conn.php';
require_once __DIR__ . '/../../../includes/security.php';
Security::init_secure_session('ADMIN_SESSION');

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
$username = $_POST['username'] ?? '';
$deliveryAddress = $_POST['deliveryAddress'] ?? '';
$billingAddress = $_POST['billingAddress'] ?? '';
$city = $_POST['city'] ?? '';
$stateName = $_POST['state'] ?? '';
$zipCode = $_POST['zipCode'] ?? '';
$email = $_POST['email'] ?? '';
$order_status = $_POST['orderStatus'] ?? '';
$contactNumber = $_POST['contactNumber'] ?? '';

if (empty($orderId)) {
  http_response_code(400);
  echo json_encode(['error' => 'Order ID is required']);
  exit();
}

$stmt = $conn->prepare("UPDATE user_details SET username=?, delivery_address=?, billing_address=?, city=?, state_name=?, zip_code=?, email=?, contact_number=?, order_status=? WHERE id=?");
$stmt->bind_param("ssssssssss", $username, $deliveryAddress, $billingAddress, $city, $stateName, $zipCode, $email, $contactNumber, $order_status, $orderId);
$stmt->execute();
$stmt->close();
$stmt = $conn->prepare("UPDATE orders SET username=?, delivery_address=?, billing_address=?, city=?, state_name=?, zip_code=?, contact_number=?, order_status=? WHERE id=?");
$stmt->bind_param("sssssssss", $username, $deliveryAddress, $billingAddress, $city, $stateName, $zipCode, $contactNumber, $order_status, $orderId);
$stmt->execute();
$stmt->close();
exit();
