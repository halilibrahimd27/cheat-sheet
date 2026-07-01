// Bump this on any change to the cached static assets so returning users get
// the update (the old cache is purged on activate).
const CACHE_NAME = 'cheatsheet-v2';
const STATIC_ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Let the page trigger an immediate activation of a waiting worker.
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return; // never intercept writes
  const url = new URL(request.url);

  // API: network-first, fall back to cache, and never hand back something that
  // breaks JSON.parse when offline and uncached.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(request).then(c =>
          c || new Response('[]', { headers: { 'Content-Type': 'application/json' } })))
    );
    return;
  }

  // Static: stale-while-revalidate — serve the cached copy instantly, then
  // refresh it in the background so a shipped fix reaches the user next load.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
