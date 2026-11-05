# Structure du jeu et règles du mode Histoire

## Règles livrées

- Trois mauvaises réponses cumulées dans les étapes du parcours coûtent un cœur. Une bonne réponse ne remet pas ce compteur à zéro. Quitter puis revenir conserve le compteur, enregistré dans le profil.
- À la troisième erreur, le jeu appelle son mécanisme existant de déduction : un bouclier actif peut absorber la perte. Le compteur repart à zéro dans les deux cas.
- Les modes libres conservent leurs règles. Les boss conservent leurs points de combat ; ce changement concerne les étapes du parcours.
- Après une bonne réponse à une question difficile, une surprise est possible (25 % de chance). Le tirage n’est pas annoncé avant la réponse. Une question ne peut donner lieu qu’à un tirage par profil, même lorsque celui-ci ne donne aucun cadeau.
- Répartition des cadeaux : 5 gemmes (70 %), 10 gemmes (25 %), un bouclier dans l’inventaire (5 %). Ces pourcentages sont conditionnels à l’obtention d’un cadeau.

## Où modifier quoi

| Fichier | Responsabilité |
|---|---|
| `web/js/story-rules.js` | Règles pures de l’Histoire : compteur d’erreurs, éligibilité et tirage des cadeaux, attribution. Constantes d’équilibrage et commentaires de section regroupés. |
| `web/js/game.js` | Orchestration existante : lancement des parties, réponses, cœurs, sauvegarde, interface et autres modes. Une section Histoire relie l’interface aux règles séparées. |
| `web/js/motion.js` | Animations et préférences de mouvement, aperçus, file de célébrations. |
| `web/motion.css` | Présentation des effets et des informations Histoire. |
| `web/data_loader.js` | Chargement des banques de questions et du parcours. |
| `data/roadmap.json` | Données du parcours, transformées en étapes jouables. |
| `web/sw.js` | Cache hors ligne des fichiers du jeu. |

La séparation commence par les règles nouvelles, sans déplacer brutalement les milliers de lignes existantes. Le fichier `game.js` reste volumineux : les extractions suivantes peuvent porter sur les sauvegardes, les quiz, l’Atlas et les modes spéciaux, avec tests à chaque étape. Cette livraison ne prétend pas avoir réécrit tout le moteur.

## Vérifications

Les règles sont testables sans navigateur avec `node --test agents/testeur/story-rules.test.js` depuis le dossier parent du dépôt. La sauvegarde stocke le compteur et les tirages déjà effectués ; aucun champ de cadeau à venir n’est ajouté à l’énoncé visible.
