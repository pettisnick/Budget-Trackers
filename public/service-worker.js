console.log("Service worker is working!");

const STATIC_CACHE = 'budget-trackers--v1';
const DATA_CACHE = 'budget-trackers-data-v1';

var FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/style.css",
    "/manifest.webmanifest",
    "/assets/js/index.js",
    "/assets/js/indexedDB.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png",
  ];
  
  
  //Install
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(DATA_CACHE)
        .then(cache => {
          return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
  });
  
  //Activate
  // The activate handler takes care of cleaning up old caches.
  self.addEventListener("activate", event => {
    const currentCaches = [STATIC_CACHE, DATA_CACHE];
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          // return array of cache names that are old to delete
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
          );
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  //Fetch
  self.addEventListener('fetch', event => {
    // non GET requests are not cached and requests to other origins are not cached
    event.respondWith(
      caches.open(STATIC_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
    });
  })
    );
});
  
  
    
  