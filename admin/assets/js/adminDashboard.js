const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const fetchDashboardData = async () => {
  try {
    const response = await fetch("./assets/api/getDashboardData.php");
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return null;
  }
};
const createSalesChart = (data) => {
  const ctx = document.getElementById("salesChart").getContext("2d");
  const dates = data.totalDailySales.map((item) => formatDate(item.date));
  const sales = data.totalDailySales.map((item) => item.total);
  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Daily Sales",
          data: sales,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value),
          },
          X: {
            biginsAtZero: true,
            ticks: {
              callback: (value) => formatDate(value),
            },
          },
        },
      },
    },
  });
};

const updateStats = (data) => {
  document.getElementById("totalSales").textContent = formatCurrency(
    data.totalSales
  );
  document.getElementById("salesThisWeek").textContent = formatCurrency(
    data.weeklySales
  );
  document.getElementById("pendingOrders").textContent = data.pendingOrders;
  document.getElementById("totalProducts").textContent = data.totalProducts;
};

const updateRecentOrders = (orders) => {
  const container = document.getElementById("recentOrders");
  if (!orders || !orders.length) {
    container.innerHTML = '<p class="text-muted">No recent orders</p>';
    return;
  }
  const ordersList = orders
    .map(
      (order) => `
        <div class="border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <p class="mb-0 fw-bold">#${order.id} - ${order.username}</p>
                    <small class="text-muted">${new Date(
                      order.created_at
                    ).toLocaleString()}</small>
                </div>
                <div><span class="badge ${order.order_status}">${
        order.order_status
      }</span></div>
                <div>
                    <span class="ms-2" style="width: 55px; display: block; text-align: right;">${formatCurrency(
                      order.total_amount
                    )}</span>
                </div>
            </div>
        </div>
    `
    )
    .join("");

  container.innerHTML = ordersList;
};

const init = async () => {
  try {
    const data = await fetchDashboardData();
    if (!data) return;
    updateStats(data);
    createSalesChart(data);
    updateRecentOrders(data.recentOrders);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  init();
  setInterval(init, 5 * 60 * 1000);
});
