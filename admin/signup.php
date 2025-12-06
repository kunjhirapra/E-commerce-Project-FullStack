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

include 'main-header.php' ?>
<?php

$email = $password = $userName = $Upload = $emailErr = $passwordErr = $userNameErr = $UploadErr = "";

function test_input($data)
{
  return htmlspecialchars(stripslashes(trim($data)));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["email"])) {
    $emailErr = "Email is required";
  } else {
    $email = test_input($_POST["email"]);
    if (!preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/", $email)) {
      $emailErr = "Invalid email format, spaces & backslashes are not allowed";
    }
  }

  if (empty($_POST["userName"])) {
    $userNameErr = "Username is required";
  } else {
    $userName = test_input($_POST["userName"]);
    if (!preg_match("/^[a-zA-Z0-9._-]{3,20}$/", $userName)) {
      $userNameErr = "Only letters, numbers, dots, underscores, and hyphens are allowed (3-20 characters)";
    }
  }

  if (empty($_POST["password"])) {
    $passwordErr = "Password is required";
  } else {
    $password = test_input($_POST["password"]);

    if (!preg_match("/^[a-zA-Z0-9._-]{3,20}$/", $password)) {
      $passwordErr = "Only alphabets, numbers, and . _ - are allowed for Password, length 3 to 20 characters.";
    }
  }

  $UploadErr = [];

  $maxsize = 2 * 1024 * 1024;
  $acceptable = ['image/jpeg', 'image/gif', 'image/png'];

  if (isset($_FILES['Upload'])) {
    if ($emailErr === "" && $passwordErr === "" && $userNameErr === "") {
      $fileSize = $_FILES['Upload']['size'];
      $fileType = $_FILES['Upload']['type'];
      $tmpName = $_FILES['Upload']['tmp_name'];

      if ($fileSize == 0 || $fileSize > $maxsize) {
        $UploadErr[] = 'File too large. File must be less than 2 megabytes.';
      }

      if (!in_array($fileType, $acceptable)) {
        $UploadErr[] = 'Invalid file type. Only JPG, GIF and PNG types are accepted.';
      }

      if (count($UploadErr) === 0) {
        $uploadDir = __DIR__ . '/assets/images/admin-sign-up-uploads/';
        if (!is_dir($uploadDir)) {
          mkdir($uploadDir, 0755, true);
        }
        $fileName = preg_replace("/[^a-zA-Z0-9\._-]/", "_", basename($_FILES['Upload']['name']));
        $uniqueFileName = uniqid() . '-' . $fileName;
        $destination = $uploadDir . $uniqueFileName;

        if (move_uploaded_file($tmpName, $destination)) {
          $Upload = $uniqueFileName;
        } else {
          $UploadErr[] = 'Failed to move uploaded file.';
        }
      }
    } else {
      $UploadErr[] = 'It seems tha the fields above are not correct.';
    }
  } else {
    $UploadErr[] = 'No file uploaded or selected.';
  }



  $stmt = $conn->prepare("SELECT id FROM admin_sign_in WHERE email = ? AND role_id = 1");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $stmt->store_result();

  if ($stmt->num_rows > 0) {
    $emailErr = "Email already registered.";
    $stmt->close();
  } else {
    $stmt->close();

    if ($emailErr === "" && $passwordErr === "" && $userNameErr === "" && count($UploadErr) === 0) {
      $defaultRole = 'admin';
      $roleStmt = $conn->prepare("SELECT id FROM roles WHERE name = ?");
      $roleStmt->bind_param("s", $defaultRole);
      $roleStmt->execute();
      $roleResult = $roleStmt->get_result();

      if ($roleResult->num_rows === 1) {
        $roleData = $roleResult->fetch_assoc();
        $role_id = $roleData['id'];

        $hashed_password = md5($password);

        $stmt = $conn->prepare("INSERT INTO admin_sign_in (email, password, username, user_img, role_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $email, $hashed_password, $userName, $Upload, $role_id);

        if ($stmt->execute()) {
          $stmt->close();
          $roleStmt->close();
          $conn->close();
          header("Location: signin.php");
          exit();
        } else {
          echo "Error: " . $stmt->error;
        }
      } else {
        echo "Role not found in database.";
      }
    }
  }

  $conn->close();
}
?>


<section class="sign-in-section bg-lightBlue h-full">
  <div class="container ">
    <div class="row">
      <div class="col-5 mx-auto bg-white p-5 rounded-3 shadow-lg">
        <h2 class="section-title-h2 text-center mb-4">Sign UP</h2>
        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>"
          enctype="multipart/form-data">
          <div class="form-floating mb-3">
            <input type="text" name="userName" class="form-control" id="userName" placeholder="userName">
            <label for="userName">UserName*</label>
            <span class="error-message"><?php echo $userNameErr; ?></span>
          </div>
          <div class="form-floating mb-3">
            <input type="email" name="email" class="form-control" id="email" placeholder="name@example.com">
            <label for="email">Email address*</label>
            <span class="error-message"><?php echo $emailErr; ?></span>
          </div>
          <div class="form-floating mb-3">
            <input type="password" name="password" class="form-control" id="password" placeholder="Password">
            <label for="password">Password*</label>
            <span class="error-message"><?php echo $passwordErr; ?></span>
          </div>
          <div class="">
            <input type="file" name="Upload" class="form-control" required>
            <div class="invalid-feedback">Example invalid form file feedback</div>
            <span class="error-message">
              <?php
              if (!empty($UploadErr) && is_array($UploadErr)) {
                foreach ($UploadErr as $error) {
                  echo htmlspecialchars($error) . '<br>';
                }
              }
              ?>
            </span>
          </div>
          <p class="mb-0 mt-4 text-dark text-center">Alreadey have an accout?<a href="signin.php">Sign in</a>
          </p>
          <div class="d-flex justify-content-center">
            <button type="submit" class="add-to-cart-button mt-4">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
</body>

</html>