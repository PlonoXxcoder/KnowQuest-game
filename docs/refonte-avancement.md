# Refonte — avancement vérifié

Ce document accompagne `plan-refonte-knowquest.md`. Le plan complet n’est pas annoncé comme terminé.

**Lieu actif : `KnowQuest-dev/refonte-isolee/`.** Un autre travail a remplacé des fichiers du développement pendant les contrôles. Ses changements ont été conservés dans `archive/travail-parallele-2026-11-06T00-44-42`, puis les intégrations de refonte ont été réappliquées dans cette copie isolée. Le lanceur dédié est `LANCER_REFONTE.bat` à la racine du projet. Aucune fusion automatique ne doit écraser les autres travaux.

## Sauvegarde initiale

`archive/refonte-2026-11-06T00-25-59` conserve 116 fichiers du jeu, des données et de la documentation avec leurs empreintes SHA-256 dans `manifest.json`. Les profils réels du navigateur n’ont pas été manipulés : les essais utilisent des profils temporaires.

## Changements réalisés

- Audit de départ : 18 875 QCM, 2 388 Vrai/Faux et 2 105 Méli-Mélo ; 1 074 anomalies structurelles et 2 335 signaux éditoriaux.
- Préparation des données : 911 entrées mises en quarantaine, originaux conservés ; 163 normalisations de catégorie/XP, sans changement automatique de réponse factuelle. Les XP absents/invalides prennent la valeur de secours de 10 déjà utilisée par le jeu.
- Données jouables après préparation : 18 847 QCM, 2 229 Vrai/Faux, 1 381 Méli-Mélo. Zéro anomalie structurelle ; 1 611 réserves éditoriales restent à examiner.
- Fichier principal et fichiers QCM par catégorie régénérés ensemble.
- Protection des sauvegardes extraite dans `web/js/profile-store.js` : normalisation, copie avant migration/import, conservation des données illisibles, restauration et refus d’écraser une écriture d’un autre onglet.
- Écran d’erreur de sauvegarde avec export, restauration et rechargement ; indication de sauvegarde locale dans les paramètres.
- Règles communes dans `web/js/game-rules.js` : dates locales et mélange des quinze catégories QCM, incluant musique, jeux vidéo, séries, littérature et banque mixte.
- Validation d’une réponse et attribution d’un résultat rendues idempotentes, y compris le calcul Elo.
- Réglage de difficulté désormais appliqué aux questions d’aventure et de catégorie. Le quiz infini conserve son mélange propre.
- Révision priorisant les questions arrivées à échéance ; recherche dans les catégories récentes et formats supplémentaires ; échéance visible après correction d’une question suivie.
- Jeux regroupés en quiz rapides, défis/missions, exploration, championnat et catégories.
- Choix de personnage disponible dans le profil après l’inscription.
- Charte commune de surfaces, espacements et focus ; question et réponses adaptées aux textes longs ; navigation clavier sur les choix et modes.
- Retour à l’étape actuelle disponible après défilement du chemin.
- Première région en QCM pour apprendre les règles ; variantes géographiques limitées aux étapes de géographie ; formats alternatifs orientés vers la catégorie du lieu lorsque les données disponibles le permettent.
- Repères thématiques par étape pour privilégier les questions liées au lieu. Cette sélection par mots-clés reste une aide de classement, pas une curation factuelle complète.
- Chargement incomplet des fichiers découpés : retour au fichier principal plutôt qu’une base partielle silencieuse.
- JSON vérifié avant sa mise en cache ; secours de navigation réseau/cache renforcé sur les réponses HTTP en erreur.
- Collection d’avatar reconstruite seulement lorsque le profil est ouvert, au lieu de chaque mise à jour en partie.
- Bot corrigé pour distinguer Continuer de Signaler cette question.
- Outils `tools/version_assets.js`, `tools/prepare_questions.js` et `tools/check_release.js` : empreintes, préparation et bilan de version sans publication.

