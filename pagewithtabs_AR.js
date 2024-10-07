document.addEventListener("DOMContentLoaded", function() {
    // Check if the localStorage variable `arpage` is set to 'ar'
    if (localStorage.getItem("arpage") === "ar") {
        // Translate the button texts into Arabic
        const buttons = document.querySelectorAll('.tablink');
        
        if (buttons.length >= 7) {
            buttons[0].innerHTML = "غرفة الاجتماعات G-meet";
            buttons[1].innerHTML = "Reels مقاطع";
            buttons[2].innerHTML = "Posts منشورات";
            buttons[3].innerHTML = "Resumes سير ذاتية";
            buttons[4].innerHTML = "lectures archive  محتوى";
            buttons[5].innerHTML = "Admin مدير";
            buttons[6].innerHTML = "sign out خروج";
            
            // Make the text bold for each button
            buttons.forEach(button => {
                button.style.fontWeight = "bold";
            });
        }
    }
});
