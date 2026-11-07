/* Attendre une banque sans conserver d'écouteur ni marquer un échec comme chargé. */
((root) => {
  'use strict';
  function wait(ready, { target = root, timeout = 10000 } = {}) {
    if (ready()) return Promise.resolve(true);
    return new Promise(resolve => {
      let timer;
      const finish = result => {
        clearTimeout(timer);
        target.removeEventListener('kq:data-loaded', check);
        target.removeEventListener('kq:bank-loaded', check);
        resolve(result);
      };
      const check = () => { if (ready()) finish(true); };
      target.addEventListener('kq:data-loaded', check);
      target.addEventListener('kq:bank-loaded', check);
      timer = setTimeout(() => finish(false), timeout);
      check();
    });
  }
  const api = { wait };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BankReadiness = api;
})(typeof window === 'undefined' ? globalThis : window);
