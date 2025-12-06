const dropdown = document.getElementById("profileDropdown");
let timeoutId;

if (dropdown) {
  dropdown.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
    dropdown.classList.add("show");
  });

  dropdown.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      dropdown.classList.remove("show");
    }, 300);
  });
}
document.addEventListener("click", function (e) {
  const clicked = e.target;

  if (clicked.closest(".dropdown-list-menu")) {
    e.preventDefault();

    const button = clicked.closest(".dropdown-list-menu");
    const dropdownMenu = button.nextElementSibling;
    if (dropdownMenu) {
      dropdownMenu.classList.toggle("active");
    }
    document.querySelectorAll(".dropdown-list").forEach((d) => {
      if (d !== dropdownMenu) d.classList.remove("active");
    });
  } else if (!clicked.closest(".dropdown-list")) {
    document.querySelectorAll(".dropdown-list").forEach((d) => {
      d.classList.remove("active");
    });
  }
});
//**************************************************************
document.addEventListener("DOMContentLoaded", function () {
  const customSelect = document.querySelectorAll(".custom-select");
  if (customSelect.length > 0) {
    function updateSelectedOptions(customSelect) {
      const allTagsOption = customSelect.querySelector(".option.all-tags");
      const isAllSelected = allTagsOption.classList.contains("active");

      let selectedOptions = [];
      if (isAllSelected) {
        // When Select All is active, value should be "all"
        selectedOptions = [];
      } else {
        selectedOptions = Array.from(
          customSelect.querySelectorAll(".option.active")
        )
          .filter((option) => option !== allTagsOption)
          .map(function (option) {
            return {
              value: option.getAttribute("data-value"),
              text: option.textContent.trim(),
            };
          });
      }

      const selectedValuesElement =
        customSelect.querySelector(".selected-values");
      if (selectedValuesElement) {
        selectedValuesElement.value = isAllSelected
          ? "all"
          : selectedOptions.map((option) => option.value).join(",");
      }

      let tagsHtml = "";
      if (isAllSelected) {
        tagsHtml = `<span class="tag">All<span class="remove-tag" data-value="all">&times;</span></span>`;
      } else if (selectedOptions.length === 0) {
        tagsHtml = '<span class="placeholder">Select the tags</span>';
      } else {
        let maxTagstoShow = 3;
        let additionalCount = 0;
        selectedOptions.forEach((option, index) => {
          if (index < maxTagstoShow) {
            tagsHtml += `<span class="tag">${option.text}<span class="remove-tag" data-value="${option.value}">&times;</span></span>`;
          } else {
            additionalCount++;
          }
        });
        if (additionalCount > 0) {
          tagsHtml += `<span class="tag">+${additionalCount} more</span>`;
        }
      }
      customSelect.querySelector(".selected-options").innerHTML = tagsHtml;
    }

    customSelect.forEach(function (customSelect) {
      const searchInput = customSelect.querySelector(".search-tags");
      const optionsContainer = customSelect.querySelector(".options");
      const noResultMessage = customSelect.querySelector(".no-result-message");
      const options = customSelect.querySelectorAll(".option");
      const allTagsOption = customSelect.querySelector(".option.all-tags");

      // Handle 'Select All' click
      allTagsOption.addEventListener("click", function () {
        const isActive = this.classList.contains("active");
        options.forEach(function (option) {
          if (option !== allTagsOption) {
            option.classList.toggle("active", !isActive);
          }
        });

        if (isActive) {
          allTagsOption.classList.remove("active");
        } else {
          allTagsOption.classList.add("active");
        }

        updateSelectedOptions(customSelect);
      });

      // Handle individual option clicks
      options.forEach(function (option) {
        option.addEventListener("click", function () {
          if (option === allTagsOption) return; // Skip if it's the "Select All" option itself

          this.classList.toggle("active");

          // Check if all individual options are selected
          const allIndividualSelected = Array.from(options)
            .filter((o) => o !== allTagsOption)
            .every((option) => option.classList.contains("active"));

          if (allIndividualSelected) {
            allTagsOption.classList.add("active");
          } else {
            allTagsOption.classList.remove("active");
          }

          updateSelectedOptions(customSelect);
        });
      });

      // Handle input search filtering
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        options.forEach(function (option) {
          const optionText = option.textContent.trim().toLocaleLowerCase();
          const shouldShow = optionText.includes(searchTerm);
          option.style.display = shouldShow ? "block" : "none";
        });

        const anyVisible = Array.from(options).some(
          (option) => option.style.display === "block"
        );
        noResultMessage.style.display = anyVisible ? "none" : "block";

        if (searchTerm) {
          optionsContainer.classList.add("option-search-active");
        } else {
          optionsContainer.classList.remove("option-search-active");
        }
      });
    });

    // Remove tags logic (user clicks 'X' to remove a tag)
    document.addEventListener("click", function (e) {
      const removeTag = e.target.closest(".remove-tag");
      if (removeTag) {
        const valueToRemove = removeTag.getAttribute("data-value");
        const customSelect = removeTag.closest(".custom-select");
        const allTagsOption = customSelect.querySelector(".option.all-tags");

        if (valueToRemove === "all") {
          // Clear all selections if 'all' tag is removed
          allTagsOption.classList.remove("active");
          const options = customSelect.querySelectorAll(".option");
          options.forEach((option) => {
            option.classList.remove("active");
          });
        } else {
          // Remove individual option
          const optionToDeactivate = customSelect.querySelector(
            `.option[data-value="${valueToRemove}"]`
          );
          optionToDeactivate.classList.remove("active");
          allTagsOption.classList.remove("active");
        }

        updateSelectedOptions(customSelect);
      }
    });

    // Opening and closing the custom select dropdown
    customSelect.forEach(function (customSelect) {
      customSelect.addEventListener("click", function (e) {
        if (!e.target.closest(".search-tags") && !e.target.closest(".tag")) {
          this.classList.toggle("open");
        }
      });
    });

    // Close the dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !e.target.closest(".custom-select") &&
        !e.target.classList.contains("remove-tag")
      ) {
        customSelect.forEach(function (customSelect) {
          customSelect.classList.remove("open");
        });
      }
    });

    // // Reset select options (if needed)
    // function resetCustomSelects() {
    //   customSelect.forEach(function (customSelect) {
    //     const options = customSelect.querySelectorAll(".option.active");
    //     options.forEach(function (option) {
    //       option.classList.remove("active");
    //     });
    //     customSelect.querySelector(".option.all-tags").classList.remove("active");
    //     updateSelectedOptions(customSelect);
    //   });
    // }

    updateSelectedOptions(customSelect[0]);

    const submitButton = document.getElementById("couponFormSubmit");
    submitButton.addEventListener("click", function (e) {
      let isValid = true;
      customSelect.forEach(function (customSelect) {
        const selectedOptions = customSelect.querySelectorAll(".option.active");
        if (selectedOptions.length === 0) {
          const tagErrorMessage =
            customSelect.querySelector(".tag-error-message");
          tagErrorMessage.textContent = "This field is required.";
          tagErrorMessage.style.display = "block";
          isValid = false;
        } else {
          const tagErrorMessage =
            customSelect.querySelector(".tag-error-message");
          tagErrorMessage.textContent = "";
          tagErrorMessage.style.display = "none";
        }
      });
    });
  }
});
