/* Ressources d'une activité : délais, écouteurs et réponses asynchrones. */
((root) => {
  'use strict';

  function create(clock = root) {
    let generation = 0;
    const timers = new Map();
    const cleanups = new Set();

    // Capturer avant un await ; vérifier avant d'utiliser la réponse.
    function checkpoint() {
      const version = generation;
      return () => version === generation;
    }

    // Une ressource est libérée au plus une fois, manuellement ou à la sortie.
    function own(cleanup) {
      cleanups.add(cleanup);
      return () => { if (cleanups.delete(cleanup)) cleanup(); };
    }

    function listen(target, event, action, options) {
      const current = checkpoint();
      const callback = (...args) => { if (current()) action(...args); };
      target.addEventListener(event, callback, options);
      return own(() => target.removeEventListener(event, callback, options));
    }

    function schedule(action, delay, repeat) {
      const current = checkpoint();
      let id;
      const callback = () => {
        if (!repeat) timers.delete(id);
        if (current()) action();
      };
      id = repeat ? clock.setInterval(callback, delay) : clock.setTimeout(callback, delay);
      timers.set(id, repeat);
      return id;
    }

    function clear(id) {
      if (!timers.has(id)) return;
      const repeat = timers.get(id);
      timers.delete(id);
      if (repeat) clock.clearInterval(id);
      else clock.clearTimeout(id);
    }

    // Invalider d'abord : un callback déjà placé dans la file ne peut plus agir.
    function cancel() {
      generation++;
      for (const id of [...timers.keys()]) clear(id);
      for (const cleanup of [...cleanups]) {
        cleanups.delete(cleanup);
        cleanup();
      }
    }

    return {
      later: (action, delay) => schedule(action, delay, false),
      every: (action, delay) => schedule(action, delay, true),
      clear, cancel, checkpoint, own, listen,
      pending: () => timers.size,
    };
  }

  const api = {create};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TaskScope = api;
})(typeof window === 'undefined' ? globalThis : window);
