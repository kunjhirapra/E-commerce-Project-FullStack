<?php include 'header.php' ?>
<div id="show-toast" class="toast-container position-fixed bottom-0 end-0" style="z-index: 1100;"></div>

<section class="addToCartElement" id="addToCartElem">
  <div class="container">
    <section class="row">
      <div class="col-lg-9 mb-3">
        <div id="productCartContainer"></div>
      </div>
      <div class="col-lg-3">

        <section class="cartTotalElement flex-column sticky-top">
          <div class="productCartTotalElement">
            <p>Selected Offer Summary</p>
            <div class="productOrderTotal">
              <div class="d-flex justify-content-between">
                <p>Sub Total:</p>
                <p class="product-subtotal">$0</p>
              </div>
              <div class="d-flex justify-content-between">
                <p>GST(18%):</p>
                <p class="product-tax">$0</p>
              </div>
              <div class="d-flex justify-content-between">
                <p>Shipping Cost:</p>
                <p class="product-shipping">+ $5</p>
              </div>
              <hr />
              <div class="d-flex justify-content-between">
                <p>Final Total:</p>
                <p class="product-total">$0</p>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-center mt-5">
            <a href="./checkout.php" class="add-to-cart-button fs-5">Check Out</a>
          </div>
        </section>
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
          <button class="cart-decrement">-</button>
          <p class="product-quantity">1</p>
          <button class="cart-increment">+</button>
        </div>
      </div>
      <button class="add-to-cart-button remove-to-cart-button mt-0">
        Remove
      </button>
    </article>
  </div>
</template>
<script type="module" src="<?php echo $Base_Url; ?>/assets/js/showAddToCart.js"></script>
<?php include 'footer.php';
include 'main-footer.php'; ?>