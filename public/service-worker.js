/*
 * PWA Service Worker — caching only.
 * Intentionally contains NO business logic and NO synchronization logic.
 * Its single responsibility is to make the application shell and its static
 * assets (HTML, CSS, JS, images, fonts) available offline.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `core-pwa-${CACHE_VERSION}`;
const APP_SHELL_URL = '/index.html';

const PRECACHE_URLS = [
  '/',
  APP_SHELL_URL,
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
];

const CACHEABLE_DESTINATIONS = ['script', 'style', 'image', 'font'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  // App shell: network-first with offline fallback so updates are picked up
  // when online but the app still loads when offline.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithShellFallback(request));
    return;
  }

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCacheableAsset = CACHEABLE_DESTINATIONS.includes(request.destination);

  if (isSameOrigin && isCacheableAsset) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

function networkFirstWithShellFallback(request) {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() =>
      caches.match(request).then((cached) => cached || caches.match(APP_SHELL_URL)),
    );
}

function staleWhileRevalidate(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    }),
  );
}
