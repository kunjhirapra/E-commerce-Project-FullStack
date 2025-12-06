<?php 
include "../../conn.php";
require_once __DIR__ . '/../../includes/security.php';
Security::init_secure_session('USER_SESSION');
header('Content-Type: application/json');
$response = array();
$orderId = (int)$_POST['orderIdNo'];
$itemId = $_POST['itemIdNo'];
$returnReason = $_POST['returnReason'];
$paymentType = $_POST['paymentType'];
$returnDescription = $_POST['returnDescription'];
$contactNumber = $_POST['contactNumber'];
$customerName = $_POST['customerName'];
$refundAmount = $_POST['refundAmount'];

$itemIds = array_map('intval', explode(',', $itemId));

if ($conn) {

  $userEmail = $_SESSION['email'];
  $stmt = $conn->prepare("SELECT id, username FROM user_sign_in WHERE email = ?");
  $stmt->bind_param("s", $userEmail);
  $stmt->execute();
  $stmt->bind_result($userId, $username);
  $stmt->fetch();
  $stmt->close();

  $itemIdsString = implode(',', $itemIds);
  $sql = "UPDATE order_items SET deleted_at = NOW() WHERE order_id = ? AND product_id IN ($itemIdsString)";
  
  $stmtUpdate = $conn->prepare($sql);
  $stmtUpdate->bind_param("i", $orderId);
  $stmtUpdate->execute();
  $stmtUpdate->close();


  $sqlInsertProducts = "INSERT INTO return_products (user_id, user_email, order_id, customer_name, return_reason, return_description, payment_type, contact_number, refund_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sqlInsertProducts);
  $stmt->bind_param("isisssssd", $userId, $userEmail, $orderId, $customerName, $returnReason, $returnDescription, $paymentType, $contactNumber, $refundAmount);

  if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save user details'])  ;
    $stmt->close();
    $conn->close();
    exit(); 
  }
  $returnOrderId = $stmt->insert_id;
  $stmt->close();  
  
  $query = "INSERT INTO return_items (return_id, order_id, order_item_id) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($query);
  foreach ($itemIds as $itemId) {
    $stmt->bind_param("iii", $returnOrderId, $orderId, $itemId);
    $stmt->execute();
  }
  $stmt->close(); 

  
  $query = "SELECT ri.*, oi.quantity 
  FROM return_items ri
  JOIN order_items oi 
    ON ri.order_id = oi.order_id 
    AND ri.order_item_id = oi.product_id
    WHERE ri.return_id = ? 
      AND ri.order_id = ? 
      AND ri.order_item_id = ?
";

$stmt = $conn->prepare($query);

foreach ($itemIds as $itemId) {
  $stmt->bind_param("iii", $returnOrderId, $orderId, $itemId);
  $stmt->execute();

  $result = $stmt->get_result();
  while ($row = $result->fetch_assoc()) {
    $returnId = $row['return_id'];

    $returnItems[$returnId][] = [
      'id' => $row['id'],
      'returnId' => $row['return_id'],
      'orderItemId' => $row['order_item_id'],
      'quantity' => $row['quantity'],
    ];
  }
}
$stmt->close();


    
  $response = [];

  $sqlReturnProducts = "SELECT id AS return_id,
    customer_name,
    user_email,
    payment_type,
    refund_amount,
    return_status,
    return_date
    FROM return_products
    WHERE id = ?";

  $stmtReturn = $conn->prepare($sqlReturnProducts);
  $stmtReturn->bind_param("i", $returnOrderId);
  $stmtReturn->execute();

  $resultReturn = $stmtReturn->get_result();
  while ($row = $resultReturn->fetch_assoc()) {
    $returnId = $row['return_id'];

    $response[] = [
      'returnId' => $returnId,
      'customerName' => $row['customer_name'],
      'userEmail' => $row['user_email'],
      'paymentType' => $row['payment_type'],
      'refundAmount' => $row['refund_amount'],
      'returnStatus' => $row['return_status'],
      'returnDate' => date("d-m-Y", strtotime($row['return_date'])),
      'items' => isset($returnItems[$returnId]) ? $returnItems[$returnId] : []
    ];
  }

  $stmtReturn->close();
  echo json_encode($response, JSON_PRETTY_PRINT);

} else {
  http_response_code(500);
  echo json_encode(['error' => 'Database connection failed']);
}
?>