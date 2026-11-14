/* Réactions contextuelles du compagnon : politique seule (priorité, fréquence,
 * annulation, mouvements réduits). Les textes et humeurs vivent ici ; le
 * rendu reste celui du compagnon existant (bulle + humeur de la mascotte).
 *
 * Le jeu appelle CompanionReactions.install(hooks) une fois après la création
 * de Companion (voir patch game.js) :
 *   say(text, opts)      affiche une bulle via Companion.say
 *   drop()               vide la file du compagnon et masque la bulle
 *   reading()            true pendant la lecture d'une nouvelle question
 *   reduced()            true si les mouvements doivent être réduits
 *   hidden()             true si l'onglet n'est pas visible
 * Les tests peuvent fournir leurs propres hooks : aucun DOM requis.
 */
((root) => {
  'use strict';
  // Priorité décroissante : un événement plus urgent annule la réaction
  // courante s'il devient obsolète (ex. : sortie d'écran).
  const PRIORITY = {
    'adventure:chapter-completed': 4,
    'quiz:session-end': 3,
    'reward:accessory-preview': 1,
    'reward:accessory-equipped': 1,
    'quiz:answer': 0,
  };
  const WRONG_MIN_MS = 15000;      // encouragement d'erreur : au plus 1 / 15 s
  const CORRECT_MIN_MS = 9000;     // approbation : ~1 / 9 s (cohérent avec l'existant)
  const CHAPTER_IDS = new Set();   // une célébration par chapitre, jamais rejouée
  let hooks = null;
  let current = null;              // { name, priority }
  let shownAt = { wrong: -Infinity, correct: -Infinity, preview: -Infinity, equipped: -Infinity };
  let pendingTimer = 0;
  let wrongStreak = 0;
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function install(overrides = {}) {
    hooks = {
      say: overrides.say || (root.Companion ? (t, o) => root.Companion.say(t, o) : () => {}),
      drop: overrides.drop || (() => {}),
      reading: overrides.reading || (() => false),
      hidden: overrides.hidden || (() => typeof document !== 'undefined' && document.hidden),
      now: overrides.now || (() => Date.now()),
    };
    return api;
  }
  // true = la réaction existante doit être ignorée (limite de fréquence).
  function gate(event, data = {}) {
    if (!hooks) return false;
    if (event === 'wrong') {
      wrongStreak += 1;
      if (hooks.now() - shownAt.wrong < WRONG_MIN_MS) return true;
      shownAt.wrong = hooks.now();
      return false;
    }
    if (event === 'correct') {
      wrongStreak = 0;
      if (data.combo >= 5) return false;             // série : gérée par l'existant
      if (hooks.now() - shownAt.correct < CORRECT_MIN_MS) return true;
      shownAt.correct = hooks.now();
      return false;
    }
    return false;
  }
  function cancelCurrent(name) {
    if (current && PRIORITY[name] > current.priority) {
      clearTimeout(pendingTimer); pendingTimer = 0;
      hooks.drop();
      current = null;
    }
  }
  // Une réaction devenue obsolète (sortie d'écran, nouvel écran) est annulée.
  function cancel() {
    clearTimeout(pendingTimer); pendingTimer = 0;
    current = null;
    wrongStreak = 0;
    hooks?.drop();
  }
  function announce(name, text, mood, dur) {
    if (!hooks || hooks.hidden()) return;            // rien tourne en arrière-plan
    if (hooks.reading() && name !== 'adventure:chapter-completed') return;
    hooks.say(text, { mood, dur: dur || 2600 });     // bulle existante : même présentation
    current = { name, priority: PRIORITY[name] ?? 1 };
  }
  function handle({ name, payload = {} }) {
    if (!hooks || hooks.hidden()) return;
    if (name === 'adventure:chapter-completed') {
      // Dédoublonnage par chapitre, indépendant de l'émetteur : la publication
      // canonique (handleBossResult, avec bossId et accessoryId) et l'adaptateur
      // de kq:chapitre-restaure (Aventure, sans bossId) convergent vers la même
      // clé — une seule célébration par victoire, jamais deux.
      const key = 'ch' + payload.chapterIndex;
      if (CHAPTER_IDS.has(key)) return;              // jamais deux fois le même chapitre
      CHAPTER_IDS.add(key);
      cancelCurrent(name);
      const index = Number(payload.chapterIndex) + 1 || '';
      announce(name, pick([
        `Le chapitre ${index} est terminé — je suis fier de toi ! 🎉`,
        `Une page de plus restaurée. Bravo pour ce chapitre ! 🌟`,
        `Chapitre ${index} réussi ! Tu vois, on y est arrivés ensemble 🦉`,
      ]), 'celebrate', 4200);
      return;
    }
    if (name === 'quiz:session-end') return;         // félicitations existantes conservées
    if (name === 'quiz:answer') return;              // approbation / encouragement existants conservés
    if (name === 'reward:accessory-preview') {
      if (hooks.now() - shownAt.preview < 4000) return;
      shownAt.preview = hooks.now();
      announce(name, pick(['Oh, il te va bien ! ✨', 'Joli souvenir, non ? 👀', 'Essaie-le autant que tu veux !']), 'happy', 2200);
      return;
    }
    if (name === 'reward:accessory-equipped') {
      if (hooks.now() - shownAt.equipped < 4000) return;
      shownAt.equipped = hooks.now();
      announce(name, pick(['C’est fait ! Joli choix ✨', 'Et voilà, il est à toi ! 🦉']), 'happy', 2200);
      return;
    }
  }
  function reset() { // tests uniquement
    CHAPTER_IDS.clear(); current = null; wrongStreak = 0;
    shownAt = { wrong: -Infinity, correct: -Infinity, preview: -Infinity, equipped: -Infinity };
    clearTimeout(pendingTimer); pendingTimer = 0;
  }
  const api = { PRIORITY, install, gate, cancel, handle, reset,
    wrongStreak: () => wrongStreak, current: () => current,
    celebrated: () => [...CHAPTER_IDS] }; // chapitres célébrés cette session (tests/audit)
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CompanionReactions = api;
})(typeof window !== 'undefined' ? window : globalThis);
