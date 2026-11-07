# Connexion Oracle dans la candidate de refonte

La connexion est intégrée à `KnowQuest-dev/refonte-isolee/`. La référence `KnowQuest/` et le développement principal ne sont pas modifiés.

## Utiliser le compte

- Lancer `LANCER_REFONTE.bat` à la racine du projet.
- Sur l'accueil : « Déjà un compte ? Se connecter ».
- Dans Profil : « Compte et progression », puis « Créer un compte » ou « Se connecter ».
- Le pseudo du compte accepte 3 à 20 lettres, chiffres, tirets ou underscores. Le mot de passe demande au moins 6 caractères, conformément au client Oracle existant.
- Le mot de passe est envoyé uniquement à la connexion ou à l'inscription. Il n'est pas conservé dans le stockage du jeu. Le jeton de session est conservé localement sous `kq_account`, comme dans la version de référence.

## Fonctionnement

`account-sync.js` reprend l'API Oracle ORDS de la référence : `/signup`, `/signin`, `/sync-pull`, `/sync-push`. L'URL est celle déjà configurée dans `KnowQuest/web/js/game.js`. Le JSON est envoyé dans le corps avec le même encodage que l'ancien client.

Le module synchronise les champs de progression de la refonte, notamment boss vaincus, étoiles, accessoires, cadeaux déjà tentés, compteur d'erreurs Histoire, saison de championnat et révisions. Les erreurs à réviser utilisent des identifiants au lieu de recopier toutes les questions ; les identifiants dont la banque n'est pas encore prête restent conservés. Les signalements, le webhook Discord et les permissions de notification restent propres à l'appareil.

Une première synchronisation est tentée au chargement des données. Les modifications sauvegardées déclenchent une vérification sous 30 secondes ; le retour d'une partie de quiz et le bouton « Synchroniser maintenant » permettent de la lancer immédiatement. Le retour en ligne relance la synchronisation. Une restauration est différée pendant un quiz, une activité de carte, un résultat ou une partie de Frise. Les appels ont un délai limite de 12 secondes.

Avant de remplacer la progression par une sauvegarde en ligne, le jeu garde une copie locale avec la raison `oracle-before-restore`. Les migrations et la protection contre les conflits entre onglets restent actives. Si les deux progressions ont changé, le profil affiche une comparaison et demande de choisir. Le serveur est relu au moment du choix ; si le conflit a changé, le choix doit être confirmé de nouveau.

La déconnexion conserve la progression locale. La connexion à un autre compte ne l'envoie pas automatiquement à ce compte : une comparaison est demandée. Un jeton expiré déconnecte le compte sans effacer la partie locale. Un échec réseau n'efface pas le profil.

## Limites explicites

- Le serveur Oracle réel n'a pas été utilisé pour créer des comptes ou modifier des données pendant cette intégration. Les tests interceptent ses appels et utilisent des comptes fictifs. Le déploiement, les règles CORS, la sécurité du serveur, la durée effective des jetons et son schéma de réponse restent à confirmer avec le service réel.
- L'API existante ne documente pas de verrou ou de comparaison atomique de version : une modification distante entre la lecture et l'envoi reste possible. La comparaison cliente n'est pas un verrou entre appareils.
- Une sauvegarde de plus de 28 000 octets est refusée par le client avec une erreur explicite ; aucun historique ni aucune révision n'est tronqué pour la faire passer. L'export JSON reste disponible. Cette marge reprend la contrainte indiquée dans l'ancien client Oracle ; une évolution du serveur permettrait de l'augmenter.
- Les sauvegardes produites par l'ancien client n'incluaient pas tous les champs de la refonte. Une restauration ne peut pas reconstituer des informations que le serveur n'avait jamais reçues ; la copie locale permet de revenir au profil précédent.
- Aucun push GitHub ni publication n'est effectué.

## Vérification reproductible

Depuis le dossier de la candidate :

```powershell
node --test agents/testeur/account-sync.test.js agents/testeur/account.browser.test.js
node tools/version_assets.js
node tools/check_release.js --browser
```

Les tests couvrent inscription, erreurs de mot de passe, double soumission, connexion depuis un navigateur vierge, restauration des nouveaux champs, protection contre un second gain de boss, conflits, choix explicite, sauvegarde locale avant restauration, hors ligne, reprise, déconnexion, session expirée et taille excessive. Les captures sont dans `reports/compte-*.png`.

## Continuité de session et réponses invalides

La session et le dernier échange réussi sont retrouvés après rechargement, sans ressaisie du mot de passe tant que le jeton reste accepté. Les progrès enregistrés localement mais pas encore envoyés sont comparés à la sauvegarde en ligne lors de la prochaine ouverture. Fermer immédiatement le navigateur ne garantit pas l'envoi de ces derniers progrès : ils restent sur cet appareil jusqu'à une prochaine synchronisation.

Le retour dans l'onglet relit la progression distante, même lorsque le dernier état affiché était synchronisé. La Frise est reconnue par sa classe d'ouverture ; aucune restauration ne la remplace en cours de partie. Fermer la Frise ou la carte reprend une synchronisation différée.

Une erreur ou un conflit signalé par la sauvegarde locale bloque les échanges cloud jusqu'à résolution. Le contrôle est refait après la lecture distante. Une réponse sans champ `profile`, ou avec un type inattendu, n'est jamais interprétée comme une sauvegarde vide. Les collections incohérentes sont refusées avant restauration. Les erreurs réseau et de réponse sont expliquées en français.

Les tests supplémentaires couvrent également les progrès acquis pendant un envoi, l'expiration du délai réseau, la persistance de session, le retour sur l'onglet et la reprise après la Frise et la carte. Tous les appels Oracle de ces scénarios restent simulés.
