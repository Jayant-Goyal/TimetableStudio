/**
 * Service Worker for Timetable Mobile Companion
 * Full offline caching for PWA on Android
 */

const CACHE_NAME = 'ttstudio-mobile-v2';
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './js/mobile-app.js',
  '../css/styles.css',
  '../js/samples.js',
  '../js/themes.js',
  '../js/parser.js',
  '../js/renderer.js',
  '../js/exporter.js'
];

// Install Event: Pre-cache core assets with resilient Promise.allSettled
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache each asset individually so one failed relative path doesn't fail the whole install
      await Promise.allSettled(
        CORE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Pre-cache skipped for ${asset}:`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: Clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First with Dynamic Fallback & Background Revalidation
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle HTML navigation requests
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        return cached || fetch(event.request).catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  // Handle all other assets (Cache-first with network fallback & runtime caching)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate for local assets
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Fetch from network and cache runtime dependencies (like Tailwind, Lucide, Fonts)
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }

          // Cache valid GET responses (both basic and opaque CORS responses like Google Fonts/CDNs)
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone).catch(() => {});
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request);
        });
    })
  );
});
