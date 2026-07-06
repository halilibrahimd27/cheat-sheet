const CACHE_NAME = 'cheatsheet-static-v1';
const CORE = ['./', './index.html', './style.css', './app.js', './checklist-templates.js', './local-backend.js', './seed-data.js', './manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const { request } = e; if (request.method !== 'GET') return;
  if (request.mode === 'navigate') { e.respondWith(caches.match('./index.html').then(c => c || fetch(request))); return; }
  e.respondWith(caches.match(request).then(cached => {
    const net = fetch(request).then(resp => { if (resp && resp.status === 200 && resp.type === 'basic') { const cl = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(request, cl)).catch(() => {}); } return resp; }).catch(() => cached);
    return cached || net;
  }));
});
