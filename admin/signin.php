<?php
session_id("sessionadmin");
session_start();

// Check if admin is already signed in
if (isset($_SESSION['admin_email']) && isset($_SESSION['admin_logged_in'])) {
    // Check if session is still valid (not expired)
    if (isset($_SESSION['admin_last_signin_time']) && (time() - $_SESSION['admin_last_signin_time']) <= 10000) {
        // User is already logged in, redirect to dashboard
        header("Location: dashboard.php");
        exit();
    }
}

include 'main-header.php';

$email = $password = $emailErr = $passwordErr = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("
        SELECT a.password, r.role AS role_name 
        FROM admin_sign_in a
        JOIN roles r ON a.role_id = r.id
        WHERE a.email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($db_password, $role_name);
        $stmt->fetch();

        if (md5($password) === $db_password) {
            $_SESSION['admin_email'] = $email;
            $_SESSION['admin_logged_in'] = $email;
            $_SESSION['admin_role'] = $role_name;
            $_SESSION['admin_last_signin_time'] = time();

            if ($role_name === 'admin') {
              header("Location: dashboard.php");
            }else{
              header("Location: login.php");
            }
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
      <div class="col-5 mx-auto bg-white p-5 rounded-3 shadow-lg">
        <h2 class="section-title-h2 text-center mb-4">Sign In</h2>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
          <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="name@example.com">
            <label for="email">Email address</label>
            <span class="message-error"><?php echo $emailErr; ?></span>
          </div>
          <div class="form-floating">
            <input type="password" name="password" class="form-control" id="password" placeholder="Password">
            <label for="password">Password</label>
            <span class="message-error"><?php echo $passwordErr; ?></span>
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