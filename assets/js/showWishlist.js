import { getWishlist } from "./getWishlist.js";
import { showToast } from "./showToast.js";
console.log(userId);
let cartProducts = await getWishlist();
if (cartProducts.length === 0 || !cartProducts) {
  window.location.href = "product.php";
}
const productCartContainer = document.querySelector("#productCartContainer");
const productCartTemplate = document.querySelector("#productCartTemplate");
const addToCartElement = document.querySelector("#addToCartElem .row");
const quantityChange = async (event, id, stock, price) => {
  const currentElem = document.querySelector(`#card-${id}`);
  const productQuantityElem = currentElem.querySelector(".product-quantity");
  const productPriceElem = currentElem.querySelector(".product-price");

  let cartProducts = await getWishlist();
  console.log(cartProducts);
  let existingProduct = cartProducts.find((item) => item.id === id);
  let quantity = existingProduct.productQuantity;
  if (IS_LOGGED_IN) {
    existingProduct = cartProducts.find((item) => item.id === Number(id));
    quantity = parseInt(existingProduct.productQuantity);
  }
  if (event.target.classList.contains("cart-increment")) {
    if (quantity < stock) quantity++;
  } else if (event.target.classList.contains("cart-decrement")) {
    if (quantity > 1) quantity--;
  }
  const newPrice = String(price * quantity);
  if (IS_LOGGED_IN) {
    $.ajax({
      url: "./assets/api/add_to_wishlist.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        product_id: id,
        quantity: quantity,
      }),
      success: function (data) {},
      error: function (xhr, status, error) {
        console.error("AJAX Error:", status, error);
        alert("Failed to update cart. Please try again.");
      },
    });
  }

  productQuantityElem.innerText = quantity;
  productQuantityElem.setAttribute("data-quantity", quantity);
  productPriceElem.innerText = `$${newPrice}.00`;
  return quantity;
};
async function showCartProduct() {
  let products = [];
  const res = await fetch("/assets/api/api.php");
  products = await res.json();

  if (cartProducts.length === 0) {
    addToCartElement.innerHTML = "";
    const emptyCart = document.createElement("div");
    emptyCart.innerHTML = `<h2 class="text-center">Cart is Empty Please select an item...</h2>
    <div class="d-flex align-items-center justify-content-center mt-5">
    <a href="./product.php" class="add-to-cart-button fs-5"><i class="fa-solid fa-cart-shopping me-2">
            </i><span>Go to Shop</span></a>
  </div>`;
    addToCartElement.append(emptyCart);
    return;
  }

  let filterProducts = products.filter((product) => {
    return cartProducts.some((cartItem) => String(cartItem.id) === product.id);
  });
  productCartContainer.innerHTML = "";

  filterProducts.forEach((productItems) => {
    let { id, name, category, brand, price, image, stock } = productItems;
    id = Number(id);
    const filterProductClone = document.importNode(
      productCartTemplate.content,
      true
    );

    const cartProductItems = cartProducts.find((elem) => elem.id === id);
    const filterProductQuantity =
      filterProductClone.querySelector(".product-quantity");
    const filterProductCategory = filterProductClone.querySelector(".category");
    const filterQuantitySelector =
      filterProductClone.querySelector(".quantity-selector");
    const cloneRemoveBtn = filterProductClone.querySelector(
      ".remove-to-cart-button"
    );
    const MoveToCartBtn = filterProductClone.querySelector(
      ".move-to-cart-button"
    );
    filterProductClone
      .querySelector("#cart-card-value")
      .setAttribute("id", `card-${id}`);
    filterProductClone.querySelector(".product-name").textContent = name;

    filterProductClone.querySelector(".product-brand").textContent = brand;
    filterProductClone.querySelector(".product-price").textContent =
      "$" + price * cartProductItems.productQuantity + ".00";
    if (filterProductCategory) {
      filterProductCategory.textContent = category;
    }
    if (filterProductQuantity) {
      filterProductQuantity.textContent = cartProductItems.productQuantity;
    }
    filterProductClone.querySelector(
      ".product-img"
    ).src = `${baseUrl}/assets/images/uploads/${image}`;

    if (filterQuantitySelector) {
      filterQuantitySelector.addEventListener("click", (event) => {
        quantityChange(event, Number(id), stock, price);
      });
    }

    filterProductClone
      .querySelector(".product-name")
      .addEventListener("click", () => {
        window.location.href = `show-product.php?name=${name}`;
      });
    if (MoveToCartBtn) {
      MoveToCartBtn.addEventListener("click", async () => {
        cartProducts = await getWishlist();
        console.log(cartProducts);
        console.log("id" + id);
        if (!cartProducts || cartProducts.length === 1) {
          window.location.href = "add-to-cart.php";
        }
        let removeDiv = document.querySelector(`#card-${id}`);
        console.log(removeDiv);
        if (removeDiv) {
          showToast("delete", id);
          removeDiv.remove();
        }
        $.ajax({
          url: "./assets/api/move_to_Cart.php",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            product_id: id,
          }),
          success: function (data) {},
        });
      });
    }

    if (cloneRemoveBtn) {
      cloneRemoveBtn.addEventListener("click", async () => {
        cartProducts = await getWishlist();
        if (!cartProducts || cartProducts.length === 1) {
          window.location.href = "product.php";
        }
        let removeDiv = document.querySelector(`#card-${id}`);
        console.log(removeDiv);
        if (removeDiv) {
          showToast("delete", id);
          removeDiv.remove();
        }
        if (IS_LOGGED_IN) {
          $.ajax({
            url: "./assets/api/remove_wishlist_product.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              product_id: id,
            }),
            success: function (data) {},
          });
        } else {
          window.location.href = "signin.php";
        }
      });
    }

    productCartContainer.append(filterProductClone);
  });
}

showCartProduct();
