document.addEventListener("DOMContentLoaded", function () {
  // Get users and logged-in user data from localStorage
  const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const isLoggedin = JSON.parse(localStorage.getItem("isLoggedin")) || [];

  // Find the logged-in user
  const loggedInUser = storedUsers.find((user) =>
    isLoggedin.some((entry) => entry.user_id === user.id && entry.is_loggedin)
  );

  if (!loggedInUser) {
    alert("No logged-in user found. Redirecting to login.");
    window.location.href = "login.html"; // Redirect if no user is logged in
    return;
  }

  // Populate user profile fields
  document.querySelector(".profile-pic").src = loggedInUser.user_image || "https://i.pravatar.cc/150?img=23";
  document.querySelector(".profile-details h1").innerText = loggedInUser.name;
  document.querySelector(".profile-details p").innerText = loggedInUser.bio || "Passionate about making a difference";
  document.querySelector(".location-info span:first-child").innerText = `📍 ${loggedInUser.address || "Unknown"}`;
  document.querySelector(".stats-value:nth-child(2)").innerText = `$${loggedInUser.total_donation}`;
  document.querySelector(".stats-value:nth-child(4)").innerText = `${loggedInUser.volunter_hours} hrs`;

  // Fetch and display activities the user has participated in
  const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
  const userActivities = storedActivities.filter(activity => activity.user_id === loggedInUser.id);

  const activityList = document.querySelector(".campaigns-card");
  activityList.innerHTML += userActivities.map(activity => `
    <div class="campaign-item">
      <div class="campaign-icon blue">🌟</div>
      <div class="campaign-details">
        <h3>${activity.activity_name || "Unnamed Activity"}</h3>
        <p>${activity.activity_description || "No description available"}</p>
        <div class="campaign-meta">
          <span>📅 ${activity.time || "Unknown"}</span>
          <span>📍 ${activity.location || "No location set"}</span>
        </div>
      </div>
    </div>
  `).join("");

  // Edit profile form
  document.querySelector(".edit-btn").addEventListener("click", function () {
    document.body.innerHTML += `
      <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit Profile</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="editProfileForm">
                <div class="mb-3">
                  <label for="editName" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="editName" value="${loggedInUser.name}" required>
                </div>
                <div class="mb-3">
                  <label for="editEmail" class="form-label">Email</label>
                  <input type="email" class="form-control" id="editEmail" value="${loggedInUser.email}" required disabled>
                </div>
                <div class="mb-3">
                  <label for="editPhone" class="form-label">Phone</label>
                  <input type="text" class="form-control" id="editPhone" value="${loggedInUser.phone}">
                </div>
                <div class="mb-3">
                  <label for="editAddress" class="form-label">Address</label>
                  <input type="text" class="form-control" id="editAddress" value="${loggedInUser.address}">
                </div>
                <div class="mb-3">
                  <label for="editBio" class="form-label">Bio</label>
                  <textarea class="form-control" id="editBio">${loggedInUser.bio}</textarea>
                </div>
                <div class="mb-3">
                  <label for="editProfilePic" class="form-label">Profile Picture URL</label>
                  <input type="text" class="form-control" id="editProfilePic" value="${loggedInUser.user_image}">
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("editProfileModal"));
    modal.show();

    document.getElementById("editProfileForm").addEventListener("submit", function (e) {
      e.preventDefault();

      // Update user object
      loggedInUser.name = document.getElementById("editName").value;
      loggedInUser.phone = document.getElementById("editPhone").value;
      loggedInUser.address = document.getElementById("editAddress").value;
      loggedInUser.bio = document.getElementById("editBio").value;
      loggedInUser.user_image = document.getElementById("editProfilePic").value;

      // Update in localStorage
      const updatedUsers = storedUsers.map(user => user.id === loggedInUser.id ? loggedInUser : user);
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      // Reload page to reflect changes
      location.reload();
    });
  });
});
