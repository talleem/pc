document.addEventListener("DOMContentLoaded", function() {
    // Check if the localStorage variable `arpage` is set to 'ar'
    if (localStorage.getItem("arpage") === "ar") {
        // Translate the page elements to Arabic
        const h1Element = document.querySelector("h1");
        document.querySelector("h1").innerHTML = "السماح بالدخول باستخدام حساب الغوغل";

         // Apply styling to move it to the horizontal center and slightly to the right
        h1Element.style.textAlign = "center";
        h1Element.style.marginRight = "100px"; // Adjust this value to shift it more or less to the right
        
        // Translate the <h2> elements
        const h2Elements = document.querySelectorAll("h2");
        h2Elements[0].innerHTML = "تذكر: سجل الدخول باستخدام حساب غوغل";
        h2Elements[1].innerHTML = "الذي استخدمته في شاشة الدخول الرئيسية";
        h2Elements[2].innerHTML = "أو اضغط على زر خروج للعودة للشاشة الرئيسية";
        h2Elements[3].innerHTML = "";
        // Translate the button texts
        document.querySelector("#oauthButton h4").innerHTML = "أضغط لتسجيل الدخول بحساب غوغل";
        document.querySelector("#signout h4").innerHTML = "خروج";
    }
});
