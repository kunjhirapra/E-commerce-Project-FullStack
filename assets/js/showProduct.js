import { addToCart } from "./addToCart.js";
import { addTowishlist } from "./addToWishlist.js";
import { quantityToggle } from "./quantity-manipulation.js";

async function loadProduct() {
  const container = document.getElementById("product-details");
  const template = document.getElementById("product-template");

  const params = new URLSearchParams(window.location.search);
  const productName = params.get("name");

  if (!productName) {
    container.textContent = "No product specified.";
    return;
  }
  try {
    const response = await fetch("./assets/api/api.php");
    if (!response.ok) {
      container.textContent = "Failed to load product data.";
      return;
    }
    const allProducts = await response.json();

    const product = allProducts.find((p) => p.name === productName);

    if (!product) {
      container.textContent = "Product not found.";
      return;
    }
    const currentProduct = document.importNode(template.content, true);
    const wishBtn = currentProduct.querySelector(".wish-btn");
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
    console.log(product);
    currentProduct
      .querySelector("#card-value")
      .setAttribute("id", `card-${id}`);
    currentProduct.querySelector(".product-name").textContent = name;
    currentProduct.querySelector(
      ".product-img"
    ).src = `${baseUrl}/assets/images/uploads/${image}`;
    currentProduct.querySelector(".product-img").alt = name;

    currentProduct.querySelector(".product-brand").textContent = brand;
    currentProduct.querySelector(".product-category").textContent = category;
    currentProduct.querySelector(".product-color").textContent = color;
    currentProduct.querySelector(".new-price").textContent =
      "$" + Number(price).toFixed(2);
    currentProduct.querySelector(".old-price").textContent =
      " $" + (price * 3).toFixed(2);
    currentProduct.querySelector(".product-stock").textContent = stock;
    currentProduct.querySelector(".product-description").textContent =
      description;

    currentProduct
      .querySelector(".quantity-selector")
      .addEventListener("click", (event) => {
        quantityToggle(event, id, stock, price);
      });
    currentProduct
      .querySelector(".shopping-button")
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
    container.innerHTML = "";
    container.appendChild(currentProduct);
  } catch (error) {
    container.textContent = "Failed to load product data.";
    console.error(error);
  }
}

loadProduct();
