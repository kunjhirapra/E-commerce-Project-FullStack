<?php include 'header.php' ?>

<script type="module" src="./assets/js/cartValue.js"></script>
<div id="show-toast" class="toast-container position-fixed bottom-0 end-0" style="z-index: 1100;"></div>

<?php if (!isset($_SESSION['email'])): ?>
<!-- Not logged in - show sign in prompt -->
<section class="addToCartElement" id="addToCartElem">
  <div class="container">
    <section class="row">
      <div class="col-lg-12">
        <div class="text-center py-5">
          <i class="fa-regular fa-heart" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
          <h2 class="mb-3">Sign in to view your Wishlist</h2>
          <p class="text-muted mb-4">Create a wishlist to save your favorite items and access them anytime.</p>
          <div class="d-flex align-items-center justify-content-center gap-3">
            <a href="./signin.php" class="add-to-cart-button fs-5">
              <i class="fa-solid fa-right-to-bracket me-2"></i>Sign In
            </a>
            <a href="./signup.php" class="add-to-cart-button fs-5" style="background-color: #6c757d;">
              <i class="fa-solid fa-user-plus me-2"></i>Create Account
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</section>
<?php else: ?>
<!-- Logged in - show wishlist -->
<section class="addToCartElement" id="addToCartElem">
  <div class="container">
    <section class="row">
      <div class="col-lg-12">
        <div id="productCartContainer"></div>
      </div>
    </section>

  </div>
</section>

<template id="productCartTemplate">
  <div class="add-to-cart-card" id="cart-card-value">
    <article class="information-card p-3">
      <div class="imageContainer">
        <img class="product-img" src="" alt="" />
      </div>
      <div class="d-flex flex-column">
        <h2><a href="#" class="product-name"></a></h2>
        <p class="brand">Brand: <span class="product-brand"></span></p>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <p class="mb-0 text-nowrap">Price: <strong class="product-price"></strong></p>

        <div class="quantity-selector">
          <button class="cart-increment">+</button>
          <p class="product-quantity">1</p>
          <button class="cart-decrement">-</button>
        </div>
      </div>
      <div class="d-flex justify-content-center gap-3">
        <button class="add-to-cart-button move-to-cart-button mt-0">
          Move To Cart
        </button>
        <button class="add-to-cart-button remove-to-cart-button mt-0">
          Remove
        </button>
      </div>
    </article>
  </div>
</template>
<script>
const userId = <?php echo $_SESSION["userLogId"]; ?>
</script>
<script type="module" src="<?php echo $Base_Url; ?>/assets/js/showWishlist.js"></script>
<?php endif; ?>
<?php include 'footer.php';
include 'main-footer.php';?>