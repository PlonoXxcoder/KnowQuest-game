# Gardiens de l’aventure

Le jeu de développement utilise huit gardiens distincts, un après chaque chapitre. Les identifiants `boss_ch0` à `boss_ch7` sont conservés : les anciennes victoires restent acquises.

## Réglages

Les paramètres sont regroupés dans `web/js/bosses.js`, dans l’ordre des chapitres. La présentation est dans `web/bosses.css`. Le lancement, les sauvegardes et les récompenses restent reliés au moteur dans `web/js/game.js`.

| Chapitre | Gardien | Points | Questions maximum | Règle |
| --- | --- | ---: | ---: | --- |
| Phare | Gardien de la Brume | 4 | 10 | Facile et intermédiaire, sans chrono |
| Cité | Sentinelle des Archives | 5 | 10 | Facile et intermédiaire, sans chrono |
| Jardin | Gardien des Racines | 5 | 10 | +1 point tous les trois coups reçus, au plus deux soins |
| Atelier | Enchanteur des Couleurs | 5 | 10 | Intermédiaire, sans chrono |
| Marché | Gardien du Banquet | 6 | 10 | Facile et intermédiaire, sans chrono |
| Arène | Champion de l’Arène | 6 | 10 | Intermédiaire, 20 secondes par question |
| Studio | Maître des Échos | 6 | 10 | Une erreur rend un point au gardien |
| Bibliothèque | Gardien de l’Oubli | 8 | 14 | Régénération limitée, puis soin sur erreur à mi-vie |

Chaque bonne réponse enlève un point. Une erreur ou un délai expiré enlève une des trois **vies de combat** ; les cœurs et le compteur d’erreurs de l’histoire ne sont pas touchés. Le talent Chasseur de boss retire toujours un point au gardien, sans descendre sous trois. Les soins ne dépassent jamais le maximum ajusté.

Les questions reprennent les catégories du chapitre, avec une préférence pour les difficultés configurées et un complément disponible si nécessaire. Le combat s’arrête dès que l’une des deux barres atteint zéro.

La récompense de première victoire est de **200 XP, 100 gemmes, un accessoire d’avatar, la page restaurée et une fiche Atlas encore verrouillée si disponible**. Les gains des réponses, talents, missions ou niveaux s’ajoutent selon leurs règles habituelles. Les découvertes de fiches pendant le combat sont regroupées dans le résultat. Un résultat répété n’attribue pas une seconde récompense.

## Boss mensuel

Le boss mensuel reste dans Jeux. Il possède 12 points de vie pour 15 questions, en trois groupes de cinq : facile, intermédiaire, difficile. Le chronomètre reste à 15 secondes et les objets sont interdits, y compris par un appel direct à leur fonction. Deux erreurs sont compatibles avec une victoire. La première victoire du mois donne 300 XP, 150 gemmes et le titre existant ; la protection contre une seconde attribution couvre aussi ce boss.

## Présentation

Avant le combat : gardien, règle courte, nombre de points/questions, trois vies, récompense et bouton Affronter. Pendant : portrait, barres de combat, question et signal du pouvoir. Le combat démarre immédiatement ; l’animation d’entrée ne bloque pas la réponse.

Les effets d’arrivée, de dégât, d’attaque, de pouvoir et de changement de phase sont distincts. La victoire colore la page dans le même écran que les gains. Les autres célébrations attendent la fermeture du résultat. Les préférences de mouvement réduit désactivent les animations.

## Vérification

- `agents/testeur/bosses.test.js` : configurations, soins plafonnés, deux phases, vies et possibilité de gagner avec toutes les positions de deux erreurs.
- `agents/testeur/bosses.browser.test.js` : huit gardiens sur ordinateur et mobile, bouton après consultation du mensuel, parties gagnées/perdues, revanche, récompenses uniques, phases finales et sauvegarde après rechargement.
- `agents/testeur/motion.test.js` : parcours, animations, règles d’histoire, mise à jour et cache hors ligne.

Les captures sont enregistrées dans `agents/testeur/rapports/gardiens-*`. Aucun envoi sur GitHub n’est automatique.
