/* Histoire : règles de progression, sans dépendance à l’interface. */
((root) => {
  'use strict';

  // ── Équilibrage : valeurs regroupées pour faciliter les ajustements ──
  const ERRORS_PER_HEART = 3;
  const GIFT_CHANCE = 0.25;

  // ── Sauvegarde : compatibilité avec les profils déjà existants ──
  function state(profile) {
    if (!profile.storyRules || typeof profile.storyRules !== 'object' || Array.isArray(profile.storyRules)) profile.storyRules = {};
    const s = profile.storyRules;
    if (!Number.isInteger(s.errors) || s.errors < 0 || s.errors >= ERRORS_PER_HEART) s.errors = 0;
    if (!s.giftAttempts || typeof s.giftAttempts !== 'object' || Array.isArray(s.giftAttempts)) s.giftAttempts = {};
    return s;
  }

  // ── Périmètre : uniquement les étapes du parcours Histoire ──
  function isStory(mode, chapters) {
    return Array.isArray(chapters) && chapters.some(chapter => Array.isArray(chapter.nodes) && chapter.nodes.some(node => node.id === mode));
  }

  // ── Vies : les bonnes réponses ne remettent pas les erreurs à zéro ──
  function mistake(profile) {
    const s = state(profile);
    s.errors++;
    const costsHeart = s.errors === ERRORS_PER_HEART;
    if (costsHeart) s.errors = 0;
    return { costsHeart, errors: s.errors };
  }

  // ── Surprises : tirage après réponse, jamais annoncé dans la question ──
  function surprise(profile, question, random = Math.random) {
    if (!question || !question.id || question.difficulty !== 'hard') return null;
    const s = state(profile);
    if (Object.hasOwn(s.giftAttempts, question.id)) return null;
    // Une seule chance par question, même si le premier tirage ne donne rien.
    Object.defineProperty(s.giftAttempts, question.id, { value: true, enumerable: true, writable: true, configurable: true });
    if (random() >= GIFT_CHANCE) return null;
    const roll = random();
    if (roll < 0.70) return { type: 'gems', amount: 5, label: '+5 gemmes' };
    if (roll < 0.95) return { type: 'gems', amount: 10, label: '+10 gemmes' };
    return { type: 'shield', amount: 1, label: '+1 bouclier' };
  }

  // ── Attribution : une récompense effective, sauvegardée par le jeu ──
  function grant(profile, gift) {
    if (!gift) return;
    if (gift.type === 'gems') profile.gems = (profile.gems || 0) + gift.amount;
    else if (gift.type === 'shield') {
      profile.powerups ||= {};
      profile.powerups.shield = (profile.powerups.shield || 0) + gift.amount;
    }
  }

  const rules = { ERRORS_PER_HEART, GIFT_CHANCE, state, isStory, mistake, surprise, grant };
  if (typeof module !== 'undefined' && module.exports) module.exports = rules;
  else root.StoryRules = rules;
})(typeof window !== 'undefined' ? window : globalThis);
