/*
 * PWA Service Worker — caching only.
 * Intentionally contains NO business logic and NO synchronization logic.
 * Its single responsibility is to make the application shell and its static
 * assets (HTML, CSS, JS, images, fonts) available offline.
 */

const CACHE_VERSION = '1.5.1';
const CACHE_NAME = `core-pwa-${CACHE_VERSION}`;
const APP_SHELL_URL = '/index.html';

// Configuração de runtime (URL da API), gerada pelo container na inicialização. Muda sem que a
// versão do app (CACHE_VERSION) mude, então NUNCA pode ser servida do cache estando online:
// network-first, com o cache apenas como fallback offline. Fica no precache para que o app
// abra offline já a partir do primeiro acesso (nele a página ainda não é controlada pelo SW).
const RUNTIME_CONFIG_URL = '/runtime-config.js';

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
  RUNTIME_CONFIG_URL,
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

  // Antes da regra genérica de scripts (stale-while-revalidate), que serviria a configuração antiga.
  if (isSameOrigin && url.pathname === RUNTIME_CONFIG_URL) {
    event.respondWith(networkFirst(request));
    return;
  }

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

// Só respostas 200 entram no cache: um erro transitório do servidor não pode substituir a
// última configuração boa. Com o servidor respondendo erro, cai para o cache se houver.
function networkFirst(request) {
  return caches.open(CACHE_NAME).then((cache) =>
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
          return response;
        }
        return cache.match(request, { ignoreSearch: true }).then((cached) => cached || response);
      })
      .catch(() =>
        cache.match(request, { ignoreSearch: true }).then((cached) => cached || Response.error()),
      ),
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
