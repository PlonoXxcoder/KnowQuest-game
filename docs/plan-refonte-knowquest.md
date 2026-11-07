# Plan de refonte de KnowQuest

Statut : proposition de travail, pas une liste de fonctionnalités déjà réalisées.

## Direction

Faire de KnowQuest une aventure de culture générale agréable à retrouver : on ouvre le jeu, on comprend immédiatement où aller, on apprend quelque chose, puis on gagne une récompense qui a du sens. L’accueil reste centré sur le chemin ; les activités facultatives restent dans Jeux, la collection dans Profil et les achats dans Boutique.

La taille du chantier vient de la cohérence et de la fiabilité à construire entre les systèmes existants, pas du nombre de menus ajoutés.

## Point de départ vérifié

- Huit chapitres, quarante étapes, des icônes variées et un lancement direct depuis le chemin.
- Huit gardiens, un combat final à deux phases et un boss mensuel distinct.
- Trois mauvaises réponses pour perdre un cœur dans l’histoire ; trois vies indépendantes pendant les combats.
- Récompenses surprises sur certaines questions difficiles, pages de l’Atlas, fiches de connaissances, gemmes et XP.
- Huit souvenirs d’avatar à gagner, aperçu, équipement et accessoires achetés conservés.
- Plusieurs formats de quiz, révision espacée, difficultés, maîtrise des catégories, talents, missions et séries.
- Modes géographiques et championnat automobile déjà présents.
- Préférences de mouvement, animations, mode hors ligne, vérification des mises à jour et bot de test local.
- Le moteur principal mélange encore une grande partie des modes, de l’interface, de la progression, des sauvegardes et des appels réseau.

Les fonctions de réseau, de classement et de synchronisation devront être vérifiées avec les services réellement disponibles ; leur présence dans le code ne suffit pas à garantir leur fonctionnement en ligne.

## Cadre de réalisation

1. Tous les travaux restent dans `KnowQuest-dev`. `KnowQuest` reste la référence publiée ; aucune publication automatique.
2. Conserver les profils, achats, victoires, identifiants de questions et identifiants d’étapes existants.
3. Avant une migration importante, produire une sauvegarde et vérifier son import dans la nouvelle version.
4. Livrer par lots utilisables, avec captures ordinateur/mobile et bilan de vérification.
5. Un ajout doit avoir une place précise dans la navigation existante.
6. Réutiliser les systèmes déjà présents avant d’en créer un autre : missions, révision, Atlas, talents, accessoires.
7. Mesurer les performances avant de définir ce qui doit être optimisé. Les objectifs ci-dessous sont des cibles, pas des résultats déjà obtenus.

## Phase A — Assurer les fondations

### Lot 1 — Audit complet et état de référence · Important

**Travail**

- Recenser les écrans, modes, règles de vie, gains, sources de questions et dépendances réseau.
- Distinguer les fonctions opérationnelles, les fonctions partiellement reliées et celles à réparer.
- Faire parcourir les principaux scénarios au bot, sur ordinateur et téléphone.
- Vérifier les données réellement chargées par rapport aux fichiers publiés.
- Repérer les clics sans effet, fenêtres superposées, textes illisibles et écrans trop longs.
- Photographier l’état initial et constituer un registre d’anomalies avec étapes de reproduction.

**Livrable** : inventaire du jeu, liste priorisée des défauts et parcours de référence.

**Acceptation** : chaque anomalie importante possède une reproduction ; les corrections urgentes sont distinguées des idées de design.

### Lot 2 — Sauvegardes et intégrité de la progression · Important

**Travail**

- Centraliser lecture, validation, migration et écriture du profil.
- Vérifier anciennes sauvegardes, import incomplet, données invalides et stockage indisponible.
- Conserver une copie précédente avant une migration de schéma.
- Vérifier qu’une victoire, un achat ou une récompense ne peut être attribué deux fois par double clic ou rechargement.
- Définir le comportement si deux onglets modifient le même profil.
- Empêcher une erreur réseau de bloquer une sauvegarde locale.
- Améliorer les messages d’export/import et afficher la dernière sauvegarde réussie.

**Livrable** : système de sauvegarde documenté avec jeux de profils anciens.

**Acceptation** : les profils de référence retrouvent leurs objets, gemmes, étapes et victoires ; une migration interrompue ne détruit pas la copie précédente.

### Lot 3 — Organiser le code progressivement · Très important

**Travail**