Les données écartées et les corrections sont conservées dans `reports/questions/2026-11-05T23-28-52-359Z/preparation.json`, avec les trois fichiers originaux. Le pipeline de génération reste une source de propositions ; sa sortie doit repasser par la préparation et l’audit avant toute publication.

## Apports parallèles repris dans la candidate

La copie isolée intègre aussi les nouveaux apports de données présents au moment de sa création. Sa préparation conserve **18 935 QCM, 2 263 Vrai/Faux et 1 381 Méli-Mélo**. Elle a remis en quarantaine 724 Méli-Mélo aux identifiants réutilisés et consigné 163 normalisations ; les originaux sont dans son propre dossier `reports/questions/2026-11-05T23-47-22-955Z/`. Ces apports expliquent la différence avec les nombres de la première passe ci-dessus. Aucun ajout provenant de l’autre travail n’a été effacé pour retrouver les anciens nombres.

Le serveur isolé utilise un autre port. Les profils de joueur ne sont donc pas partagés automatiquement entre les deux versions ; un export/import explicite permet de les transférer.

## État des lots

| Lot | État | Ce qui reste |
| --- | --- | --- |
| 1 — Audit | Première passe réalisée | Étendre les scénarios aux modes globe/championnat et établir leur registre détaillé |
| 2 — Sauvegardes | Protections principales réalisées et testées | Tester les imports très anciens et les conflits avec les services distants réels |
| 3 — Architecture | Extraction commencée | Extraire sessions, économie et modes ; réduire les réécritures de fonctions restantes |
| 4 — Charte | Socle réalisé | Décliner tous les écrans, harmoniser les illustrations et vérifier les contrastes complets |
| 5 — Parcours | Améliorations réalisées | Décors évolutifs et transitions détaillées des huit destinations |
| 6 — Questions | Lisibilité, clavier et validations améliorés | Revue exhaustive des corrections et mise en page des cas extrêmes |
| 7 — Chapitres | Sélection thématique et introduction progressive | Curation des groupes de questions et approfondissement éditorial des huit régions |
| 8 — Boss | Système existant conservé et contrôlé | Silhouettes originales, décors et effets spécifiques plus poussés |
| 9 — Difficulté | Réglage réparé et règles consultables | Mesurer puis ajuster la courbe des quarante étapes |
| 10 — Questions fiables | Structure et export contrôlés | Examiner les 1 611 réserves et vérifier les réponses factuelles avec des preuves |
| 11 — Révision/Atlas | Recherche SRS et échéances corrigées | Fiches liées, organisation enrichie de l’Atlas et révisions personnalisées |
| 12 — Avatars | Collection existante et changement de personnage | Étudier les emplacements indépendants et récompenses de maîtrise supplémentaires |
| 13 — Économie | Gains doubles corrigés | Inventaire complet des gains, simulations et rééquilibrage |
| 14 — Modes | Navigation regroupée | Audit complet des modes géographiques et automobile, reprise et règles communes |
| 15 — Missions/profil | Navigation et profil allégés | Déduplication des objectifs et analyse de leur rythme |
| 16 — Services en ligne | Non validés | Auditer les services réellement déployés ; aucun test local ne prouve leur fonctionnement |
| 17 — Performance/accessibilité/hors ligne | Premières améliorations | Mesures comparatives, transitions de versions et revue complète d’accessibilité |
| 18 — Testeur | Scénarios et commande de bilan étendus | Couvrir modes avancés, comparer les captures et multiplier les profils anciens |
| 19 — Publication | Préparation technique disponible | Finir les réserves, préparer une candidate et publier uniquement sur demande explicite |

## Vérifications et limites

