// KnowQuest — chef d'orchestre du démarrage.
// L'app démarre UNE seule fois, quand les données principales sont prêtes
// (événement 'kq:data-loaded' émis par data_loader.js) — plus de course
// critique entre game.js et le chargement des questions.
//
// Filet de sécurité : si les données n'arrivent pas sous 3 s (première
// visite hors-ligne, serveur absent…), on démarre quand même. Les modes
// concernés afficheront « questions indisponibles » via ensureBankLoaded.

    function __kqBoot() {
      // NB : P, _appStarted et startApp sont déclarés `let`/`function` au
      // niveau script dans game.js → portée lexicale globale, PAS window.P.
      if (_appStarted || typeof P === 'undefined' || !P.name) return;
      _appStarted = true;
      console.log('[KnowQuest] Données prêtes (ou délai dépassé) — lancement du jeu…');
      startApp();
    }

    window.addEventListener('kq:data-loaded', () => {
      console.log('Données prêtes ! Lancement du jeu…');
      __kqBoot();
    });

    setTimeout(__kqBoot, 3000);
