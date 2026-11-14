/* Catalogue du compagnon et règles de déblocage : couche de lecture au-dessus
 * des catalogues existants (AvatarRewards.items pour les souvenirs de
 * chapitre, Economy.cosmetics pour les accessoires en gemmes). Aucune donnée
 * n'est recréée ici : ids, noms et conditions restent ceux des modules d'origine.
 *
 * Correspondance explicite chapitres ↔ accessoires (identifiants stables) :
 *   chapitre 1 → voyage_phare   (Insigne du navigateur)
 *   chapitre 2 → voyage_cite    (Plume des chroniques)
 *   chapitre 3 → voyage_jardin  (Emblème du jardin)
 *   chapitre 4 → voyage_atelier (Signature de l'artiste)
 *   chapitre 5 → voyage_marche  (Insigne des saveurs)
 *   chapitre 6 → voyage_arene   (Médaille de l'arène)
 *   chapitre 7 → voyage_studio  (Note des échos)
 *   chapitre 8 → voyage_atlas   (Sceau du Grand Atlas)
 *
 * Déblocage : seul AvatarRewards.unlock(profile) attribue, une seule fois,
 * sans gemme ni XP (aucune récompense monétaire rejouée). Les chapitres déjà
 * terminés des anciens profils sont récupérés gratuitement au chargement par
 * ensureHatInventory() (game.js), qui repose sur le même mécanisme idempotent.
 */
((root) => {
  'use strict';
  const FALLBACK = id => ({ id, ico: '🏅', name: 'Souvenir',
    desc: 'Cet accessoire n’est plus disponible dans cette version du jeu.',
    slot: 'badge', unknown: true });
  const stateOf = (player, item) => {
    if (!player) return 'locked';
    if (player.avatarStyle?.hat === item.ico) return 'equipped';
    return (player.ownedHats || []).includes(item.id) ? 'owned' : 'locked';
  };
  const conditionOf = item => item.chapter !== undefined
    ? `Vaincre le gardien du chapitre ${item.chapter + 1}`
    : item.cost ? `Acheter pour ${item.cost} 💎` : 'Offert';
  function decorated(item, player) {
    if (!item) return null;
    return { ...item, state: stateOf(player, item), condition: conditionOf(item),
      owned: (player?.ownedHats || []).includes(item.id) };
  }
  function catalog() {
    const rewards = root.AvatarRewards?.items || [];
    const cosmetics = (root.Economy?.cosmetics || []).filter(item => item.chapter === undefined);
    return [...rewards, ...cosmetics];
  }
  // Liste complète, souvenirs et achats, états séparés : equipped, owned, locked.
  function items(player) {
    return catalog().map(item => decorated(item, player))
      .sort((a, b) => {
        const rank = { equipped: 0, owned: 1, locked: 2 };
        return (rank[a.state] - rank[b.state]) || ((a.chapter ?? 99) - (b.chapter ?? 99));
      });
  }
  function chapterAccessory(index) {
    return root.AvatarRewards?.items?.[index] || null;
  }
  function byId(id, player) {
    const item = catalog().find(entry => entry.id === id);
    return item ? decorated(item, player) : { ...FALLBACK(id), state: 'owned', condition: '—', owned: false };
  }
  // Attribution unique des souvenirs admissibles (anciens profils inclus),
  // sans rejouer les récompenses monétaires : délègue au mécanisme existant.
  function syncUnlocks(player) {
    return root.AvatarRewards?.unlock?.(player) || [];
  }
  const api = { items, chapterAccessory, byId, syncUnlocks, FALLBACK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CompanionCatalog = api;
})(typeof window !== 'undefined' ? window : globalThis);
