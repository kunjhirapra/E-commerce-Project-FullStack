const resetCurrentPage = () => {
  currentPage = 1;
};

const allProductsApi = fetch("assets/api/api.php").then((res) => res.json());
const tbody = document.querySelector("tbody");
const paginationContainer = document.getElementById("paginationContainer");
const itemsPerPage = 10;

const form = document.getElementById("filterForm");
const resetBtn = document.getElementById("resetBtn");

const rangeInput = document.getElementById("price");
const startPrice = document.querySelector(".min-price");
const endPrice = document.querySelector(".max-price");

let currentPage = 1;
let allProducts = [];
let displayedProducts = [];

const renderTable = (products) => {
  console.log(products);
  tbody.innerHTML = products.length
    ? products
        .map((p) => {
          const dateOnly = p.is_deleted
            ? new Date(p.is_deleted).toISOString().split("T")[0]
            : null;

          // Encode the product name for safe URL usage
          const encodedName = encodeURIComponent(p.name);

          return `  
            <tr>
              <td class="text-start">
                <img src="../assets/images/uploads/${
                  p.image
                }" style="max-width:60px" alt="${p.name}">
              </td>
              <td class="text-start">
                <a href="../show-product.php?name=${encodedName}" class="product-name">${
            p.name
          }</a>
              </td>
              <td>${p.brand}</td>
              <td>${p.category}</td>
              <td>$${p.price}</td>
              <td>${p.stock}</td>
              <td class="${p.color}">${p.color}</td> 
              <td>
                ${
                  p.is_deleted === null
                    ? `<label class="switch">
                        <input type="checkbox" id="productState-${p.id}" ${
                        Number(p.is_active) === 1 ? "checked" : ""
                      }>
                        <span class="slider rounded-5"></span>
                      </label>`
                    : `<span class="text-danger d-flex flex-column">deleted on <span>${dateOnly}</span></span>`
                }
              </td>
              <td class="text-center">
                <button class="dropdown-list-menu">
                  <span>Action</span><i class="fa-solid fa-angle-down"></i>
                </button>
                <ul class="dropdown-list">
                  <li>
                    <a href="./edit-product.php?q=${
                      p.id
                    }" data-product-id="product-${
            p.id
          }" class="dropdown-btn edit-product-btn">edit</a> 
                  </li>
                  <li>
                    <a href="./assets/api/deleteProduct.php?id=${
                      p.id
                    }" data-product-id="product-${
            p.id
          }" class="dropdown-btn delete-btn">Delete</a>
                  </li>
                </ul> 
              </td> 
            </tr>`;
        })
        .join("")
    : `<tr><td colspan="9">No products found.</td></tr>`;

  // Add click event listeners to product names for navigation
  tbody.querySelectorAll(".product-name").forEach((name) => {
    name.addEventListener("click", (e) => {
      e.preventDefault();
      const productName = name.textContent;
      window.location.href = `../show-product.php?name=${encodeURIComponent(
        productName
      )}`;
    });
  });

  // Add change event listeners to checkboxes to toggle product state
  tbody.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const productId = e.target.id.split("-")[1];
      const isActive = e.target.checked ? 1 : 0;
      try {
        await fetch(
          `./assets/api/updateProductState.php?id=${productId}&is_active=${isActive}`,
          {
            method: "POST",
          }
        );
      } catch (error) {
        console.error("Error updating product state:", error);
      }
    });
  });
};

const renderPages = (list, page = 1) => {
  if (list.length === 0) {
    renderTable([]);
    paginationContainer.innerHTML = "";
    return;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = list.slice(startIndex, startIndex + itemsPerPage);

  renderTable(paginatedItems);
  renderPagination(list.length);
};

const renderPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagesPerBlock = 4;
  const blockStart =
    Math.floor((currentPage - 1) / pagesPerBlock) * pagesPerBlock + 1;
  const blockEnd = Math.min(blockStart + pagesPerBlock - 1, totalPages);

  paginationContainer.innerHTML = "";

  const createButton = (text, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    btn.addEventListener("click", onClick);
    return btn;
  };

  paginationContainer.appendChild(
    createButton("Previous", blockStart === 1, () => {
      if (blockStart > 1) {
        currentPage = blockStart - 1;
        renderPages(displayedProducts, currentPage);
      }
    })
  );

  for (let i = blockStart; i <= blockEnd; i++) {
    const pageBtn = createButton(i, false, () => {
      currentPage = i;
      renderPages(displayedProducts, currentPage);
    });
    if (i === currentPage) pageBtn.classList.add("active");
    paginationContainer.appendChild(pageBtn);
  }

  paginationContainer.appendChild(
    createButton("Next", blockEnd === totalPages, () => {
      if (blockEnd < totalPages) {
        currentPage = blockEnd + 1;
        renderPages(displayedProducts, currentPage);
      }
    })
  );
};

const showToast = (message, type = "error", duration = 3000) => {
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
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toast);

  toast.querySelector(".btn-close").addEventListener("click", () => {
    toast.classList.remove("show");
    toast.classList.add("hide");
  });

  setTimeout(() => toast.classList.add("hide"), duration);
};

const setPriceRange = (products) => {
  if (!rangeInput) return;

  const prices = products.map((p) => Number(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  rangeInput.min = min.toFixed(0);
  rangeInput.max = max.toFixed(0);
  rangeInput.value = max.toFixed(0);

  startPrice.textContent = `$${min.toFixed(0)}`;
  endPrice.textContent = `$${max.toFixed(0)}`;

  rangeInput.addEventListener("input", function () {
    endPrice.textContent = `$${this.value}`;
  });
};

const applyFilters = (products, filterData) => {
  const {price, ...categories} = filterData;

  const selectedCategories = Object.keys(categories).filter(
    (key) => categories[key] === "on" || !isNaN(Number(categories[key]))
  );

  let filtered = products.filter((product) =>
    selectedCategories.every(
      (cat) =>
        product.brand === cat ||
        product.category === cat ||
        product.color === cat
    )
  );

  return filtered.filter((product) => Number(product.price) <= Number(price));
};

const handleFormSubmit = (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const filterData = Object.fromEntries(data.entries());

  const filtered = applyFilters(allProducts, filterData);

  if (filtered.length > 0) {
    resetCurrentPage();
    displayedProducts = filtered;
    renderPages(displayedProducts, currentPage);
  } else {
    showToast(
      `No data Found!! Please select <strong><em>a Valid Filter</em></strong>.`
    );
  }
};

const handleReset = () => {
  form.reset();
  const max = rangeInput?.max;
  if (rangeInput && max) {
    rangeInput.value = max;
    endPrice.textContent = `$${max}`;
  }
  currentPage = 1;
  displayedProducts = [...allProducts];
  renderPages(displayedProducts, currentPage);
};

const setupEventListeners = () => {
  if (form) form.addEventListener("submit", handleFormSubmit);
  if (resetBtn) resetBtn.addEventListener("click", handleReset);
};

const init = async () => {
  try {
    const data = await allProductsApi;

    allProducts = data;
    displayedProducts = [...allProducts];
    setPriceRange(allProducts);
    setupEventListeners();
    renderPages(displayedProducts, currentPage);
  } catch (err) {
    showToast("Failed to load products.", "error");
  }
};
init();
