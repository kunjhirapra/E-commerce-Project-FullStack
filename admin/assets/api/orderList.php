<?php 
include "../../../conn.php";

$response = [];

if ($conn) {
      $sql = "SELECT 
    o.id AS order_id,
    o.username,
    o.user_email,
    o.created_at,   
    o.payment_type,
    o.order_status,
    user.user_img
FROM orders o
LEFT JOIN user_sign_in user ON o.user_id = user.id
WHERE o.id IN (
    SELECT DISTINCT oi.order_id
    FROM order_items oi
    WHERE oi.deleted_at IS NULL
);
";

    $ordersResult = mysqli_query($conn, $sql);
    $orderItemsResult = mysqli_query($conn, "SELECT * FROM order_items WHERE deleted_at IS NULL");

    if ($ordersResult && $orderItemsResult) {
        header("Content-Type: application/json");

        $orderItems = [];
        while ($row = mysqli_fetch_assoc($orderItemsResult)) {
            $orderItems[$row['order_id']][] = [ 
                
                'id' => $row['id'],
                'product_id' => $row['product_id'],
                'quantity' => $row['quantity'],
                'price' => $row['price']
            ];
        }

        while ($row = mysqli_fetch_assoc($ordersResult)) {
            $orderId = $row['order_id'];

            $response[] = [
                'order_id' => $orderId,
                'username' => $row['username'],
                'user_email' => $row['user_email'],
                'payment_type' => $row['payment_type'],
                'order_status' => $row['order_status'],
                'order_date' => date("d-m-Y", strtotime($row['created_at'])),
                'user_img' => $row['user_img'],
                'items' => isset($orderItems[$orderId]) ? $orderItems[$orderId] : []
            ];
        }

        echo json_encode($response, JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch data']);
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
}
?>