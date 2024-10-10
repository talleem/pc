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
        sendInvitButton.style.fontWeight = 'bold';  // Make bold
    }

    const deleteAttendeeButton = document.getElementById('deleteattendee1');
    if (deleteAttendeeButton) {
        deleteAttendeeButton.textContent = 'احذف مشارك';
        deleteAttendeeButton.style.fontWeight = 'bold';  // Make bold
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
     // Translate "Repeat Every:" and "No of Occurs:" titles using exact text search
    const labels = document.querySelectorAll('span');
    labels.forEach(label => {
        if (label.textContent.includes('Repeat Every:')) {
            label.textContent = 'كرر التنبيه كل:';
        } else if (label.textContent.includes('No of Occurs:')) {
            label.textContent = 'عدد مرات التكرار:';
        }
    });
    // Translate the "Repeat Frequency" dropdown options
    const repeatFrequencySelect = document.getElementById('repeatFrequency');
    if (repeatFrequencySelect) {
        const options = repeatFrequencySelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === 'Daily') {
                options[i].textContent = 'يومي';
            } else if (options[i].value === 'Weekly') {
                options[i].textContent = 'أسبوعي';
            } else if (options[i].value === 'Monthly') {
                options[i].textContent = 'شهري';
            } else if (options[i].value === 'Yearly') {
                options[i].textContent = 'سنوي';
            }
        }
    }
    // Translate input placeholders
    const attendeeEmailInput = document.getElementById('attendeeEmail');
    if (attendeeEmailInput) {
        attendeeEmailInput.placeholder = 'أدخل بريد المشاركين هنا..';
    }

    const meetingDescInput = document.getElementById('meetingdesc');
    if (meetingDescInput) {
        meetingDescInput.placeholder = 'أدخل وصف الاجتماع هنا';
    }

    const startTimeInput = document.getElementById('starttime');
    if (startTimeInput) {
        startTimeInput.placeholder = 'أدخل وقت بداية الاجتماع هنا';
    }

    const endTimeInput = document.getElementById('endtime');
    if (endTimeInput) {
        endTimeInput.placeholder = 'أدخل وقت نهاية الاجتماع هنا';
    }
}
