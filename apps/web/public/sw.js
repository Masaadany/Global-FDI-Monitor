// GFM Service Worker — offline support + cache
const CACHE_VERSION = 'gfm-v3';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const PRECACHE = [
  '/', '/dashboard/', '/signals/', '/gfr/', '/pricing/',
  '/analytics/', '/about/', '/contact/', '/register/',
];

// Install — precache core pages
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(STATIC_CACHE).then(c => c.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for API
self.addEventListener('fetch', evt => {
  const { request } = evt;
  const url = new URL(request.url);

  // API calls — network first, no cache
  if (url.pathname.startsWith('/api/')) return;

  // Static assets — cache first
  if (request.method !== 'GET') return;

  evt.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && res.type !== 'opaque') {
          caches.open(DYNAMIC_CACHE).then(c => c.put(request, res.clone()));
        }
        return res;
      }).catch(() => caches.match('/') || new Response('Offline', {status:503}));
    })
  );
});
