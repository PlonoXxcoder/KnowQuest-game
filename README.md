# 🦉 KnowQuest

Jeu de quiz de culture générale, jouable dans le navigateur (PWA installable).

Progression façon jeu vidéo : XP, niveaux, gemmes, cœurs, **Trophy Road** de
40 paliers, quêtes et missions du jour, boss légendaire, cartes à collectionner,
mode Carrière F1 et Rallye du Monde sur globe 3D.

## 🎮 Jouer

Le jeu charge ses données via `fetch()` : il faut donc un petit serveur local
(ouvrir le fichier directement ne marche pas) :

```bash
# à la racine du projet
python -m http.server 8080
```

puis ouvrir **http://localhost:8080/web/index.html**

Sur mobile, le jeu s'installe comme une application (bouton 📲 Installer).

## 🗂️ Contenu du dépôt

```
web/      ← le jeu (index.html + modules js + service worker + manifest PWA)
data/     ← les banques de questions et la roadmap (Trophy Road)
```

Les questions sont éclatées par catégorie dans `data/questions/`
(12 catégories : art, châteaux, cinéma, culture générale, extended, gastronomie,
géographie, histoire, littérature, mythologie, sciences, sport — 2 709 questions
au total, plus les modes Vrai/Faux et Méli-Mélo).

> Ce dépôt ne contient que le jeu jouable, pas les outils de développement.
