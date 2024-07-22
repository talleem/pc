// Function to switch tabs
function openTab(evt, tabName) {
    // Hide all tab content
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Deactivate all tab buttons
    var tablinks = document.getElementsByClassName("tablink");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the clicked tab content and mark the button as active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
