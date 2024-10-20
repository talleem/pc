// waitingalert.js

let waitingAlert;

function showWaitingAlert() {
    waitingAlert = document.createElement('div');
    waitingAlert.id = 'waitingAlert';
    waitingAlert.style.position = 'fixed';
    waitingAlert.style.top = '0';
    waitingAlert.style.left = '0';
    waitingAlert.style.width = '100%';
    waitingAlert.style.height = '100%';
    waitingAlert.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    waitingAlert.style.display = 'flex';
    waitingAlert.style.justifyContent = 'center';
    waitingAlert.style.alignItems = 'center';
    waitingAlert.style.color = 'white';
    waitingAlert.style.fontSize = '20px';
    waitingAlert.style.fontWeight = 'bold';
    waitingAlert.innerHTML = 'Please wait while we save the video into the Database, don\'t close the browser until the operation is completed.';

   document.body.appendChild(waitingAlert);
}

function hideWaitingAlert() {
    if (waitingAlert) {
        waitingAlert.remove();
    }
}
