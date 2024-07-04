document.getElementById('sendEmailButton').addEventListener('click', function() {
    const receiverEmail = document.getElementById('receiverEmail').value;
    const messageBody = document.getElementById('messageBody').value;

    // Replace with your actual OAuth flow logic to obtain and use the access token
    const accessToken = 'ya29.a0AXooCgsLbYLVK6i8vi3fW3XWxizPENSfF665CxFdGis9ShLZt5PAAs3U6Itx2nvte1cnyBeqCUKs1oRt5ps-3wekBBJJR-hX6pP-oBhBiOq0iTNLhkaCUcId4MDuQpXP9WCoTQ5ee9sGungKPapCI_08gd-bQMHR3OhqrAaO2dP_EgZeaCgYKAZYSARESFQHGX2Mis_HYmzufYKC6p3QnC_w4Kw0183'; // You need to retrieve this from your OAuth flow

    const email = {
        to: receiverEmail,
        subject: 'Test Email',
        message: messageBody
    };

    sendMessage(accessToken, email);
});

function sendMessage(accessToken, email) {
    const apiUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

    const headers = new Headers({
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    });

    const raw = makeEmail(email);

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(raw)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.status}`);
        }
        console.log('Email sent successfully!');
    })
    .catch(error => {
        console.error('Error sending email:', error);
    });
}

function makeEmail(email) {
    const message = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        `To: ${email.to}\n`,
        'MIME-Version: 1.0\n',
        'Subject: =?utf-8?B?' + btoa(email.subject) + '?=\n',
        'Content-Transfer-Encoding: 7bit\n\n',
        email.message
    ].join('');

    return {
        raw: btoa(message).replace(/\+/g, '-').replace(/\//g, '_')
    };
}