- Extraire du moteur les domaines : profil, questions, sessions, progression, économie, modes, interface et réseau.
- Garder et prolonger les modules déjà créés : aventure, boss, avatars, animations et règles d’histoire.
- Remplacer progressivement les fonctions réécrites plusieurs fois par des points d’entrée explicites.
- Séparer les calculs de récompenses de leur présentation.
- Centraliser constantes, identifiants et configuration ; éviter les règles dupliquées dans le HTML.
- Nommer les fonctions selon leur rôle et commenter les règles ou raisons qui ne sont pas évidentes.
- Documenter comment ajouter une question, une étape, un objet ou un mode.

**Livrable** : arborescence claire et moteur découpé par étapes, sans réécriture totale d’un seul coup.

**Acceptation** : chaque extraction garde les scénarios existants fonctionnels ; les règles de gain et de sauvegarde n’existent qu’à un endroit.

## Phase B — Donner une identité visuelle cohérente

### Lot 4 — Une vraie charte du jeu · Important

**Travail**

- Définir palette, typographie, espacements, arrondis, reliefs, ombres et tailles de boutons.
- Créer des composants communs pour cartes, boutons, dialogues, barres de progression et notifications.
- Donner à chaque chapitre une ambiance compatible avec cette charte.
- Remplacer progressivement les pictogrammes les moins lisibles par une famille d’icônes cohérente.
- Harmoniser modes clair et sombre, états désactivés et textes secondaires.
- Garder une hiérarchie simple : une action principale, des détails consultables à la demande.

**Livrable** : page de référence visuelle et composants réutilisables.

**Acceptation** : profil, aventure, boss, boutique et résultats semblent appartenir au même jeu ; les textes restent lisibles sur téléphone.

### Lot 5 — Un parcours plus vivant et facile à lire · Important

**Travail**

- Améliorer le tracé du chemin et les transitions entre destinations.
- Distinguer clairement étape actuelle, terminée, coffre, gardien et étape verrouillée.
- Proposer un retour discret à l’étape actuelle lorsqu’on explore les chapitres éloignés.
- Réduire les répétitions de titres et les grands espaces qui n’aident pas la lecture.
- Ajouter quelques éléments de décor légers qui évoluent avec la progression.
- Faire apparaître l’étape utile rapidement au retour dans le jeu, sans défilement surprenant pendant une action.

**Livrable** : accueil terminé sur petit téléphone, grand téléphone et ordinateur.

**Acceptation** : un joueur identifie son prochain objectif sans ouvrir plusieurs fenêtres ; les objectifs secondaires ne recouvrent pas le chemin.

### Lot 6 — Refaire l’expérience d’une question · Important

**Travail**

- Harmoniser QCM, Vrai/Faux et Méli-Mélo : consigne, réponses, validation et correction.
- Adapter la mise en page aux questions et réponses longues.
- Limiter les déplacements des boutons entre les états.
- Mettre en avant une explication courte après réponse ; garder les détails et sources accessibles.
- Améliorer la lisibilité du chronomètre et des états « sélectionné », « correct » et « incorrect ».
- Signaler un problème sans quitter la question ni perdre la réponse.
- Empêcher les validations répétées et les anciennes animations d’agir sur la question suivante.

**Livrable** : un écran de question commun, adaptable à chaque format.

**Acceptation** : aucune réponse ni action essentielle n’est masquée ; les grandes tailles de texte et le clavier restent utilisables.

## Phase C — Faire une aventure qu’on a envie de terminer

### Lot 7 — Approfondir les huit chapitres · Très important

**Travail**

- Écrire pour chacun une introduction, une progression, un enjeu, un gardien et une conclusion cohérents.
- Choisir des questions qui correspondent réellement aux lieux et aux thèmes annoncés.
- Construire des groupes de questions par étape, avec suffisamment de variété pour rejouer.
- Présenter les récits au bon moment, en gardant le lancement rapide et la lecture facultative.
- Donner un rôle plus précis à Chouette : guider, expliquer et célébrer avec mesure.
- Transformer visuellement le lieu après la restauration de sa page.
- Prévoir un état clair lorsque les huit chapitres sont terminés.

**Livrable** : huit chapitres complets, et pas seulement huit noms différents.

**Acceptation** : les textes, questions, récompenses et décors racontent la même progression ; passer un récit n’empêche jamais de jouer.

### Lot 8 — Affiner les combats et leur mise en scène · Important

**Travail**

