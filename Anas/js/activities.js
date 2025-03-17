document
  .getElementById("activityForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let activities = JSON.parse(localStorage.getItem("activities")) || [];

    let newActivity = {
      activity_id: activities.length + 1,
      activity_name: document.getElementById("activityName").value,
      activity_description: document.getElementById("activityDescription")
        .value,
      location: document.getElementById("activityLocation").value,
      hours: 0,
    };

    activities.push(newActivity);
    localStorage.setItem("activities", JSON.stringify(activities));

    alert("Activity added successfully!");
    window.location.href = "index.html";
  });
