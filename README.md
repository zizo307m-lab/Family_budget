# Budget Familial

Suivi du budget familial et des dépenses — rapide (ajout d'une dépense en quelques secondes), hors ligne, données privées sur l'appareil.

## Utiliser sur Android
1. Publiez le dossier sur un hébergement HTTPS (par ex. **GitHub Pages** : déposez le contenu du dossier à la racine d'un dépôt, puis Settings → Pages).
2. Ouvrez l'adresse dans **Chrome sur Android** → menu ⋮ → **Ajouter à l'écran d'accueil** (ou bouton « Installer » dans Paramètres).
3. L'application fonctionne ensuite sans connexion.

> Le verrouillage par PIN, le mode hors ligne et l'installation exigent **HTTPS** (ou `localhost`).

## Tester en local
```
python3 -m http.server 8080      # puis ouvrir http://localhost:8080
npm test                         # tests unitaires
python3 tests/e2e.py             # tests navigateur (Playwright)
```

## Mettre à jour l'application publiée
Modifiez `VERSION` dans `sw.js` (ex. `budget-familial-v1.0.1`) à chaque publication pour que les téléphones rechargent les nouveaux fichiers.

## Sauvegarde
Paramètres → **Sauvegarde (JSON)** régulièrement : les données ne sont que sur le téléphone (effacer les données du navigateur les supprime).

Voir `ARCHITECTURE.md` pour la conception.
