async function viewOrder() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("q");

  if (!productId) {
    container.textContent = "No product specified.";
    return;
  }
  try {
    const orderResponse = await fetch("./admin/assets/api/viewOrder.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const userResponse = await fetch("./admin/assets/api/viewUserOrder.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${productId}`,
    });

    const orderData = await orderResponse.json();
    const userData = await userResponse.json();

    const matchingItems = orderData.filter(
      (item) => item.order_id === productId
    );
    let subTotal = 0;
    for (const item of matchingItems) {
      subTotal += Number(item.price) * Number(item.quantity);
    }
    const shippingRate = 5.0;
    const gstTax = Number(((subTotal * 18) / 100).toFixed(2));
    const grandTotal = Number((subTotal + gstTax + shippingRate).toFixed(2));
    const dateObj = new Date(matchingItems[0].order_date);
    const dateOnly = dateObj.toISOString().split("T")[0];
    const showOrderDetails = document.getElementById("showOrderDetails");

    showOrderDetails.innerHTML = `
      <div class="row row-gap-5">
        <div class="col-4">
          <div class="order-card shadow-sm bg-white rounded-3 border">
            <h5 class="mb-4">Order Details (#${matchingItems[0].order_id})</h5>
            <ul class="ps-0 mb-0">
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-calendar-days"></i>Date Added</span>
                  <span id="order-date">${dateOnly}</span>
                </p>
              </li>
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-credit-card"></i>Payment Method</span>
                  <span id="paymentMethod">${userData.payment_type}</span>
                </p>
              </li>
              <li class="">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-truck"></i>Shipping Method</span>
                  <span class="text-end" id="shippingMethod">Regular Shipping</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-4">
          <div class="order-card shadow-sm bg-white rounded-3 border">
            <h5 class="mb-4">Customer Details</h5>
            <ul class="ps-0 mb-0">
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-user"></i>Customer</span>
                  <span id="customer-name">${userData.username}</span>
                </p>
              </li>
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-envelope"></i>Email</span>
                  <span id="customerNmail">${userData.email}</span>
                </p>
              </li>
              <li class="">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-mobile"></i>Phone</span>
                  <span class="text-end" id="customerNumber">+91 ${userData.contact_number}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-4">
          <div class="order-card shadow-sm bg-white rounded-3 border">
            <h5 class="mb-4">Documents</h5>
            <ul class="ps-0 mb-0">
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-file-lines"></i>Invoice</span>
                  <span id="orderNumber">#${matchingItems[0].order_id}</span>
                </p>
              </li>
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-truck"></i>Shipping</span>
                  <span id="shippingId">#${matchingItems[0].order_id}</span>
                </p>
              </li>
              <li class="">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-truck"></i>Order Items</span>
                  <span class="text-end" id="totalItems">${matchingItems.length}</span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-6">
          <div class="order-card shadow-sm bg-white rounded-3 border d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-4">Shipping Address</h5>
              <div class="">
                <p class="fs-6 text-secondary fw-medium" id="billingAddress">
                To, ${userData.username}
                <br>
                At, ${userData.delivery_address}
                </p>
              </div>
            </div>
            <i class="fa-solid fa-address-card address-icon"></i>
          </div>
        </div>
        <div class="col-6">
          <div class="order-card shadow-sm bg-white rounded-3 border d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-4">Shipping Address</h5>
              <div class="">
                <p class="fs-6 text-secondary fw-medium" id="billingAddress">
                To, ${userData.username}
                <br>
                At, ${userData.billing_address}
                </p>
              </div>
            </div>
              <i class="fa-solid fa-truck-fast address-icon"></i>          
          </div>
        </div>
        <div class="col-12">
          <div class="order-card shadow-sm bg-white rounded-3 border">
            <h5 class="mb-4">Order #${matchingItems[0].order_id}</h5>
            <div id="checkoutContainer">
              <div class="product-table">
                <div class="table-responsive w-100">
                  <table class="table" id="cart-table">
                    <thead class="border-bottom">
                      <tr>
                        <th>Product</th>
                        <th>Color</th>
                        <th>QTY</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>
                    <tbody id="orderItemsTableBody">
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="py-2">Sub Total:</p></td>
                      <td><p class="product-subtotal">$${subTotal}</p></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="py-2">GST(18%):</p></td>
                      <td><p class="product-tax">$${gstTax}</p></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><p class="py-2">Shipping Rate:</p></td>
                      <td><p class="shipping-cost">$${shippingRate}</p></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><h5 class="py-2">Grand Total:</h5></td>
                      <td><h5 class="Total-cost">$${grandTotal}</h5></td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    const tableBody = document.getElementById("orderItemsTableBody");

    matchingItems.forEach((productItem) => {
      const { name, image, price, color, quantity } = productItem;
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="text-start"><img src="${baseUrl}/assets/images/uploads/${image}" alt="${name}" style="max-width: 80px; max-height: 80px;" /><a href="../show-product.php?name=${name}" class="product-name">${name}</a></td>
        <td class="${color}">${color}</td>
        <td>${quantity}</td>
        <td><strong>$${price}</strong></td>
        <td><strong>$${price * quantity}</strong></td>
      `;

      tableBody.prepend(tr);
    });
  } catch (error) {
    console.error("Error fetching order/user data:", error);
  }
}

viewOrder();
