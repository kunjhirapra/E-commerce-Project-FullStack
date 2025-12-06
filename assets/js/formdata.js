import { resetCurrentPage, showProductCard } from "./product-card.js";

let products = [];
let filteredProducts = [];

const searchInput = document.getElementById("search");
const form = document.getElementById("categoryForm");
const resetBtn = document.getElementById("resetBtn");
const rangeInput = document.getElementById("price");
const startPrice = document.querySelector(".min-price");
const endPrice = document.querySelector(".max-price");

let minPrice = 0;
let maxPrice = 0;

export const productsPromise = fetch("assets/api/api.php").then((res) =>
  res.json()
);

productsPromise.then((data) => {
  products = data;
  filteredProducts = [...products];
  setPriceRange();
  filterProducts();
});

function setPriceRange() {
  const priceList = products.map((product) => Number(product.price));
  minPrice = Math.min(...priceList);
  maxPrice = Math.max(...priceList);

  rangeInput.min = minPrice.toFixed(0);
  rangeInput.max = maxPrice.toFixed(0);
  rangeInput.value = maxPrice.toFixed(0);

  startPrice.textContent = `$${minPrice.toFixed(0)}`;
  endPrice.textContent = `$${maxPrice.toFixed(0)}`;

  rangeInput.addEventListener("input", () => {
    endPrice.textContent = `$${rangeInput.value}`;
  });
}

function filterProducts() {
  const formData = new FormData(form);
  const searchTerm = searchInput.value
    .trim()
    .replace(/[\s-]+/g, "")
    .toLowerCase();

  const selectedCategories = [];
  for (const [key, value] of formData.entries()) {
    if (key !== "price" && (value === "on" || !isNaN(Number(value)))) {
      selectedCategories.push(key);
    }
  }

  const priceFilter = formData.get("price") || maxPrice;

  filteredProducts = products.filter((product) => {
    const categoriesMatch = selectedCategories.every((category) =>
      Object.values(product).includes(category)
    );
    const priceMatch = Number(product.price) <= Number(priceFilter);
    const productName = product.name.replace(/[\s-]+/g, "").toLowerCase();
    const searchMatch = productName.includes(searchTerm);

    return categoriesMatch && priceMatch && searchMatch;
  });

  if (filteredProducts.length > 0) {
    resetCurrentPage();
    showProductCard(filteredProducts);
  } else {
    showToast(
      `No data found! Please select <strong><em>a valid filter</em></strong>.`
    );
  }
}

function showToast(message, type = "error", duration = 3000) {
  const container = document.getElementById("show-toast");
  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white ${
    type === "error" ? "bg-danger" : "bg-success"
  } border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
  }, duration);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  filterProducts();
});

searchInput.addEventListener("input", () => {
  filterProducts();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  searchInput.value = "";
  rangeInput.value = maxPrice.toFixed(0);
  endPrice.textContent = `$${maxPrice.toFixed(0)}`;
  filteredProducts = [...products];
  resetCurrentPage();
  showProductCard(products);
});
