document
  .querySelector(".mobile-menu-toggle")
  .addEventListener("click", function () {
    document.querySelector(".main-nav").classList.toggle("active");
    document.querySelector(".auth-controls").classList.toggle("active");
    document.querySelector(".isLogedIn").classList.toggle("active");
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

const loggedInUserId = checkLoginStatus();

if (loggedInUserId) {
  console.log(`User ID ${loggedInUserId} is currently logged in`);

  const usersData = localStorage.getItem("users");

  try {
    const users = JSON.parse(usersData);

    const currentUserData = users.find((user) => user.id === loggedInUserId);

    if (currentUserData.user_img !== "") {
      document.querySelector(
        ".user-img"
      ).style.backgroundImage = `url(${currentUserData.user_img})`;
    }

    document.querySelector(".auth-controls").style.display = "none";
    document.querySelector(".isLogedIn").style.display = "flex";

    currentUser = loggedInUserId;
    is_loggedIn = true;
  } catch (error) {
    console.error("Error parsing users data:", error);
  }
} else {
  console.log("No user is currently logged in");

  document.querySelector(".auth-controls").style.display = "flex";
  document.querySelector(".isLogedIn").style.display = "none";

  currentUser = 0;
  is_loggedIn = false;
}

document.getElementById("log").addEventListener("click", function () {
  let isLoggedin = JSON.parse(localStorage.getItem("isLoggedin")) || [];

  // Find the logged-in user and set their status to false
  isLoggedin = isLoggedin.map((user) =>
    user.is_loggedin ? { ...user, is_loggedin: false } : user
  );

  localStorage.setItem("isLoggedin", JSON.stringify(isLoggedin));
  window.location.reload();
});
