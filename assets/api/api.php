<?php
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');
include "../../conn.php";

$response = [];

if (isset($_SESSION['userLogId'])) {
  $userLogId = (int)$_SESSION['userLogId'];

  $wishlist_product = [];
  $wishlistResult = mysqli_query($conn, "SELECT product_id FROM wishlist WHERE user_id = $userLogId");

  if ($wishlistResult) {
    while ($row = mysqli_fetch_assoc($wishlistResult)) {
      $wishlist_product[$row['product_id']] = true;
    }
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch wishlist']);
    exit;
  }

  $productsResult = mysqli_query($conn, "SELECT tp.*, c.name AS category FROM total_products tp JOIN categories c ON tp.category_id = c.id WHERE tp.is_active = 1 AND is_deleted IS NULL ORDER BY tp.id;");
  if (!$productsResult) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch products']);
    exit;
  }

  while ($product = mysqli_fetch_assoc($productsResult)) {
    $response[] = [
      'id' => $product['id'],
      'name' => $product['name'],
      'category' => $product['category'],
      'category_id' => $product['category_id'],
      'brand' => $product['brand'],
      'price' => $product['price'],
      'stock' => $product['stock'],
      'description' => $product['description'],
      'image' => $product['image'],
      'color' => $product['color'],
      'active' => isset($wishlist_product[$product['id']]),
    ];
  }
} else {
  $result = mysqli_query($conn, "SELECT tp.*, c.name AS category FROM total_products tp JOIN categories c ON tp.category_id = c.id WHERE tp.is_active = 1 AND tp.is_deleted IS NULL ORDER BY tp.id;");
  if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch products']);
    exit;
  }

  while ($row = mysqli_fetch_assoc($result)) {
    $response[] = [
      'id' => $row['id'],
      'name' => $row['name'],
      'category' => $row['category'],
      'brand' => $row['brand'],
      'price' => $row['price'],
      'stock' => $row['stock'],
      'description' => $row['description'],
      'image' => $row['image'],
      'color' => $row['color'],
    ];
  }
}

header("Content-Type: application/json");
echo json_encode($response, JSON_PRETTY_PRINT);
