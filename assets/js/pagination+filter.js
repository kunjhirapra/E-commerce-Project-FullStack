export let currentPage = 1;

export const resetCurrentPage = () => {
  currentPage = 1;
};

export const paginateList = (list, itemsPerPage) => {
  const start = (currentPage - 1) * itemsPerPage;
  return list.slice(start, start + itemsPerPage);
};

// export const renderPaginationControls = ({
//   container,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
// }) => {
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   container.innerHTML = "";

//   const createButton = (text, disabled, onClick) => {
//     const btn = document.createElement("button");
//     btn.textContent = text;
//     btn.disabled = disabled;
//     btn.addEventListener("click", onClick);
//     return btn;
//   };

//   container.appendChild(
//     createButton("Previous", currentPage === 1, () => {
//       if (currentPage > 1) {
//         currentPage--;
//         onPageChange(currentPage);
//       }
//     })
//   );

//   for (let i = 1; i <= totalPages; i++) {
//     const pageBtn = createButton(i, false, () => {
//       currentPage = i;
//       onPageChange(currentPage);
//     });
//     if (i === currentPage) pageBtn.classList.add("active");
//     container.appendChild(pageBtn);
//   }

//   container.appendChild(
//     createButton("Next", currentPage === totalPages, () => {
//       if (currentPage < totalPages) {
//         currentPage++;
//         onPageChange(currentPage);
//       }
//     })
//   );
// };
export const renderPaginationControls = ({
  container,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  container.innerHTML = "";

  const createButton = (text, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    btn.addEventListener("click", onClick);
    return btn;
  };

  container.appendChild(
    createButton("Previous", currentPage === 1, () => {
      if (currentPage > 1) {
        currentPage--;
        onPageChange(currentPage);
      }
    })
  );

  const maxVisiblePages = 4;

  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createButton(i, false, () => {
      currentPage = i;
      onPageChange(currentPage);
    });
    if (i === currentPage) pageBtn.classList.add("active");
    container.appendChild(pageBtn);
  }

  container.appendChild(
    createButton("Next", currentPage === totalPages, () => {
      if (currentPage < totalPages) {
        currentPage++;
        onPageChange(currentPage);
      }
    })
  );
};

export const filterProducts = (products, filterData) => {
  const { price, ...categories } = filterData;

  const selectedCategories = Object.keys(categories).filter(
    (key) => categories[key] === "on" || !isNaN(Number(categories[key]))
  );

  let filtered = products.filter((product) =>
    selectedCategories.every(
      (cat) =>
        product.brand === cat ||
        product.category === cat ||
        product.color === cat
    )
  );

  return filtered.filter((product) => Number(product.price) <= Number(price));
};

export const setupPriceRange = (products, rangeInput, startLabel, endLabel) => {
  if (!rangeInput) return;

  const prices = products.map((p) => Number(p.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  rangeInput.min = min.toFixed(0);
  rangeInput.max = max.toFixed(0);
  rangeInput.value = max.toFixed(0);

  startLabel.textContent = `$${min.toFixed(0)}`;
  endLabel.textContent = `$${max.toFixed(0)}`;

  rangeInput.addEventListener("input", function () {
    endLabel.textContent = `$${this.value}`;
  });
};
