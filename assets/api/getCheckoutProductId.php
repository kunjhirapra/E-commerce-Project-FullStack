<?php
include '../../conn.php';
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');

if (!isset($_SESSION['email'])) {
    header("Location: signin.php");
    exit();
}

$userEmail = $_SESSION['email'];

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["orderId"])) {
    unset($_SESSION['orderId']);
    $_SESSION['orderId'] = $_POST['orderId'];

    exit();
}

if (isset($_SESSION['orderId'])) {
    $orderId = $_SESSION['orderId'];
} else {
    echo "No order information found.";
    exit();
}

$stmt = $conn->prepare("SELECT 
    oi.*, 
    c.discount_type, 
    c.discount_value
FROM 
    order_items oi
JOIN 
    orders o ON oi.order_id = o.id
LEFT JOIN 
    coupons c ON o.coupon_code = c.coupon_code
WHERE 
    oi.order_id = ?
    AND oi.deleted_at IS NULL;

");
$stmt->bind_param("s", $orderId);
$stmt->execute();

$result = $stmt->get_result();

$products = [];

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($products, JSON_PRETTY_PRINT);
?>