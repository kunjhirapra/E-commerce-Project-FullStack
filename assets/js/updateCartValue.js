import { getFromLocal, updateCartValue } from "./getFromLocal.js";

export const updateCart = () => {
  if (IS_LOGGED_IN) {
    fetch("./assets/api/getFromCart.php")
      .then((res) => res.json())
      .then((data) => {
        updateCartValue(data);
      });
  } else {
    const localStorageData = getFromLocal();
    updateCartValue(localStorageData);
  }
};
updateCart();