- Conserver les huit gardiens et leurs règles déjà intégrées.
- Donner à chacun une silhouette reconnaissable et des réactions plus expressives.
- Représenter les pouvoirs : racines protectrices, échos qui soignent, changement de phase de l’Oubli.
- Présenter le pouvoir avant le combat et le rendre visible lorsqu’il agit.
- Ajuster les points, questions, chronomètres et difficultés à partir des essais.
- Proposer après défaite une revanche claire et une révision des erreurs.
- Affiner le boss mensuel sans lui faire encombrer l’accueil.

**Livrable** : combats courts, lisibles et distincts, avec une vraie conclusion.

**Acceptation** : les scénarios annoncés restent gagnables avec la marge d’erreur prévue ; une animation ou une récompense ne bloque pas la suite.

### Lot 9 — Progression et difficulté mieux expliquées · Important

**Travail**

- Rendre visibles les règles des cœurs, des vies de combat, des étoiles et des pages.
- Vérifier le rythme de difficulté sur l’ensemble des quarante étapes.
- Utiliser les résultats du joueur pour conseiller une révision ou un réglage, sans changer brutalement une règle cachée.
- Garder le choix de difficulté accessible sans remettre une fenêtre obligatoire avant chaque partie.
- Maintenir les cadeaux surprises cachés avant réponse, tout en expliquant leur gain après attribution.
- Clarifier l’intérêt de rejouer une étape sans permettre de récupérer indéfiniment une récompense unique.

**Livrable** : courbe de progression et règles présentées en termes simples.

**Acceptation** : un joueur comprend pourquoi il avance, échoue ou gagne quelque chose ; les règles existantes ne changent pas silencieusement.

## Phase D — Rendre les connaissances et récompenses plus intéressantes

### Lot 10 — Fiabiliser toute la chaîne des questions · Très important

**Travail**

- Définir précisément la source éditable, les données validées et les fichiers générés pour le jeu.
- Vérifier identifiants uniques, réponses valides, explications, catégories et références.
- Détecter doublons, formulations très proches, indices dans les réponses et questions ambiguës.
- Repérer les faits susceptibles de changer et prévoir leur révision.
- Mettre les questions douteuses en attente plutôt que les republier automatiquement.
- Relier chaque correction à sa source et à un petit historique.
- Adapter les contrôles aux affirmations Vrai/Faux, expressions Méli-Mélo et événements chronologiques.
- Vérifier que les fichiers découpés et le fichier final donnent le même contenu au jeu.

**Livrable** : rapport de qualité par catégorie et procédure de validation avant publication.

**Acceptation** : les erreurs de structure bloquent l’export ; les réserves factuelles sont visibles pour la revue. Une validation automatique n’est pas présentée comme une garantie de vérité.

### Lot 11 — Révisions et Atlas vraiment utiles · Important

**Travail**

- Améliorer le système de révision espacée déjà présent plutôt qu’en créer un second.
- Expliquer simplement pourquoi une question revient et la prochaine échéance.
- Préparer une courte révision depuis les erreurs récentes, avec une charge raisonnable.
- Éviter les répétitions immédiates involontaires d’une même question.
- Rendre l’Atlas plus facile à explorer : recherche, catégories, fiches liées et éléments découverts récemment.
- Conserver des explications pédagogiques et des sources consultables dans les fiches.
- Donner une lecture compréhensible de la maîtrise d’une catégorie.

**Livrable** : boucle « jouer → comprendre → revoir → retenir » visible dans le jeu.

**Acceptation** : une mauvaise réponse produit une occasion utile de réviser ; les échéances restent cohérentes après sauvegarde et rechargement.

### Lot 12 — Collection et récompenses d’avatar · Important

**Travail**

- Partir des huit souvenirs de chapitre et de la collection récemment intégrée.
- Améliorer les compositions visuelles pour chaque avatar : cadre, insigne et accessoire bien positionnés.
- Permettre de changer de personnage après l’inscription.
- Étudier des emplacements distincts pour cadre, chapeau et insigne, avec compatibilité des anciennes tenues.
- Ajouter des récompenses de maîtrise ou d’exploit avec des conditions précises et un nombre limité d’objets.
- Montrer une prochaine récompense atteignable et la progression correspondante.
- Préserver l’aperçu sans achat, l’équipement gratuit et les objets déjà acquis.

**Livrable** : un vestiaire agréable à utiliser, avec des récompenses qui représentent le parcours du joueur.

**Acceptation** : on distingue objet porté, possédé et verrouillé ; aucun objet possédé n’est refacturé ; une migration ne retire pas l’apparence actuelle.

