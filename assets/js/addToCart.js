import {getFromLocal, updateCartValue} from "./getFromLocal.js";
import {showToast} from "./showToast.js";
import {updateCart} from "./updateCartValue.js";

export const addToCart = (event, id) => {
  const currentElem = document.querySelector(`#card-${id}`);

  let productQuantity = Number(
    currentElem.querySelector(".product-quantity").innerText
  );
  if (IS_LOGGED_IN) {
    console.log(id, productQuantity);
    fetch("./assets/api/add_to_cart_product.php", {
      method: "POST",
      body: JSON.stringify({product_id: id, quantity: productQuantity}),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateCart();
        showToast("add", id);
      });
  } else {
    getFromLocal().then((localStorageData) => {
      if (!currentElem) return;

      let itemPrice = currentElem
        .querySelector(".new-price")
        .textContent.trim();
      itemPrice = parseFloat(itemPrice.replace("$", "")) || 0;

      let existingProduct = localStorageData.find((item) => item.id === id);

      if (existingProduct) {
        existingProduct.productQuantity += productQuantity;
        existingProduct.productPrice = parseFloat(
          (existingProduct.productQuantity * itemPrice).toFixed(2)
        );

        localStorage.setItem("cartProducts", JSON.stringify(localStorageData));
        showToast("add", id);
        return;
      }
      localStorageData.push({
        id: Number(id),
        productQuantity,
        productPrice: parseFloat((itemPrice * productQuantity).toFixed(2)),
      });
      localStorage.setItem("cartProducts", JSON.stringify(localStorageData));
      // console.log(localStorageData.length);
      updateCartValue(localStorageData);
      showToast("add", id);
    });
  }
};
