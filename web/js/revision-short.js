'use strict';
// Polyfill minimal pour tests Node (l'API DOM n'est jamais touchée en dehors du navigateur)
if (typeof window === 'undefined') { globalThis.window = globalThis; }
// ================================================================
// RÉVISIONS COURTES v5 — session de 5 questions sur les erreurs du joueur.
// Réutilise EXCLUSIVEMENT le moteur SRS de game.js et la sauvegarde existante.
// v2 : bilan réel via point de fin explicite (showResult), anti-farm persistant
// (P.revShort marqué À LA RÉPONSE), selectSession = contrat clair (session max 5
// + total admissible), dates validées, compatibilité moteur (QCM seulement),
// cycle de vie propre (double lancement, abandon, reprise, nettoyage).
// ================================================================
const RevShort = (() => {
  const SESSION_SIZE = 5;
  const REV_IDS_MAX = 60;  // seuil d'usage normal ; AUCUNE éviction (garde-fou anti-anomalie à 300 : jour bloqué plutôt qu'oublié)
  const REV_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;     // format réel du moteur (GameRules.day)

  // ---- horloge injectable (tests) ------------------------------------------
  function now() {
    const injected = window.__revClock;
    if (injected) { const d = injected(); return d instanceof Date ? d : new Date(d); }
    return new Date();
  }
  function dayStr(offsetDays = 0) {
    const d = now();
    d.setDate(d.getDate() + offsetDays);
    return GameRules.day(d);
  }

  // ---- validation de dates au format réel du moteur ------------------------
  function dateValide(s) {
    if (typeof s !== 'string' || !REV_DAY_RE.test(s)) return false;
    const [y, m, j] = s.split('-').map(Number);
    const d = new Date(y, m - 1, j);
    return d.getFullYear() === y && d.getMonth() === m - 1 && d.getDate() === j;
  }

  // ---- compatibilité avec le moteur de révision ----------------------------
  // Le flux 'revision' rend les questions en QCM : une fiche TF ou Méli-Mélo
  // renvoyée par findQuestionById n'y est PAS rendable -> exclue proprement.
  function rendable(q) {
    return !!q && Array.isArray(q.choices) && q.choices.length === 4
      && q.choices.every(c => typeof c === 'string' && c.trim())
      && Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer <= 3
      && typeof q.id === 'string' && !!q.id;
  }

  // ---- sélection : retourne la SESSION FINALE + le total admissible --------
  // p : profil ; resolve(id)->q|null ; today : jour courant (string) ;
  // joueAujourd : Set des ids déjà RÉPONDUS aujourd'hui (persisté P.revShort).
  // Retour { due:[{id,q,entry}], recent:[{id,q}], taille, totalAdmissible }
  //   - taille          : questions sélectionnées pour la session (<= 5)
  //   - totalAdmissible : fiches + erreurs admissibles avant limite de 5
  function selectSession(p, resolve, today, joueAujourd) {
    const out = { due: [], recent: [], taille: 0, totalAdmissible: 0 };
    const srs = p?.srs || {};
    const joue = joueAujourd || new Set();
    const du = [];
    for (const [id, e] of Object.entries(srs)) {
      if (!e || !dateValide(e.due)) continue;                 // fiche malformée : ignorée
      if (e.due > today) continue;                            // pas encore échéue
      if (joue.has(id)) continue;                             // déjà répondue aujourd'hui
      const q = resolve(id);
      if (!q) continue;                                       // question absente
      if (!rendable(q)) continue;                             // TF/Scramble : incompatible QCM
      du.push({ id, q, entry: e });
    }
    du.sort((a, b) => a.entry.due.localeCompare(b.entry.due)); // échéances les plus anciennes d'abord
    const recents = [];
    const vus = new Set(du.map(x => x.id));
    for (const m of (Array.isArray(p?.mistakes) ? p.mistakes : [])) {
      if (!m?.id || vus.has(m.id) || joue.has(m.id)) continue;
      const e = srs[m.id];
      if (e && dateValide(e.due) && e.due <= today) continue;  // déjà comptée côté échéance
      const q = resolve ? resolve(m.id) : null;                 // version ACTUELLE de la banque
      if (!q) continue;                                        // identifiant supprimé : ignoré
      if (!rendable(q)) continue;                              // TF/Scramble : incompatible
      // plus de comparaison intégrale : la version actuelle de la banque fait foi
      recents.push({ id: q.id, q });                           // version actuelle, pas l'ancienne copie
      vus.add(q.id);
    }
    out.totalAdmissible = du.length + recents.length;
    out.due = du.slice(0, SESSION_SIZE);
    const reste = SESSION_SIZE - out.due.length;
    out.recent = recents.slice(0, Math.max(0, reste));
    out.taille = out.due.length + out.recent.length;
    return out;
  }

  // ---- donnée persistante anti-farm (dans le profil existant, pas de 2e sauvegarde) ----
  // Schéma : P.revShort = { jour: 'YYYY-MM-DD', ids: [id...] } ; ids <= 60 ;
  // valeur de secours : undefined -> traité comme vide ; synchronisé par le
  // mécanisme existant du profil (accountSync), compatible anciens profils.
  function idsRepondusAujourdhui() {
    resetJourPersiste();
    return new Set(P.revShort.ids);
  }
  function resetJourPersiste() {
    const j = dayStr();
    if (!P) return;
    const r = P.revShort;
    if (!r || !dateValide(r.jour) || r.jour !== j) P.revShort = { jour: j, ids: [] };
    if (!Array.isArray(P.revShort.ids)) P.revShort.ids = [];
    // AUCUNE éviction : les identifiants du jour ne sont jamais oubliés (aucun
    // regagnage possible). La liste est bornée par le nombre de questions
    // admissibles du jour ; au-delà de REV_IDS_MAX*5 (anomalie), start() refuse
    // la session du jour plutôt que d'oublier.
  }
  function marquerRepondu(id) {
    if (!id || !P) return;
    resetJourPersiste();
    if (!P.revShort.ids.includes(id)) { P.revShort.ids.push(id); if (typeof save === 'function') save(); }
  }
  // Appelé par le patch game.js pour une réussite SANS fiche existante. La fiche
  // n'est créée QUE dans le contexte session courte active ET pour une erreur
  // récente retravaillée — les autres modes gardent le comportement antérieur (rien).
  function succesSansFiche(id) {
    if (!sessionActive || !id || !P) return;
    if (!Array.isArray(P.mistakes) || !P.mistakes.some(m => m && m.id === id)) return;
    const eng = window.__revSrsEngine;
    if (!eng) return;
    P.srs[id] = { box: 1, due: eng.todayStr(eng.SRS_INTERVALS[0]) };
    if (typeof save === 'function') save();
  }

  // ---- cycle de vie --------------------------------------------------------
  let sessionActive = false;      // empêche double lancement
  function start() {
    if (!window.findQuestionById || !window.startQuizFlow || !window.setSrsPool) {
      showToast?.('Chargement… réessaie dans un instant.');
      return false;                                              // rien consommé si lancement impossible
    }
    if (sessionActive) return false;                             // double lancement : ignoré
    resetJourPersiste();
    if ((P.revShort?.ids?.length ?? 0) >= REV_IDS_MAX * 5) {     // garde-fou anti-anomalie : jour bloqué, jamais d'oubli
      showToast?.('Tu as beaucoup révisé aujourd’hui 🎉 Reviens demain pour ancrer tes acquis.');
      return false;                                              // pas de regagnage le même jour
    }
    sessionActive = true;
    nettoyerCarte();
    const sel = selectSession(P, findQuestionById, dayStr(), idsRepondusAujourdhui());
    if (sel.taille === 0) {
      sessionActive = false;                                     // lancement annulé : rien verrouillé
      showToast?.('Rien à réviser pour le moment 🎉 Joue une partie : tes erreurs reviendront ici au bon moment.');
      return false;
    }
    const n = Math.min(SESSION_SIZE, sel.taille);
    const pool = [...sel.due, ...sel.recent].map(x => x.q);      // déjà limité à 5 par selectSession
    if (n < SESSION_SIZE) showToast?.(`Session courte : ${n} question${n > 1 ? 's' : ''} à revoir aujourd'hui.`);
    window.setSrsPool(pool);
    try {
      const resultat = window.startQuizFlow(n, 'Revision', 'revision');
      // Contrat réel de startQuizFlow : return false si pool vide, sinon undefined.
      if (resultat === false) {
        sessionActive = false;
        window.setSrsPool([]);                                   // aucun ancien pool ne peut agir plus tard
        return false;                                            // rien consommé, nouvelle tentative possible
      }
      return true;                                               // lancement réussi
    } catch (e) {
      sessionActive = false;
      window.setSrsPool([]);
      console.warn('[RevShort] échec de lancement :', e);
      return false;
    }
  }
  function abandonner() {
    // sortie (retour accueil, changement de mode) : session NON terminée -> pas
    // de bilan ; les questions non répondues restent proposables (jamais marquées).
    sessionActive = false;
  }

  // ---- BILAN : appelé par le point de fin explicite de game.js -------------
  // game.js showResult() : window.__revSession?.onSessionEnd?.(Q.mode, Q.correct, Q.qs.length)
  // Déclenché UNE fois par session (garde Q.resultShown du moteur) ; le bilan
  // n'est injecté que si mode==='Revision' et sessionActive — jamais sur un
  // autre mode, jamais deux fois, jamais après une autre partie.
  function onSessionEnd(mode, acc, total) {
    if (mode !== 'Revision' || !sessionActive) return;
    sessionActive = false;
    const reussies = Number.isFinite(acc) ? acc : 0;            // Q.correct : bonnes réponses du moteur
    const repondues = Number.isFinite(total) ? total : 0;       // questions de la session (toutes répondues à showResult)
    const sel = selectSession(P, findQuestionById, dayStr(), idsRepondusAujourdhui());
    const aRevoir = sel.totalAdmissible;
    const auj = dayStr();
    let plusProche = null;
    for (const [, e] of Object.entries(P.srs || {})) {
      if (!dateValide(e?.due) || e.due <= auj) continue;         // jamais une date passée
      if (!plusProche || e.due < plusProche) plusProche = e.due;
    }
    const scr = document.getElementById('scrResult');
    if (!scr) return;
    nettoyerCarte();
    const card = document.createElement('div');
    card.id = 'revShortSummary';
    card.className = 'rev-bilan';
    card.setAttribute('role', 'status');
    if (!document.getElementById('revBilanStyle')) {
      const st = document.createElement('style');
      st.id = 'revBilanStyle';
      st.textContent = `
        #revShortSummary{display:flex;flex-direction:column;gap:8px;margin:14px auto;padding:16px;
          max-width:520px;width:calc(100% - 24px);box-sizing:border-box;border-radius:16px;text-align:left;
          background:var(--bg-card);border:2px solid var(--green,#4ade80);color:var(--text)}
        #revShortSummary .rev-titre{font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--green,#4ade80)}
        #revShortSummary .rev-score{font-size:22px;font-weight:900;color:var(--text)}
        #revShortSummary .rev-ligne{font-size:13px;line-height:1.45;color:var(--text);opacity:.85;overflow-wrap:anywhere}
        #revShortSummary .rev-note{font-size:11px;line-height:1.4;color:var(--text);opacity:.55;overflow-wrap:anywhere}
        @media (min-width:520px){#revShortSummary{padding:18px}}`;
      document.head.appendChild(st);
    }
    card.innerHTML = `
      <div class="rev-titre">⚡ Session révision</div>
      <div class="rev-score">${reussies}/${repondues} réussies — continue à ton rythme !</div>
      <div class="rev-ligne">${aRevoir ? `Encore ${aRevoir} notion${aRevoir > 1 ? 's' : ''} à revoir` : 'Aucune autre notion due aujourd’hui'}${plusProche ? ` · prochaine révision possible le ${plusProche}` : ''}</div>
      <div class="rev-note">Une réussite de quelques questions ne vaut pas maîtrise : les fiches reviendront selon le calendrier.</div>`;
    const ancre = document.getElementById('btnResContinue');   // identifiant réel (index.html l.6579)
    if (ancre?.parentElement) ancre.parentElement.insertBefore(card, ancre);
    else console.warn('[RevShort] ancre de bilan absente : bilan non affiché — à signaler, jamais silencieux');
  }
  function nettoyerCarte() { document.getElementById('revShortSummary')?.remove(); }

  // ---- nettoyage (sortie, changement de mode) ------------------------------
  function dispose() { sessionActive = false; nettoyerCarte(); }

  return { SESSION_SIZE, now, dayStr, dateValide, rendable, selectSession,
           start, abandonner, onSessionEnd, dispose, marquerRepondu, succesSansFiche,
           _sessionActive: () => sessionActive };
})();
window.RevShort = RevShort;
window.__revSession = {                                        // points d'entrée du moteur (patchs game.js)
  onAnswer: (id) => { if (RevShort._sessionActive()) RevShort.marquerRepondu(id); },
  nettoyer: () => RevShort.dispose(),
  onSuccessNoCard: (id) => RevShort.succesSansFiche(id),
  onSessionEnd: (mode, acc, total) => RevShort.onSessionEnd(mode, acc, total),
  abandonner: () => RevShort.abandonner(),
};
