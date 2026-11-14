/* KnowQuest — Service Worker (cache du shell applicatif)
 *
 * Stratégies :
 *  - HTML (shell) : réseau d'abord, cache en secours → la page est toujours
 *    fraîche (elle référence des assets versionnés par hash) et le jeu
 *    s'ouvre quand même hors-ligne.
 *  - JS / CSS / data (même origine) : réseau d'abord sans cache HTTP,
 *    puis cache hors ligne si le réseau est indisponible.
 *  - Ressources tierces autorisées (polices, textures du globe…) : réseau
 *    d'abord + cache d'exécution → disponibles hors-ligne au 2e passage.
 *
 * Les données (data/*.json) sont aussi mises en cache par data_loader.js
 * lui-même (Cache API côté page, 'kq-data-v3').
 */
const CACHE = 'knowquest-v14-secure-reports';
const SHELL = [
  './',
  './index.html',
  './data_loader.js',
  './js/local-config.js',
  './motion.css',
  './adventure.css',
  './chapter-narration.css',
  './integration-acr.css',
  './companion.css',
  './bosses.css',
  './avatar-rewards.css',
  './experience.css',
  './js/experience.js',
  './js/profile-store.js',
  './js/account-sync.js',
  './js/account-ui.js',
  './account.css',
  './onboarding.css',
  './js/onboarding.js',
  './js/game-rules.js',
  './js/economy.js',
  './js/task-scope.js',
  './js/race-rules.js',
  './js/session-state.js',
  './js/bank-readiness.js',
  './js/modal-focus.js',
  './js/destinations.js',
  './destinations.css',
  './js/avatar-rewards.js',
  './js/bosses.js',
  './js/adventure.js',
  './js/motion.js',
  './js/story-rules.js',
  './js/chapter-narration.js',
  './js/notices.js',
  './js/question-reports.js',
  './js/companion-events.js',
  './js/companion-catalog.js',
  './js/companion-reactions.js',
  './js/companion-rewards-ui.js',
  './js/revision-short.js',
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
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('knowquest-') && k !== CACHE).map((k) => caches.delete(k))))
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
        const resp = await fetchFresh(req);
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
        const resp = await fetchFresh(req);
        if (!resp || !resp.ok) throw new Error('HTTP indisponible');
        cache.put(req, resp.clone());
        return resp;
      } catch (_) {
        if (cached) return cached;
        throw _;
      }
    }

    // JS / CSS / data : réseau d'abord, cache en secours.
    const network = fetchFresh(req)
      .then((resp) => {
        if (!resp || !resp.ok) throw new Error('HTTP indisponible');
        cache.put(req, resp.clone());
        return resp;
      })
      // Le shell préchargé contient les chemins sans ?v=. En mode hors ligne,
      // ces copies servent aussi les URL versionnées du HTML.
      .catch(async () => cached || await cache.match(req, { ignoreSearch: true }));
    // En ligne : demander le fichier courant, même si l’URL n’a pas changé.
    // Hors ligne : le catch ci-dessus retrouve le fichier dans le cache.
    return await network;
  })());
});

async function fetchFresh(request) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try { return await fetch(request, { cache: 'no-store', signal: controller.signal }); }
  finally { clearTimeout(timer); }
}
