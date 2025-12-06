const productsPromise = fetch("./admin/assets/api/orderList.php").then((res) =>
  res.json()
);

const flattenOrders = (orders) => {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderInfo: {
        order_id: order.order_id,
        user_img: order.user_img,
        username: order.username,
        user_email: order.user_email,
        order_date: order.order_date,
        payment_type: order.payment_type,
        status: order.order_status,
      },
    }))
  );
};
const tbody = document.querySelector("tbody");

const renderTable = (items) => {
  const seenUserIds = {};
  const uniqueRow = items.filter((item) => {
    const userId = item.orderInfo.order_id;
    const userEmail = item.orderInfo.user_email;
    if (!seenUserIds[userId] && newEmail == userEmail) {
      seenUserIds[userId] = true;
      return true;
    }
    return false;
  });
  tbody.innerHTML = uniqueRow.length
    ? uniqueRow
        .map(
          (item) => `
          <tr>
            <td>${item.orderInfo.order_id}</td>
            <td class="d-flex-align-items-center justify-content-center gap-2">
              <img src="./assets/images/user-sign-up-uploads/${
                item.orderInfo.user_img
              }" alt="${item.orderInfo.username}" width="40"/>
              <span class="">${item.orderInfo.username}</span>
            </td>
            <td class="text-nowrap">${item.orderInfo.order_date}</td>
            <td class="text-center">${item.orderInfo.payment_type.toUpperCase()}</td>
            <td class="text-center"><span class="badge ${
              item.orderInfo.status
            }">${item.orderInfo.status}</span></td>
            <td>
                  
          <a href="./return-your-order.php?q=${
            item.orderInfo.order_id
          }" data-order-id="order-${
            item.orderInfo.order_id
          }" class="add-to-cart-button view-btn">View</a>
               
            </td>
          </tr>
        `
        )
        .join("")
    : "<tr><td colspan='7'>No records found.</td></tr>";
};

const showToast = (message, type = "error", duration = 3000) => {
  const container = document.getElementById("show-toast");
  container.innerHTML = "";

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white ${
    type === "error" ? "bg-danger" : "bg-success"
  } border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toast);

  toast.querySelector(".btn-close").addEventListener("click", () => {
    toast.classList.remove("show");
    toast.classList.add("hide");
  });

  setTimeout(() => toast.classList.add("hide"), duration);
};

const init = async () => {
  try {
    const data = await productsPromise;

    let allProducts = flattenOrders(data);
    renderTable(allProducts);
  } catch (err) {
    showToast("Failed to load products.", "error");
  }
};
init();
