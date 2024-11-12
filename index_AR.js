document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("topButton").addEventListener("click", function() {
        localStorage.setItem("arpage", "ar");
        
        // Check if localStorage has the Arabic page setting after the button click
        if (localStorage.getItem("arpage") === "ar") {
            // Translate main heading text
            const h1Elements = document.querySelectorAll("h1, h2, h3, h4");
            h1Elements.forEach(el => {
                if (el.textContent.includes("This is college Tallem Application")) {
                    el.innerHTML = "<b>تطبيق معهد (تعلم) الالكتروني <font color='#FF0000'> ملاحظة: لا يزال قيد التطوير </font></b>";
                    el.classList.add("arabic");
                }
            });
            
            // Translate "Enter the application" link text
            const entryLinks = document.querySelectorAll("a[href='https://engineerr1983.github.io/hello-world-page/loginscreen.html'] h1, h2, h3");
            entryLinks.forEach(el => {
                if (el.textContent.includes("Enter the application from here")) {
                    el.innerHTML = "<b>ادخل التطبيق من هنا</b>";
                    el.classList.add("arabic");
                }
            });

            // Translate the descriptive text about application contents
            const h3Elements = document.querySelectorAll("h1, h2, h3, h4");
            h3Elements.forEach(el => {
                if (el.textContent.includes("The college application contains Conference meet room powered by Google Meet")) {
                    el.innerHTML = "<b>تطبيق المعهد يحتوي على غرفة شات اجتماعات مدعوم من غوغل / منشورات المعهد ومحاضرات وسير ذاتية للمدرسين / صفحة محتوى المعهد تحتوي على المحاضرات وأية ملفات أخرى</b>";
                    el.classList.add("arabic");
                }
            });
        }
    });
});
