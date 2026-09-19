// ============================================================================
// JEEVAN JYOTI FOUNDATION - SERVICE WORKER (OFFLINE CERTIFICATES & ASSET CACHE)
// ============================================================================

const CACHE_NAME = 'jeevan-jyoti-v4-pwa';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/logo.png',
  '/logo.jpg',
  '/apple-touch-icon.png',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/pwa-icon-maskable-192.png',
  '/pwa-icon-maskable-512.png',
  '/signature-shailesh-overlay.png',
  '/signature-shailesh-royalblue.png',
  '/signature-shailesh-overlay.svg',
  '/signature-shailesh-royalblue.svg'
];

// Install Event: Pre-cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.debug('Service Worker asset pre-caching partial note:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Stale-While-Revalidate for app assets & Network-First with Cache Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never intercept Vite development endpoints, HMR, or raw TypeScript/JSX source modules
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.searchParams.has('import')
  ) {
    return;
  }

  // For API requests, use Network-First with JSON fallback if offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'इंटरनेट कनेक्शन उपलब्ध नहीं है (Device is currently offline). लोकल कैश डेटा उपयोग में है।'
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // For images, fonts, and static assets: Cache First, then Network & Cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale-While-Revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silently ignore background fetch failure when offline
          });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|woff|ttf)$/) ||
              url.origin === location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is navigation (HTML page), return cached root index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return new Response('Offline asset unavailable', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
