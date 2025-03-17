document.addEventListener("DOMContentLoaded", function () {
  let activities = JSON.parse(localStorage.getItem("activities")) || [];
  let activityTable = document.getElementById("activityTableBody");

  function loadActivities(filterUnadded = false) {
    activityTable.innerHTML = "";

    let filteredActivities = filterUnadded
      ? activities.filter((a) => !a.activity_name || !a.activity_description)
      : activities;

    if (filteredActivities.length === 0) {
      activityTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No activities found</td></tr>`;
      return;
    }

    filteredActivities.forEach((activity) => {
      let row = document.createElement("tr");
      row.innerHTML = `
                <td>${activity.activity_id}</td>
                <td>${
                  activity.activity_name ||
                  "<span class='text-danger'>Not Added</span>"
                }</td>
                <td>${
                  activity.activity_description ||
                  "<span class='text-danger'>Not Added</span>"
                }</td>
                <td>${activity.location || "N/A"}</td>
                <td>${activity.hours || 0} hrs</td>
            `;
      activityTable.appendChild(row);
    });
  }

  window.filterActivities = function () {
    loadActivities(true);
  };

  loadActivities();
});