- Les tests unitaires couvrent sauvegardes anciennes, données corrompues, quota, conflit entre instances, calendrier, mélange de banques, vies, boss, avatars et structure des questions.
- Les tests navigateur couvrent QCM, TF, Méli-Mélo, aventure, gardiens, avatars, sauvegarde, règles de progression, préférences visuelles et cache hors ligne.
- Les nouveaux parcours de fondation vérifient un ancien profil réel dans un navigateur temporaire, le réglage de difficulté, l’absence de récompense répétée, la révision musique, le changement d’avatar et deux onglets concurrents.
- Les services de production sont interceptés dans ces tests. Ni la synchronisation distante, ni les classements réels, ni toute la base factuelle ne sont certifiés.
- Aucune publication vers `KnowQuest`, GitHub ou l’hébergement n’a été faite pour cette refonte.

## Commandes

Depuis `KnowQuest-dev` :

```powershell
node tools/version_assets.js
node tools/check_release.js --browser
node agents/testeur/testeur.js --facts 0 --questions 6
```

`node tools/prepare_questions.js` produit un diagnostic sans modifier les données. Ajouter `--apply` pour écrire les données préparées et conserver les originaux dans un nouveau rapport. Cette commande ne corrige pas les faits et ne résout pas les réserves éditoriales.


## Ajustement : section Jeux précédente conservée

Les nouveaux volets Défis, Monde, Championnat et Catégories ont été retirés. Les cartes et titres d'origine restent directement visibles. Les corrections internes sont conservées.

La suite du lot économie corrige le débit d'une recharge lorsque les cœurs sont pleins et la diminution involontaire d'un stock supérieur à cinq cœurs. Les prix de vies et de power-ups proviennent du catalogue, sans faire confiance aux prix passés par les boutons. Le Pack Questions, qui ne débloquait rien, est retiré de la vente ; son appel direct ne débite plus de gemmes. Aucun achat ancien n'est retiré.

Restent notamment : la curation factuelle des réserves, les décors et illustrations spécifiques, la simulation de toute l'économie, les modes géographiques/automobile et les services distants, puis une fusion contrôlée avec l'autre travail. Ces travaux ne sont pas annoncés comme terminés.


## Modes avancés — corrections suivantes

Les gains de rallye, carte et Grand Prix ne sont plus accordés plusieurs fois si le résultat est rappelé. Les gemmes des mini-tours de route sont sauvegardées après attribution. La carte accorde son XP via le mécanisme commun des niveaux ; son pourcentage est présenté comme une part du score maximal, sans prétendre mesurer une précision indépendante du chrono.

L’attente du globe est annulée en quittant le mode, limitée dans le temps et une requête de bibliothèque expirée peut être réessayée. Le rallye reste jouable en QCM si le globe est indisponible. Les paramètres invalides de difficulté et de recherche automobile sont refusés.

Les tests de fondation couvrent ces transitions, attributions et un chargement de bibliothèque réellement interrompu. Ils ne simulent pas une saison automobile complète ni un rendu WebGL réel : ces parties de l’audit restent à poursuivre.


## Championnat — saison et reprise

Un scénario spécifique couvre tous les résultats d'une saison, une sauvegarde/reprise après deux courses, l'attribution unique des points et primes, le titre et le palmarès, puis le passage à la saison suivante avec une offre d'écurie. Les arrivées sont simulées et transmises au vrai moteur de résultat : il ne s'agit pas d'un test complet des qualifications, de la conduite ou de la physique de course.

Corrections : les courses hors ordre ou déjà passées sont refusées avant attribution ; changer d'équipe ou réinitialiser une saison en cours ne remet plus les scores à zéro ; les paramètres d'écurie sont validés. Lors de l'adaptation d'un ancien classement, les points des pilotes identifiés sont conservés. Les pilotes absents ne reçoivent plus de points aléatoires. Seules les premières places augmentent désormais le compteur de victoires ; les gains et trophées historiques sont conservés. Le titre de fin de saison affiche le numéro de la saison terminée. Un bouton différé de retour n'est plus ajouté dans l'écran d'une nouvelle course.


## Qualifications et course — parcours joué dans le navigateur

