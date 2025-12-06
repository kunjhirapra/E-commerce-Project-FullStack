<?php
include "../../../conn.php";
header("Content-Type: application/json");

$productId = $_GET['id'];
$isActive = $_GET['is_active'];


$sql = "UPDATE total_products SET is_active = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ii', $isActive, $productId);
$stmt->execute();
$stmt->close();
$conn->close();
