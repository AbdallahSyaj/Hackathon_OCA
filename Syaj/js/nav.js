document
  .querySelector(".mobile-menu-toggle")
  .addEventListener("click", function () {
    document.querySelector(".main-nav").classList.toggle("active");
    document.querySelector(".auth-controls").classList.toggle("active");
    this.classList.toggle("active");
  });

function checkLoginStatus() {
  const isLoggedinData = localStorage.getItem("isLoggedin");

  if (!isLoggedinData) {
    console.log("No login data found in localStorage");
    return null;
  }

  try {
    const loginData = JSON.parse(isLoggedinData);

    if (!Array.isArray(loginData)) {
      console.log("Login data is not in the expected format");
      return null;
    }

    let loggedInUser = null;

    loginData.forEach((user) => {
      if (user.is_loggedin === true) {
        loggedInUser = user.user_id;
      }
    });
    return loggedInUser;
  } catch (error) {
    console.error("Error parsing login data:", error);
    return null;
  }
}

// First, get the logged in user ID
const loggedInUserId = checkLoginStatus();

if (loggedInUserId) {
  console.log(`User ID ${loggedInUserId} is currently logged in`);

  // Get the users data and parse it correctly
  const usersData = localStorage.getItem("users");

  try {
    // Parse the users data
    const users = JSON.parse(usersData);

    // Find the current logged in user
    const currentUserData = users.find((user) => user.id === loggedInUserId);

    // Set the background image if the user has an image
    if (currentUserData.user_img !== "") {
      document.querySelector(
        ".user-img"
      ).style.backgroundImage = `url(${currentUserData.user_img})`;
    }

    // Update UI elements for logged in state
    document.querySelector(".auth-controls").style.display = "none";
    document.querySelector(".isLogedIn").style.display = "flex";

    // Set global variables
    currentUser = loggedInUserId;
    is_loggedIn = true;
  } catch (error) {
    console.error("Error parsing users data:", error);
  }
} else {
  console.log("No user is currently logged in");

  // Update UI elements for logged out state
  document.querySelector(".auth-controls").style.display = "flex";
  document.querySelector(".isLogedIn").style.display = "none";

  // Set global variables
  currentUser = 0;
  is_loggedIn = false;
}

document
  .getElementsByClassName("nav-logout")
  .addEventListener("click", function () {
    let isLoggedin = JSON.parse(localStorage.getItem("isLoggedin")) || [];

    // Find the logged-in user and set their status to false
    isLoggedin = isLoggedin.map((user) =>
      user.is_loggedin ? { ...user, is_loggedin: false } : user
    );

    localStorage.setItem("isLoggedin", JSON.stringify(isLoggedin));
  });
