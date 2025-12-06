let compareList = JSON.parse(localStorage.getItem("compareList")) || [];
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

    observer.observe(productContainer, {childList: true, subtree: true});
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

  const index = compareList.indexOf(productId);
  const icon = card.querySelector(".compare-btn i");

  if (index === -1) {
    if (compareList.length >= maxCompareItems) {
      showToast("You can compare maximum " + maxCompareItems + " products");
      return;
    }
    compareList.push(productId);
    if (icon) icon.classList.add("active");
  } else {
    compareList.splice(index, 1);
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

  try {
    const response = await fetch(`./assets/api/fetchAllProducts.php`).then(
      (response) => response.json()
    );

    const results = compareList.map((compareId) => {
      return response.filter((product) => product.id == compareId);
    });

    let comparisonTable = `
            <div class="table-responsive">
                <table class="table table-bordered compare-table">
                    <thead>
                        <tr>
                            <th class="d-flex">Feature</th>
                            ${results
                              .map((productArray) => {
                                if (!productArray || !productArray[0])
                                  return "";
                                const product = productArray[0];
                                return `<th>
                                <button class="btn btn-danger btn-sm float-end mb-2" onclick="removeProduct('${product.id}')">
                                    <i class="fa-solid fa-times"></i>
                                </button>
                                    <div class="d-flex flex-column align-items-center">
                                    <img src="./assets/images/uploads/${product.image}" class="img-fluid mb-2" style="max-height: 100px" alt="${product.name}">
                                    <br>${product.name}
                                    </div>
                                </th>`;
                              })
                              .join("")}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Price</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>$${productArray[0].price}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                        <tr>
                            <td><strong>Brand</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>${productArray[0].brand}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                        <tr>
                            <td><strong>Category</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>${productArray[0].category}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                        <tr>
                            <td><strong>Color</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>${productArray[0].color}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                        <tr>
                            <td><strong>Stock</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>${productArray[0].stock}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                        <tr>
                            <td><strong>Description</strong></td>
                            ${results
                              .map((productArray) =>
                                productArray && productArray[0]
                                  ? `<td>${productArray[0].description}</td>`
                                  : "<td>N/A</td>"
                              )
                              .join("")}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

    container.innerHTML = comparisonTable;
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
  saveToLocalStorage();
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
