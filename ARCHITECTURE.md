# Budget Familial — architecture

Application **PWA** (installable sur Android, 100 % hors ligne, données locales). JavaScript ES modules, **aucune dépendance, aucune étape de build** : on peut la publier telle quelle sur GitHub Pages.

## Couches (dépendances dans un seul sens : UI → store → calc/validators → utils)

| Dossier | Rôle | Dépend de |
|---|---|---|
| `js/utils.js` | Dates ISO locales, formats de montants, récurrences | — |
| `js/defaults.js` | Catégories par défaut, état initial, données de démo | utils |
| `js/storage.js` | Accès aux données (localStorage derrière une interface `getItem/setItem`), migration, import/export | defaults |
| `js/validators.js` | Validation et nettoyage des saisies | utils |
| `js/calc.js` | **Tous les calculs** (fonctions pures : budget, % utilisé, semaine, comparaison, alertes…) | utils, defaults |
| `js/store.js` | État unique + actions métier (ajout, suppression de catégorie, récurrences…), évènements de seuil | tout ce qui précède |
| `js/ui/`, `js/screens/` | Rendu (chaînes HTML échappées), formulaires, graphiques SVG | store, calc |
| `js/security.js`, `js/notify.js` | PIN (PBKDF2), notifications locales | — |
| `js/app.js` | Assemblage : navigation, thème, verrouillage, service worker | tout |
| `sw.js`, `manifest.webmanifest` | Mode hors ligne et installation | — |

Flux : action utilisateur → `store.*` (validation → mutation → persistance différée → notification) → `render()` de l'écran actif. Un changement de dépense ou de budget recalcule donc immédiatement tableau de bord, graphiques et alertes.

## Base de données (état persisté)

```
Category 1─* SubCategory
Category 1─* Expense  (subId optionnel)         Category 1─1 budget mensuel
Category 1─* Recurring(kind=expense) ──génère──▶ Expense (recurringId)
Recurring(kind=income) ──génère──▶ Income (recurringId)
SavingGoal, PaymentMethod : listes indépendantes
Settings : devise, thème, budget global, formule d'épargne, PIN (empreinte)
```
Types complets : `js/types.d.ts`. Suppression d'une catégorie : les dépenses sont **déplacées** vers une autre catégorie (choix par défaut) ou supprimées avec confirmation ; les sous-catégories supprimées laissent la dépense intacte.

## Prêt pour la suite (non implémenté dans le MVP)

* **Synchronisation / cloud / multi-membres** : remplacer `createStorage(backend)` par un backend distant ; les entités `User`/`Family` sont déjà décrites dans `types.d.ts` ; les identifiants (`uid()`) sont uniques côté client.
* **Biométrie** : WebAuthn pourra se brancher sur `security.js`.
* **Export PDF, import bancaire, sauvegarde Drive** : s'ajoutent comme services autour de `storage.js`.

## Tests

* `npm test` — 26 tests unitaires (calculs, store, validation, récurrences, import/export), Node ≥ 20, sans dépendance.
* `python3 tests/e2e.py` — 18 parcours de bout en bout dans Chromium (écran de téléphone), avec captures d'écran (Playwright).
