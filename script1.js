document.getElementById('sendEmailButton').addEventListener('click', function() {
    const receiverEmail = document.getElementById('receiverEmail').value;
    const messageBody = document.getElementById('messageBody').value;

    // Replace with your actual OAuth flow logic to obtain and use the access token
    const accessToken = 'ya29.a0AXooCgvcvIZq9TqDtlVF4nboFQWsOr6lJNzeLp-XLM7_q8iA5YIzDwiB-3GPDLR_IYuPziuUlIgaOA6fv1y-2RCisUALSE1phH1M_igK3kYvunZ7Z7uFXCON1wWjBJA5SVpSG2r_U8zVW_FdIN1zlS3i1RXGjaFI_sKNjlxd8NI3p8zwaCgYKAbESARESFQHGX2MiRxiJUJjHDJTs_s4NLMLMGQ0183'; // You need to retrieve this from your OAuth flow localStorage.getItem('accessToken')
     
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
