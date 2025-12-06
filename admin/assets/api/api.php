<?php
include "../../../conn.php";

$response = array();

if ($conn) {
  $sql = "SELECT tp.*, c.name AS category FROM total_products tp JOIN categories c ON tp.category_id = c.id ORDER BY tp.id;";
  $result = mysqli_query($conn, $sql);

  if ($result) {
    header("Content-Type: application/json");
    while ($row = mysqli_fetch_assoc($result)) {
      $response[] = $row;
    }
    echo json_encode($response, JSON_PRETTY_PRINT);
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch products']);
  }
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
}
