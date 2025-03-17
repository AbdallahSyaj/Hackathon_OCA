document.addEventListener("DOMContentLoaded", function () {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  let postTable = document.getElementById("postTableBody");

  function loadPosts() {
    postTable.innerHTML = "";
    posts.forEach((post) => {
      let row = document.createElement("tr");
      row.innerHTML = `
                <td>${post.post_id}</td>
                <td><textarea class="form-control" id="desc-${post.post_id}">${post.description}</textarea></td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="editPost(${post.post_id})">Save</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePost(${post.post_id})">Delete</button>
                </td>
            `;
      postTable.appendChild(row);
    });
  }

  window.editPost = function (postId) {
    let newDesc = document.getElementById(`desc-${postId}`).value;
    let postIndex = posts.findIndex((post) => post.post_id === postId);

    if (postIndex !== -1) {
      posts[postIndex].description = newDesc;
      localStorage.setItem("posts", JSON.stringify(posts));
      alert("Post updated successfully!");
    }
  };

  window.deletePost = function (postId) {
    posts = posts.filter((post) => post.post_id !== postId);
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  };

  loadPosts();
});
