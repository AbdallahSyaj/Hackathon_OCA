// Select form elements
const registerForm = document.getElementById("registerForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

// Regex for validation
const nameRegex = /^[A-Za-z\s]{2,}$/; // Only letters and spaces, min 2 characters
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

// Live validation for password
passwordInput.addEventListener("input", () => {
  passwordError.textContent = passwordRegex.test(passwordInput.value)
    ? ""
    : "Password must be at least 8 characters,upper,lowercase,a number,a special character.";
});

// Live validation for password confirmation
confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordError.textContent =
    confirmPasswordInput.value === passwordInput.value
      ? ""
      : "Passwords do not match.";
});

function showError(inputField, errorField, message) {
  errorField.innerText = message;
  inputField.style.border = "2px solid red";
}

// Function to clear error messages
function clearError(inputField, errorField) {
  errorField.innerText = "";
  inputField.style.border = "2px solid #ccc"; // Reset border to default
}

// Handle form submission
registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form refresh

  let isValid = true; // Flag to check if all fields are valid

  // Validate first name
  if (!nameRegex.test(firstNameInput.value.trim())) {
    showError(
      firstNameInput,
      emailError,
      "First name must contain only letters & spaces."
    );
    document.getElementById("forfirstname").innerHTML =
      "first name should be more than 2 letters";
    isValid = false;
  } else {
    clearError(firstNameInput, emailError);
  }

  // Validate last name
  if (!nameRegex.test(lastNameInput.value.trim())) {
    showError(
      lastNameInput,
      emailError,
      "Last name must contain only letters & spaces."
    );
    document.getElementById("forlastname").innerHTML =
      "last name should be more than 2 letters";
    isValid = false;
  } else {
    clearError(lastNameInput, emailError);
  }

  // Validate email
  if (!emailRegex.test(emailInput.value)) {
    showError(emailInput, emailError, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Validate password
  if (!passwordRegex.test(passwordInput.value)) {
    showError(
      passwordInput,
      passwordError,
      "Password must be at least 6 characters with letters and numbers."
    );
    isValid = false;
  } else {
    clearError(passwordInput, passwordError);
  }

  // Validate confirm password
  if (confirmPasswordInput.value !== passwordInput.value) {
    showError(
      confirmPasswordInput,
      confirmPasswordError,
      "Passwords do not match."
    );
    isValid = false;
  } else {
    clearError(confirmPasswordInput, confirmPasswordError);
  }

  // If form is invalid, stop submission
  if (!isValid) return;

  // Retrieve existing users from localStorage
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email is already registered
  const userExists = storedUsers.some(
    (user) => user.email === emailInput.value
  );

  if (userExists) {
    showError(emailInput, emailError, "User with this email already exists!");
    return;
  }

  // Create new user object
  const newUser = {
    id: storedUsers.length + 1, // Auto-increment ID
    name: firstNameInput.value.trim() + " " + lastNameInput.value.trim(), // Combine first & last name
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
    phone: "", // Default empty values
    user_image: "",
    address: "",
    bio: "",
    total_donation: 0,
    volunter_hours: 0,
  };

  // Add new user to localStorage
  storedUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(storedUsers));

  // Store the logged-in user in sessionStorage
  sessionStorage.setItem("loggedInUser", JSON.stringify(newUser));

  // Redirect to login page
  window.location.href = "login.html";
});
