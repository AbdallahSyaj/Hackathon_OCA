  (function () {
    emailjs.init("kDoWlQZQ1-a2sCMNG");
  })();
  
  document.addEventListener("DOMContentLoaded", function () {
    document
      .querySelector(".contact-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
  
        let name = document
          .querySelector(".form-control[name='name']")
          .value.trim();
        let email = document
          .querySelector(".form-control[name='email']")
          .value.trim();
        let phone = document
          .querySelector(".form-control[name='phone']")
          .value.trim();
        let subject = document
          .querySelector(".form-control[name='subject']")
          .value.trim();
        let message = document
          .querySelector(".form-control[name='message']")
          .value.trim();
        let responseMessage = document.querySelector(".response-message");
        let submitButton = document.querySelector(".btn-submit");
  
        if (!name || !email || !message) {
          responseMessage.innerText = "❌ Please fill in all required fields.";
          responseMessage.style.color = "red";
          return;
        }
  
        submitButton.innerHTML = "Sending...";
        submitButton.disabled = true;
  
        let params = { name, email, phone, subject, message };
  
        emailjs
          .send("service_w5kt754", "template_g91p2hr", params)
          .then(function (response) {
            if (response.status === 200) {
              // Ensure success response
              console.log("✅ Email sent successfully!", response);
  
              responseMessage.innerText = "✅ Message sent successfully!";
              responseMessage.style.color = "green";
  
              document.querySelector(".contact-form").reset();
  
              setTimeout(() => {
                responseMessage.innerText = "";
              }, 5000);
            } else {
              throw new Error("Email sent but returned an unexpected response.");
            }
          })
          .catch(function (error) {
            console.error("❌ Failed to send email:", error);
          })
          .finally(function () {
            submitButton.innerHTML = "Send Message";
            submitButton.disabled = false;
          });
      });
  });