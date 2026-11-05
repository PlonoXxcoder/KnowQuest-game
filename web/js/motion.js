/* Effets visuels uniquement : aucune modification du score ni des récompenses. */
(() => {
  'use strict';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'knowquest_motion_v1';
  let preference = 'system', lastConfetti = -Infinity, waiting = false, previewRun = 0;
  const counts = new Map(), celebrations = new Map();
  try { preference = localStorage.getItem(key) || 'system'; } catch {}
  if (!['system', 'full', 'reduced'].includes(preference)) preference = 'system';
  const reduced = () => preference === 'reduced' || (preference === 'system' && media.matches);
  function sync() {
    document.documentElement.dataset.motion = reduced() ? 'reduced' : 'full';
    document.querySelectorAll('[data-motion-setting]').forEach(el => { el.value = preference; });
    if (reduced()) {
      counts.forEach((entry, el) => { cancelAnimationFrame(entry.frame); el.textContent = String(entry.value); });
      counts.clear();
      document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
    }
  }
  function setPreference(value) {
    if (!['system', 'full', 'reduced'].includes(value)) return;
    preference = value;
    try { localStorage.setItem(key, value); } catch {}
    sync();
  }
  function countTo(el, value) {
    if (!el) return;
    if (counts.has(el)) cancelAnimationFrame(counts.get(el).frame);
    counts.delete(el);
    value = Math.max(0, Math.round(Number(value) || 0));
    if (reduced() || !value) { el.textContent = String(value); return; }
    const started = performance.now(), entry = { value, frame: 0 };
    el.textContent = '0'; counts.set(el, entry);
    function tick(now) {
      const progress = Math.min(1, (now - started) / 800);
      el.textContent = String(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1 && el.isConnected) entry.frame = requestAnimationFrame(tick);
      else { el.textContent = String(value); counts.delete(el); }
    }
    entry.frame = requestAnimationFrame(tick);
  }
  function mastery(days, host = document.getElementById('vBanner')) {
    if (!host) return;
    host.querySelector('.motion-mastery')?.remove();
    const badge = document.createElement('div'); badge.className = 'motion-mastery';
    badge.setAttribute('role', 'status');
    const star = document.createElement('span'); star.className = 'motion-mastery-star'; star.textContent = '★'; star.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span'); text.textContent = `Bien mémorisé · prochain rappel dans ${days} jours`;
    badge.append(star, text); host.prepend(badge);
    setTimeout(() => badge.remove(), 4000);
  }
  const blockers = '#chestOverlay.show,#discoveryOverlay.show,#levelUpOverlay.show,#bonusPopupOverlay.open,#adventureDialog[open],#bossOutcome,#scrQuiz.active:has(#bossScene)';
  function drain() {
    if (waiting || !celebrations.size) return;
    if (document.querySelector(blockers)) {
      waiting = true; setTimeout(() => { waiting = false; drain(); }, 160); return;
    }
    const [id, action] = celebrations.entries().next().value;
    celebrations.delete(id);
    action();
    if (celebrations.size) { waiting = true; setTimeout(() => { waiting = false; drain(); }, 160); }
  }
  function celebrate(id, action) {
    celebrations.set(id, action);
    queueMicrotask(drain);
  }
  function reading(value) {
    document.documentElement.classList.toggle('motion-reading', value);
    if (value) document.getElementById('companionBubble')?.classList.remove('show');
  }
  function confettiAllowed() {
    if (reduced() || document.documentElement.classList.contains('motion-reading') || Date.now() - lastConfetti < 1800) return false;
    lastConfetti = Date.now(); return true;
  }
  function openPreview() {
    let dialog = document.getElementById('motionPreview');
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'motionPreview';
      dialog.setAttribute('aria-labelledby', 'motionPreviewTitle');
      dialog.innerHTML = `<div class="motion-preview-head"><h2 id="motionPreviewTitle">Les animations du jeu</h2><button type="button" data-motion-close aria-label="Fermer l’aperçu">✕</button></div>
        <p>Choisis un effet pour le rejouer. Cet aperçu ne change ni tes XP, ni tes récompenses, ni tes révisions.</p>
        <label class="motion-preview-setting">Mouvements <select data-motion-setting aria-label="Mouvements de l’aperçu"><option value="system">Selon mon appareil</option><option value="full">Animations normales</option><option value="reduced">Animations réduites</option></select></label>
        <div class="motion-preview-buttons"><button data-demo="answer">Bonne réponse</button><button data-demo="wrong">Erreur</button><button data-demo="xp">Gain d’XP</button><button data-demo="mastery">Révision maîtrisée</button><button data-demo="mascot">Mascotte</button><button data-demo="atlas">Fiche Atlas</button><button data-demo="chest">Coffre</button><button data-demo="level">Niveau supérieur</button><button data-demo="road">Étape du parcours</button></div>
        <div class="motion-preview-stage" aria-live="polite"><p>Un aperçu apparaîtra ici.</p></div>
        <p class="motion-preview-note">Les couleurs et les informations restent visibles avec les animations réduites.</p>`;
      dialog.querySelector('[data-motion-close]').onclick = () => dialog.close();
      dialog.querySelector('select').onchange = e => setPreference(e.target.value);
      dialog.querySelectorAll('[data-demo]').forEach(button => { button.onclick = () => preview(button.dataset.demo); });
      document.body.append(dialog);
    }
    sync(); dialog.showModal();
  }
  function preview(type) {
    const run = ++previewRun;
    const stage = document.querySelector('#motionPreview .motion-preview-stage');
    if (!stage) return;
    counts.forEach((entry, el) => { if (stage.contains(el)) { cancelAnimationFrame(entry.frame); counts.delete(el); } });
    const examples = {
      answer: '<div class="ans-btn correct"><span>Paris</span></div><p>Bonne réponse : couleur et coche.</p>',
      wrong: '<div class="ans-btn wrong shake"><span>Une réponse incorrecte</span></div><p>Une secousse courte, puis la correction reste lisible.</p>',
      xp: '<div class="motion-demo-xp">+<span data-xp>0</span> XP</div><p>Le total augmente en 0,8 seconde.</p>',
      mastery: '<div data-mastery></div><p>Lorsqu’une question atteint le rappel à 7 jours.</p>',
      mascot: '<div id="motionDemoMascot"></div><p>Une réaction joyeuse ; la mascotte reste calme pendant la lecture.</p>',
      atlas: '<div class="motion-demo-atlas">🌍<strong>Nouvelle fiche Atlas</strong></div><p>Révélation lumineuse, sans seconde célébration superposée.</p>',
      chest: '<div class="motion-demo-chest">🎁</div><p>Secousse puis ouverture du coffre dans le jeu.</p>',
      level: '<div class="motion-demo-level">🏅<strong>Niveau supérieur !</strong></div><p>La célébration attend la fermeture des autres récompenses.</p>',
      road: '<div class="motion-demo-road"><span class="motion-demo-node">★</span></div><p>L’étape se valide et le parcours progresse.</p>',
    };
    stage.innerHTML = examples[type] || '';
    stage.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'instant' : 'smooth' });
    if (type === 'xp') countTo(stage.querySelector('[data-xp]'), 240);
    if (type === 'mastery') mastery(7, stage.querySelector('[data-mastery]'));
    if (type === 'mascot' && typeof window.renderMascot === 'function') window.renderMascot('motionDemoMascot', 'happy');
    if (type === 'chest') setTimeout(() => {
      if (run !== previewRun || !document.getElementById('motionPreview').open) return;
      const chest = stage.querySelector('.motion-demo-chest');
      if (chest) { chest.textContent = '✨'; chest.style.animation = 'chestBurstBig .55s ease-out both'; }
      const info = stage.querySelector('p'); if (info) info.textContent = 'Récompenses révélées — aperçu uniquement.';
    }, reduced() ? 0 : 1100);
  }
  window.Motion = { reduced, sync, setPreference, countTo, mastery, celebrate, reading, confettiAllowed, openPreview, preview };
  media.addEventListener('change', sync);
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.repeat || !event.ctrlKey || !event.altKey || event.shiftKey || event.metaKey || event.key.toLowerCase() !== 'a') return;
    if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])')) return;
    event.preventDefault();
    if (!document.getElementById('motionPreview')?.open) openPreview();
  });
  document.addEventListener('DOMContentLoaded', sync);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    counts.forEach((entry, el) => { cancelAnimationFrame(entry.frame); el.textContent = String(entry.value); }); counts.clear();
  });
  sync();
})();
