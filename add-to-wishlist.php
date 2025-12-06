<?php include 'header.php' ?>

<script type="module" src="./assets/js/cartValue.js"></script>
<div id="show-toast" class="toast-container position-fixed bottom-0 end-0" style="z-index: 1100;"></div>

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
<?php include 'footer.php';
include 'main-footer.php';?>