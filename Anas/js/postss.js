const posts = [
    {
      post_id: 1,
      user_id: 1,
      user_name: "anas",
      created_at: "2025-03-17 08:30:00",
      category: "Donation",
      description: "Just donated 100 JD to a local food drive!",
      like: 5,
      comments: [
        { id: 1, name: "ahmad", comment: "Great job, Anas!" },
        { id: 2, name: "Sara", comment: "Keep up the good work!" },
      ],
    },
    {
      post_id: 2,
      user_id: 2,
      user_name: "ahmad",
      created_at: "2025-03-17 10:15:00",
      category: "Volunteer",
      description: "Spent 2 hours at the community center organizing clothes.",
      like: 3,
      comments: [{ id: 1, name: "anas", comment: "Amazing effort!" }],
    },
  ];

  const isLoggedin = [
    { user_id: 1, is_loggedin: true },
    { user_id: 2, is_loggedin: false },
  ];

  // Store in localStorage
  localStorage.setItem("posts", JSON.stringify(posts));

  console.log("Updated data stored in localStorage!");