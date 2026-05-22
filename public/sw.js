const CACHE_NAME = 'meridian-mart-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install — cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — stale-while-revalidate for navigation, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Supabase API — always network
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Navigation — stale-while-revalidate
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            caches.open(CACHE_NAME).then((cache) => cache.put('/', response.clone()));
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Everything else — cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request);
    })
  );
});