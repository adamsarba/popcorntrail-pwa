const CACHE_NAME = "v0.0.1";

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files...");
      return cache
        .addAll([
          "/",
          "/index.html",
          "/src/main.tsx",
          "/src/index.css",
          "/public/img/icon-512.png",
        ])
        .then(() => {
          console.log("Service Worker: Caching completed");
        })
        .catch((error) => {
          console.error("Service Worker: Failed to cache files");
          console.error(error);
        });
    }),
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Removing old cache...", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching...", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
