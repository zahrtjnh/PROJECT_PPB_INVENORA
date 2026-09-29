const CACHE_NAME = 'invenora-cache-v2';

const urlsToCache = [
    './',
    './index.html',
    './script.js',
    './style.css',
    './manifest.json',
    './invenora-logo.png',
    './icon-192.png',
    './icon-512.png',
    './icon-maskable-192.png',
    './icon-maskable-512.png'
];

// Install Service Worker & cache assets (satu per satu, supaya 1 file gagal tidak menggagalkan semuanya)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(
                urlsToCache.map((url) =>
                    cache.add(url).catch((err) => console.warn('Gagal cache:', url, err))
                )
            )
        )
    );

    self.skipWaiting();
});

// Fetch assets
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return (
                cached ||
                fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                })
            );
        })
    );
});

// Activate Service Worker & membersihkan cache lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        )
    );

    self.clients.claim();
});
