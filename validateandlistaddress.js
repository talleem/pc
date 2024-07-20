// Function to validate an email address
function isValidEmail(email) {
  // Regular expression for basic email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('receiverEmail');
  const emailList = document.getElementById('validEmailList');

  // Initialize an array to store unique valid emails
  let validEmails = [];

  // Function to update the email list display
  function updateEmailList() {
    // Clear the current list
   // emailList.innerHTML = '';

    // Add each valid email to the list
    validEmails.forEach(email => {
      const li = document.createElement('li');
      li.textContent = email;
      emailList.appendChild(li);
    });
  }

  // Event listener for when textarea is focused
  textarea.addEventListener('focus', function() {
    // Update the email list display
    updateEmailList();
  });

  // Event listener for when a key is pressed in the textarea
  textarea.addEventListener('keyup', function(event) {
    if (event.key === 'Enter' || event.key === ',') {
      // Split the textarea value by newline or comma to get potential email addresses
      const emails = textarea.value.split(/[\n,]+/);

      // Validate each email and add it to the validEmails array if unique and valid
      emails.forEach(email => {
        email = email.trim(); // Trim whitespace

        if (email && isValidEmail(email) && !validEmails.includes(email)) {
          validEmails.push(email);
        }
      });

      // Clear the textarea and update the email list display
      textarea.value = '';
      updateEmailList();
    }
  });
});
