<?php 
  session_id("sessionuser");
  session_start();
  
  // Check if user is already signed in
  if (isset($_SESSION['email']) && isset($_SESSION['userLogId'])) {
    // Check if session is still valid (not expired)
    if (isset($_SESSION['last_signin_time']) && (time() - $_SESSION['last_signin_time']) <= 10000) {
      // User is already logged in, redirect to home page
      header("Location: my-dashboard.php");
      exit();
    }
  }
  
  include 'main-header.php'; 
$email = $password = $emailErr = $passwordErr = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT password, id FROM user_sign_in WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
      $stmt->bind_result($db_password, $userLogId);
      $stmt->fetch();

      if (md5($password) === $db_password) {
        $_SESSION['email'] = $email;
        $_SESSION['userLogId'] = $userLogId;
        $_SESSION['last_signin_time'] = time();
        ?>
<script>
const cartItem = localStorage.getItem("cartProducts");
localStorage.removeItem("cartProducts")
console.log("cartItem" + cartItem);
if (cartItem) {
  const cartArray = JSON.parse(cartItem);

  cartArray.forEach(item => {
    const id = item.id;
    const quantity = item.productQuantity;

    fetch("./assets/api/add_to_cart_product.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: id,
        quantity: quantity,
      }),
    })

  });
} else {
  console.log("No cart items found in localStorage");
}
setTimeout(() => {
  window.location.href = "index.php";
}, 50);
</script>
<?=
        exit(); 
      } else {
        $passwordErr = "Incorrect password";
      }
    } else {
      $emailErr = "Email not found";
    }

    $stmt->close();
    $conn->close();
}
?>
<section class="sign-in-section bg-lightBlue h-full">
  <div class="container ">
    <div class="row">
      <div class="col-4 mx-auto bg-white p-5 rounded-3 shadow-lg">
        <h2 class="section-title-h2 text-center mb-4">Sign In</h2>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="name@example.com">
            <label for="email">Email address</label>
            <span class="error"><?php echo $emailErr; ?></span>
          </div>
          <div class="form-floating">
            <input type="password" name="password" class="form-control" id="password" placeholder="Password">
            <label for="password">Password</label>
            <span class="error"><?php echo $passwordErr; ?></span>
          </div>
          <div class="d-flex justify-content-between  mt-4">
            <p class="mb-0 text-dark text-center"><a href="signup.php" class="btn btn-secondary p-2">Create Account</a>
            </p>
            <button type="submit" class="add-to-cart-button mt-0">Sign IN</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

</body>

</html>