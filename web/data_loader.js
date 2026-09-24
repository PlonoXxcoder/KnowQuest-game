/**
 * KnowQuest V3 — Data Loader
 * ===========================
 * Charge data/roadmap.json et les banques de questions, puis les injecte
 * dans les banques window.*_QB définies par game.js.
 *
 * STRATÉGIE DE CHARGEMENT
 *   1. Phase principale (avant le démarrage de l'app) :
 *      - roadmap.json (petit) ;
 *      - les questions : si data/questions/index.json existe, les fichiers
 *        par catégorie produits par tools/split_questions.py sont chargés en
 *        parallèle ; sinon on retombe sur questions.json monolithique.
 *      → émet 'kq:data-loaded' : l'app peut démarrer.
 *   2. Phase arrière-plan (après le démarrage) :
 *      - tf_questions.json et scramble_questions.json, injectés à leur
 *        arrivée → émet 'kq:bank-loaded' { name: 'TF_QB' | 'SCRAMBLE_QB' }.
 *      Les modes correspondants attendent ce signal via ensureBankLoaded().
 *
 * Événements émis (sur document) :
 *   - 'kq:data-loaded'  detail { questionsInjected, roadmapLoaded }
 *   - 'kq:bank-loaded'  detail { name: 'TF_QB' | 'SCRAMBLE_QB' }
 *
 * HORS-LIGNE : chaque réponse réseau est mise en cache (Cache API côté page,
 * 'kq-data-v3') même quand les JSON vivent hors du scope du service worker.
 *
 * NOTE PIPELINE : l'agent DevTools (main.py --agent devtools) régénère une
 * version minimale de ce fichier — ne pas le relancer sans ré-appliquer V3.
 */