Un nouveau scénario couvre la sélection d'écurie, du circuit et des pneus, quinze réponses de qualifications, la grille, les réponses de course, un temps écoulé, l'arrêt aux stands, le résultat et la sortie, sur 1280 et 390 pixels. La séquence lumineuse est passée par le contrôleur de lancement pour limiter les délais du test ; le comportement physique n'est pas évalué comme un simulateur automobile.

Corrections : une réponse de course n'est traitée qu'une fois, ses XP sont comptés, les erreurs et délais expirés rejoignent les statistiques et la révision. L'XP des qualifications est attribué une seule fois avant la course. Les chronomètres s'arrêtent à la fin et à la sortie. Un retour différé d'arrêt aux stands ne relance pas une ancienne session. Un double clic sur Continuer ne saute plus une question pendant la transition.


## Interruptions de course et tâches différées

Les tâches des feux de départ et des stands sont désormais regroupées dans des portées annulables (`web/js/task-scope.js`). Sortie, redémarrage et nouvelle course invalident les rappels de l'activité précédente. Le compte à rebours, le délai de fin et le timer des stands sont annulés ensemble ; une promesse d'arrêt interrompu est résolue une seule fois. La fin d'un arrêt ne peut pas attribuer deux boosts ou deux entrées de pitstop. Les pneus inconnus sont refusés.

Les tests couvrent la sortie pendant le compte à rebours des stands et le lancement d'une nouvelle partie avant la fin des anciens feux, sur ordinateur et mobile, en plus du déroulement habituel de la course.

## Livraison des six volets — candidate isolée

Le travail ci-dessous est dans `KnowQuest-dev/refonte-isolee`. Il ne remplace ni la copie GitHub `KnowQuest`, ni les modifications parallèles dans le développement principal.

1. **Moteur structuré.** Quatorze créations d'état de partie utilisent maintenant `SessionState.create`, avec compteurs, tableaux et drapeau de résultat neufs. Les règles de course sont dans `race-rules.js`, les catalogues d'achat dans `economy.js`, les rappels annulables dans `task-scope.js`. Le moteur principal reste volumineux : cette extraction n'est pas une réécriture intégrale.
2. **Modes avancés.** Qualifications et course sont parcourues sur ordinateur et mobile ; saison, reprise et attributions uniques sont vérifiées. Le bonus de dépassement utilise le classement réel des voitures encore en course. Le gain de vitesse tient compte de la durée effective de la question. Les sorties annulent les anciens feux et stands. Le globe WebGL et les services distants restent à vérifier dans leur environnement réel.
3. **Économie.** Prix et catalogues sont centralisés, achats et gains protégés contre les répétitions, soins gratuits sans réduction des cœurs achetés. `tools/economy_report.js` contrôle 48 entrées et compare les gains garantis après 1, 4 et 8 gardiens. Il exclut explicitement les revenus variables : ce n'est pas une simulation exhaustive du comportement des joueurs.
4. **Visuels.** Huit silhouettes SVG locales distinguent les gardiens ; le décor discret du chapitre évolue avec sa progression. La présentation précédente de la section Jeux est conservée. Les récompenses d'avatar et animations existantes restent intégrées ; les préférences de mouvement sont respectées.
5. **Qualité.** Nouveaux contrôles à 320, 390 et 1280 pixels : longue question, choix longs, absence de débordement horizontal, réponse au clavier et contraste du texte principal. Les mesures locales sont dans `reports/qualite`. Le scénario service worker installe réellement une nouvelle version pendant un quiz, vérifie que la partie reste ouverte, puis recharge et retrouve le profil ; il vérifie aussi le fonctionnement hors ligne. Ces contrôles ne constituent pas une certification d'accessibilité ou une mesure de performance en production.
6. **Fusion préparée.** `tools/prepare_merge.js` compare archive de départ, développement actuel et candidate ; il prépare les fichiers web, documentation, outils et tests sans les appliquer. Il exclut les données réservées à l'autre agent. Le rapport conserve les empreintes des trois états. Une fusion textuelle sans conflit doit encore être testée dans l'ensemble intégré.

