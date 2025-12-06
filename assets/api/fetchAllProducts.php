<?php
include "../../conn.php";
header("Content-Type: application/json");

if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
  exit;
}

$sql = "SELECT tp.*, c.name AS category FROM total_products tp LEFT JOIN categories c ON tp.category_id = c.id WHERE tp.is_active = 1 AND tp.is_deleted IS NULL;";
$result = mysqli_query($conn, $sql);

$data = [];

if ($result && mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
  }
}

echo json_encode($data);