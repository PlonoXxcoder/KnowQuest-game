/* Présentation des récompenses du compagnon : aperçu avant équipement,
 * confirmation explicite, retour sans mutation de la sauvegarde.
 *
 * - L'aperçu (« Essayer » / « Voir en grand ») ne modifie jamais le profil.
 * - « Équiper » passe par la fonction d'équipement existante (buyOrEquipHat),
 *   qui applique, sauvegarde et met à jour l'interface : aucune voie parallèle.
 * - Retour / Échap / clic sur le voile ferment l'aperçu sans rien changer.
 * - Un accessoire déjà porté n'est pas remplacé sans action du joueur.
 * - Identifiant inconnu ou retiré : valeur de secours explicite, équipement désactivé.
 * - Mouvements réduits : mêmes informations, sans animation (garde CSS dans companion.css).
 */
((root) => {
  'use strict';
  const events = () => root.CompanionEvents;
  const catalog = () => root.CompanionCatalog;
  const reduced = () => root.Motion ? root.Motion.reduced() : false;

  function ensureDialog() {
    let dialog = document.getElementById('companionPreview');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'companionPreview';
    dialog.className = 'cq-preview';
    dialog.setAttribute('aria-labelledby', 'companionPreviewTitle');
    document.body.append(dialog);
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return dialog;
  }
  function open({ itemId, avatar, onEquip, source }) {
    const resolved = catalog().byId(itemId, (root.kqPlayer?.() ?? root.P) || null);
    const dialog = ensureDialog();
    const title = document.createElement('h2');
    title.id = 'companionPreviewTitle';
    title.textContent = resolved.unknown ? 'Accessoire indisponible' : 'Aperçu de l’accessoire';
    const fitting = document.createElement('div');
    fitting.className = 'cq-preview-look';
    const look = root.AvatarRewards.look(avatar || '🦁', resolved);
    fitting.append(look);
    const info = document.createElement('div');
    info.className = 'cq-preview-info';
    const name = document.createElement('strong'); name.textContent = resolved.name;
    const condition = document.createElement('p');
    condition.className = 'cq-preview-condition';
    condition.textContent = resolved.unknown
      ? resolved.desc
      : `Condition : ${resolved.condition}`;
    info.append(name, condition);
    if (resolved.unknown) {
      const note = document.createElement('p');
      note.className = 'cq-preview-note';
      note.textContent = 'Si tu l’avais porté, ton apparence reste celle de ton profil.';
      info.append(note);
    }
    const actions = document.createElement('div');
    actions.className = 'cq-preview-actions';
    const canEquip = resolved.owned && !resolved.unknown;
    const equippedNow = resolved.state === 'equipped';
    if (onEquip) {
      const equip = document.createElement('button');
      equip.type = 'button';
      equip.className = 'cq-btn cq-btn-equip';
      equip.textContent = equippedNow ? 'Porté' : 'Équiper';
      equip.disabled = !canEquip || equippedNow;
      equip.onclick = () => {
        try { onEquip(resolved.id); } finally { dialog.close(); }
      };
      actions.append(equip);
    }
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'cq-btn cq-btn-back';
    back.textContent = 'Retour';
    back.onclick = () => dialog.close();
    actions.append(back);
    const hint = document.createElement('small');
    hint.className = 'cq-preview-hint';
    hint.textContent = 'L’aperçu ne change pas ta sauvegarde ; ton avatar ne porte l’accessoire qu’après « Équiper ».';
    dialog.replaceChildren(title, fitting, info, actions, hint);
    dialog.showModal();
    (canEquip && !equippedNow ? actions.querySelector('.cq-btn-equip') : back).focus();
    if (source === 'collection') return;
    events()?.publish('reward:accessory-preview', { itemId: resolved.id });
    // Réaction légère : annoncée une fois par ouverture (limitée côté réactions).
  }
  // Bloc de fin de chapitre, inséré dans l'écran de résultat existant.
  function presentChapterReward({ item, avatar, host, equip }) {
    if (!host) return null;
    const resolved = catalog().byId(item?.id, (root.kqPlayer?.() ?? root.P) || null);
    const block = document.createElement('div');
    block.className = 'cq-reward';
    const label = document.createElement('strong');
    label.textContent = `${resolved.ico} Souvenir obtenu : ${resolved.name}`;
    const condition = document.createElement('small');
    condition.textContent = resolved.unknown ? resolved.desc : `Condition remplie : ${resolved.condition}`;
    const actions = document.createElement('div');
    actions.className = 'cq-preview-actions';
    const tryBtn = document.createElement('button');
    tryBtn.type = 'button';
    tryBtn.className = 'cq-btn cq-btn-try';
    tryBtn.textContent = 'Essayer';
    tryBtn.onclick = () => open({ itemId: resolved.id, avatar, onEquip: id => {
      equip?.(id); markEquipped();
    } });
    const later = document.createElement('button');
    later.type = 'button';
    later.className = 'cq-btn cq-btn-back';
    later.textContent = 'Plus tard';
    later.onclick = () => { block.dataset.state = 'dismissed'; };
    actions.append(tryBtn, later);
    const hint = document.createElement('small');
    hint.className = 'cq-preview-hint';
    hint.textContent = 'Il restera dans ta collection d’avatar, ruban Profil.';
    block.append(label, condition, actions, hint);
    host.append(block);
    function markEquipped() { block.dataset.state = 'equipped'; tryBtn.textContent = 'Équipé ✓'; }
    return block;
  }
  const api = { open, presentChapterReward };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CompanionRewardsUI = api;
})(typeof window !== 'undefined' ? window : globalThis);
