<?php
session_start();
include '../../conn.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$productId = (int)$input['product_id'];

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(['error' => 'User not logged in']);
    exit;
}
$userEmail = $_SESSION['email'];
$stmt = $conn->prepare("SELECT id FROM user_sign_in WHERE email = ?");
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$stmt->bind_result($userId);
$stmt->fetch();
$stmt->close();

$sql = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?;";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die('Prepare failed: ' . $conn->error);
}
$stmt->bind_param('ii', $userId, $productId);
$stmt->execute();
$stmt->close();
?>