# Voir les animations de KnowQuest

Dans le jeu : **Ctrl + Alt + A** ouvre le panneau d’aperçu. **Échap** le ferme. Les deux entrées ajoutées au Profil ont été retirées : le panneau est accessible au clavier, sans bouton dans les menus du joueur. Le raccourci est ignoré pendant la saisie dans un champ.

Neuf boutons permettent de rejouer les effets. Les aperçus sont isolés du score : ils ne donnent aucun XP, ne débloquent aucune récompense et ne modifient pas les révisions.

| Animation | Où la voir dans une partie | Comportement |
|---|---|---|
| Bonne réponse | Après une réponse correcte | Pulsation verte et coche existantes conservées. |
| Erreur | Après une réponse incorrecte | Secousse courte de la carte, puis correction lisible. |
| Gain d’XP | Écran de résultats | Le nombre monte jusqu’au total exact en 0,8 seconde. Le calcul des XP ne change pas. |
| Question bien mémorisée | Réussite faisant passer une question suivie de la boîte 2 à la boîte 3 | Étoile et badge « Bien mémorisé », avec le prochain rappel à 7 jours. Ce n’est pas une suppression définitive de la révision. |
| Mascotte | Réponses et récompenses | Réactions existantes conservées. Les mouvements et paroles automatiques sont calmés pendant la lecture d’une nouvelle question. |
| Fiche Atlas | Nouvelle fiche débloquée | Révélation existante conservée. La fenêtre attend la fin des autres récompenses. |
| Coffre | Ouverture d’un coffre | Secousse, ouverture et révélation successive des récompenses. Les coffres en attente sont conservés séparément. |
| Niveau supérieur | Gain d’un ou plusieurs niveaux | Médaille et célébration existantes. Les passages simultanés sont regroupés, avec le bon cumul de gemmes affiché. |
| Étape du parcours | Validation d’une étape | Validation et progression existantes conservées ; certaines pulsations décoratives de la route s’arrêtent après deux cycles. |

Les boutons Vérifier et Continuer respirent pendant deux cycles au lieu de bouger indéfiniment. Les confettis sont espacés d’au moins 1,8 seconde et masqués pendant la lecture. Le titre de la carte Boss est éclairci pour rester lisible.

## Réduire les mouvements

Le réglage **Mouvements**, en haut du panneau ouvert avec **Ctrl + Alt + A**, propose :

- **Selon mon appareil** : suit le réglage système de réduction des mouvements, y compris ses changements en cours de partie.
- **Animations normales** : conserve les effets du jeu.
- **Animations réduites** : supprime les confettis, réduit fortement les mouvements CSS et affiche immédiatement le total d’XP. Les couleurs, les corrections, les informations et les récompenses restent disponibles.

Le choix est mémorisé dans ce navigateur. Les déplacements nécessaires aux modes de jeu et le calendrier de révision ne sont pas modifiés. Les deux effets de révision et de compteur sont nouveaux ; les autres aperçus montrent ou illustrent les effets déjà présents et leurs ajustements.
