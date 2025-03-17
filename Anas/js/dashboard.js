document.querySelectorAll(".list-group-item").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = this.getAttribute("href");
  });
});
