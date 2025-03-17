document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("forloginerror"); // Error message h4

  // Handle form submission
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    let isLoggedin = JSON.parse(localStorage.getItem("isLoggedin")) || [];

    // Find user in stored users
    const user = storedUsers.find((u) => u.email === email);

    if (!user) {
      errorMessage.innerText =
        "Email does not exist! Please check your email or register.";
      return;
    }

    if (user.password !== password) {
      errorMessage.innerText = "Incorrect password! Please try again.";
      return;
    }

    // Clear previous error message if login is successful
    errorMessage.innerText = "";

    // Step 1: Preserve existing user IDs but set all to false
    const updatedIsLoggedin = isLoggedin.map((u) => ({
      user_id: u.user_id,
      is_loggedin: false,
    }));

    // Step 2: If the user is not in the list, add them
    if (!updatedIsLoggedin.some((u) => u.user_id === user.id)) {
      updatedIsLoggedin.push({ user_id: user.id, is_loggedin: false });
    }

    // Step 3: Mark only the logged-in user as true
    const finalIsLoggedin = updatedIsLoggedin.map((u) =>
      u.user_id === user.id ? { ...u, is_loggedin: true } : u
    );

    // Store updated login status in localStorage
    localStorage.setItem("isLoggedin", JSON.stringify(finalIsLoggedin));

    // Store logged-in user session
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));

    // Redirect to dashboard or profile page
    window.location.href = "dashboard.html";
  });
});
