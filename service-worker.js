self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('hello-world-cache').then(cache => {
            return cache.addAll([
               '/hello-world-page/',
                '/hello-world-page/index.html',
                '/hello-world-page/style.css',
                '/hello-world-page/script.js',
'/hello-world-page/store-token.js',
'/hello-world-page/store-token2.js',
'/hello-world-page/store-token3.js',
'/hello-world-page/store-token4.js',
'/hello-world-page/icons/icon-192x192.png',
'/hello-world-page/icons/icon-512x512.png',
'/hello-world-page/G.gif',
'/hello-world-page/OAuthConsentScreen.html',
'/hello-world-page/PrivacyPage.html',
'/hello-world-page/bg.png',
'/hello-world-page/callback.html',
'/hello-world-page/clearscript.js',
'/hello-world-page/collegeposts.html',
'/hello-world-page/collegereels.html',
'/hello-world-page/fileupload.js',
'/hello-world-page/firebasedash.html',
'/hello-world-page/getLoggedStudents.js',
'/hello-world-page/googlemeetpage.html',
'/hello-world-page/index.html',
'/hello-world-page/instaresume.js',
'/hello-world-page/instavideo.js',
'/hello-world-page/joinedstudents.html',
'/hello-world-page/loadattendeailfromfirestore.js',
'/hello-world-page/loctures.html',
'/hello-world-page/loggedinstudents.webp',
'/hello-world-page/loginscreen.html',
'/hello-world-page/logo.png',
'/hello-world-page/manifest.json',
'/hello-world-page/meetingeventsnotification.js',
'/hello-world-page/pagewithtabs.html',
'/hello-world-page/persondetails.html',
'/hello-world-page/persondetailsbg.png',
'/hello-world-page/phone.png',
'/hello-world-page/populatewithcontacts.js',
'/hello-world-page/registertofirebase.html',
'/hello-world-page/resend-verification.html',
'/hello-world-page/resumebg.webp',
'/hello-world-page/script.js',
'/hello-world-page/script1.js',
'/hello-world-page/scripts.js',
'/hello-world-page/sendinvtoattendee.js',
'/hello-world-page/service-worker.js',
'/hello-world-page/signout.js',
'/hello-world-page/staff.webp',
'/hello-world-page/staffresumes.html',
'/hello-world-page/tabsstyles.css',
'/hello-world-page/updatenotes.js',
'/hello-world-page/updateuserstbl.js'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
