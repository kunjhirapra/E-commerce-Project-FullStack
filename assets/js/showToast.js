let toastTimeout;

export const showToast = (operation, id) => {
  // if (document.querySelector(".toast")) {
  //   document.querySelector(".toast").classList.add("d-none");
  // }
  const toastContainer = document.getElementById("show-toast");
  const currentElem = document.querySelector(`#card-${id}`);
  const name = currentElem.querySelector(".product-name")?.textContent;
  const toastElem = document.createElement("div");
  let message;
  toastElem.className = "toast align-items-center show mb-2 bg-white";

  if (operation === "add") {
    message = `
    <p class="toast-text mb-0">Product with <strong>Name:</strong> <em>"${name}"</em> has been added to your cart.</p>
    <a href="add-to-cart.php"
    class="nav-link add-to-cart-button mt-0 toast-btn d-inline-flex justify-content-end align-items-center"
    id="cart-value"><span>Go To Cart </span>
    <i class="fa-solid fa-arrow-right-long mx-2"></i>
    <span>
    <i class="fa-solid fa-cart-shopping"></i>
    </span>
    </a>`;
  } else if (operation === "add-wish") {
    message = `<p class="toast-text mb-0">Product with <strong>Name:</strong> <em>"${name}"</em> has been added to your <strong>Wishlist.</strong></p>
    <a href="add-to-wishlist.php"
    class="nav-link add-to-cart-button mt-0 toast-btn d-inline-flex justify-content-end align-items-center"
    id="cart-value"><span>Go To Wishlist </span>
    <i class="fa-solid fa-arrow-right-long mx-2"></i>
    </a>`;
  } else {
    message = `<p class="error-toast mb-0">Product with <strong>Name:</strong> <em>"${name}"</em> has been <strong>Removed.</strong></p>`;
  }

  toastElem.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="btn-close me-2 m-auto"></button>
    </div>
  `;

  toastContainer.appendChild(toastElem);

  toastElem.querySelector(".btn-close").addEventListener("click", () => {
    toastElem.classList.remove("show");
    toastElem.classList.add("hide");
  });

  toastTimeout = setTimeout(() => {
    toastElem.classList.remove("show");
    toastElem.classList.add("hide");
    setTimeout(() => toastElem.remove(), 300);
  }, 3000);
};
