let cacheName = "v1";
let cacheFiles = [

	'/',
	'/css/styles.css',
	'/data/restaurants.json',
	'/img/1.jpg',
	'/img/2.jpg',
	'/img/3.jpg',
	'/img/4.jpg',
	'/img/5.jpg',
	'/img/6.jpg',
	'/img/7.jpg',
	'/img/8.jpg',
	'/img/9.jpg',
	'/img/10.jpg',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/restaurant_info.js',
	'/index.html',
	'/restaurant.html'
]

/*
 Added three event listeners for the different states of the service worker: install, activate and fetch.
 The install event listens for the installation and decides what happens when the service worker is installed successfully or when the installation fails.
*/
self.addEventListener('install', function(event) {
	console.log("[Service Worker] Installed");
// The install has to wait until the promise within waitUntil()
	event.waitUntil(
// The browser opens the caches corresponding to the cacheName and adds all the files of the array "cacheFiles".
		caches.open(cacheName).then(function(cache) {
			console.log("[Service Worker] Caching cacheFiles");
			return cache.addAll(cacheFiles);
		})
	)
})

// Activate the service worker and listen for the activation.

self.addEventListener('activate', function(event) {
	console.log("[Service Worker] Activated");

	event.waitUntil(
// Loop through all the keys of the caches to compare them later.
		caches.keys().then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {
		// Compare the cache names. If they are not equal, delete the old caches to update the cache with the new caches.
				if (thisCacheName !== cacheName) {
					console.log("[Service Worker] Removing Cached Files from", thisCacheName);
					return caches.delete(thisCacheName);
				}
			}))
		})
	)
})

// Fetch the data from the given URL.
self.addEventListener('fetch', function(event) {
	console.log("[Service Worker] Fetching", event.request.url);
	// Check in the cache if the cached URL/file and the requested URL/file match. Then respond appropriately to the outcome.
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				// If the requested URL/file is found in the cache, log out a message and return the cached version. 
				 if (response) {
					console.log("[ServiceWorker] Found in cache", event.request.url);
					return response;
				}
				// If the requested URL/file is not in the cache yet, the file gets fetched.
				return fetch(event.request);
			})
			.catch(function(error) {
				console.log("Error fetching and caching new data", error);
			})
	)
})
