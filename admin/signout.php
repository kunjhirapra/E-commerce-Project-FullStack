<?php
require_once __DIR__ . '/../includes/security.php';
Security::init_secure_session('ADMIN_SESSION');

unset($_SESSION['admin_email']);

header("Location: signin.php");
exit();
?>