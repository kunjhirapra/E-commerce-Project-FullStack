let compareList = JSON.parse(localStorage.getItem("compareList")) || [];
let compareCategory = localStorage.getItem("compareCategory") || null;
const maxCompareItems = 4;

document.addEventListener("DOMContentLoaded", () => {
  updateCompareButton();
  bindEvents();
  renderCompareProducts();

  const productContainer = document.getElementById("product-container");
  if (productContainer) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          updateCompareIcons();
        }
      }
    });

    observer.observe(productContainer, { childList: true, subtree: true });
  }
});

function bindEvents() {
  document.addEventListener("click", (e) => {
    const compareBtn = e.target.closest(".compare-btn");
    if (compareBtn) {
      const card = compareBtn.closest(".cards");
      if (!card) return;
      const productId = card.dataset.productId;
      if (!productId) {
        console.error("No product ID found on card:", card);
        return;
      }
      toggleCompare(card, productId);
    }
  });

  const clearBtn = document.getElementById("clearCompare");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAll);
  }

  updateCompareIcons();
}

function updateCompareIcons() {
  document.querySelectorAll(".compare-btn i").forEach((icon) => {
    icon.classList.remove("active");
  });

  compareList.forEach((productId) => {
    const card = document.querySelector(
      `.cards[data-product-id="${productId}"]`
    );
    if (card) {
      const icon = card.querySelector(".compare-btn i");
      if (icon) icon.classList.add("active");
    }
  });
}

function toggleCompare(card, productId) {
  if (!productId) {
    console.error("No product ID provided");
    return;
  }

  const productCategory = card.dataset.category;
  if (!productCategory) {
    console.error("No product category found");
    return;
  }

  const index = compareList.indexOf(productId);
  const icon = card.querySelector(".compare-btn i");

  if (index === -1) {
    // Check if we already have products from a different category
    if (compareCategory && compareCategory !== productCategory) {
      showToast(
        `You can only compare products from the same category (${compareCategory}). Please clear the comparison list or select products from the ${compareCategory} category.`
      );
      return;
    }

    if (compareList.length >= maxCompareItems) {
      showToast("You can compare maximum " + maxCompareItems + " products");
      return;
    }

    // Add product to compare list
    compareList.push(productId);

    // Set the category if this is the first product
    if (compareList.length === 1) {
      compareCategory = productCategory;
      localStorage.setItem("compareCategory", compareCategory);
    }

    if (icon) icon.classList.add("active");
  } else {
    // Remove product from compare list
    compareList.splice(index, 1);

    // Clear category if no products left
    if (compareList.length === 0) {
      compareCategory = null;
      localStorage.removeItem("compareCategory");
    }

    if (icon) icon.classList.remove("active");
  }

  saveToLocalStorage();
  updateCompareButton();
  renderCompareProducts();
}

function updateCompareButton() {
  const compareButton = document.getElementById("compareButton");
  const compareCount = document.getElementById("compareCount");

  if (compareButton && compareCount) {
    if (compareList.length > 0) {
      compareButton.style.display = "block";
      compareCount.textContent = compareList.length;
    } else {
      compareButton.style.display = "none";
    }
  }
}

