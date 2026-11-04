/* Festival Town service worker: the game plays offline once it has been opened once.
   Small files are cached when the game is installed; pictures and voices are cached as they
   are first used. Bump VERSION whenever index.html changes so players get the new build. */
const VERSION = 'ft-1.0.2-2026-11-03';
const CORE = ['./', './index.html', './tv.js', './tv.css', './manifest.webmanifest', './vo/manifest.js', './assets/fonts/fonts.css', './assets/brand/logo.webp', './assets/bg2/bg_title.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  /* the page itself: network first so updates land, cache when offline */
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/tv.js')){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  /* everything else: cache first, then network */
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok && (r.type === 'basic' || r.type === 'default')){ const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return r;
  })));
});
