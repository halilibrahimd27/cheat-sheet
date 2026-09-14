// Bump this on any change to the cached static assets so returning users get
// the update (the old cache is purged on activate).
const CACHE_NAME = 'cheatsheet-v5';
// checklist-templates.js and sw-register.js are loaded by index.html too — without
// them precached, a cold offline load renders an app with no machine playbooks.
// session-data.js is fetched on demand rather than at load, so it has to be
// precached explicitly or Sessions is the one view that breaks offline.
const STATIC_ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/checklist-templates.js',
  '/sw-register.js', '/manifest.json', '/session.js', '/session-data.js', '/nextmove.js'];

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

  // Application code: network-first. Stale-while-revalidate reads well on paper
  // — "a shipped fix reaches the user next load" — but *next load* is the
  // problem: after every deploy the user gets one full session of the previous
  // build, which is indistinguishable from the fix never having shipped. Falls
  // back to cache, so offline is unaffected.
  const isCode = /\.(js|css|html)$/.test(url.pathname) && !/seed-data\.js$/.test(url.pathname);
  if (isCode) {
    event.respondWith(
      fetch(request).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone)).catch(() => {});
        }
        return resp;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Everything else (the 1.4MB seed blob, icons, uploads): cache-first with a
  // background refresh. Big, and it changes far less often than the code.
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
