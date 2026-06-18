/**
 * KnowQuest V2 — Data Loader (FIXED)
 * ===========================
 * Charge dynamiquement data/questions.json, data/roadmap.json,
 * data/tf_questions.json et data/scramble_questions.json
 * et les injecte dans les banques de questions existantes.
 */

(function() {
  'use strict';

  // ── Config ─────────────────────────────────────────────────────────────────
  const DATA_PATH      = './data/questions.json';
  const ROADMAP_PATH   = './data/roadmap.json';
  const TF_PATH        = './data/tf_questions.json';
  const SCRAMBLE_PATH  = './data/scramble_questions.json';
  const READY_EVENT    = 'kq:data-loaded';
  const VERBOSE        = true;

  // ── Mapping catégorie → variable JS globale (QCM standard uniquement) ──────
  const CAT_TO_BANK = {
    geo:      'GEO_QB',
    hist:     'HIST_QB',
    sci:      'SCI_QB',
    art:      'ART_QB',
    cinema:   'CINEMA_QB',
    sport:    'SPORT_QB',
    gastro:   'GASTRO_QB',
    mytho:    'MYTHO_QB',
    chateaux: 'CHATEAUX_QB',
    mixed:    'MIXED_QB',
    extended: 'EXTENDED_QB',
    litt:     'MIXED_QB',
    flag:     'MIXED_QB',
  };

  // ── Logger ─────────────────────────────────────────────────────────────────
  function log(msg, type = 'info') {
    if (!VERBOSE) return;
    const icons = { info: '📥', ok: '✅', warn: '⚠️', err: '❌' };
    console.log(`[KQ-Loader] ${icons[type] || '•'} ${msg}`);
  }

  // ── Fetch JSON ─────────────────────────────────────────────────────────────
  async function fetchJSON(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      log(`Impossible de charger ${url}: ${e.message}`, 'warn');
      return null;
    }
  }

  // ── Injection QCM standard → banques QB ───────────────────────────────────
  // FIX: validation stricte choices uniquement pour les QCM standards
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

      // FIX: utilise String(q.id) pour gérer les IDs entiers et string
      const existingIds = new Set(bank.map(q => String(q.id)).filter(Boolean));
      let added = 0;

      for (const q of questions) {
        // FIX: validation QCM standard uniquement (choices requis)
        if (!q.id || !q.question || !Array.isArray(q.choices) || q.choices.length !== 4) {
          log(`QCM invalide ignoré (id=${q.id}): choices manquants ou incorrects`, 'warn');
          continue;
        }
        if (existingIds.has(String(q.id))) continue;

        bank.push(q);
        existingIds.add(String(q.id));
        added++;
      }

      if (added > 0) {
        log(`${added} QCM injectés dans ${bankName} (total: ${bank.length})`, 'ok');
        totalInjected += added;
      }
    }

    return totalInjected;
  }

  // ── FIX: Injection Vrai/Faux → TF_QB (banque dédiée) ────────────────────
  function injectTFQuestions(tfData) {
    if (!tfData || typeof tfData !== 'object') return 0;

    // Initialise TF_QB si pas encore défini par le HTML
    if (!Array.isArray(window.TF_QB)) window.TF_QB = [];

    let totalAdded = 0;

    for (const [cat, questions] of Object.entries(tfData)) {
      if (!Array.isArray(questions) || questions.length === 0) continue;

      // FIX: utilise String(q.id) pour gérer les IDs entiers
      const existingIds = new Set(window.TF_QB.map(q => String(q.id)).filter(Boolean));
      let added = 0;

      for (const q of questions) {
        // FIX: validation TF — "r" booléen requis, PAS "choices"
        if (!q.id || !q.question || typeof q.r !== 'boolean') {
          log(`TF invalide ignorée (id=${q.id}): champ "r" (booléen) manquant`, 'warn');
          continue;
        }
        if (existingIds.has(String(q.id))) continue;

        // Normalise la catégorie
        window.TF_QB.push({ ...q, cat: q.cat || cat });
        existingIds.add(String(q.id));
        added++;
      }

      if (added > 0) {
        log(`${added} questions TF injectées dans TF_QB (total: ${window.TF_QB.length})`, 'ok');
        totalAdded += added;
      }
    }

    return totalAdded;
  }

  // ── FIX: Injection Méli-Mélo → SCRAMBLE_QB (banque dédiée) ───────────────
  function injectScrambleQuestions(scrambleData) {
    if (!scrambleData || typeof scrambleData !== 'object') return 0;

    // Initialise SCRAMBLE_QB si pas encore défini par le HTML
    if (!Array.isArray(window.SCRAMBLE_QB)) window.SCRAMBLE_QB = [];

    let totalAdded = 0;

    for (const [cat, questions] of Object.entries(scrambleData)) {
      if (!Array.isArray(questions) || questions.length === 0) continue;

      // FIX: utilise String(q.id) pour gérer les IDs entiers
      const existingIds = new Set(window.SCRAMBLE_QB.map(q => String(q.id)).filter(Boolean));
      let added = 0;

      for (const q of questions) {
        // FIX: validation Scramble — "pool" et "correct" requis, PAS "choices"
        if (!q.id || !q.question || !Array.isArray(q.pool) || !Array.isArray(q.correct)) {
          log(`Scramble invalide ignorée (id=${q.id}): champs "pool" ou "correct" manquants`, 'warn');
          continue;
        }
        if (existingIds.has(String(q.id))) continue;

        // Normalise la catégorie
        window.SCRAMBLE_QB.push({ ...q, cat: q.cat || cat });
        existingIds.add(String(q.id));
        added++;
      }

      if (added > 0) {
        log(`${added} questions Scramble injectées dans SCRAMBLE_QB (total: ${window.SCRAMBLE_QB.length})`, 'ok');
        totalAdded += added;
      }
    }

    return totalAdded;
  }

  // ── Injection roadmap ─────────────────────────────────────────────────────
  function injectRoadmap(roadmapData) {
    if (!roadmapData || !Array.isArray(roadmapData.milestones)) return false;

    window.KQ_ROADMAP = roadmapData;

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

  // ── Événement custom ──────────────────────────────────────────────────────
  function emitReady(stats) {
    const event = new CustomEvent(READY_EVENT, { detail: stats });
    document.dispatchEvent(event);
    log(
      `Événement "${READY_EVENT}" émis. ` +
      `QCM: ${stats.questionsInjected}, ` +
      `TF: ${stats.tfInjected}, ` +
      `Scramble: ${stats.scrambleInjected}, ` +
      `Roadmap: ${stats.roadmapLoaded}`,
      'ok'
    );
  }

  // ── Point d'entrée principal ───────────────────────────────────────────────
  async function init() {
    log('Démarrage du chargeur de données…');

    // FIX: charge les 4 fichiers en parallèle
    const [questionsData, roadmapData, tfData, scrambleData] = await Promise.all([
      fetchJSON(DATA_PATH),
      fetchJSON(ROADMAP_PATH),
      fetchJSON(TF_PATH),
      fetchJSON(SCRAMBLE_PATH),
    ]);

    // FIX: chaque type va dans sa propre fonction de validation/injection
    const questionsInjected = questionsData ? injectQuestions(questionsData)         : 0;
    const roadmapLoaded     = roadmapData   ? injectRoadmap(roadmapData)             : false;
    const tfInjected        = tfData        ? injectTFQuestions(tfData)              : 0;
    const scrambleInjected  = scrambleData  ? injectScrambleQuestions(scrambleData)  : 0;

    emitReady({ questionsInjected, roadmapLoaded, tfInjected, scrambleInjected });
  }

  // ── Lance après que le DOM soit prêt ──────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();