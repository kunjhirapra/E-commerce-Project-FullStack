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
