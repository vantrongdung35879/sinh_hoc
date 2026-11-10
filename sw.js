/* BioGalaxy Service Worker — chỉ hoạt động khi phục vụ qua http(s).
   - Navigation: network-first, rơi về cache khi offline.
   - Tài nguyên tĩnh: stale-while-revalidate.
   - Không cache request khác origin (PeerJS CDN, fonts...) để tránh cũ.
   Nâng CACHE_VERSION mỗi lần phát hành để trình duyệt lấy bản mới. */
'use strict';
const CACHE_VERSION = 'biogalaxy-v5-14-0';
const CORE = [
  './',
  './index.html',
  './sinh.html',
  './admin.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE).catch(() => { }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // CDN/PeerJS: để trình duyệt tự xử lý

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => { });
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./sinh.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => { });
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
