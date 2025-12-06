<?php
include "../../../conn.php";

header("Content-Type: application/json");

$response = [];

if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$order_id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($order_id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid or missing product ID']);
  exit;
}

$sql = "SELECT tp.*, c.name AS category 
        FROM total_products tp 
        JOIN categories c ON tp.category_id = c.id 
        WHERE tp.id = ?;";

$stmt = mysqli_prepare($conn, $sql);

if (!$stmt) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to prepare statement']);
  exit;
}

mysqli_stmt_bind_param($stmt, "i", $order_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (!$result) {
  http_response_code(500);
  echo json_encode(['error' => 'Failed to fetch product']);
  exit;
}
$response = mysqli_fetch_all($result, MYSQLI_ASSOC);

if (empty($response)) {
  http_response_code(404);
  echo json_encode(['error' => 'No products found']);
  exit;
}

echo json_encode($response[0], JSON_PRETTY_PRINT);

mysqli_stmt_close($stmt);
