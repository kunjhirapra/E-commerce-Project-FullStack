<?php 
include "../../conn.php";
session_start();
header("Content-Type: application/json");

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


$stmt = $conn->prepare("SELECT * FROM wishlist WHERE user_id = ?");
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result(); 

$response = [];
if ($result) {
	
	while ($row = mysqli_fetch_assoc($result)) {
		$response[] = [
		'id' => (int)$row['product_id'],
		'productQuantity' => (int)$row['quantity'],
	];
}

echo json_encode($response, JSON_PRETTY_PRINT);
} else {
	http_response_code(500);
	echo json_encode(['error' => 'Failed to fetch products']);
}
$stmt->close();
$conn->close();
?>