### Lot 13 — Équilibrer gemmes, XP, talents et boutique · Très important

**Travail**

- Recenser tous les gains et dépenses, y compris missions, séries, niveaux et modes secondaires.
- Simuler des profils débutants, réguliers et avancés pour repérer gains excessifs et périodes sans récompense intéressante.
- Vérifier l’utilité de chaque prix et éviter les objets redondants.
- Présenter les talents existants avec leurs effets exacts et leurs limites.
- Distinguer la récompense du combat des bonus supplémentaires de mission ou de niveau.
- Garder les avantages cosmétiques séparés des règles de combat.
- Maintenir les mécanismes de chance à leur place actuelle, sans multiplier les tirages ou fenêtres de récompense.

**Livrable** : tableau d’économie cohérent et écrans de gains compréhensibles.

**Acceptation** : les montants affichés correspondent aux gains accordés ; les récompenses uniques sont protégées ; les changements de prix n’effacent pas les possessions.

## Phase E — Faire fonctionner tout le jeu comme un ensemble

### Lot 14 — Organiser et approfondir les modes existants · Très important

**Travail**

- Clarifier Jeux avec quelques familles : quiz rapides, révision, géographie, défis et championnat.
- Donner à chaque mode une règle courte, un objectif et une fin compréhensible.
- Harmoniser pause, abandon, reprise, résultats et retour au menu.
- Auditer les modes géographiques : chargement du globe, réponses, erreurs de localisation et comportement sans réseau.
- Auditer le championnat : début de saison, qualification, course, classement, carrière et sauvegarde.
- Comparer leur complexité et leur intérêt ; regrouper les modes trop proches si cela améliore la navigation.
- Prévoir une aide consultable au lieu d’explications répétées avant chaque partie.

**Livrable** : modes entretenus et accessibles, au lieu d’une liste de boutons inégaux.

**Acceptation** : chaque mode a un parcours début-fin testé, un retour fiable et une gestion explicite des dépendances indisponibles.

### Lot 15 — Missions, profil et progression à long terme · Important

**Travail**

- Réutiliser les missions quotidiennes, hebdomadaires et objectifs déjà présents.
- Éviter plusieurs missions qui demandent presque la même chose au même moment.
- Relier les suggestions aux points faibles du joueur, sans imposer un mode qu’il ne souhaite pas jouer.
- Clarifier les dates de remise à zéro et les récompenses reçues.
- Améliorer la vitrine du profil : tenue, pages restaurées, succès récents et progression utile.
- Regrouper les statistiques détaillées à la demande.
- Garder les rappels et la mascotte discrets et réglables.

**Livrable** : profil valorisant et missions utiles, sans surcharge de l’accueil.

**Acceptation** : les missions impossibles ou déjà réalisées ne sont pas proposées ; les compteurs et échéances survivent au rechargement.

### Lot 16 — Réseau, classement et synchronisation · À auditer puis décider

**Travail**

- Vérifier les services déjà reliés au jeu, leurs réponses et leurs erreurs possibles.
- Garder le mode invité utilisable localement.
- Si la synchronisation existante est conservée, définir les conflits entre sauvegarde locale et distante avant de modifier les écrans.
- Vérifier authentification, gestion des erreurs et protection des informations sensibles.
- Vérifier que le classement ne repose pas uniquement sur des scores déclarés par le navigateur.
- Rendre les files d’envoi hors ligne observables et empêcher les envois en double.
- Afficher un état honnête : local, synchronisation en cours, réussi ou impossible.

**Livrable** : contrat clair entre le jeu et ses services, puis fonctionnalités en ligne fiables selon l’infrastructure réellement disponible.

**Acceptation** : une coupure réseau ne supprime pas le profil ; les conflits sont résolus selon une règle documentée ; aucune promesse de synchronisation n’est affichée sans service opérationnel.

## Phase F — Finir, vérifier et publier proprement

### Lot 17 — Performance, mobile, accessibilité et hors ligne · Très important

**Travail**

- Mesurer chargement, poids des fichiers, temps avant première partie et fluidité du parcours.
- Charger les gros modes et bibliothèques à leur ouverture.
- Limiter les reconstructions complètes des boutiques, collections et statistiques à chaque petite mise à jour.
- Définir un cache de version cohérent et vérifier la transition depuis une ancienne version du jeu.
- Préciser quels modes restent disponibles hors ligne et les rendre reconnaissables.
- Vérifier clavier, focus, lecteurs d’écran, contrastes, zoom, sons et mouvement réduit.
- Tester petits écrans, clavier virtuel, changements d’orientation et retour d’arrière-plan.

