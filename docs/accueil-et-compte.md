# Accueil Essentiel et compte des joueurs existants

## Premier lancement

L'accueil propose la création d'un compte, la connexion et un essai sans compte. Le parcours invité demande un pseudo puis un avatar. Le parcours d'inscription affiche successivement pseudo, mot de passe, confirmation et avatar. Le retour conserve les champs tant que la fenêtre reste ouverte ; fermer ou changer de mode efface les mots de passe. Aucun mot de passe n'est écrit dans les sauvegardes.

L'avatar sélectionné apparaît en grand sous la grille. La mascotte regarde le pointeur, détourne les yeux lorsqu'un champ de mot de passe est actif et regarde l'aperçu avec un signe d'approbation lors du choix d'avatar. Les préférences de réduction des animations du jeu et de l'appareil sont respectées.

## Joueurs possédant déjà une progression

Un profil local possédant des statistiques, de l'XP, des objets ou une progression, mais sans session de compte, doit s'inscrire ou se connecter pour continuer. Cette règle est également réappliquée après déconnexion ou expiration d'une session. Un profil neuf peut essayer le jeu ; après une partie jouée, l'obligation apparaîtra à son prochain lancement.

La fenêtre ne peut pas être fermée par Annuler, Échap ou clic sur le fond. Le jeu situé derrière devient inerte. Il reste possible de passer de l'inscription à la connexion et d'exporter la sauvegarde. La règle est une restriction de l'interface du jeu, pas un contrôle d'autorisation serveur.

Une copie supplémentaire du profil normalisé est conservée, une seule fois, dans `kq_account_migration_backup_v1`. Elle est indépendante de `knowquest_v2_0:backup` et n'est jamais remplacée par une restauration cloud. La sauvegarde normale n'est ni effacée ni réinitialisée.

Créer un compte neuf conserve le nom, l'avatar et les statistiques de l'ancien profil. Se connecter à un compte déjà doté d'une autre progression utilise le mécanisme de conflit existant : choix explicite et copie de sauvegarde avant restauration, aucune fusion ou substitution silencieuse.

## Réseau et limites

Sans session de compte et avec une progression existante, Internet est nécessaire pour continuer : l'obligation n'est pas contournée en cas d'échec réseau. Les données restent sur cet appareil et leur export demeure disponible. Une session déjà enregistrée permet de conserver le fonctionnement hors ligne existant ; un jeton refusé impose une reconnexion.

Le serveur Oracle et son protocole n'ont pas changé. Les limites de taille et de concurrence décrites dans `compte-oracle.md` restent applicables. Une inscription peut réussir alors que l'envoi de la progression est en erreur : le compte existe, et le message de synchronisation indique ce qu'il reste à envoyer.

## Vérification

`node --test agents/testeur/onboarding.browser.test.js agents/testeur/account.browser.test.js` couvre les étapes, le retour, l'avatar, les erreurs d'inscription, le hors-ligne, les anciens profils, la copie indépendante, l'expiration et les conflits cloud sur mobile et ordinateur, contre un serveur simulé.

Les autres parcours utilisent une session locale fictive (`mechanics-account.js`) pour isoler les mécaniques du jeu. Cela ne valide pas une connexion Oracle réelle et ne désactive aucune règle dans le code de production.
