const resetCurrentPage = () => {
  currentPage = 1;
};

const productsPromise = fetch("./assets/api/orderList.php").then((res) =>
  res.json()
);
const paginationContainer = document.getElementById("paginationContainer");
const itemsPerPage = 10;

let currentPage = 1;
let allProducts = [];
let displayedItems = [];

const flattenOrders = (orders) => {
  return orders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderInfo: {
        order_id: order.order_id,
        user_img: order.user_img,
        username: order.username,
        order_date: order.order_date,
        payment_type: order.payment_type,
        status: order.order_status,
      },
    }))
  );
};
const tbody = document.querySelector("tbody");

const renderTable = (items) => {
  tbody.innerHTML = items.length
    ? items
        .map(
          (item) => `
          <tr>
            <td>${item.orderInfo.order_id}</td>
            <td class="text-start text-nowrap">
              <img src="../assets/images/user-sign-up-uploads/${
                item.orderInfo.user_img
              }" alt="${item.orderInfo.username}" width="40"/>
              <span class="ms-2">${item.orderInfo.username}</span>
            </td>
            <td class="text-nowrap">${item.orderInfo.order_date}</td>
            <td>${item.orderInfo.payment_type.toUpperCase()}</td>
            <td><span class="badge ${item.orderInfo.status}">${
            item.orderInfo.status
          }</span></td>
            <td  class="text-center">
              <button class="dropdown-list-menu">
                <span>Action</span><i class="fa-solid fa-angle-down"></i>
              </button>
              <ul class="dropdown-list">
                <li>
                  <a href="./view-order.php?q=${
                    item.orderInfo.order_id
                  }" data-order-id="order-${
            item.orderInfo.order_id
          }" class="dropdown-btn view-btn">view</a> 
                </li>
                <li>
                  <a href="./edit-order.php?q=${
                    item.orderInfo.order_id
                  }" data-order-id="order-${
            item.orderInfo.order_id
          }" class="dropdown-btn edit-btn">Edit</a>
                </li>
                <li>
                  <a href="./assets/api/delete-order.php?q=${
                    item.orderInfo.order_id
                  }" data-order-id="order-${
            item.orderInfo.order_id
          }" class="dropdown-btn delete-btn">Delete</a>
                </li>
              </ul> 
            </td>
          </tr>
        `
        )
        .join("")
    : "<tr><td colspan='7'>No records found.</td></tr>";
};

const renderPages = (list, page = 1) => {
  const uniqueOrders = getUniqueOrders(list);
  if (uniqueOrders.length === 0) {
    renderTable([]);
    paginationContainer.innerHTML = "";
    return;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = uniqueOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  renderTable(paginatedItems);

  renderPagination(uniqueOrders.length);
};

const renderPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagesPerBlock = 4;
  const blockStart =
    Math.floor((currentPage - 1) / pagesPerBlock) * pagesPerBlock + 1;
  const blockEnd = Math.min(blockStart + pagesPerBlock - 1, totalPages);

  paginationContainer.innerHTML = "";

  const createButton = (text, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    btn.addEventListener("click", onClick);
    return btn;
  };
  paginationContainer.appendChild(
    createButton("Previous", blockStart === 1, () => {
      if (blockStart > 1) {
        currentPage = blockStart - 1;
        renderPages(displayedItems, currentPage);
      }
    })
  );
  for (let i = blockStart; i <= blockEnd; i++) {
    const pageBtn = createButton(i, false, () => {
      currentPage = i;
      renderPages(displayedItems, currentPage);
    });
    if (i === currentPage) pageBtn.classList.add("active");
    paginationContainer.appendChild(pageBtn);
  }
  paginationContainer.appendChild(
    createButton("Next", blockEnd === totalPages, () => {
      if (blockEnd < totalPages) {
        currentPage = blockEnd + 1;
        renderPages(displayedItems, currentPage);
      }
    })
  );
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
const getUniqueOrders = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    if (!seen.has(item.orderInfo.order_id)) {
      seen.add(item.orderInfo.order_id);
      return true;
    }
    return false;
  });
};

const init = async () => {
  try {
    const data = await productsPromise;

    allProducts = flattenOrders(data);
    displayedItems = [...allProducts];
    renderPages(displayedItems, currentPage);
  } catch (err) {
    showToast("Failed to load products.", "error");
  }
};
init();
