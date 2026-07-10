const CACHE_NAME = "lozada-erp-v1";

const urlsToCache = [
    "./",
    "./index.html"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => {

            return cache.addAll(urlsToCache);

        })

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request).catch(() => {
                return new Response("", {
                    status: 404,
                    statusText: "Offline"
                });
            });

        })

    );

});
