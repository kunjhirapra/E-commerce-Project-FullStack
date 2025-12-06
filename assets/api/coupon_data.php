<?php
include "../../conn.php";
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');
header('Content-Type: application/json');

$coupon = $_POST['coupon'] ?? '';
if (isset($_POST['categories'])) {
  $jsonString = $_POST['categories'];
  $phpArray = json_decode($jsonString, true);
} else {
  echo "No array data received.";
}

$userId = $_SESSION["userLogId"] ?? '';
unset($_SESSION['applied_coupon']);
$coupons = [];
if (isset($_SESSION['applied_coupon'])) {
  echo json_encode([
    "error" => "You have already applied a coupon. Only one coupon is allowed per order."
  ]);
  exit();
}

$stmt = $conn->prepare("SELECT c.*, ca.name AS category 
    FROM coupons c
    LEFT JOIN coupon_categories cc ON c.id = cc.coupon_id
    LEFT JOIN categories ca ON cc.category_id = ca.id
    WHERE c.coupon_code = ?
");
$stmt->bind_param("s", $coupon);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode(["error" => "Invalid coupon code."]);
  exit();
}

$couponData = null;
$categories = [];

while ($row = $result->fetch_assoc()) {
  if ($couponData === null) {
    $couponData = $row;
    unset($couponData['category']);
  }
  if ($row['category'] && !in_array($row['category'], $categories)) {
    $categories[] = $row['category'];
  }
}

$couponData['category'] = $categories;

if ($couponData['expiry_date'] < date('Y-m-d')) {
  echo json_encode(["error" => "Coupon has expired."]);
  exit();
}


$stmt = $conn->prepare("SELECT usage_count FROM coupon_usage WHERE user_id = ? AND coupon_code = ?");
$stmt->bind_param("is", $userId, $coupon);
$stmt->execute();
$usageResult = $stmt->get_result();

$usageLimit = (int)$couponData['usage_limit'];
$alreadyUsed = 0;

if ($usageResult->num_rows > 0) {
  $usageData = $usageResult->fetch_assoc();
  $alreadyUsed = (int)$usageData['usage_count'];

  if ($alreadyUsed >= $usageLimit) {
    echo json_encode(["error" => "You have already used this coupon the maximum allowed times."]);
    exit();
  }


  $stmt = $conn->prepare("UPDATE coupon_usage SET usage_count = usage_count + 1, last_used = NOW() WHERE user_id = ? AND coupon_code = ?");
  $stmt->bind_param("is", $userId, $coupon);
  $stmt->execute();
} else {

  $stmt = $conn->prepare("INSERT INTO coupon_usage (user_id, coupon_code, usage_count) VALUES (?, ?, 1)");
  $stmt->bind_param("is", $userId, $coupon);
  $stmt->execute();
}

$_SESSION['applied_coupon'] = $coupon;

echo json_encode([
  "success" => "Coupon Applied Successfully!",
  "coupon" => $couponData,
], JSON_PRETTY_PRINT);
exit();
