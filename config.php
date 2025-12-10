<?php
/**
 * Configuration file for base URLs
 * This file automatically detects the environment and sets appropriate URLs
 */

// Detect if running on localhost or production server
$isLocalhost = in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1', '::1']);

// Get the protocol (http or https)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

if ($isLocalhost) {
    // Local development environment
    $Base_Url = $protocol . $_SERVER['SERVER_NAME'] . '/E-commerce-Project-FullStack';
    $Admin_Base_Url = $protocol . $_SERVER['SERVER_NAME'] . '/E-commerce-Project-FullStack/admin';
} else {
    // Production server environment
    // Option 1: Site is in root directory (ACTIVE for projectstore.kunjdeveloper.me)
    $Base_Url = $protocol . $_SERVER['SERVER_NAME'];
    $Admin_Base_Url = $protocol . $_SERVER['SERVER_NAME'] . '/admin';
    
    // Option 2: If the site is in a subdirectory (DISABLED)
    // Modify 'E-commerce-Project-FullStack' to match your actual directory name on the server
    // $Base_Url = $protocol . $_SERVER['SERVER_NAME'] . '/E-commerce-Project-FullStack';
    // $Admin_Base_Url = $protocol . $_SERVER['SERVER_NAME'] . '/E-commerce-Project-FullStack/admin';
    
    // Option 3: Custom domain/path - Manually specify your production URLs (DISABLED)
    // Uncomment and modify these lines if you need specific URLs
    // $Base_Url = 'https://your-domain.com';
    // $Admin_Base_Url = 'https://your-domain.com/admin';
}

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kunj_ecommerce";

// For production, use different database credentials
// IMPORTANT: Update these with your actual production database credentials!
if (!$isLocalhost) {
    // TODO: Replace these with your actual production database credentials
    $servername = "localhost"; // Usually 'localhost' but check with your hosting provider
    $username = "kunj"; // Your hosting database username
    $password = "Kunj@localhost#@!"; // Your hosting database password
    $dbname = "kunj_ecommerce"; // Your hosting database name
}

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to UTF-8
$conn->set_charset("utf8mb4");
?>