function calculateWeeks(dateToStr) {
  const date1 = new Date();
  const [date, month, year] = dateToStr.split("-").map(Number);
  const date2 = new Date(date, month - 1, year);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const weekDiff = Math.round(Math.abs((date1 - date2) / oneWeek));
  return weekDiff;
}

async function returnOrder() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("q");
  try {
    const orderResponse = await fetch("./admin/assets/api/viewOrder.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id=${productId}`,
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

    if (!orderData || orderData.length < 1) {
      window.location.href = "my-orders.php";
    }
    let subTotal = 0;
    for (const item of orderData) {
      subTotal += Number(item.price) * Number(item.quantity);
    }

    const coupon = orderData[0];
    let couponDiscountAmount = 0;

    if (coupon.discount_type === "percentage") {
      couponDiscountAmount =
        (subTotal * parseFloat(coupon.discount_value)) / 100;
    } else if (coupon.discount_type === "fixed") {
      couponDiscountAmount = parseFloat(coupon.discount_value);
    }

    couponDiscountAmount = Math.min(couponDiscountAmount, subTotal);

    const priceAfterDiscount = subTotal - couponDiscountAmount;

    const shippingRate = 5.0;
    const gstTax = Number(((priceAfterDiscount * 18) / 100).toFixed(2));
    const grandTotal = Number(
      (priceAfterDiscount + gstTax + shippingRate).toFixed(2)
    );
    const dateObj = new Date(orderData[0].order_date);
    const dateOnly = dateObj.toISOString().split("T")[0];
    const returnOrderDetails = document.getElementById("returnOrderDetails");
    const weeksAgo = calculateWeeks(dateOnly);

    returnOrderDetails.innerHTML = `
<div class="row row-gap-5">
        <div class="col-4">
          <div class="order-card shadow-sm bg-white rounded-3 border">
            <h5 class="mb-4">Order Details (#${orderData[0].order_id})</h5>
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
                  <span class="text-end" id="customerNumber">+91 ${
                    userData.contact_number
                  }</span>
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
                  <span id="orderNumber">#${orderData[0].order_id}</span>
                </p>
              </li>
              <li class="mb-4 border-bottom pb-3">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-truck"></i>Shipping</span>
                  <span id="shippingId">#${orderData[0].order_id}</span>
                </p>
              </li>
              <li class="">
                <p class="order-detail-card">
                  <span><i class="fa-solid me-1 fa-truck"></i>Order Items</span>
                  <span class="text-end" id="totalItems">${
                    orderData.length
                  }</span>
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
            <h5 class="mb-4">Order #${orderData[0].order_id}</h5>
            <div id="checkoutContainer">  <div class="product-table">
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
            <td><p class="product-subtotal">$${subTotal.toFixed(2)}</p></td>
          </tr>
          ${
            couponDiscountAmount > 0
              ? `<tr id="couponDiscountRow">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><p class="py-2">Discount:</p></td>
                  <td><p class="product-coupon text-success">- $${couponDiscountAmount.toFixed(
                    2
                  )} (${coupon.discount_value}${
                  coupon.discount_type === "percentage" ? "%" : "$"
                } OFF)</p></td>
                </tr>`
              : ""
          }
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><p class="py-2">GST(18%):</p></td>
            <td><p class="product-tax">$${gstTax.toFixed(2)}</p></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><p class="py-2">Shipping Rate:</p></td>
            <td><p class="shipping-cost">$${shippingRate.toFixed(2)}</p></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><h5 class="py-2">Grand Total:</h5></td>
            <td><h5 class="Total-cost">$${grandTotal.toFixed(2)}</h5></td>
          </tr>
        </tbody>
      </table>
    </div>
                ${
                  orderData[0].order_status === "Completed" && weeksAgo < 1
                    ? `
                    <a href="javascript:void(0)" data-order-id="${orderData[0].order_id}" class="add-to-cart-button mb-3 d-inline-flex return-btn" id="returnBtn">return</a>
                <p><strong><em>Note:</em></strong> Slect checkbox to return Items</p>
                  `
                    : `<p><strong><em>Note:</em></strong> Return is Only Available <strong>till one week of the Delivered Items.</strong></p>`
                }
                
    </div>
    </div>
    </div>
  </div>
`;
    const tableBody = document.getElementById("orderItemsTableBody");
    console.log(orderData);
    orderData.forEach((productItem) => {
      const { id, name, image, price, color, quantity } = productItem;
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td class="text-start d-flex align-items-center">
      ${
        orderData[0].order_status === "Completed" && weeksAgo < 1
          ? `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="checkbox${id}" data-item-id=${id}>
        <label class="form-check-label" for="checkbox${id}"></label>
      </div>`
          : ``
      }
        <img src="${baseUrl}/assets/images/uploads/${image}" alt="${name}" style="max-width: 80px; max-height: 80px;" /><a href="../show-product.php?name=${name}" class="product-name">${name}</a></td>
        <td class="${color}">${color}</td>
        <td>${quantity}</td>
        <td><strong>$${price}</strong></td>
        <td><strong>$${price * quantity}</strong></td>
      `;
      tableBody.prepend(tr);
    });
    $("#returnBtn").on("click", function () {
      const checkedIds = [];
      $("input[type='checkbox']:checked").each(function () {
        const itemId = $(this).data("item-id");
        if (itemId !== undefined) {
          checkedIds.push(Number(itemId));
        }
      });
      if (checkedIds.length === 0 || !checkedIds) {
        return;
      }
      const itemOrderId = $(this).data("order-id");
      const encodedOrderId = btoa(itemOrderId);
      const encodedItemId = btoa(JSON.stringify(checkedIds));
      window.location.href = `return_order_item.php?orderId=${encodedOrderId}&itemId=${encodedItemId}`;
    });
  } catch (error) {
    console.error("Error fetching order/user data:", error);
  }
}

returnOrder();
