const CACHE_NAME = 'japan-trip-v2';
const urlsToCache = [
  '/Japan-trip/',
  '/Japan-trip/index.html',
  '/Japan-trip/osaka.html',
  '/Japan-trip/fuji.html',
  '/Japan-trip/tokyo.html',
  '/Japan-trip/shanghai.html',
  '/Japan-trip/budget.html',
  '/Japan-trip/toilet-map.html',
  '/Japan-trip/visa.html',
  '/Japan-trip/CSS/style.css',
  '/Japan-trip/js/currency.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Cache error:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
  );
});