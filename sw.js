/* ========== File: sw.js ========== */
/**
 * ===================================
 * Service Worker - France ADA Immigration Report 2024
 * Guru-Level PWA Implementation
 * Author: AI France Revolution (as Developer Hero)
 * Mission: Ensure extreme performance, reliability, and offline capability.
 * ===================================
 */

const CACHE_NAME = 'ada-report-2024-cache-v1.0';
const CACHE_VERSION = 'v1.0'; // Increment to force update

// Assets to precache for instant loading and offline access
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
  './assets/og-image-ada-report-2024.webp',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png',
  './favicon.ico',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2'
];

/**
 * Install Event: Precache critical assets.
 * This is where the magic begins. We build the offline fortress.
 */
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching precache assets.');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete. Ready to take over.');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Precache failed:', error);
      })
  );
});

/**
 * Activate Event: Clean up old caches.
 * Out with the old, in with the new. This ensures clients get the latest version.
 */
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${CACHE_VERSION}...`);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activation complete. Clients claimed.');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch Event: The core of our strategy.
 * Intercept requests and serve from cache or network based on a smart strategy.
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests and chrome extensions
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Strategy: Cache-first for static assets, network-first for HTML.
  // This gives a fast, "app-like" experience while ensuring content is fresh.
  const isHtmlNavigation = request.mode === 'navigate';
  const isFontOrIcon = request.destination === 'font' || request.url.includes('fontawesome');

  if (isHtmlNavigation) {
    // Network first for the main HTML file to get the latest version.
    event.respondWith(
      fetch(request)
        .then(response => {
          // If network is available, cache the fresh response.
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // If network fails, serve the cached HTML.
          return caches.match(request);
        })
    );
  } else if (isFontOrIcon || PRECACHE_ASSETS.includes(new URL(request.url).pathname.substring(1))) {
    // Cache-first for fonts, icons, and precached assets. They don't change often.
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return networkResponse;
        });
      })
    );
  } else {
    // Stale-while-revalidate for other assets (e.g., images). Serve from cache instantly,
    // then update the cache in the background. Perfect for non-critical assets.
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});