**Livrable** : jeu réactif sur les appareils ciblés, avec objectifs de performance mesurés avant/après.

**Acceptation** : les actions essentielles restent accessibles ; une mise à jour n’interrompt pas un combat et ne mélange pas silencieusement des données incompatibles.

### Lot 18 — Transformer le bot en contrôle de qualité régulier · Très important

**Travail**

- Étendre le testeur existant avec des parties complètes et des profils anciens.
- Tester surtout les règles et scénarios sensibles : sauvegarde, achat, gain unique, défaite, reprise et déconnexion.
- Tester questions courtes/longues, banques absentes et données invalides.
- Ajouter des captures comparables sur quelques écrans représentatifs, avec revue des différences visuelles utiles.
- Produire un rapport lisible : gravité, reproduction, capture et résultat attendu.
- Séparer erreurs techniques, problèmes visuels et questions factuelles à revoir.
- Garder une vérification humaine finale pour le ressenti et les réserves que le bot ne peut pas trancher.

**Livrable** : une commande de vérification avant publication, avec un rapport exploitable.

**Acceptation** : les scénarios critiques sont reproductibles ; un échec réel bloque la préparation de la version ; les résultats ne masquent pas les limites du testeur.

### Lot 19 — Préparer une version publiable · Important

**Travail**

- Faire une passe finale sur textes, cohérence graphique, sons, navigation et messages d’erreur.
- Vérifier installation, lancement en ligne, ancien cache, hors ligne et retour au réseau.
- Préparer un journal des nouveautés et une copie de la version précédente.
- Établir la liste précise des fichiers à transférer de dev vers la référence publiée.
- Vérifier les changements distants avant toute synchronisation vers GitHub.
- Après demande explicite de publication, envoyer la version et vérifier le site réellement déployé.

**Livrable** : version candidate testée, puis publication contrôlée si demandée.

**Acceptation** : le joueur reçoit la bonne version, conserve sa progression et retrouve tous les parcours essentiels ; un retour à la version précédente est préparé.

## Ordre de réalisation recommandé

| Étape | Lots principaux | Objectif |
| --- | --- | --- |
| 1 | 1 et 2 | Connaître les défauts et protéger les données |
| 2 | 3, commencé sur les parcours sensibles | Rendre les évolutions maîtrisables |
| 3 | 4, 5 et 6 | Fixer le style et rendre la partie agréable |
| 4 | 10, puis 7 et 9 | Faire correspondre questions et aventure |
| 5 | 8, 11 et 12 | Approfondir boss, apprentissage et collection |
| 6 | 13 et 15 | Donner un rythme cohérent aux gains et objectifs |
| 7 | 14 et 16 | Consolider les modes et les services réels |
| 8 | 17, 18 et 19 | Finir la qualité et préparer la publication |

Les contrôles des lots 17 et 18 commencent dès le premier lot et s’enrichissent au fil des changements. Le découpage du code accompagne les travaux ; il ne doit pas devenir une longue réécriture qui empêche de livrer des améliorations visibles.

## Premier ensemble concret à réaliser

1. Sauvegarder des profils représentatifs et dresser le registre d’anomalies.
2. Corriger les pertes de progression, attributions doubles et blocages prioritaires trouvés pendant cet audit.
3. Extraire les règles communes de session et de récompense les plus sensibles.
4. Finaliser une charte et un écran de question de référence sur ordinateur/mobile.
5. Terminer entièrement le chapitre du Phare avec cette qualité visuelle et éditoriale.
6. Utiliser ce chapitre comme référence avant de décliner les sept suivants.

## Ce qu’il vaut mieux reporter

- Ajouter encore des modes avant d’avoir consolidé ceux qui existent.
- Multiplier les monnaies, notifications, récompenses aléatoires ou menus.
- Créer un multijoueur temps réel avant d’avoir clarifié sauvegardes et services.
- Générer massivement de nouvelles questions avant de stabiliser la validation.
- Réécrire tout le jeu d’un coup ou remplacer des sauvegardes pour simplifier la migration.

## Définition d’un lot terminé

Le lot fonctionne dans dev ; ses données et profils existants sont préservés ; les scénarios concernés passent ; les écrans modifiés ont été vérifiés visuellement ; ses limites restantes sont documentées ; l’utilisateur peut l’essayer avec le lanceur local. Un lot terminé n’est pas automatiquement publié.