Depuis le dossier de la candidate :

```powershell
node tools/economy_report.js
node tools/version_assets.js
node tools/check_release.js --browser
node tools/prepare_merge.js
```

Les rapports de livraison sont horodatés dans `reports/releases` et ceux de fusion dans `reports/fusion`. La revue factuelle des 1 611 réserves reste confiée au travail éditorial séparé ; aucune correction de cet autre agent n'est injectée ici. Aucune publication n'est effectuée par ces commandes.

## Consolidation et assemblage avec le développement parallèle

- Les fichiers de la proposition précédente étaient inchangés au début de cette étape. Les résolutions restent liées aux empreintes exactes des fichiers relus.
- `bank-readiness.js` remplace l'attente intégrée au moteur : les écouteurs et le délai sont nettoyés, un échec n'est jamais mémorisé comme une banque chargée. Les lancements sans questions ne donnent plus de résultat vide ni de récompense.
- Les délais de duel, survie et chaîne sont annulés lors d'une sortie, d'un résultat ou d'une nouvelle partie. Les erreurs terminales du quiz traversent aussi l'enregistrement et la sauvegarde avant le résultat différé.
- Les activités du globe partagent la remise à zéro des chronomètres et attentes. Le Tour du Monde ne boucle plus indéfiniment si le globe échoue ; son récit fonctionne sans globe. Une sortie annule son attente et une fin de tour ne paie qu'une fois par tour terminé. L'XP passe par la progression commune des niveaux.
- Les mises à jour protègent les deux écrans de partie, quiz et carte. Le scénario navigateur vérifie le refus d'une actualisation pendant la carte, le profil après actualisation, le démarrage hors ligne et le retour en ligne.
- `modal-focus.js` donne aux fenêtres existantes un rôle et un titre accessibles, garde le focus au clavier dans la fenêtre, puis le rend au bouton précédent. Contrôles et captures à 320, 390 et 1280 pixels ; présentation des Jeux conservée.
- L'analyse économique ajoute neuf scénarios de dépenses : collection, aides et aides avec recharge après 1, 4 ou 8 gardiens. Solde initial nul, revenus garantis seulement et achats trop chers refusés. Aucune estimation du temps de jeu réel ou de l'économie complète.

### Validation de la fusion

`node tools/prepare_merge.js` régénère la proposition. `node tools/validate_merge.js` assemble ensuite une copie horodatée dans son rapport, avec les données **du développement principal** et les modifications de code proposées. Les empreintes des entrées sont contrôlées avant et après ; les assets sont reversionnés seulement dans cette copie. Aucun fichier du développement principal n'est modifié.

L'audit initial du développement principal relève **892 erreurs de structure** : 723 collisions d'identifiants Méli-Mélo, 162 XP invalides ou absents, une catégorie invalide, un défaut de structure Méli-Mélo et cinq différences entre QCM monolithique et fichiers par catégorie. Ce sont des constats de validation, pas 892 erreurs factuelles distinctes. La candidate isolée conserve zéro erreur structurelle et 1 611 réserves éditoriales. Le diagnostic est dans `reports/integration-preflight.json`.

La validation de l'assemblage doit signaler ces problèmes, sans remplacer les banques par celles de la candidate pour obtenir artificiellement un bilan vert. Les tests navigateur restent distincts de l'audit des données ; consulter le rapport horodaté de chaque assemblage pour son résultat réel. Une intégration publiable reste conditionnée à la résolution des données avec le chantier éditorial.

## Suite — réponses tardives et ressources du globe

`TaskScope` gère maintenant les écouteurs et ressources libérables, en plus des chronomètres. Un point de contrôle capturé avant une attente permet d'ignorer une réponse devenue obsolète. Le module est mis en forme et commenté autour de ces responsabilités.

