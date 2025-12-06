<?php
session_id("sessionadmin");
session_start();
include '../../../conn.php';

if (!isset($_SESSION['admin_email'])) {
  header("Location: signin.php");
  exit();
}
if (isset($_SESSION['admin_last_signin_time']) && (time() - $_SESSION['admin_last_signin_time']) > 10000) {
  header("Location: signout.php");
  exit();
}

$_SESSION['admin_last_signin_time'] = time();
$userEmail = $_SESSION['admin_email'];

$stmt = $conn->prepare("SELECT username FROM admin_sign_in WHERE email = ?");
$stmt->bind_param("s", $userEmail);
$stmt->execute();
$stmt->bind_result($userName);
$stmt->fetch();
$stmt->close();

if (isset($_GET['q']) && !empty($_GET['q'])) {
  $orderNo = $_GET['q'];
  echo htmlspecialchars($orderNo);

  $stmt = $conn->prepare("DELETE FROM order_items WHERE order_id = ?");
  $stmt->bind_param("s", $orderNo);
  $stmt->execute();
  $stmt->close();

  $stmt = $conn->prepare("SELECT username_id FROM orders WHERE id = ?");
  $stmt->bind_param("s", $orderNo);
  $stmt->execute();
  $stmt->bind_result($usernameId);
  $stmt->fetch();
  $stmt->close();

  $stmt = $conn->prepare("DELETE FROM orders WHERE id = ?");
  $stmt->bind_param("s", $orderNo);
  $stmt->execute();
  $stmt->close();

  $stmt = $conn->prepare("DELETE FROM user_details WHERE id = ?");
  $stmt->bind_param("s", $usernameId);
  $stmt->execute();
  $stmt->close();

  header("Location: orders-listing.php");
  exit();
} else {
  echo "No order ID specified.";
}
exit();
