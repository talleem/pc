document.addEventListener("DOMContentLoaded", function() {
    // Check if the localStorage variable `arpage` is set to 'ar'
    if (localStorage.getItem("arpage") === "ar") {
        // Translate the page elements to Arabic
        document.querySelector("h1").innerHTML = "السماح بالدخول باستخدام حساب الغوغل";
        
        // Translate the <h2> elements
        const h2Elements = document.querySelectorAll("h2");
        h2Elements[0].innerHTML = "تذكر: سجل الدخول باستخدام حساب غوغل";
        h2Elements[1].innerHTML = "الذي استخدمته في شاشة الدخول الرئيسية";
        h2Elements[2].innerHTML = "أو اضغط على زر خروج للعودة للشاشة الرئيسية";

        // Translate the button texts
        document.querySelector("#oauthButton h4").innerHTML = "أضغط لتسجيل الدخول بحساب غوغل";
        document.querySelector("#signout h4").innerHTML = "خروج";
    }
});
