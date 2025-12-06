<?php include 'header.php'; ?>
<script type="module" src="./assets/js/cartValue.js"></script>


<section class="hero-section p-5 bg-blue">
  <h2 class="section-title-h1 text-black text-center m-5">Contact Us </h2>
</section>

<section class="section-contact py-5 bg-light">
  <div class="container">
    <!-- <h2 class="section-title-h2 text-center mb-3">Contact Us</h2> -->
    <p class="section-title-h4 text-center mb-5 text-secondary">
      Get in touch with us. We are always here to help you.
    </p>

    <div class="row align-items-start">
      <div class="col-lg-6 mb-4">
        <form action="#" class="bg-white p-4 rounded shadow-sm">
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label for="username" class="form-label fw-semibold text-capitalize">Full Name</label>
              <input type="text" class="form-control" id="username" name="username" placeholder="Enter full name"
                required autocomplete="off" />
            </div>
            <div class="col-md-6">
              <label for="email" class="form-label fw-semibold text-capitalize">Email Address</label>
              <input type="email" class="form-control" id="email" name="email" placeholder="abc@gmail.com" required
                autocomplete="off" />
            </div>
          </div>

          <div class="mb-3">
            <label for="subject" class="form-label fw-semibold text-capitalize">Subject</label>
            <input type="text" class="form-control" id="subject" name="subject" placeholder="Title of your message"
              required autocomplete="off" />
          </div>

          <div class="mb-4">
            <label for="message" class="form-label fw-semibold text-capitalize">Message</label>
            <textarea class="form-control" id="message" name="message" rows="6"
              placeholder="Give us a brief description of your message" required></textarea>
          </div>

          <div class="d-grid">
            <button type="submit" class="add-to-cart-button btn-lg text-uppercase fw-bold">Send Message</button>
          </div>
        </form>
      </div>

      <div class="col-lg-6">
        <div class="ratio ratio-4x3 rounded shadow-sm">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.493701753005!2d72.4988428760091!3d23.079016314218084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9d5d92f73005%3A0x7097a50d680e1e82!2sNSEG%20PVT.%20LTD.!5e0!3m2!1sen!2sin!4v1753146394290!5m2!1sen!2sin"
            allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            title="Company Location"></iframe>
        </div>
      </div>
    </div>
  </div>
</section>
<?php
include 'footer.php';
include 'main-footer.php';
?>