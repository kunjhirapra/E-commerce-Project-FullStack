<?php include 'header.php';?>
<script type="module" src="./assets/js/cartValue.js"></script>

<section class="page-header">
  <h1 class="page-header-title">My dashboard</h1>
</section>
<section class="dashbord">
  <div class="container py-5 my-5">
    <div class="row">
      <div class="col-md-3">
        <ul class="dashboard-link-list dashboard-item-border">
          <li><a href="#" class="active">Dashboard</a></li>
          <li><a href="./my-orders.php">Orders</a></li>
          <li><a href="./my-address.php">Addresses</a></li>
          <li><a href="./my-account-details.php">Account Details</a></li>
          <li><a href="./signout.php">Signout</a></li>
        </ul>
      </div>
      <div class="col-md-9">
        <div class="dashboard-item-border p-4 user-detail-box">
          <p>
            Hello <strong><?php echo $userName ?></strong> </p>
          <p>
            From your account dashboard you can view your
            <a href="./my-orders.php">recent orders</a>, manage your
            <a href="./my-address.php">shipping and billing addresses</a>, and
            <a href="./my-account-details.php">edit your account details</a>.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<?php include 'footer.php'; 
include 'main-footer.php'; ?>