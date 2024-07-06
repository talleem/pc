document.addEventListener('DOMContentLoaded', function() {
  const validEmailList = document.getElementById('validEmailList');
  const receiverEmailInput = document.getElementById('receiverEmail');

  // Event listener for double-click on a valid email address
  validEmailList.addEventListener('dblclick', function(event) {
    if (event.target.tagName === 'LI') {
      const selectedEmail = event.target.textContent.trim();

      // Set the receiver's email field value and clear textarea
      receiverEmailInput.value = selectedEmail;
      receiverEmailInput.focus(); // Optional: focus on the input field after setting value
    }
  });
});
