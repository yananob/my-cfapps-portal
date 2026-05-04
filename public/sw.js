const CACHE_NAME = 'cr-manager-cache-v2';
const urlsToCache = [
  '/',
  '/icon.svg',
  '/icon',
  '/apple-icon',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // 外部オリジン（GCP APIなど）へのリクエストはキャッシュしない
  // マニフェストファイルは IAP 認証のリダイレクトを伴う可能性があるため Service Worker で扱わない
  if (
    !event.request.url.startsWith(self.location.origin) ||
    event.request.url.endsWith('manifest.webmanifest')
  ) {
    return;
  }

  // ナビゲーションリクエスト（HTML）は Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 正常なレスポンスのみキャッシュを更新
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // それ以外は Cache First
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
