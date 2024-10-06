document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("topButton").addEventListener("click", function() {
        localStorage.setItem("arpage", "ar");
        
        // Check if localStorage has the Arabic page setting after the button click
        if (localStorage.getItem("arpage") === "ar") {
            // Replace text with Arabic equivalent
            const arabicH2 = "<b>تطبيق معهد (تعلم) الالكتروني <font color='#FF0000'> ملاحظة: لا يزال قيد التطوير </font></b>";
            document.querySelector("h2").innerHTML = arabicH2;
            document.querySelector("h2").classList.add("arabic"); // Add Arabic class
            
            // Replace the application entry link with Arabic
            const arabicLink = "<b>ادخل التطبيق من هنا</b>";
            document.querySelector("a[href='https://engineerr1983.github.io/hello-world-page/loginscreen.html'] h3").innerHTML = arabicLink;
            document.querySelector("a[href='https://engineerr1983.github.io/hello-world-page/loginscreen.html'] h3").classList.add("arabic"); // Add Arabic class

            // Replace the second <h4> (index 1) with the Arabic equivalent
            const arabicH4 = "<b>تطبيق المعهد يحتوي على غرفة شات اجتماعات مدعوم من غوغل / منشورات المعهد ومحاضرات وسير ذاتية للمدرسين / صفحة محتوى المعهد تحتوي على المحاضرات وأية ملفات أخرى</b>";
            document.querySelectorAll("h4")[1].innerHTML = arabicH4;
            document.querySelectorAll("h4")[1].classList.add("arabic"); // Add Arabic class
        }
    });
});
