<?php
session_start();
?>
<script>
localStorage.removeItem("cartProducts");
</script>
<?php

session_destroy();
header("Location: index.php");
exit();
?>