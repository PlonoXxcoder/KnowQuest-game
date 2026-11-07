/* Fenêtres existantes : focus contenu pendant l'ouverture, puis rendu au déclencheur. */
(() => {
  'use strict';
  function boot() {
    const previous = new Map();
    const current = () => [...document.querySelectorAll('.modal-bg.open')].at(-1);
    const controls = modal => [...modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
    const sync = () => {
      for (const modal of document.querySelectorAll('.modal-bg')) {
        if (modal.classList.contains('open')) {
          if (previous.has(modal)) continue;
          previous.set(modal, document.activeElement);
          modal.setAttribute('role', 'dialog');
          modal.setAttribute('aria-modal', 'true');
          if (!modal.hasAttribute('aria-label') && !modal.hasAttribute('aria-labelledby')) {
            const heading = modal.querySelector('h1, h2, h3, .modal-title');
            if (heading) {
              heading.id ||= modal.id + '-title';
              modal.setAttribute('aria-labelledby', heading.id);
            } else modal.setAttribute('aria-label', 'Fenêtre du jeu');
          }
          modal.tabIndex = -1;
          (controls(modal)[0] || modal).focus();
        } else if (previous.has(modal)) {
          const trigger = previous.get(modal);
          previous.delete(modal);
          modal.removeAttribute('aria-modal');
          if (trigger?.isConnected && trigger.getClientRects().length) trigger.focus();
        }
      }
    };
    document.addEventListener('keydown', event => {
      const modal = current();
      if (!modal || event.key !== 'Tab') return;
      const items = controls(modal), first = items[0] || modal, last = items.at(-1) || modal;
      if (!modal.contains(document.activeElement) || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    });
    new MutationObserver(sync).observe(document.body, {subtree: true, attributes: true, attributeFilter: ['class']});
    sync();
  }
  document.addEventListener('DOMContentLoaded', boot, {once: true});
})();
