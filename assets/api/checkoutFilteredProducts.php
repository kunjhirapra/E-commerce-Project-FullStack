<?php
include '../../conn.php';
session_start();

if (!isset($_SESSION['email'])) {
  header("Location: signin.php");
  exit();
}

$orderId = $_SESSION['orderId'];

$sql = "SELECT * FROM total_products 
    WHERE id IN (
        SELECT product_id FROM order_items WHERE order_id = ?  AND is_deleted IS NULL AND is_active = 1);";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $orderId);
$stmt->execute();
$productResult = $stmt->get_result();

$filteredProducts = [];
while ($row = $productResult->fetch_assoc()) {
  $filteredProducts[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($filteredProducts, JSON_PRETTY_PRINT);
