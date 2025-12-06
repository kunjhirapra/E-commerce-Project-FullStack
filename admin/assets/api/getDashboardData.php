<?php
header('Content-Type: application/json');
include '../../../conn.php';

function getTotalSales($conn)
{
  $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE order_status != 'cancelled'";
  $result = $conn->query($query);
  return $result->fetch_assoc()['total'];
}

function getWeeklySales($conn)
{
  $query = "SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
              WHERE order_status != 'cancelled' 
              AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
  $result = $conn->query($query);
  return $result->fetch_assoc()['total'];
}

function getPendingOrders($conn)
{
  $query = "SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'";
  $result = $conn->query($query);
  return $result->fetch_assoc()['count'];
}

function getTotalProducts($conn)
{
  $query = "SELECT COUNT(*) as count FROM total_products WHERE is_active = 1 AND is_deleted IS NULL";
  $result = $conn->query($query);
  return $result->fetch_assoc()['count'];
}

function getRecentOrders($conn)
{
  $query = "SELECT o.id, o.total_amount, o.order_status, o.created_at, u.username 
              FROM orders o 
              JOIN user_sign_in u ON o.user_id = u.id 
              ORDER BY o.created_at DESC 
              LIMIT 5";
  $result = $conn->query($query);
  $orders = [];
  while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
  }
  return $orders;
}

function getDailySales($conn)
{
  $query = "SELECT DATE(created_at) as date, SUM(total_amount) as total 
              FROM orders 
              WHERE order_status != 'cancelled' 
              AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
              GROUP BY DATE(created_at)
              ORDER BY date";
  $result = $conn->query($query);
  $sales = [];
  while ($row = $result->fetch_assoc()) {
    $sales[] = $row;
  }
  return $sales;
}
function getTotalDailySales($conn)
{
  $query = "SELECT DATE(created_at) as date, SUM(total_amount) as total 
              FROM orders 
              WHERE order_status != 'cancelled'
              GROUP BY DATE(created_at)
              ORDER BY date";
  $result = $conn->query($query);
  $sales = [];
  while ($row = $result->fetch_assoc()) {
    $sales[] = $row;
  }
  return $sales;
}

$data = [
  'totalSales' => getTotalSales($conn),
  'totalDailySales' => getTotalDailySales($conn),
  'weeklySales' => getWeeklySales($conn),
  'pendingOrders' => getPendingOrders($conn),
  'totalProducts' => getTotalProducts($conn),
  'recentOrders' => getRecentOrders($conn),
  'dailySales' => getDailySales($conn)
];

echo json_encode($data);