(function() {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────────
  // Chemins multiples : en déploiement, data/ est à côté du HTML ('./data/');
  // dans le repo, il est à la racine du projet ('../data/'). On essaie chacun.
  const DATA_BASES    = ['./data/', '../data/'];
  const DATA_FILE     = 'questions.json';
  const ROADMAP_FILE  = 'roadmap.json';
  const TF_FILE       = 'tf_questions.json';
  const SCRAMBLE_FILE = 'scramble_questions.json';
  const READY_EVENT    = 'kq:data-loaded';
  const BANK_EVENT     = 'kq:bank-loaded';
  const VERBOSE        = true;

  // ── Mapping catégorie → variable JS globale ────────────────────────────────
  const CAT_TO_BANK = {
    geo:      'GEO_QB',
    hist:     'HIST_QB',
    sci:      'SCI_QB',
    art:      'ART_QB',   // Note: ART_QB inclut atlas cards + questions
    cinema:   'CINEMA_QB',
    sport:    'SPORT_QB',
    gastro:   'GASTRO_QB',
    mytho:    'MYTHO_QB',
    chateaux: 'CHATEAUX_QB',
    litt:     'LITT_QB',
    mixed:    'MIXED_QB',
    extended: 'EXTENDED_QB',
    flag:     'MIXED_QB', // pas de banque FLAG_QB : les drapeaux vont dans MIXED_QB
  };

  // ── Logger ─────────────────────────────────────────────────────────────────
  function log(msg, type = 'info') {
    if (!VERBOSE) return;
    const icons = { info: '📥', ok: '✅', warn: '⚠️', err: '❌' };
    console.log(`[KQ-Loader] ${icons[type] || '•'} ${msg}`);
  }

  // ── Cache hors-ligne (Cache API côté page) ─────────────────────────────────
  const DATA_CACHE = 'kq-data-v3';

  async function cacheResponse(url, resp) {
    try {
      if (typeof caches === 'undefined') return;
      const c = await caches.open(DATA_CACHE);
      await c.put(url, resp.clone());
    } catch (e) { /* mode privé / non supporté : on ignore */ }
  }
  async function fromDataCache(url) {
    try {
      if (typeof caches === 'undefined') return null;
      const c = await caches.open(DATA_CACHE);
      return (await c.match(url)) || null;
    } catch (e) { return null; }
  }

  // Base de données qui répond (mémorisée pour ne tester qu'elle ensuite)
  let _workingBase = null;

  // Essaie chaque base ('./data/', '../data/') puis le cache hors-ligne.
  // `quiet` évite le bruit de console pour les sondes optionnelles (index.json).
  async function fetchJSONAny(file, quiet = false) {
    const bases = _workingBase ? [_workingBase] : DATA_BASES;
    for (const base of bases) {
      const url = base + file;
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        cacheResponse(url, resp);
        _workingBase = base;
        return await resp.json();
      } catch (e) {
        if (!quiet) log(`Chargement impossible ${url}: ${e.message}`, 'warn');
        const cached = await fromDataCache(url);
        if (cached) { _workingBase = base; if (!quiet) log(`${file} servi depuis le cache hors-ligne`, 'warn'); return await cached.json(); }
      }
    }
    return null;
  }

  // ── Questions : fichiers par catégorie (si présents) ou monolithique ──────
  async function loadQuestions() {
    const index = await fetchJSONAny('questions/index.json', true);
    if (index && Array.isArray(index.categories) && index.categories.length > 0) {
      const results = await Promise.all(index.categories.map(cat => fetchJSONAny('questions/' + cat + '.json')));
      const merged = {};
      let files = 0;
      results.forEach(obj => { if (obj && typeof obj === 'object') { Object.assign(merged, obj); files++; } });
      if (files > 0) {
        log(`Questions chargées depuis ${files} fichier(s) par catégorie`, 'ok');
        return merged;
      }
    }
    // Fallback : le JSON monolithique généré par le pipeline
    return await fetchJSONAny(DATA_FILE);
  }

  // ── Injection questions → banques QB ──────────────────────────────────────
  function injectQuestions(questionsData) {
    if (!questionsData || typeof questionsData !== 'object') return 0;

    let totalInjected = 0;

    for (const [cat, questions] of Object.entries(questionsData)) {
      if (!Array.isArray(questions) || questions.length === 0) continue;

      const bankName = CAT_TO_BANK[cat];
      if (!bankName) {
        log(`Catégorie inconnue "${cat}" ignorée.`, 'warn');
        continue;
      }

      const bank = window[bankName];
      if (!Array.isArray(bank)) {
        log(`Banque ${bankName} non trouvée dans window.`, 'warn');
        continue;
      }

      // Collecte les IDs existants pour éviter les doublons
      const existingIds = new Set(bank.map(q => q.id).filter(Boolean));
      let added = 0;

      for (const q of questions) {
        // Validation minimale
        if (!q.id || !q.question || !Array.isArray(q.choices) || q.choices.length !== 4) {
          log(`Question invalide ignorée: ${JSON.stringify(q).substring(0, 80)}`, 'warn');
          continue;
        }
        if (existingIds.has(q.id)) continue;

        bank.push(q);
        existingIds.add(q.id);
        added++;
      }

      if (added > 0) {
        log(`${added} questions injectées dans ${bankName} (total: ${bank.length})`, 'ok');
        totalInjected += added;
      }
    }

    return totalInjected;
  }

  // ── Injection TF / Scramble → banques dédiées ─────────────────────────────
  function injectModeQuestions(questionsData, bankName, validate) {
    if (!questionsData || typeof questionsData !== 'object') return 0;
    const bank = window[bankName];
    if (!Array.isArray(bank)) { log(`Banque ${bankName} non trouvée dans window.`, 'warn'); return 0; }
    const existingIds = new Set(bank.map(q => q.id).filter(Boolean));
    let added = 0;
    for (const questions of Object.values(questionsData)) {
      if (!Array.isArray(questions)) continue;
      for (const q of questions) {
        if (!q.id || !q.question || !validate(q)) continue;
        if (existingIds.has(q.id)) continue;
        bank.push(q); existingIds.add(q.id); added++;
      }
    }
    if (added > 0) log(`${added} questions injectées dans ${bankName} (total: ${bank.length})`, 'ok');
    return added;
  }

  // ── Injection roadmap ─────────────────────────────────────────────────────
  function injectRoadmap(roadmapData) {
    if (!roadmapData || !Array.isArray(roadmapData.milestones)) return false;

    // Expose globalement
    window.KQ_ROADMAP = roadmapData;

    // Si la fonction updateTrophyRoad existe, l'appeler
    if (typeof window.updateTrophyRoad === 'function') {
      try {
        window.updateTrophyRoad(roadmapData);
        log('Trophy Road mis à jour via updateTrophyRoad()', 'ok');
      } catch (e) {
        log(`updateTrophyRoad() error: ${e.message}`, 'warn');
      }
    }

    log(`Roadmap chargée: ${roadmapData.milestones.length} paliers`, 'ok');
    return true;
  }

  // ── Événements ─────────────────────────────────────────────────────────────
  function emitReady(stats) {
    const event = new CustomEvent(READY_EVENT, { detail: stats });
    document.dispatchEvent(event);
    log(`Événement "${READY_EVENT}" émis. Questions: ${stats.questionsInjected}, Roadmap: ${stats.roadmapLoaded}`, 'ok');
  }
  function emitBankLoaded(name) {
    document.dispatchEvent(new CustomEvent(BANK_EVENT, { detail: { name } }));
    log(`Événement "${BANK_EVENT}" émis pour ${name}`, 'ok');
  }

  // ── Phase arrière-plan : TF + Scramble ─────────────────────────────────────
  async function loadModeBanks() {
    const [tfData, scrambleData] = await Promise.all([
      fetchJSONAny(TF_FILE, true),
      fetchJSONAny(SCRAMBLE_FILE, true)
    ]);
    const tfInjected = injectModeQuestions(tfData, 'TF_QB', q => q.r === true || q.r === false);
    const scrambleInjected = injectModeQuestions(scrambleData, 'SCRAMBLE_QB',
      q => Array.isArray(q.pool) && q.pool.length >= 4 && Array.isArray(q.correct) && q.correct.length >= 4);
    if (tfInjected > 0) emitBankLoaded('TF_QB');
    if (scrambleInjected > 0) emitBankLoaded('SCRAMBLE_QB');
    log(`Arrière-plan terminé — TF: ${tfInjected}, Scramble: ${scrambleInjected}`, 'ok');
  }

  // ── Point d'entrée principal ───────────────────────────────────────────────
  async function init() {
    log('Démarrage du chargeur de données…');
    const t0 = performance.now();

    // Roadmap d'abord : petite, et buildRoad() en a besoin dès le démarrage.
    const roadmapLoaded = injectRoadmap(await fetchJSONAny(ROADMAP_FILE));

    // Questions principales (par catégorie si possible, sinon monolithique).
    const questionsInjected = injectQuestions(await loadQuestions());

    emitReady({ questionsInjected, roadmapLoaded });

    // Les modes TF / Scramble n'ont pas besoin d'être prêts au démarrage :
    // on les charge en arrière-plan pour libérer l'écran d'accueil plus vite.
    loadModeBanks();

    log(`Données principales prêtes en ${Math.round(performance.now() - t0)} ms`);
  }

  // ── Lance après que le DOM soit prêt ──────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
