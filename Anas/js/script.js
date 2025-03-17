






  document.addEventListener('DOMContentLoaded', function() {
    // Load activities from localStorage
    let activities = [];
    const storedActivities = localStorage.getItem('activities');
    
    if (storedActivities) {
      activities = JSON.parse(storedActivities);
    } else {
      console.error('No activities found in localStorage');
    }
    
    const container = document.getElementById('activities-container');
    
    // Create and add filter controls at the top of the container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    
    // Get unique categories from activities
    const categories = ['All'];
    activities.forEach(activity => {
      if (activity.category && !categories.includes(activity.category)) {
        categories.push(activity.category);
      }
    });
    
    // Create filter dropdown
    const filterSelect = document.createElement('select');
    filterSelect.id = 'category-filter';
    filterSelect.className = 'category-filter';
    
    // Add options to select
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      filterSelect.appendChild(option);
    });
    
    // Create label for filter
    const filterLabel = document.createElement('label');
    filterLabel.htmlFor = 'category-filter';
    filterLabel.textContent = 'Filter by Category: ';
    
    // Append filter elements to filter container
    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSelect);
    
    // Insert filter container before the activity cards
    document.querySelector('.container').insertBefore(filterContainer, document.querySelector('.container').firstChild);
    
    // Add event listener to filter
    filterSelect.addEventListener('change', function() {
      const selectedCategory = this.value;
      displayActivities(selectedCategory);
    });
    
    // Function to display activities based on category filter
    function displayActivities(categoryFilter = 'All') {
      // Clear current activities
      const activityContainer = document.getElementById('activities-container');
      // Remove existing activity cards but keep the filter
      const existingCards = activityContainer.querySelectorAll('.activity-card, .no-activities');
      existingCards.forEach(card => card.remove());
      
      // Filter activities based on selected category
      const filteredActivities = categoryFilter === 'All' 
        ? activities 
        : activities.filter(activity => activity.category === categoryFilter);
      
      if (filteredActivities.length > 0) {
        // Create activity cards for filtered activities
        filteredActivities.forEach(activity => {
          const card = createActivityCard(activity);
          activityContainer.appendChild(card);
        });
        
        // Add event listeners to all buttons
        document.querySelectorAll('.btn-donate, .btn-volunteer').forEach(button => {
          button.addEventListener('click', function() {
            const activityId = this.getAttribute('data-activity-id');
            const buttonType = this.getAttribute('data-type');
            const activity = activities.find(act => act.activity_id == activityId);
            
            if (activity) {
              showModal(activity, buttonType);
            }
          });
        });
      } else {
        // Show message if no activities found
        const noActivitiesDiv = document.createElement('div');
        noActivitiesDiv.className = 'no-activities';
        noActivitiesDiv.textContent = categoryFilter === 'All' 
          ? 'No activities found' 
          : `No activities found in category: ${categoryFilter}`;
        activityContainer.appendChild(noActivitiesDiv);
      }
    }
    
    // Function to create an activity card
    function createActivityCard(activity) {
      const card = document.createElement('div');
      card.className = 'activity-card';
      
      // Prepare image HTML
      let imageHTML = '';
      if (activity.activity_image) {
        imageHTML = `<img src="${activity.activity_image}" alt="${activity.activity_name || 'Activity'}" class="activity-image">`;
      } else {
        imageHTML = `<div class="image-placeholder">No image available</div>`;
      }
      
      // Create location detail if present
      let locationHTML = '';
      if (activity.location) {
        locationHTML = `
          <div class="detail-item">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${activity.location}</span>
          </div>
        `;
      }
      
      // Create time detail if present
      let timeHTML = '';
      if (activity.time) {
        timeHTML = `
          <div class="detail-item">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>${activity.time}</span>
          </div>
        `;
      }
      
      // Create hours detail if present
      let hoursHTML = '';
      if (activity.hours) {
        hoursHTML = `
          <div class="detail-item">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <circle cx="12" cy="15" r="2"></circle>
              <polyline points="12 13 12 15 13 16"></polyline>
            </svg>
            <span>${activity.hours} hours</span>
          </div>
        `;
      }
      
      // Create category badge if present
      let categoryHTML = '';
      if (activity.category) {
        categoryHTML = `<div class="category-badge">${activity.category}</div>`;
      }
      
      // Assemble the card HTML
      card.innerHTML = `
        ${imageHTML}
        ${categoryHTML}
        <div class="activity-content">
          <h3 class="activity-name">${activity.activity_name || "Unnamed Activity"}</h3>
          <p class="activity-description">${activity.activity_description || "No description available"}</p>
          
          <div class="activity-details">
            ${locationHTML}
            ${timeHTML}
            ${hoursHTML}
          </div>
          
          ${createButton(activity.type, activity.activity_id)}
        </div>
      `;
      
      return card;
    }
    
    // Function to create button based on activity type
    function createButton(type, activityId) {
      let buttonHTML = '';
      
      switch(type) {
        case 'donate':
          buttonHTML = `<button class="btn btn-donate" data-activity-id="${activityId}" data-type="donate">Donate Now</button>`;
          break;
        case 'contribute':
          buttonHTML = `<button class="btn btn-volunteer" data-activity-id="${activityId}" data-type="volunteer">Volunteer</button>`;
          break;
        case 'both':
          buttonHTML = `
            <div class="button-group">
              <button class="btn btn-donate" data-activity-id="${activityId}" data-type="donate">Donate</button>
              <button class="btn btn-volunteer" data-activity-id="${activityId}" data-type="volunteer">Volunteer</button>
            </div>
          `;
          break;
        default:
          buttonHTML = '';
      }
      
      return buttonHTML;
    }
    
    // Initial load of activities
    displayActivities('All');
    
    // Rest of the modal related code (showModal, closeModal, etc.)
    // Create modal container if it doesn't exist
    if (!document.getElementById('modal-container')) {
      const modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      modalContainer.className = 'modal-container';
      document.body.appendChild(modalContainer);
    }
    
    // Function to show modal
    function showModal(activity, type) {
      const modalContainer = document.getElementById('modal-container');
      
      let modalContent = '';
      
      if (type === 'donate') {
        modalContent = `
          <div class="modal-content donate-modal">
            <div class="modal-header">
              <h2>Donate to ${activity.activity_name}</h2>
              <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
              <p>Your donation will help support this important cause.</p>
              <form id="donate-form">
                <div class="form-group">
                  <label for="donation-amount">Donation Amount (JD)</label>
                  <input type="number" id="donation-amount" min="1" step="1" required>
                </div>
                <div class="form-group">
                  <label for="payment-method">Payment Method</label>
                  <select id="payment-method" required>
                    <option value="">Select payment method</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank-transfer">Bank Transfer</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-donate">Confirm Donation</button>
                </div>
              </form>
            </div>
          </div>
        `;
      } else if (type === 'volunteer') {
        modalContent = `
          <div class="modal-content volunteer-modal">
            <div class="modal-header">
              <h2>Volunteer for ${activity.activity_name}</h2>
              <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
              <p>Thank you for your interest in volunteering! Please fill out the form below.</p>
              <form id="volunteer-form">
                <div class="form-group">
                  <label for="volunteer-hours">Hours Available</label>
                  <input type="number" id="volunteer-hours" min="1" max="${activity.hours || 8}" required>
                </div>
                <div class="form-group">
                  <label for="volunteer-message">Message (Optional)</label>
                  <textarea id="volunteer-message" rows="3"></textarea>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn btn-volunteer">Confirm</button>
                </div>
              </form>
            </div>
          </div>
        `;
      }
      
      modalContainer.innerHTML = modalContent;
      modalContainer.classList.add('show');
      
      // Add event listener to close button
      document.querySelector('.close-modal').addEventListener('click', function() {
        closeModal();
      });
      
      // Add event listener to click outside modal to close
      modalContainer.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
          closeModal();
        }
      });
      
      // Add event listener to forms
      const form = document.querySelector('#donate-form') || document.querySelector('#volunteer-form');
      if (form) {
        form.addEventListener('submit', function(event) {
          event.preventDefault();
          
          // Get the currently logged in user
          const loggedInUserData = getLoggedInUser();
          
          if (!loggedInUserData) {
            alert("You need to be logged in to perform this action.");
            closeModal();
            return;
          }
          
          let successMessage = "";
          
          // Update user stats based on form type
          if (form.id === 'donate-form') {
            // Handle donation
            const donationAmount = parseInt(document.getElementById('donation-amount').value, 10);
            if (donationAmount > 0) {
              // Update user's total donation
              loggedInUserData.user.total_donation += donationAmount;
              successMessage = `Thank you for your donation of ${donationAmount} JD!`;
              
              // Create a post about the donation
              createPost(loggedInUserData.user.id, loggedInUserData.user.name, 'Donation', 
                `Just donated ${donationAmount} JD to ${activity.activity_name}!`);
            }
          } else if (form.id === 'volunteer-form') {
            // Handle volunteer hours
            const volunteerHours = parseInt(document.getElementById('volunteer-hours').value, 10);
            if (volunteerHours > 0) {
              // Update user's volunteer hours
              loggedInUserData.user.volunter_hours += volunteerHours;
              successMessage = `Thank you for volunteering ${volunteerHours} hours!`;
              
              // Create a post about volunteering
              createPost(loggedInUserData.user.id, loggedInUserData.user.name, 'Volunteer', 
                `Just signed up to volunteer ${volunteerHours} hours for ${activity.activity_name}!`);
            }
          }
          
          // Save the updated user data
          updateUserData(loggedInUserData.user);
          
          // Show success message
          modalContainer.innerHTML = `
            <div class="modal-content success-modal">
              <div class="modal-header">
                <h2>Thank You!</h2>
                <button class="close-modal">&times;</button>
              </div>
              <div class="modal-body">
                <div class="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p>${successMessage}</p>
                <p>Your contribution has been recorded successfully!</p>
                <div class="form-actions">
                  <button class="btn btn-primary close-success">Close</button>
                </div>
              </div>
            </div>
          `;
          
          // Add event listener to new close button
          document.querySelector('.close-modal').addEventListener('click', closeModal);
          document.querySelector('.close-success').addEventListener('click', closeModal);
        });
      }
    }
    
    // Function to close modal
    function closeModal() {
      const modalContainer = document.getElementById('modal-container');
      modalContainer.classList.remove('show');
      modalContainer.innerHTML = '';
    }
    
    // Helper function to get logged in user
  function getLoggedInUser() {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const isLoggedin = JSON.parse(localStorage.getItem('isLoggedin')) || [];
      
      // Find the logged in user
      const loggedInStatus = isLoggedin.find(status => status.is_loggedin === true);
      
      if (!loggedInStatus) {
        return null;
      }
      
      // Find the user data
      const user = users.find(user => user.id === loggedInStatus.user_id);
      
      if (!user) {
        return null;
      }
      
      return { user, statusIndex: isLoggedin.indexOf(loggedInStatus) };
    } catch (error) {
      console.error('Error getting logged in user:', error);
      return null;
    }
  }
  
  // Helper function to update user data
  function updateUserData(updatedUser) {
    try {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Find and update the user in the array
      const userIndex = users.findIndex(user => user.id === updatedUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }
  
  // Helper function to create a new post
  function createPost(userId, userName, category, description) {
    try {
      const posts = JSON.parse(localStorage.getItem('posts')) || [];
      
      // Create a new post object
      const newPost = {
        post_id: posts.length > 0 ? Math.max(...posts.map(post => post.post_id)) + 1 : 1,
        user_id: userId,
        user_name: userName,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        category: category,
        description: description,
        like: 0,
        comments: []
      };
      
      // Add the new post to the posts array
      posts.push(newPost);
      
      // Save the updated posts to localStorage
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }
});


  