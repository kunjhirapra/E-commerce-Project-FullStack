<?php
include "../../../conn.php";

header("Content-Type: application/json");

$response = [];

if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($product_id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid or missing product ID']);
  exit;
}

$sql = $conn->prepare("UPDATE total_products SET is_deleted = NOW() WHERE id = ?");
$sql->bind_param("i", $product_id);
$sql->execute();

if ($sql->affected_rows > 0) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['error' => 'Product not found or no changes made']);
}

$sql->close();
$conn->close();
header(('Location: ../../add-product.php'));
exit();
