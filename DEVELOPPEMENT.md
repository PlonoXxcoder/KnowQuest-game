# Organisation du projet

- `../KnowQuest/` : référence de GitHub, laissée propre. Ne pas y développer.
- Ici, `web/`, `data/`, `docs/` : jeu de développement, avec les modifications en cours.
- `agents/testeur/` : bot et tests du jeu de développement. Les navigateurs déjà installés dans l’ancien emplacement sont réutilisés.
- `pipeline-questions/` : pipeline et pool final actifs pour les prochains travaux.
- Les anciens outils `agents/`, `core/`, `tools/` sont conservés.
- Les fichiers `.bat` de la racine ciblent désormais le développement.
- `../LANCER_DEV.bat` ouvre le jeu de développement via un serveur local.
- `separation.json` indique la sauvegarde vérifiée avant le retour de KnowQuest à GitHub.

## Aventure

`web/js/adventure.js` contient les huit destinations, les cinq étapes de chaque chapitre, leurs textes et les conclusions. `web/adventure.css` définit la carte compacte. L’accueil affiche directement le chemin et ses étapes ; un clic sur une étape disponible lance les questions. Les quêtes, missions, événements et boss mensuel sont dans Jeux. Le panneau de récit reste dans Jeux, sous Mon aventure et ses récits. Les coffres et gardiens gardent leur séquence dédiée. Les identifiants d’étapes et les récompenses existantes sont conservés. Les pages restaurées sont déduites des gardiens déjà vaincus. Rejouer un gardien ne redonne pas son bonus de victoire.

Les cœurs et les surprises restent gérés par `web/js/story-rules.js`. Les animations restent dans `web/js/motion.js`. Les changements ne sont pas envoyés automatiquement sur GitHub.

Les huit gardiens sont configurés dans `web/js/bosses.js`, leurs effets dans `web/bosses.css`. Voir `docs/gardiens.md` pour les paramètres, récompenses et vérifications. Les vies de combat sont indépendantes des cœurs de l’histoire.

## Version en ligne

Après publication, le navigateur demande les fichiers courants au serveur, sans utiliser d’ancienne réponse du cache HTTP. Le service worker vérifie ses mises à jour au lancement. Son remplacement peut déclencher une seule actualisation automatique au démarrage ; une partie en cours n’est pas interrompue. Hors ligne, le jeu conserve un secours dans son cache. Les profils du joueur dans localStorage sont conservés.

Le navigateur récupère la version **déployée du site** : un commit GitHub doit avoir été publié par l’hébergement pour devenir accessible aux joueurs. Il ne copie pas directement des fichiers privés ou des changements locaux depuis GitHub.
