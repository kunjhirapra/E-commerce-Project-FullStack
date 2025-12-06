import { showToast } from "./showToast.js";

export const addTowishlist = (event, id) => {
  const currentElem = document.querySelector(`#card-${id}`);
  let productQuantity = Number(
    currentElem.querySelector(".product-quantity").innerText
  );
  if (IS_LOGGED_IN) {
    fetch("./assets/api/add_to_wishlist.php", {
      method: "POST",
      body: JSON.stringify({
        product_id: id,
        quantity: productQuantity,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        showToast("add-wish", id);
      });
  } else {
    window.location.href = "signin.php";
  }
};
