<?php
include '../../conn.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
  http_response_code(401);
  echo json_encode(['error' => 'User not logged in']);
  exit();
}

if (isset($_SESSION['last_signin_time']) && (time() - $_SESSION['last_signin_time']) > 10000) {
  http_response_code(401);
  echo json_encode(['error' => 'Session expired']);
  exit();
}
$_SESSION['last_signin_time'] = time();

$userEmail = $_SESSION['email'];

$stmtCheck = $conn->prepare("SELECT id FROM user_sign_in WHERE email = ?");
$stmtCheck->bind_param("s", $userEmail);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
$stmtCheck->close();

$deliveryAddress = trim($_POST['deliveryAddress'] ?? '');
$billingAddress = trim($_POST['billingAddress'] ?? '');
$city = trim($_POST['city'] ?? '');
$state = trim($_POST['state'] ?? '');
$zipCode = trim($_POST['zipCode'] ?? '');
$sqlUpdate = "UPDATE user_sign_in SET delivery_address = ?, billing_address = ?, city = ?, state_name = ?, zip_code = ? WHERE email = ?";

$stmt = $conn->prepare($sqlUpdate);
$stmt->bind_param("ssssss", $deliveryAddress, $billingAddress, $city, $state, $zipCode, $userEmail);

if (!$stmt->execute()) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to update user address']);
  $stmt->close();
  $conn->close();
  exit();
}

$stmt->close();
$conn->close();

echo json_encode(['success' => 'User address updated successfully']);
exit();
