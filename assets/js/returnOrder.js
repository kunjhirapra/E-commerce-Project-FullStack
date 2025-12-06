const returnOrderContainer = document.getElementById("returnOrderContainer");
const download_button = document.getElementById("downloadBtn");
const orderNoElement = document.getElementById("orderNo");
orderNoElement.innerText = orderId;
const content = document.getElementById("content");
let totalPrice = 0;

$(document).ready(function () {
  const returnProductContainer = document.getElementById(
    "returnProductContainer"
  );
  returnProductContainer.style.height = "400px";
  returnProductContainer.classList.add("overflow-y-scroll");
  const returnFormContainer = document.getElementById("returnFormContainer");

  $.ajax({
    url: "./assets/api/userDetails.php",
    type: "POST",
    data: { id: userId },
    dataType: "json",
    success: function (data) {
      returnFormContainer.innerHTML = `
        <form method="post" id="returnForm">
          <div class="row">
            <div class="col-6">
              <label for="returnReason" class="form-label fw-medium">Reason Of return</label>
              <select name="returnReason" id="returnReason" class="form-select mb-3">
                <option value="" selected>Select a Reason for Return..</option>
                <option value="wrong Size">The Delivered Size is wrong</option>
                <option value="not what i was expecting">The product is Not What i was expecting</option>
                <option value="Wrong item sent">The wrong Item was Delivered</option>
                <option value="item is defected">The Item has A defect</option>
              </select>
            </div>
            <div class="col-6">
              <label for="paymentType" class="form-label fw-medium">Payment Type</label>
              <select name="paymentType" id="paymentType" class="form-select mb-3">
                <option value="" selected>Select a payment for Return..</option>
                <option value="to original">Refund to Original Payment Method</option>
                <option value="credit or gift">Store Credit or Gift Card</option>
              </select>
            </div>
            <div class="col-12">
              <label for="returnDescription" class="form-label fw-medium">Write Description</label>
              <textarea name="returnDescription" id="returnDescription" rows="3"
              placeholder="Write Description here" class="form-control"></textarea>
            </div>
            <div class="col-6">
              <label for="contactNumber" class="form-label fw-medium">Contact Number</label>
              <input name="contactNumber" id="contactNumber" rows="3" placeholder="eg. 9856745238"
              class="form-control" value="${data.contact_number}">
            </div>
            <div class="col-6">
              <label for="customerName" class="form-label fw-medium"> Customer Name</label>
              <input name="customerName" id="customerName" rows="3" placeholder="eg. ajay"
              class="form-control" value="${data.username}">
            </div>
            <div class="d-flex align-items-center justify-content-center mt-3 gap-3">
              <button id="cancleReturnForm" type="button" class="add-to-cart-button fs-5">Cancle</button>
              <button id="submitReturnForm" type="submit" class="add-to-cart-button fs-5">Confirm
              Return</button>
            </div>
            <input id="orderIdNo" type="hidden" name="orderIdNo" value="${orderId}">
            <input id="itemIdNo" type="hidden" name="itemIdNo" value="${itemId}">
            <input id="refundAmount" type="hidden" name="refundAmount" value="${totalPrice}">
            <input id="userId" type="hidden" name="userId" value="${userId}">
            <input id="userEmail" type="hidden" name="userEmail" value="${userEmail}">
          </div>
        </form>
        `;
      $.ajax({
        url: "./admin/assets/api/viewOrder.php",
        type: "POST",
        data: { id: orderId },
        contentType: "application/x-www-form-urlencoded",
        success: function (response) {
          const numericOrderId = Number(orderId);
          const numericItemIds = itemId.map((id) => Number(id));
          let matchingItems = response.filter(
            (res) =>
              Number(res.order_id) === numericOrderId &&
              numericItemIds.includes(Number(res.id))
          );
          if (!matchingItems || matchingItems.length === 0)
            window.location.href = "my-orders.php";

          matchingItems.forEach((productItem) => {
            const { id, name, quantity, price, image } = productItem;
            const newElement = document.createElement("div");
            totalPrice += Number(price) * Number(quantity);
            newElement.innerHTML = `
            <div class="product-card" id="item-${id}">
              <div class="d-flex align-items-center justify-content-start">
                <div class="img-box">
                  <img src="${baseUrl}/assets/images/uploads/${image}" alt="${name}" style="max-width: 250px; max-height: 250px;">
                  </div>
                  <div class="content-box">
                  <a href="../show-product.php?name=${name}" class="product-name">${name}</a>
                  <p>Total Quantity: ${quantity}</p>
                  <p>Unit Price: <strong>$${price}</strong></p>
                  <p>Total Item Price: <strong>$${(price * quantity).toFixed(
                    2
                  )}</strong></p>
                </div>
              </div>
            </div>
            `;
            returnProductContainer.append(newElement);
          });
          const totalPriceElem = document.createElement("div");
          totalPriceElem.innerHTML = `<p class="fs-4">Total Returnable Amount: <strong>$${totalPrice.toFixed(
            2
          )} </strong></p>`;
          returnProductContainer.after(totalPriceElem);

          $.validator.addMethod(
            "address",
            function (value, element) {
              return (
                this.optional(element) ||
                /^[a-zA-Z0-9\s.,'#\-\/()]+$/.test(value.trim())
              );
            },
            "Only alphabets, digits and some special characters are allowed."
          );
          $.validator.addMethod(
            "notDefault",
            function (value) {
              return value !== "Select one" && value !== "";
            },
            "Please select a valid option."
          );
          $("#submitReturnForm").click(function () {
            $("#returnForm").submit();
          });

          $("#returnForm").validate({
            rules: {
              returnReason: {
                required: true,
                notDefault: true,
              },
              customerName: {
                required: true,
                address: true,
              },
              returnDescription: {
                required: true,
                address: true,
              },
              contactNumber: {
                required: true,
                digits: true,
                maxlength: 10,
                minlength: 10,
              },
              paymentType: {
                required: true,
                notDefault: true,
              },
            },
            messages: {
              customerName: {
                required: "Username is required.",
                address:
                  "User name must be alphabets, digits and some allowed special characters",
              },
              contactNumber: {
                required: "Phone number is required",
                maxlength: "Phone number length must be 10",
                minlength: "Phone number length must be 10",
              },
              returnDescription: {
                required: "Description is required",
                address:
                  "This Field must be alphabets, digits and some allowed special characters",
              },
              returnReason: {
                required: "Please select an option",
                notDefault: "Please select a valid option.",
              },
              paymentType: {
                required: "Please select an option",
                notDefault: "Please select a valid option.",
              },
            },
            submitHandler: function () {
              $("#submitReturnForm").prop("disabled", true);
              $.ajax({
                type: "POST",
                url: "./assets/api/returnOrder.php",
                data: $("#returnForm").serialize(),
                success: function (response) {
                  const returnData = response[0];
                  content.innerHTML = `<h2>Return Confirmed For User: ${returnData.customerName}.</h2>
                  <p>For items below</p>`;
                  matchingItems.forEach((productItem) => {
                    const { id, name, quantity, price, image } = productItem;
                    const productCard = document.createElement("div");
                    productCard.className = "product-card col-6";
                    productCard.id = `item-${id}`;
                    productCard.innerHTML = `
                    <div class="d-flex align-items-center justify-content-start">
                      <div class="img-box">
                        <img src="${baseUrl}/assets/images/uploads/${image}" alt="${name}" style="max-width: 250px; max-height: 250px;">
                      </div>
                      <div class="content-box">
                        <a href="../show-product.php?name=${name}" class="product-name">${name}</a>
                        <p>Total Quantity: ${quantity}</p>
                        <p>Unit Price: <strong>$${price}</strong></p>
                        <p>Total Item Price: <strong>$${(
                          price * quantity
                        ).toFixed(2)}</strong></p>
                      </div>
                    </div>
                  `;
                    content.appendChild(productCard);
                  });

                  download_button.addEventListener("click", async function () {
                    const filename = "return_recipt.pdf";
                    try {
                      const opt = {
                        margin: 1,
                        filename: filename,
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: {
                          unit: "in",
                          format: "letter",
                          orientation: "portrait",
                        },
                      };
                      await html2pdf().set(opt).from(content).save();
                    } catch (error) {
                      console.error("Error:", error.message);
                    }
                  });
                  $("#submitReturnForm").prop("disabled", false);
                },
                error: function (jqXHR) {
                  $("#submitReturnForm").prop("disabled", false);
                },
              });
            },
          });
        },
        error: function (xhr, status, error) {
          console.error("AJAX Error:", status, error);
        },
      });
    },
    error: function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
    },
  });
});
