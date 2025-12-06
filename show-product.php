<?php include 'header.php'; ?>
<script type="module" src="./assets/js/cartValue.js"></script>

<div id="show-toast" class="toast-container bg-white position-fixed bottom-0 end-0" style="z-index: 1100;"></div>

<section class="show-product-page mt-5">
  <div class="container ">
    <div class="row">
      <div id="product-details"></div>
    </div>
  </div>
</section>

<template id="product-template">
  <div class="product-card" id="card-value">

    <div class="row product-container">
      <div class="col-6">
        <div class="img-box me-5">
          <div class="card-image-box position-relative">
            <img src="" alt="" class="product-img" />
            <a href="javascript:void(0)" class="wish-btn">
              <i class="fa-solid fa-heart"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="h-100 d-flex flex-column justify-content-evenly ms-2">
          <p class="brand"><strong>Brand:</strong><span class="product-brand"></span></p>
          <h2 class="product-name"></h2>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <p><span class="product-category category"></span> <span class="product-color color"></span></p>
          <p class="product-price">Total Price: <span class="new-price"></span><span class="old-price"></span></p>
          <p>Total Stocks Available: <span class="product-stock">55</span></p>
          <p><span class="product-description"></span></p>
          <div class="quantity-container">
            <p class="quantity mb-0 me-3">Quantity(Pieces)</p>
            <div class="quantity-selector">
              <button class="cart-increment">+</button>
              <p class="product-quantity">1</p>
              <button class="cart-decrement">-</button>
            </div>
          </div>
          <button class="add-to-cart-button shopping-button">
            <i class="fa-solid fa-cart-shopping"></i> <span> Add To Cart</span>
          </button>
          <button class="add-to-cart-button">
            <i class="fa-solid fa-cart-shopping"></i> <span>Buy It Now</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<div class="container my-5">
  <!-- Description Section -->
  <section class="description mb-5">
    <h2 class="section-title">About Our Store</h2>
    <p class="">
      Welcome to <strong>ecommerce</strong>, your one-stop online shop for quality products at great prices. We are
      committed to providing a seamless shopping experience with a wide range of categories, secure payments, and fast
      shipping.
    </p>
    <p>
      Our goal is to offer outstanding customer service and ensure your satisfaction every step of the way. Browse our
      selection and enjoy exclusive deals and offers regularly.
    </p>
  </section>

  <!-- Privacy Policy Section -->
  <section class="privacy-policy">
    <h2 class="section-title">Privacy Policy</h2>
    <p>
      At <strong>ecommerce</strong>, your privacy is our priority. We collect only the necessary information to
      process your orders and provide personalized services.
    </p>
    <p>
      <strong>Information Collection:</strong> We collect personal data such as your name, email, shipping address, and
      payment details securely through our encrypted platform.
    </p>
    <p>
      <strong>Data Usage:</strong> Your information is used solely for order fulfillment, customer support, and
      improving your shopping experience. We never sell or share your data with third parties without your explicit
      consent.
    </p>
    <p>
      <strong>Cookies:</strong> We use cookies to enhance website functionality and provide personalized content. You
      can manage cookie preferences in your browser settings.
    </p>
    <p>
      <strong>Security:</strong> We implement industry-standard security measures to protect your data from unauthorized
      access.
    </p>
    <p>
      If you have any questions about our privacy practices, please contact our support team at <a
        href="mailto:support@ecommerce.com">support@ecommerce.com</a>.
    </p>
  </section>
</div>
<script type="module" src="<?php echo $Base_Url; ?>/assets/js/showProduct.js"></script>
<?php include 'footer.php';
include 'main-footer.php';?>