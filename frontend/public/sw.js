const CACHE_NAME = 'ylrk-cache-v3';
const urlsToCache = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Don't cache chrome-extension:// or other unusual schemes
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request).then(response => {
      // Check if we received a valid response
      if(!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // Clone the response to cache it
      var responseToCache = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(event.request, responseToCache);
      });

      return response;
    }).catch(() => {
      // Network failed, try cache
      return caches.match(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