async function renderCompareProducts() {
  const container = document.getElementById("compareContainer");
  if (!container) return;
  container.innerHTML = "";

  if (compareList.length === 0) {
    container.innerHTML =
      '<div class="col-12"><div class="alert alert-info">No products added to compare. Add products to start comparing.</div></div>';
    return;
  }

  // Display category notification
  let categoryNotification = "";
  if (compareCategory) {
    categoryNotification = `
      <div class="col-12 mb-3">
        <div class="alert alert-success d-flex justify-content-between align-items-center">
          <span><i class="fa-solid fa-info-circle me-2"></i>Comparing products from: <strong>${compareCategory}</strong> category</span>
        </div>
      </div>
    `;
  }

  try {
    const response = await fetch(`./assets/api/fetchAllProducts.php`).then(
      (response) => response.json()
    );

    const results = compareList.map((compareId) => {
      return response.filter((product) => Number(product.id) == compareId);
    });

    console.log(results);

    // Create card-based comparison layout
    let comparisonCards = `
      <div class="col-12">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-${
          results.length
        } g-4">
          ${results
            .map((productArray) => {
              if (!productArray || !productArray[0]) return "";
              const product = productArray[0];
              console.log(product);
              return `
                <div class="col">
                  <div class="card h-100 shadow-sm compare-product-card">
                    <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle compare-remove-btn" 
                            onclick="removeProduct('${product.id}')" 
                            style="z-index: 10; width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center;">
                      <i class="fa-solid fa-times"></i>
                    </button>
                    
                    <div class="card-img-wrapper p-3 bg-light" style="height: 200px; display: flex; align-items: center; justify-content: center;">
                      <img src="./assets/images/uploads/${product.image}" 
                           class="img-fluid" 
                           style="max-height: 100%; max-width: 100%; object-fit: contain;" 
                           alt="${product.name}">
                    </div>
                    
                    <div class="card-body d-flex flex-column">
                      <h5 class="card-title text-center mb-3" style="min-height: 48px; font-size: 1rem; line-height: 1.4;">
                        ${product.name}
                      </h5>
                      
                      <ul class="list-group list-group-flush flex-grow-1">
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span class="fw-bold text-muted"><i class="fa-solid fa-tag me-2"></i>Price</span>
                          <span class="badge bg-success fs-6">$${
                            product.price
                          }</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span class="fw-bold text-muted"><i class="fa-solid fa-copyright me-2"></i>Brand</span>
                          <span class="text-dark">${product.brand}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span class="fw-bold text-muted"><i class="fa-solid fa-layer-group me-2"></i>Category</span>
                          <span class="badge bg-primary">${
                            product.category
                          }</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span class="fw-bold text-muted"><i class="fa-solid fa-palette me-2"></i>Color</span>
                          <span class="text-dark">${product.color}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                          <span class="fw-bold text-muted"><i class="fa-solid fa-box me-2"></i>Stock</span>
                          <span class="badge ${
                            product.stock > 10
                              ? "bg-success"
                              : product.stock > 0
                              ? "bg-warning"
                              : "bg-danger"
                          }">
                            ${product.stock} units
                          </span>
                        </li>
                        <li class="list-group-item px-0" style="min-height: 80px;">
                          <span class="fw-bold text-muted d-block mb-2"><i class="fa-solid fa-align-left me-2"></i>Description</span>
                          <p class="text-muted small mb-0" style="font-size: 0.875rem; line-height: 1.4;">
                            ${
                              product.description.length > 100
                                ? product.description.substring(0, 100) + "..."
                                : product.description
                            }
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;

    container.innerHTML = categoryNotification + comparisonCards;
  } catch (error) {
    console.error("Error fetching products:", error);
    container.innerHTML =
      '<div class="col-12"><div class="alert alert-danger">Error loading products. Please try again.</div></div>';
  }
}

function removeProduct(productId) {
  const index = compareList.indexOf(productId);
  if (index !== -1) {
    compareList.splice(index, 1);

    // Clear category if no products left
    if (compareList.length === 0) {
      compareCategory = null;
      localStorage.removeItem("compareCategory");
    }

    saveToLocalStorage();
    updateCompareButton();
    renderCompareProducts();

    const card = document.querySelector(
      `.cards[data-product-id="${productId}"]`
    );
    if (card) {
      const icon = card.querySelector(".compare-btn i");
      if (icon) icon.classList.remove("active");
    }
  }
}

function clearAll() {
  compareList = [];
  compareCategory = null;
  saveToLocalStorage();
  localStorage.removeItem("compareCategory");
  updateCompareButton();
  renderCompareProducts();

  document.querySelectorAll(".compare-btn i").forEach((icon) => {
    icon.classList.remove("active");
  });
}

function saveToLocalStorage() {
  localStorage.setItem("compareList", JSON.stringify(compareList));
}

function showToast(message) {
  const toastContainer = document.getElementById("show-toast");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Notice</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

window.removeProduct = removeProduct;
window.clearAll = clearAll;
