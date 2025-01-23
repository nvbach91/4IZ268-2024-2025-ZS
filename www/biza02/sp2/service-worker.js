const CACHE_NAME = 'travel-planner-v1';
const CACHE_URLS = [
    './', // Relative paths for caching
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/router.js',
    './js/config.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_URLS))
    );
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
        if (response) return response; // Return cached response if available
        return fetch(event.request).catch(() => new Response('Offline', {status: 503, statusText: 'Service Unavailable'}));
    })
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});