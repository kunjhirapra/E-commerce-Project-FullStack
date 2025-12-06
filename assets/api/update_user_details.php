<?php
include '../../conn.php';
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');

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

$userName = trim($_POST['UserName'] ?? '');
$contactNumber = trim($_POST['contactNumber'] ?? '');
$email = trim($_POST['email'] ?? '');
// $user_img = trim($_POST['user_img'] ?? '');
$sqlUpdate = "UPDATE user_sign_in SET username = ?,  contact_number= ?, email = ? WHERE email = ?";

$stmt = $conn->prepare($sqlUpdate);
$stmt->bind_param("ssss", $userName, $contactNumber, $email, $userEmail);

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
