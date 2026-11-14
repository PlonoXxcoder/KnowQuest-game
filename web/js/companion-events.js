/* Bus d'événements du compagnon : contrat unique entre le compagnon et les
 * autres chantiers (Aventure, Révisions). Aucune logique de jeu ici.
 *
 * Contrat proposé (v1) — publier via CompanionEvents.publish(name, payload)
 * ou, sans dépendre de ce module, via un CustomEvent documenté :
 *   document.dispatchEvent(new CustomEvent('kq:companion', {
 *     detail: { name: 'adventure:chapter-completed', chapterIndex: 2, bossId: 'boss_ch2' }
 *   }));
 *
 * Événements et champs attendus :
 *  - quiz:answer                { correct: boolean, combo?: number, difficulty?: string }
 *  - quiz:session-end           { accuracy: number }        (précision en %)
 *  - adventure:chapter-completed{ chapterIndex: number, bossId?: string, accessoryId?: string }
 *  - reward:accessory-unlocked  { itemId: string, chapterIndex?: number }
 *  - reward:accessory-preview   { itemId: string }
 *  - reward:accessory-equipped  { itemId: string }
 *
 * publish() route en interne sans repasser par l'événement document (pas de
 * boucle) ; l'écouteur 'kq:companion' n'accepte que des événements externes.
 */
((root) => {
  'use strict';
  const NAMES = ['quiz:answer', 'quiz:session-end', 'adventure:chapter-completed',
    'reward:accessory-unlocked', 'reward:accessory-preview', 'reward:accessory-equipped'];
  const handlers = new Set();
  const history = [];

  function record(name, payload) {
    history.push({ name, payload, at: Date.now() });
    if (history.length > 100) history.shift();
  }
  function publish(name, payload = {}) {
    if (!NAMES.includes(name)) {
      if (typeof console !== 'undefined') console.warn(`[companion-events] événement inconnu : ${name}`);
      return;
    }
    record(name, payload);
    handlers.forEach(fn => { try { fn({ name, payload }); } catch (e) { if (typeof console !== 'undefined') console.error(e); } });
  }
  function subscribe(fn) {
    handlers.add(fn);
    return () => handlers.delete(fn);
  }
  // Point d'entrée externe (agents Aventure / Révisions) : détail = { name, ...payload }.
  // Aucune garde « || external » ici : ce nom liait le global window.external
  // (présent dans certains navigateurs) et faisait ignorer tous les CustomEvent.
  function onExternal(event) {
    const detail = event.detail;
    if (!detail || typeof detail.name !== 'string') return;
    const { name, ...payload } = detail;
    if (!NAMES.includes(name)) return;
    record(name, payload);
    handlers.forEach(fn => { try { fn({ name, payload }); } catch (e) { if (typeof console !== 'undefined') console.error(e); } });
  }
  // ── Adaptateur explicite Aventure → Compagnon ──────────────────────────
  // L'Aventure émet `kq:chapitre-restaure` (CustomEvent sur window,
  // detail = { chapitre, titre, icone, fragments, total }) au moment de la
  // restauration d'un chapitre. Correspondance de champs :
  //   chapitre  → chapterIndex
  //   titre     → titre (informationnel, non utilisé par les réactions)
  //   icone     → icone (informationnel)
  //   fragments, total → repris tels quels (informationnels)
  //   bossId    → absent de ce canal (réponse : 'ch<chapterIndex>')
  // Source de vérité de la célébration : la victoire réelle du gardien
  // (handleBossResult publie adventure:chapter-completed avec bossId et
  // accessoryId). L'adaptateur ne relaie kq:chapitre-restaure que si aucun
  // événement du contrat pour ce même chapitre n'existe déjà dans l'historique
  // de session — les deux sources convergent, le dédoublonnage final est
  // assuré par la clé 'ch<chapterIndex>' côté réactions.
  function adapterAventure(event) {
    const detail = event.detail;
    const chapitre = Number(detail?.chapitre);
    if (!Number.isInteger(chapitre) || chapitre < 0) return;
    if (history.some(item => item.name === 'adventure:chapter-completed' && item.payload.chapterIndex === chapitre)) return;
    publish('adventure:chapter-completed', {
      chapterIndex: chapitre,
      origine: 'kq:chapitre-restaure',
      titre: detail.titre, icone: detail.icone,
      fragments: detail.fragments, total: detail.total,
    });
  }
  const api = { NAMES, publish, subscribe, history: () => history.map(item => ({ ...item })), adapterAventure };
  if (typeof document !== 'undefined') document.addEventListener('kq:companion', onExternal);
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('kq:chapitre-restaure', adapterAventure);
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CompanionEvents = api;
})(typeof window !== 'undefined' ? window : globalThis);
