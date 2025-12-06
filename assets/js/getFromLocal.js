let cachedCartData;

export const getFromLocal = async () => {
  if (IS_LOGGED_IN) {
    cachedCartData = await fetch("./assets/api/getFromCart.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        updateCartValue(data);
        return data;
      });
    return cachedCartData;
  } else {
    let data = localStorage.getItem("cartProducts");

    if (!data) return [];

    data = JSON.parse(data);

    if (!Array.isArray(data)) {
      localStorage.setItem("cartProducts", JSON.stringify([]));
      return [];
    }
    updateCartValue(data);
    // console.log("getFromLocal: " + data);
    return data;
  }
};

const cartValue = document.querySelector(".cart-item-quantity");

export const updateCartValue = (cartProducts) => {
  if (!cartValue) return;

  if (IS_LOGGED_IN) {
    if (Array.isArray(cartProducts)) {
      cartValue.innerText = cartProducts.length;
    }
  } else {
    if (cartProducts.length) {
      cartValue.innerText = cartProducts.length;
    }
  }
};
