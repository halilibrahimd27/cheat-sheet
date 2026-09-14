/* GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js. */
const CACHE_NAME = 'cheatsheet-static-d81290c608fb';
const CORE = ['./', './app.js', './checklist-templates.js', './index.html', './local-backend.js', './manifest.json', './seed-data.js', './session-data.js', './session.js', './static-bootstrap.js', './style.css', './sw-register.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const { request } = e; if (request.method !== 'GET') return;
  if (request.mode === 'navigate') { e.respondWith(fetch(request).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(cc => cc.put('./index.html', c)).catch(() => {}); return r; }).catch(() => caches.match('./index.html'))); return; }
  e.respondWith(caches.match(request).then(cached => { const net = fetch(request).then(resp => { if (resp && resp.status === 200 && resp.type === 'basic') { const cl = resp.clone(); caches.open(CACHE_NAME).then(c => c.put(request, cl)).catch(() => {}); } return resp; }).catch(() => cached); return cached || net; }));
});
