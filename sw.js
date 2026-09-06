/* PACU — offline service worker.
   Navigation: network first, so a new upload appears next time the phone is online.
   Everything else: cache first, so fonts and icons never wait on the network. */

const CACHE = 'pacu-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/fonts.css',
  './icons/apple-touch-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './fonts/plus-jakarta-sans-latin-300-normal.woff2',
  './fonts/plus-jakarta-sans-latin-400-normal.woff2',
  './fonts/plus-jakarta-sans-latin-500-normal.woff2',
  './fonts/plus-jakarta-sans-latin-600-normal.woff2',
  './fonts/plus-jakarta-sans-latin-700-normal.woff2',
  './fonts/plus-jakarta-sans-latin-800-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-300-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-400-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-500-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-600-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-700-normal.woff2',
  './fonts/plus-jakarta-sans-latin-ext-800-normal.woff2',
  './fonts/noto-sans-georgian-georgian-400-normal.woff2',
  './fonts/noto-sans-georgian-georgian-500-normal.woff2',
  './fonts/noto-sans-georgian-georgian-600-normal.woff2',
  './fonts/noto-sans-georgian-georgian-700-normal.woff2'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                              .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;   // reference links go straight to the network

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
          return response;
        })
        .catch(function () {
          return caches.match('./index.html').then(function (hit) {
            return hit || caches.match('./');
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (hit) {
      if (hit) return hit;
      return fetch(request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var copy = response.clone();
          caches.open(CACHE).then(function (c) { c.put(request, copy); });
        }
        return response;
      });
    })
  );
});