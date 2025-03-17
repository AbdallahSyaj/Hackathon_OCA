console.log("Data initialized in localStorage (if not already present)");

// Rest of your script...

document.addEventListener('DOMContentLoaded', function () {
    // Get the posts data from local storage
    const storedPosts = localStorage.getItem('posts');
    const storedUsers = localStorage.getItem('users');

    // Check if data exists
    if (storedPosts && storedUsers) {
        try {
            // Parse the JSON data
            const posts = JSON.parse(storedPosts);
            const users = JSON.parse(storedUsers);

            // Get the container element
            const latestCausesSection = document.querySelector('.latest-causes');

            // If the section doesn't exist, create it
            if (!latestCausesSection) {
                const newSection = document.createElement('section');
                newSection.className = 'latest-causes';
                newSection.innerHTML = '<h2 class="section-title">Latest Causes</h2>';
                document.body.appendChild(newSection);
            }

            // Clear existing cards (but keep the title)
            const sectionTitle = latestCausesSection.querySelector('.section-title');
            latestCausesSection.innerHTML = '';
            if (sectionTitle) {
                latestCausesSection.appendChild(sectionTitle);
            } else {
                latestCausesSection.innerHTML = '<h2 class="section-title">Latest Causes</h2>';
            }

            // Get the liked posts from session storage
            const likedPosts = JSON.parse(sessionStorage.getItem('likedPosts')) || [];

            // Loop through each post and create a card

            posts.forEach(post => {
                // Find the user who created this post
                const user = users.find(u => u.id === post.user_id) || { name: 'Unknown User' };

                // Format the date for display
                const createdDate = new Date(post.created_at);
                const now = new Date();
                const diffTime = Math.abs(now - createdDate);
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                const timeAgo = diffHours <= 24 ? `${diffHours} hours ago` : `${Math.ceil(diffHours / 24)} days ago`;



                // Create the card HTML
                const causeCard = document.createElement('div');
                causeCard.className = 'cause-card';
                causeCard.innerHTML = `
            <div class="user-info">
              <img src="https://picsum.photos/400/600" alt="${user.name}" class="user-avatar" />
              <div class="user-details">
                <span class="user-name">${user.name}</span>
                <span class="posted-time">${timeAgo}</span>
              </div>
            </div>
            <div class="cause-content">
              <p class="cause-text">${post.description}</p>
              <span class="cause-tag">#${post.category}</span>
            </div>
            ${post.post_img ? `<img src="${post.post_img}" alt="${post.category}" class="cause-image" />` : ''}
            <div class="cause-actions">
              <div class="action-buttons">
                <button class="like-button ${likedPosts.includes(post.post_id) ? 'liked' : ''}" data-post-id="${post.post_id}">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${likedPosts.includes(post.post_id) ? '#EA3323' : '#999999'}">
                    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                  </svg>
                  <span class="like-count">${post.like}</span>
                </button>
              </div>
              <div class="action-button comment-button" data-post-id="${post.post_id}">
                <span class="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999">
                    <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                  </svg>
                </span> 
                ${post.comments ? post.comments.length : 0}
              </div>
            </div>
            <div class="comments-section" id="comments-${post.post_id}" style="display: none;">
              <div class="comments-container">
                ${post.comments && post.comments.length > 0
                        ? post.comments.map(comment => `
                      <div class="comment">
                        <div class="comment-user">${comment.name}</div>
                        <div class="comment-text">${comment.comment}</div>
                      </div>
                    `).join('')
                        : '<div class="no-comments">No comments yet</div>'
                    }
              </div>
              <div class="add-comment">
                <input type="text" placeholder="Add a comment..." class="comment-input" />
                <button class="submit-comment" data-post-id="${post.post_id}">Comment</button>
              </div>
            </div>
          `;

                // Add the card to the section
                latestCausesSection.appendChild(causeCard);

                // Add event listener to the like button
                const likeButton = causeCard.querySelector('.like-button');
                likeButton.addEventListener('click', function () {
                    const postId = parseInt(this.getAttribute('data-post-id'));

                    // Check if the post is already liked
                    if (!likedPosts.includes(postId)) {
                        // Update the like count in the posts array
                        const postIndex = posts.findIndex(p => p.post_id === postId);
                        if (postIndex !== -1) {
                            posts[postIndex].like += 1;

                            // Update localStorage
                            localStorage.setItem('posts', JSON.stringify(posts));

                            // Update the like count in the UI
                            const likeCount = this.querySelector('.like-count');
                            likeCount.textContent = posts[postIndex].like;

                            // Add the post to the likedPosts array in sessionStorage
                            likedPosts.push(postId);
                            sessionStorage.setItem('likedPosts', JSON.stringify(likedPosts));

                            // Disable the button and change its appearance
                            this.classList.add('liked');
                            this.disabled = true;
                            this.querySelector('svg').setAttribute('fill', '#EA3323');
                        }
                    }
                });

                // Add event listener for the comment button
                const commentButton = causeCard.querySelector('.comment-button');
                commentButton.addEventListener('click', function () {
                    const postId = parseInt(this.getAttribute('data-post-id'));
                    const commentsSection = document.getElementById(`comments-${postId}`);

                    // Toggle comments visibility
                    if (commentsSection.style.display === 'none') {
                        commentsSection.style.display = 'block';
                    } else {
                        commentsSection.style.display = 'none';
                    }
                });

                // Add event listener for submitting new comments
                const submitButton = causeCard.querySelector('.submit-comment');
                submitButton.addEventListener('click', function () {
                    const postId = parseInt(this.getAttribute('data-post-id'));
                    const commentInput = this.parentElement.querySelector('.comment-input');
                    const commentText = commentInput.value.trim();

                    if (commentText) {
                        // Get current user (in a real app, you'd get this from the logged-in user)
                        const loggedInUsers = JSON.parse(localStorage.getItem('isLoggedin')) || [];
                        const currentUser = users.find(u => {
                            const loginStatus = loggedInUsers.find(login => login.user_id === u.id);
                            return loginStatus && loginStatus.is_loggedin;
                        });

                        if (currentUser) {
                            // Add the new comment
                            const postIndex = posts.findIndex(p => p.post_id === postId);

                            if (postIndex !== -1) {
                                // Initialize comments array if it doesn't exist
                                if (!posts[postIndex].comments) {
                                    posts[postIndex].comments = [];
                                }

                                // Create new comment object
                                const newComment = {
                                    id: posts[postIndex].comments.length + 1,
                                    name: currentUser.name,
                                    comment: commentText
                                };

                                // Add to post's comments
                                posts[postIndex].comments.push(newComment);

                                // Update localStorage
                                localStorage.setItem('posts', JSON.stringify(posts));

                                // Update UI
                                const commentsContainer = document.querySelector(`#comments-${postId} .comments-container`);
                                // Clear "no comments" message if present
                                if (commentsContainer.innerHTML.includes('No comments yet')) {
                                    commentsContainer.innerHTML = '';
                                }

                                // Add the new comment to UI
                                const commentElement = document.createElement('div');
                                commentElement.className = 'comment';
                                commentElement.innerHTML = `
                    <div class="comment-user">${currentUser.name}</div>
                    <div class="comment-text">${commentText}</div>
                  `;
                                commentsContainer.appendChild(commentElement);

                                // Clear the input
                                commentInput.value = '';

                                // Update the comment count
                                const commentCount = causeCard.querySelector('.comment-button');
                                commentCount.innerHTML = `
                    <span class="action-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999">
                        <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                      </svg>
                    </span> 
                    ${posts[postIndex].comments.length}
                  `;
                            }
                        } else {
                            alert('You need to be logged in to comment');
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error parsing post data:', error);
        }
    } else {
        console.log('No post data found in local storage');
    }
});