const CACHE_NAME = 'knowquest-v1';

// Fichiers à mettre en cache pour fonctionner hors-ligne
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/data_loader.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Installation : on met tout en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Mise en cache des fichiers...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch : on sert depuis le cache, sinon le réseau
self.addEventListener('fetch', event => {
  // On laisse passer les appels API (vers onrender.com) sans les cacher
  if (event.request.url.includes('onrender.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // On met aussi en cache les nouvelles ressources valides
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Si tout échoue (hors-ligne), on renvoie la page principale
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
