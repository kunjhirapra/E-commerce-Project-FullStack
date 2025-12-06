<?php
require_once __DIR__ . '/includes/security.php';
Security::init_secure_session('USER_SESSION');
?>
<script>
localStorage.removeItem("cartProducts");
</script>
<?php

session_destroy();
header("Location: index.php");
exit();
?>