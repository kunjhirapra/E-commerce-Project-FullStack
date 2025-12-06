<?php
include "../../conn.php";
session_id("sessionuser");
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['userLogId']) || !isset($_SESSION['applied_coupon'])) {
    echo json_encode(["error" => "No active session or coupon to remove."]);
    exit;
}

$userId = $_SESSION['userLogId'];
$coupon = $_SESSION['applied_coupon'];

unset($_SESSION['applied_coupon']);

$stmt = $conn->prepare("UPDATE coupon_usage 
    SET usage_count = usage_count - 1, last_used = NOW() 
    WHERE user_id = ? AND coupon_code = ?
");
$stmt->bind_param("is", $userId, $coupon);
$stmt->execute();
$stmt->close();
echo json_encode(["success" => "Coupon removed."]);
?>