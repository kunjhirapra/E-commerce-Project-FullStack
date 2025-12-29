<?php
require_once __DIR__ . '/../../conn.php';
require_once __DIR__ . '/../../includes/security.php';

Security::init_secure_session('USER_SESSION');
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($_SESSION['userLogId'], $input['product_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$userId = (int) $_SESSION['userLogId'];
$productId = (int) $input['product_id'];

if (!$conn) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Get wishlist item details
$stmt = $conn->prepare(
    "SELECT quantity, price FROM wishlist WHERE user_id = ? AND product_id = ?"
);
$stmt->bind_param("ii", $userId, $productId);
$stmt->execute();
$stmt->bind_result($wishlistQuantity, $wishlistPrice);

if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(['error' => 'Item not found in wishlist']);
    exit;
}
$stmt->close();

// Check if product exists in cart
$stmt = $conn->prepare(
    "SELECT quantity FROM cart_products 
     WHERE user_id = ? AND product_id = ? AND is_deleted IS NULL"
);
$stmt->bind_param("ii", $userId, $productId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->bind_result($existingQty);
    $stmt->fetch();
    $stmt->close();

    $newQuantity = $existingQty + $wishlistQuantity;
    $newPrice = $wishlistPrice * $newQuantity;

    $stmt = $conn->prepare(
        "UPDATE cart_products 
         SET quantity = ?, product_price = ?
         WHERE user_id = ? AND product_id = ? AND is_deleted IS NULL"
    );
    $stmt->bind_param("idii", $newQuantity, $newPrice, $userId, $productId);
} else {
    $stmt->close();

    $totalPrice = $wishlistPrice * $wishlistQuantity;
    $stmt = $conn->prepare(
        "INSERT INTO cart_products (user_id, product_id, quantity, product_price)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->bind_param("iiid", $userId, $productId, $wishlistQuantity, $totalPrice);
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move item to cart']);
    exit;
}
$stmt->close();

// Remove from wishlist
$stmt = $conn->prepare(
    "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?"
);
$stmt->bind_param("ii", $userId, $productId);
$stmt->execute();
$stmt->close();

echo json_encode([
    'success' => true,
    'message' => 'Item moved to cart'
]);