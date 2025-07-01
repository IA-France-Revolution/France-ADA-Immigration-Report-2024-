/**
 * ===================================
 * Service Worker - France ADA Immigration Report 2024
 * Advanced PWA Implementation
 * Author: AI France Revolution
 * ===================================
 */

const CACHE_NAME = 'ada-report-2024-v1.2.0';
const CACHE_VERSION = 'v1.2.0';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/manifest.json',
  '/assets/og-image-ada-report-2024.webp',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  // Critical fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
  // Critical libraries
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Assets to cache on first request
const RUNTIME_CACHE_ASSETS = [
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png'
];

// Network-first resources (always try network first)
const NETWORK_FIRST_PATTERNS = [
  /^https:\/\/www\.google-analytics\.com/,
  /^https:\/\/www\.googletagmanager\.com/,
  /^https:\/\/static\.hotjar\.com/,
  /^https:\/\/www\.assemblee-nationale\.fr/
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
  /\.(?:js|css|woff2?|ttf|eot)$/,
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /^https:\/\/cdnjs\.cloudflare\.com/
];

// Stale-while-revalidate resources
const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
];

/**
 * Install Event - Precache critical assets
 */
self.addEventListener('install', (event) => {
  console.log(`🔧 SW Installing version ${CACHE_VERSION}`);
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Precache critical assets
        await cache.addAll(PRECACHE_ASSETS);
        
        console.log('✅ SW Precache complete');
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
      } catch (error) {
        console.error('❌ SW Install failed:', error);
      }
    })()
  );
});

/**
 * Activate Event - Clean old caches and claim clients
 */
self.addEventListener('activate', (event) => {
  console.log(`🚀 SW Activating version ${CACHE_VERSION}`);
  
  event.waitUntil(
    (async () => {
      try {
        // Clean old caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(name => name.startsWith('ada-report-') && name !== CACHE_NAME)
            .map(name => {
              console.log(`🗑️ Deleting old cache: ${name}`);
              return caches.delete(name);
            })
        );
        
        // Claim all clients
        await clients.claim();
        
        console.log('✅ SW Activated successfully');
        
        // Notify all clients about the update
        const allClients = await clients.matchAll();
        allClients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
        
      } catch (error) {
        console.error('❌ SW Activation failed:', error);
      }
    })()
  );
});

/**
 * Fetch Event - Handle network requests with different strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle different types of requests
  if (isNetworkFirst(url)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isStaleWhileRevalidate(url)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Default strategy: Cache first with network fallback
    event.respondWith(cacheFirstWithNetworkFallback(request));
  }
});

/**
 * Network First Strategy
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📡 Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return createOfflinePage();
    }
    
    throw error;
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('📡 Network request failed:', request.url);
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('📡 Background fetch failed:', request.url);
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return fetchPromise;
}

/**
 * Cache First with Network Fallback (Default)
 */
async function cacheFirstWithNetworkFallback(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && request.url.startsWith(self.location.origin)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return createOfflinePage();
    }
    
    throw error;
  }
}

/**
 * Check if URL should use network-first strategy
 */
function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Check if URL should use cache-first strategy
 */
function isCacheFirst(url) {
  return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Check if URL should use stale-while-revalidate strategy
 */
function isStaleWhileRevalidate(url) {
  return STALE_WHILE_REVALIDATE_PATTERNS.some(pattern => pattern.test(url.href));
}

/**
 * Create offline page response
 */
function createOfflinePage() {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hors ligne - ADA Immigration Report 2024</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0A0A0A, #1E1E1E);
                color: #FFFFFF;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 2rem;
            }
            
            .offline-container {
                max-width: 600px;
                background: rgba(18, 18, 18, 0.8);
                border: 1px solid #FF6B35;
                border-radius: 16px;
                padding: 3rem 2rem;
                backdrop-filter: blur(10px);
            }
            
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 2rem;
                color: #FF6B35;
            }
            
            h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
                background: linear-gradient(135deg, #FF6B35, #F7931E);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            p {
                color: #B0B0B0;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            
            .retry-btn {
                background: linear-gradient(135deg, #FF6B35, #F7931E);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1rem;
                transition: transform 0.2s ease;
            }
            
            .retry-btn:hover {
                transform: translateY(-2px);
            }
            
            .features {
                margin-top: 2rem;
                text-align: left;
            }
            
            .feature {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
                color: #B0B0B0;
            }
            
            .feature-icon {
                color: #FF6B35;
                width: 20px;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">📊</div>
            <h1>Mode Hors Ligne</h1>
            <p>
                Vous êtes actuellement hors ligne. Certaines fonctionnalités du dashboard 
                ADA Immigration Report 2024 restent disponibles grâce à la mise en cache.
            </p>
            
            <button class="retry-btn" onclick="window.location.reload()">
                Réessayer la connexion
            </button>
            
            <div class="features">
                <div class="feature">
                    <span class="feature-icon">✅</span>
                    <span>Données critiques mises en cache</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✅</span>
                    <span>Interface utilisateur disponible</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">✅</span>
                    <span>Statistiques principales accessibles</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">⚠️</span>
                    <span>Partage social indisponible</span>
                </div>
            </div>
        </div>
        
        <script>
            // Auto-retry connection every 30 seconds
            setTimeout(() => {
                if (navigator.onLine) {
                    window.location.reload();
                }
            }, 30000);
            
            // Listen for online event
            window.addEventListener('online', () => {
                window.location.reload();
            });
        </script>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
}

/**
 * Background Sync Event
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(sendOfflineAnalytics());
  }
});

/**
 * Send offline analytics when connection is restored
 */
async function sendOfflineAnalytics() {
  try {
    // Implementation would depend on your analytics storage strategy
    console.log('🔄 Sending offline analytics data');
  } catch (error) {
    console.error('❌ Failed to send offline analytics:', error);
  }
}

/**
 * Push Event (for future notifications)
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    image: data.image,
    data: data.data,
    actions: data.actions || [],
    requireInteraction: true,
    tag: data.tag || 'default'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Notification Click Event
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  
  event.waitUntil(
    clients.openWindow(data.url || '/')
  );
});

/**
 * Message Event - Handle messages from main thread
 */
self.addEventListener('message', (event) => {
  const { data } = event;
  
  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_URLS':
      cacheUrls(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(name => caches.delete(name))
  );
  console.log('🗑️ All caches cleared');
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urls);
  console.log('💾 URLs cached:', urls);
}

/**
 * Periodic Background Sync (if supported)
 */
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

/**
 * Update cache in background
 */
async function updateCache() {
  try {
    console.log('🔄 Background cache update started');
    
    const cache = await caches.open(CACHE_NAME);
    
    // Update critical assets
    await Promise.allSettled(
      PRECACHE_ASSETS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.warn(`Failed to update ${url}:`, error);
        }
      })
    );
    
    console.log('✅ Background cache update completed');
  } catch (error) {
    console.error('❌ Background cache update failed:', error);
  }
}

// Log service worker registration
console.log(`🔧 Service Worker registered - Version ${CACHE_VERSION}`);
console.log(`📦 Cache Name: ${CACHE_NAME}`);
console.log(`📋 Precaching ${PRECACHE_ASSETS.length} assets`);
