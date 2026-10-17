/*
 * PWA Service Worker — caching only.
 * Intentionally contains NO business logic and NO synchronization logic.
 * Its single responsibility is to make the application shell and its static
 * assets (HTML, CSS, JS, images, fonts) available offline.
 */

const CACHE_VERSION = '1.3.1';
const CACHE_NAME = `core-pwa-${CACHE_VERSION}`;
const APP_SHELL_URL = '/index.html';

// Fonts of the PDF generator: fetched with fetch() (no request destination), so they
// are precached and served cache-first to generate PDFs offline.
const STATIC_FILE_URLS = [
  '/fonts/arimo-1.33/Arimo-Regular.ttf',
  '/fonts/arimo-1.33/Arimo-Bold.ttf',
  '/fonts/arimo-1.33/Arimo-Italic.ttf',
];

const PRECACHE_URLS = [
  '/',
  APP_SHELL_URL,
  '/manifest.json',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  ...STATIC_FILE_URLS,
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

  if (isSameOrigin && STATIC_FILE_URLS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

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

function cacheFirst(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    cache.match(request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        }),
    ),
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
