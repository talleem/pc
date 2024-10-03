self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('hello-world-cache').then(cache => {
            return cache.addAll([
                '/hello-world-page/',
                '/hello-world-page/index.html',
                '/hello-world-page/style.css',
                '/hello-world-page/script.js'
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
