const CACHE_NAME = 'cr-manager-cache-v1';
const urlsToCache = [
  '/',
  '/icon.png',
  '/icon',
  '/apple-icon',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
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
