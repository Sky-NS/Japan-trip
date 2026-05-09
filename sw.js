// Service Worker для PWA
const CACHE_NAME = 'japan-trip-v2';
const urlsToCache = [
  'index.html',
  'osaka.html',
  'fuji.html',
  'tokyo.html',
  'shanghai.html',
  'budget.html',
  'toilet-map.html',
  'visa.html',
  'CSS/style.css',
  'js/currency.js'
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