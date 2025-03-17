document.addEventListener("DOMContentLoaded", function () {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let userTable = document.getElementById("userTableBody");

  users.forEach((user) => {
    let row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button></td>
        `;
    userTable.appendChild(row);
  });
});

function deleteUser(userId) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("users", JSON.stringify(users));
  location.reload();
}
