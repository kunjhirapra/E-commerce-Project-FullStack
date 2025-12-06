<?php
include "../../../conn.php";
session_id("sessionuser");
session_start();
header('Content-Type: application/json');

$coupon_code = $_POST['coupon_code'] ?? '';
$discount_type = $_POST['discount_type'] ?? '';
$discount_value = $_POST['discount_value'] ?? 0;
$minimum_purchase = $_POST['minimum_purchase'] ?? 0;
$expiry_date = $_POST['expiry_date'] ?? '';
$usage_limit = $_POST['usage_limit'] ?? 0;
$applicable_category = $_POST['applicable_category'] ?? '';
$category_array = explode(",", $applicable_category);

if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit();
}

$stmt = $conn->prepare("SELECT cat.name FROM categories cat JOIN coupon_categories cc ON cat.id = cc.category_id JOIN coupons c ON c.id = cc.coupon_id WHERE c.coupon_code = ?;");
$stmt->bind_param("s", $coupon_code);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
  echo json_encode(['error' => 'The Coupon already exists. Please enter another one.']);
  $stmt->close();
  $conn->close();
  exit();
}
$stmt->close();

$sqlInsert = "INSERT INTO coupons (coupon_code, discount_type, discount_value, minimum_purchase, expiry_date, usage_limit)
  VALUES (?, ?, ?, ?, ?, ?)";

$stmt2 = $conn->prepare($sqlInsert);
$stmt2->bind_param("ssddsi", $coupon_code, $discount_type, $discount_value, $minimum_purchase, $expiry_date, $usage_limit);
$stmt2->execute();

$coupon_id = $stmt2->insert_id;
$stmt2->close();

foreach ($category_array as $category_name) {
  $category_name = trim($category_name);

  if (!empty($category_name)) {
    $stmt3 = $conn->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt3->bind_param("s", $category_name);
    $stmt3->execute();
    $stmt3->store_result();

    if ($stmt3->num_rows > 0) {
      $stmt3->bind_result($category_id);
      $stmt3->fetch();

      $sqlInsertCategory = "INSERT INTO coupon_categories (coupon_id, category_id) VALUES (?, ?)";
      $stmt4 = $conn->prepare($sqlInsertCategory);
      $stmt4->bind_param("ii", $coupon_id, $category_id);
      $stmt4->execute();
      $stmt4->close();
    }
    $stmt3->close();
  }
}
$conn->close();
echo json_encode(['success' => 'Coupon created successfully']);
exit();
