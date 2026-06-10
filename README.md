# Auctelia — Dashboard de pilotage sales (v18)

Dashboard self-contained (un seul fichier `index.html`, zéro build) branché en direct sur l'API Pipedrive, pour le pilotage commercial d'Auctelia.

## Utilisation

1. Ouvrir `index.html` dans un navigateur (double-clic suffit), ou servir le repo via GitHub Pages.
2. Dans la modal de connexion, coller votre **API token Pipedrive** (Paramètres → Personal preferences → API).
3. Le token reste **en mémoire uniquement** — jamais écrit dans localStorage ni envoyé ailleurs que vers `api.pipedrive.com`.

Un **mode démo** (données fictives reproductibles) est disponible dans la modal pour explorer le dashboard sans token.

## Nouveautés v18

- **Source d'acquisition fiable** : lecture du champ custom « Origine » sur l'**organisation** liée au deal (résolution automatique de la key via `/organizationFields`, support des champs enum), avec fallback sur `channel`/`origin` natifs.
- **Fetch organisations intelligent** : appels ciblés `/organizations/{id}` par batch de 20 si ≤ 100 orgs, sinon pagination globale `/organizations` (500/page) — non bloquant, le dashboard s'affiche dès les deals chargés.
- **Nouveau tab Sources** : KPI par source, stacked bar volume × statut, classement des taux de conversion, tableau récap complet.
- **Deal detail panel** : clic sur un deal (tableau ou alertes) → panel latéral avec détails, notes Pipedrive (lazy load) et lien direct vers le deal.
- **Filtre Source global** dans la barre de contrôles, colonne Source (badge coloré) dans le tableau Deals.
- **Rafraîchissement** en arrière-plan (bouton topbar) + badge « Dernière sync il y a X min » dans la sidebar.
- **Exports** : CSV (séparateur `;`, BOM UTF-8 pour Excel) incluant la source réelle, + export JSON.
- **Objectif mensuel éditable** directement dans le tab Objectifs (recalcule historique, projection et grille par commercial).
- **Alertes plafonnées à 30 j de retard** : les alertes ne montrent que l'actionnable récent ; tout deal ouvert dépassant son seuil de plus de 30 jours bascule dans l'onglet dédié **Rotten +30j** (liste complète triée par retard, export CSV) pour le nettoyage côté Pipedrive.

## Périmètre fonctionnel (hérité v17)

Onglets Overview / Pipeline / Sources / Performance Sales / Objectifs / Alertes / Deals, filtres période (7j, 30j, MTD, QTD, YTD, 2025, custom, comparaison période précédente), chips par commercial, ribbon d'étapes cliquable, alertes rotten / stale / leads non contactés / +60j, tableau paginé avec tri et recherche.

## Stack

Vanilla JS ES6+, Chart.js 4.4.1 (CDN jsDelivr), Google Fonts (Inter, JetBrains Mono). Aucune autre dépendance.
