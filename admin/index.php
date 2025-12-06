<?php
session_id("sessionadmin");
session_start();

// Check if admin is already signed in
if (isset($_SESSION['admin_email']) && isset($_SESSION['admin_logged_in'])) {
    // Check if session is still valid (not expired)
    if (isset($_SESSION['admin_last_signin_time']) && (time() - $_SESSION['admin_last_signin_time']) <= 10000) {
        // User is logged in and session is valid, redirect to dashboard
        header("Location: dashboard.php");
        exit();
    } else {
        // Session expired, clear and redirect to signin
        session_unset();
        session_destroy();
        header("Location: signin.php");
        exit();
    }
} else {
    // User is not signed in, redirect to signin page
    header("Location: signin.php");
    exit();
}
?>
