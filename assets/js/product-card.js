import { addToCart } from "./addToCart.js";
import { addTowishlist } from "./addToWishlist.js";
import { quantityToggle } from "./quantity-manipulation.js";

const productContainer = document.querySelector("#product-container");
const productTemplate = document.querySelector("#product-template");
const paginationContainer = document.querySelector("#pagination-container");

let currentPage = 1;
export const resetCurrentPage = () => {
  currentPage = 1;
};

const itemsPerPage = 4;
let allProducts = [];

export const showProductCard = (products) => {
  if (!productTemplate) return;
  allProducts = products;

  productContainer.innerHTML = "";

  if (!products || products.length < 1) {
    productContainer.innerHTML = `
    <h2 class="section-title-h2 text-danger text-center z-3">No such Product is Available</h2>`;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const visibleProducts = products.slice(start, end);

  visibleProducts.forEach((product) => {
    const {
      id,
      name,
      category,
      brand,
      price,
      stock,
      image,
      description,
      color,
      active,
    } = product;
    const productClone = document.importNode(productTemplate.content, true);
    const wishBtn = productClone.querySelector(".wish-btn");
    const cardElement = productClone.querySelector("#card-value");
    cardElement.setAttribute("id", `card-${id}`);
    cardElement.setAttribute("data-product-id", id);
    cardElement.setAttribute("data-category", category);
    productClone.querySelector(".product-name").textContent = name;
    productClone.querySelector(".category").textContent = category;
    productClone.querySelector(".color").textContent = color;
    productClone.querySelector(".product-brand").textContent = brand;
    productClone.querySelector(".new-price").textContent = "$" + price;
    productClone.querySelector(".old-price").textContent =
      "$" + (price * 4).toFixed(2);
    productClone.querySelector(".product-stock").textContent = stock;
    productClone.querySelector(
      ".product-img"
    ).src = `./assets/images/uploads/${image}`;
    productClone.querySelector(".product-desc").textContent = description;

    productClone
      .querySelector(".product-name")
      .addEventListener("click", () => {
        window.location.href = `show-product.php?name=${name}`;
      });

    productClone
      .querySelector(".quantity-selector")
      .addEventListener("click", (event) => {
        quantityToggle(event, id, stock);
      });

    productClone
      .querySelector(".add-btn")
      .addEventListener("click", (event) => {
        addToCart(event, id);
      });
    if (wishBtn) {
      if (active) {
        wishBtn.classList.add("active");
      }
      wishBtn.addEventListener("click", (event) => {
        addTowishlist(event, id);
        wishBtn.classList.add("active");
      });
    }

    productContainer.appendChild(productClone);
  });

  pagination(products.length);
};

// export const pagination = (totalItems) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   paginationContainer.innerHTML = "";
//   const maxpage = 5;
//   let startpage = 1;
//   let endpage = maxpage;

//   const prevBtn = document.createElement("button");
//   prevBtn.textContent = "Previous";
//   prevBtn.disabled = currentPage === 1;
//   prevBtn.addEventListener("click", () => {
//    currentPage--;
//     showProductCard(allProducts);
//   });
//   paginationContainer.appendChild(prevBtn);

//   for (let i = startpage; i <= endpage; i++) {
//     const pageBtn = document.createElement("button");
//     pageBtn.textContent = i;
//     if (i === currentPage) {
//       pageBtn.classList.add("active");
//     }

//     pageBtn.addEventListener("click", () => {
//       currentPage = i;
//       showProductCard(allProducts);
//     });

//     paginationContainer.appendChild(pageBtn);
//   }

//   const nextBtn = document.createElement("button");
//   nextBtn.textContent = "Next";
//   nextBtn.disabled = currentPage === totalPages;
//   nextBtn.addEventListener("click", () => {
//   currentPage++;
//     showProductCard(allProducts);
//   });
//   paginationContainer.appendChild(nextBtn);
// };
export const pagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  paginationContainer.innerHTML = "";

  const maxVisiblePages = 5;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showProductCard(allProducts);
    }
  });
  paginationContainer.appendChild(prevBtn);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    if (i === currentPage) {
      pageBtn.classList.add("active");
    }

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      showProductCard(allProducts);
    });

    paginationContainer.appendChild(pageBtn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showProductCard(allProducts);
    }
  });
  paginationContainer.appendChild(nextBtn);

  const currentPageNo = document.getElementById("currentPageNo");
  const totalPageNo = document.getElementById("totalPageNo");
  currentPageNo.innerText = currentPage;
  totalPageNo.innerText = totalPages;
};
