<?php
  session_id("sessionadmin");
  session_start();

unset($_SESSION['admin_email']);

header("Location: signin.php");
exit();
?>