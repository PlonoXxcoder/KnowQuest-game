/* Narration de chapitre : intro à l'entrée, encouragement par étape,
 * annonce de restauration (contrat compagnon) et conclusion animée.
 *
 * - Réutilise les données existantes d'Adventure (intro, mission, lines, end,
 *   couleur, icônes) : rien n'est réinventé.
 * - Aucun gain : ce module n'accorde jamais de récompense, il affiche.
 * - Les drapeaux vivent dans le profil avec des valeurs de secours : un ancien
 *   profil sans ces propriétés est traité comme « rien de vu ».
 * - Événement de coordination : `kq:chapitre-restaure` (CustomEvent sur window,
 *   detail = { chapitre, titre, icone, fragments, total }), émis une seule fois
 *   par chapitre restauré — contrat pour l'agent Compagnon.
 */
((root) => {
  'use strict';
  const CLE = 'chapterNarration';

  // ── État dans le profil : valeurs de secours pour les anciens profils ──
  function etat(profile) {
    if (!profile || typeof profile !== 'object') return { introsVues: {}, restaurationAnnoncee: {} };
    const s = profile[CLE];
    if (!s || typeof s !== 'object' || Array.isArray(s)) {
      profile[CLE] = { introsVues: {}, restaurationAnnoncee: {} };
      return profile[CLE];
    }
    if (!s.introsVues || typeof s.introsVues !== 'object' || Array.isArray(s.introsVues)) s.introsVues = {};
    if (!s.restaurationAnnoncee || typeof s.restaurationAnnoncee !== 'object' || Array.isArray(s.restaurationAnnoncee)) s.restaurationAnnoncee = {};
    return s;
  }

  function introDejaVue(profile, chapitre) {
    return !!etat(profile).introsVues['ch' + chapitre];
  }

  function marquerIntroVue(profile, chapitre) {
    etat(profile).introsVues['ch' + chapitre] = true;
  }

  // ── Intro courte à l'entrée d'un chapitre : une seule fois, passable ──
  function afficherIntro(profile, chapitre, story, adventure, apres) {
    if (!story || !story.intro || introDejaVue(profile, chapitre)) return false;
    marquerIntroVue(profile, chapitre);
    const action = typeof apres === 'function' ? apres : null;
    adventure.dialogue(`${story.icon || ''} ${story.title}`.trim(), story.intro, action, action ? 'Commencer l’étape' : 'Continuer');
    return true;
  }

  // ── Encouragement contextuel : la réplique de l'étape, avec secours ──
  function encouragement(story, etapeIdx) {
    if (!story) return '';
    if (Array.isArray(story.lines) && typeof story.lines[etapeIdx] === 'string') return story.lines[etapeIdx];
    return story.mission || '';
  }

  // Insère la réplique dans une fenêtre existante (modale d'étape) sans la
  // dupliquer si l'insertion est déjà présente.
  function insererEncouragement(conteneur, texte, accent) {
    if (!conteneur || !texte) return null;
    if (conteneur.querySelector('.kq-encouragement')) return null;
    const p = document.createElement('p');
    p.className = 'kq-encouragement';
    if (accent) p.style.setProperty('--kq-enc-accent', accent);
    p.setAttribute('role', 'note');
    p.textContent = `🦉 ${texte}`;
    conteneur.append(p);
    return p;
  }

  // ── Contrat compagnon : un seul événement par chapitre restauré ──
  function annoncerRestauration(profile, chapitre, story, progression) {
    const s = etat(profile);
    if (s.restaurationAnnoncee['ch' + chapitre]) return false;
    s.restaurationAnnoncee['ch' + chapitre] = true;
    try {
      root.dispatchEvent(new CustomEvent('kq:chapitre-restaure', {
        detail: {
          chapitre,
          titre: story?.title || '',
          icone: story?.icon || '',
          fragments: progression?.fragments ?? null,
          total: progression?.total ?? null,
        },
      }));
    } catch (_) { /* environnement sans CustomEvent : l'annonce est perdue, pas bloquante */ }
    return true;
  }

  function restaurationAnnoncee(profile, chapitre) {
    return !!etat(profile).restaurationAnnoncee['ch' + chapitre];
  }

  // ── Conclusion animée : bloc ajouté à l'écran de victoire existant ──
  // Aucun gain : affiche la page restaurée et la progression déjà acquise.
  function decorerRestauration(host, chapitre, story, progression) {
    if (!host || host.querySelector('.kq-restauration')) return null;
    const bloc = document.createElement('div');
    bloc.className = 'kq-restauration';
    if (story?.color) bloc.style.setProperty('--kq-rest-accent', story.color);
    const page = document.createElement('div');
    page.className = 'kq-restauration-page';
    page.setAttribute('aria-hidden', 'true');
    page.textContent = story?.icon || '📖';
    const infos = document.createElement('div');
    infos.className = 'kq-restauration-infos';
    const titre = document.createElement('strong');
    titre.textContent = `${story?.title || 'Chapitre'} — page restaurée`;
    const progressionEl = document.createElement('span');
    progressionEl.className = 'kq-restauration-progression';
    progressionEl.textContent = progression
      ? `Fragments ${progression.fragments}/${progression.total} · Pages restaurées ${progression.restaurées}${progression.totalPages ? '/' + progression.totalPages : ''}`
      : '';
    infos.append(titre, progressionEl);
    bloc.append(page, infos);
    host.append(bloc);
    return bloc;
  }

  const api = { etat, introDejaVue, marquerIntroVue, afficherIntro, encouragement, insererEncouragement, annoncerRestauration, restaurationAnnoncee, decorerRestauration };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ChapterNarration = api;
})(typeof window !== 'undefined' ? window : globalThis);
