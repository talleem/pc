function translateGoogleMeetPage() {
    // Translate the first <h4> tag
    const firstH4 = document.querySelector('h4:nth-of-type(1)');
    if (firstH4) {
        firstH4.textContent = 'أدخل قائمة بريد الكتروني لمستخدمي غرفة اجتماعات غوغل';
    }

    // Translate the second <h4> tag
    const secondH4 = document.querySelector('h4:nth-of-type(2)');
    if (secondH4) {
        secondH4.textContent = 'مع بريد المستخدم الحالي أو مدير الغرفة الظاهر باللون الأزرق - ضروري -';
    }
    // Translate the <h4> inside the <div> with id="texttip"
    const textTip = document.getElementById('texttip');
    if (textTip) {
        textTip.innerHTML = 'أدخل : بريد المدعوين للاجتماع - وقت بدء الاجتماع - وقت الانتهاء - وصف الاجتماع لتكوين اجتماع جديد';
    }
     // Translate the buttons
    const sendInvitButton = document.getElementById('sendinvit');
    if (sendInvitButton) {
        sendInvitButton.textContent = 'أضف مشارك';
    }

    const deleteAttendeeButton = document.getElementById('deleteattendee1');
    if (deleteAttendeeButton) {
        deleteAttendeeButton.textContent = 'احذف مشارك';
    }

    const loadInvitButton = document.getElementById('loadinvit');
    if (loadInvitButton) {
        loadInvitButton.textContent = 'اعرض الاجتماع';
    }

    const updateInvitButton = document.getElementById('updateinvit');
    if (updateInvitButton) {
        updateInvitButton.textContent = 'عدل الاجتماع';
    }

    const createInvitButton = document.getElementById('createinvit');
    if (createInvitButton) {
        createInvitButton.textContent = 'انشئ الاجتماع';
    }
}

