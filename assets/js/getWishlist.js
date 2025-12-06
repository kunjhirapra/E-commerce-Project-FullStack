let wishlistData;
export const getWishlist = async () => {
  if (IS_LOGGED_IN) {
    wishlistData = await fetch("./assets/api/getFromWishlist.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    return wishlistData;
  } else {
    window.location.href = "signin.php";
  }
};
