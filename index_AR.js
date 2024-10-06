document.addEventListener("DOMContentLoaded", function() {
    // Set the localStorage variable when the button is clicked and check its value
    document.getElementById("topButton").addEventListener("click", function() {
        localStorage.setItem("arpage", "ar");
        
        // Check if localStorage has the Arabic page setting after the button click
        if (localStorage.getItem("arpage") === "ar") {
            // Replace text with Arabic equivalent
            document.querySelector("h3").innerHTML = "<b>هذا تطبيق كوليج تالم <font color='#FF0000'> ملاحظة: لا يزال قيد التطوير </font></b>";
            
            // Replace the application entry link with Arabic
            document.querySelector("a[href='https://engineerr1983.github.io/hello-world-page/loginscreen.html'] h3").innerHTML = "<b>ادخل التطبيق من هنا</b>";
            
            // Replace the second <h4> (index 1) with the Arabic equivalent
            document.querySelectorAll("h4")[1].innerHTML = "<b>يحتوي التطبيق على غرفة اجتماعات مدعومة بواسطة Google Meet / منشورات الكلية وسير المحاضرين (السير الذاتية والفيديوهات) / المحاضرات وأي ملفات أخرى يتم تحميلها يدويًا</b>";
        }
    });
});
