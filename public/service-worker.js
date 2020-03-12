// var CACHE_NAME = 'my-site-cache-v1';

// var urlsToCache = [
//   '/',
//   '/styles.css',
//   '/index.js'
// ];


// self.addEventListener('install', function(event) {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(function(cache) {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener("fetch", function(event) {
//   event.respondWith(
//     fetch(event.request).catch(function() {
//       return caches.match(event.request).then(function(response) {
//         if (response) {
//           return response;
//         } else if (event.request.headers.get("accept").includes("text/html")) {
//           return caches.match("/index.html");
//         }
//       });
//     })
//   );
// });


const urlsToCache = [
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/styles.css"];

    const CACHE_NAME = 'mysite-cache-v2';
    const DATA_CACHE_NAME = 'data-cache-v8';

    //Install service worker
    self.addEventListener("activate", function(evt) {
      evt.waitUntil(
          caches.keys().then(keyList => {
              return Promise.all(
                  keyList.map(key => {
                      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                          console.log("Removing old cache data", key);
                          return caches.delete(key);
                      }
                  })
              );
          })
      );
  
      self.clients.claim();
  });
  
  //fetch eventlistener
  self.addEventListener("fetch", function(evt) {
      if (evt.request.url.includes("/api/")) {
          console.log('[Service Worker fetch request', evt.request.url);
          evt.respondWith(
              caches.open(DATA_CACHE_NAME).then(cache => {
                  return fetch(evt.request)
                      .then(response => {
                          //cloning cache if response ok
                          if (response.status === 200) {
                              cache.put(evt.request.url, response.clone());
                          }
  
                          return response;
                      })
                      .catch(err => {
                          
                          return cache.match(evt.request);
  
                      });
              }).catch(err => {
                  console.log(err)
              })
          );
  
          return;
      }
  

        evt.respondWith(
            caches.open(CACHE_NAME).then( cache => {
                return cache.match(evt.request).then(response => {
                    return response || fetch(evt.request)
                });

            })
        );
    });