- Les chargements Vrai/Faux, Méli-Mélo et Pièges ne remplacent plus une partie lancée entre-temps. Changer d'onglet ou quitter invalide également la demande. Une réponse Pièges périmée n'écrit pas dans le cache de la liste.
- Les étoiles et célébrations différées de résultats sont annulées lorsque le joueur quitte le résultat ou lance une nouvelle activité. Les gains déjà enregistrés sont conservés.
- Les requêtes GeoJSON sont interrompues à la sortie. Une réponse déjà en transit reste ignorée si elle appartient à l'ancien globe. Les écouteurs de redimensionnement et effets de découverte sont libérés et l'instance du globe est détruite lorsqu'on quitte la carte.
- Une exception lors de l'initialisation WebGL déclenche le repli prévu : le rallye reste en QCM et le récit du tour demeure consultable. Le message précise que le globe peut être indisponible sur l'appareil ou hors connexion.

Les scénarios `concurrency.browser.test.js` couvrent ces courses entre activités à 390 et 1280 pixels, avec réponses volontairement retardées et une instance de globe simulée. Ils contrôlent l'annulation, les écouteurs et le repli ; ils ne valident pas le rendu WebGL réel. La célébration de résultat y est testée avec un résultat simulé, sans prétendre avoir joué ses réponses. Les commandes du bilan complet incluent automatiquement ces scénarios.

La revue des captures a également conduit à compacter le globe indisponible, à adapter le titre et la consigne à l'activité, et à masquer le chrono et le score de placement dans les modes qui ne les utilisent pas. Le dernier choix QCM reste visible sur le scénario mobile de 390 × 640 pixels ; le pied de page peut défiler pour les textes plus longs. La présentation habituelle des Jeux est conservée.

Le compagnon flottant est masqué pendant les activités de carte : il recouvrait le dernier choix du rallye sur petit écran. Le scénario contrôle également que le bouton est directement accessible au clic, sans élément superposé en son centre.

## Compte Oracle réintégré

La connexion présente dans la référence GitHub est adaptée à la candidate dans `account-sync.js` et `account-ui.js`, sans copier l'ancien moteur. Accès depuis l'accueil (« Déjà un compte ? ») et le profil, avant la collection d'avatar. L'API reste celle de la référence ; ses appels sont simulés pendant les tests.

Les nouveaux champs de progression sont inclus : gardiens vaincus, cadeaux déjà tentés, erreurs d'Histoire, accessoires, révisions et championnat. Les paramètres de signalement et le webhook restent locaux. La restauration utilise la migration et la copie de sauvegarde existantes ; le verrou contre les écritures d'autres onglets n'est pas contourné.

La synchronisation compare la progression locale, la sauvegarde en ligne et le dernier état connu. Si les deux ont changé, le joueur choisit depuis son profil. Une partie active diffère la restauration ; une réponse arrivée après déconnexion est ignorée. Les erreurs réseau et les sessions expirées conservent le profil local.

Les scénarios de compte utilisent deux navigateurs indépendants, à 390 et 1280 pixels, et vérifient l'inscription, la connexion, les erreurs, les conflits, la restauration sans nouveau gain de boss, le hors-ligne et la protection contre les écritures concurrentes. Les limites du serveur existant, notamment la taille et l'absence de verrou atomique documenté, sont précisées dans `docs/compte-oracle.md`. Le fonctionnement du serveur Oracle réellement déployé reste à valider avec un compte réel ; aucun compte réel n'est créé par les tests.

La suite de fiabilisation vérifie la session après rechargement et les progrès non encore envoyés, les nouvelles modifications acquises pendant un envoi, le retour sur un onglet auparavant synchronisé et les reprises après Frise ou carte. La Frise est désormais reconnue par sa classe réelle d'ouverture. Les erreurs locales bloquent les échanges cloud, les réponses de sauvegarde incomplètes ne sont pas prises pour un profil vide et les erreurs de transport sont traduites. Les références de comparaison sont calculées sur le JSON effectivement envoyé. Les questions et le chantier éditorial restent inchangés.
