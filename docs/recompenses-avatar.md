# Récompenses d’avatar

Chaque gardien de chapitre donne un souvenir cosmétique, en plus de ses gains habituels : ancre du navigateur, plume des chroniques, emblème du jardin, signature de l’artiste, insigne des saveurs, médaille de l’arène, note des échos et sceau du Grand Atlas.

Les anciens boss vaincus débloquent les mêmes souvenirs au chargement. Cette récupération est gratuite, sans doublon et ne remplace pas l’accessoire porté. Les objets restent dans `ownedHats` et l’apparence active dans `avatarStyle.hat`, comme auparavant.

Le profil contient une collection : choisir une carte montre un aperçu ; Équiper applique l’objet, Retirer l’enlève gratuitement. Une récompense verrouillée reste visible avec sa condition. Les accessoires achetés figurent aussi dans la collection. La boutique montre les accessoires sur l’avatar et conserve les achats événementiels déjà possédés même hors saison. Un achat possédé n’est jamais refacturé.

Les souvenirs forment des insignes avec un cadre de couleur. Les accessoires classiques se placent selon leur nature : chapeau, lunettes, écharpe, accessoire latéral ou aura. Le résultat d’une victoire propose d’équiper immédiatement le nouveau souvenir.

Configuration et rendu : `web/js/avatar-rewards.js`, présentation : `web/avatar-rewards.css`. Le catalogue payant reste dans `web/js/game.js`. Les souvenirs ne donnent aucun avantage de combat.

Vérifications : `agents/testeur/avatar-rewards.test.js` et scénarios ordinateur/mobile de `agents/testeur/bosses.browser.test.js` (aperçu sans mutation, verrouillage, achat unique, équipement/retrait, sauvegarde et récupération des anciennes victoires).
