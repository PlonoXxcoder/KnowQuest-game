/* KnowQuest — Service Worker (cache du shell applicatif)
 *
 * Stratégies :
 *  - HTML (shell) : réseau d'abord, cache en secours → la page est toujours
 *    fraîche (elle référence des assets versionnés par hash) et le jeu
 *    s'ouvre quand même hors-ligne.
 *  - JS / CSS / data (même origine) : stale-while-revalidate → démarrage
 *    instantané ; la fraîcheur est garantie par le hash ?v= d'index.html
 *    (outils/bump_assets.py), pas besoin de re-télécharger game.js à chaque
 *    lancement.
 *  - Ressources tierces autorisées (polices, textures du globe…) : réseau
 *    d'abord + cache d'exécution → disponibles hors-ligne au 2e passage.
 *
 * Les données (data/*.json) sont aussi mises en cache par data_loader.js
 * lui-même (Cache API côté page, 'kq-data-v3').
 */
const CACHE = 'knowquest-v4';
const SHELL = [
  './',
  './index.html',
  './data_loader.js',
  './js/boot.js',
  './js/game.js',
  './js/data-ready.js',
  './js/vendor/globe.gl.min.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Hôtes tiers mis en cache à l'exécution (textures globe.gl, polices, GeoJSON)
const THIRD_PARTY = [
  'fonts.googleapis.com', 'fonts.gstatic.com',
  'unpkg.com', 'raw.githubusercontent.com', 'cdn.jsdelivr.net',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // ── Ressources tierces : réseau d'abord, cache d'exécution ensuite ──
  if (url.origin !== self.location.origin) {
    if (!THIRD_PARTY.includes(url.hostname)) return;
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const resp = await fetch(req);
        if (resp && (resp.ok || resp.type === 'opaque')) cache.put(req, resp.clone());
        return resp;
      } catch (_) {
        const cached = await cache.match(req);
        if (cached) return cached;
        throw _;
      }
    })());
    return;
  }

  // ── Même origine ──
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const isNavigation = req.mode === 'navigate' ||
      url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');

    if (isNavigation) {
      // Réseau d'abord : un index.html frais suffit à tirer la nouvelle
      // version de l'app (assets versionnés par hash). Hors-ligne → cache.
      try {
        const resp = await fetch(req);
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      } catch (_) {
        if (cached) return cached;
        throw _;
      }
    }

    // JS / CSS / data : stale-while-revalidate → démarrage instantané
    const network = fetch(req)
      .then((resp) => {
        if (resp && resp.ok) cache.put(req, resp.clone());
        return resp;
      })
      .catch(() => cached);
    return cached || network;
  })());
});
