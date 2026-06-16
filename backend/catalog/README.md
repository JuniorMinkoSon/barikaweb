# Référentiel métier LocaConnecté (`backend/catalog`)

Source de vérité **indépendante du framework** pour la modélisation métier.
Aucune dépendance FastAPI/SQLAlchemy : importable par l'API, les scripts de
seed, les pipelines ML, ou exportable en JSON pour le frontend.

## Contenu

| Module | Rôle |
|---|---|
| `fields.py` | Modèle déclaratif d'un champ de formulaire (`Field`, types, validation, flag `feature`). |
| `sectors.py` | Les **20 secteurs** avec leurs champs `client` et `fournisseur`. |
| `geo.py` | Référentiel géographique normalisé (communes d'Abidjan + grandes villes), avec `slugify` pour des clés stables. |
| `ai_features.py` | Variables prédictives canoniques pour les modèles ML (XGBoost) et la liste des modèles qui les consomment. |
| `export.py` | Génère `src/data/catalog.json` pour les formulaires dynamiques React. |

## Pourquoi

Modéliser selon les **données métier réelles** (et non de simples catégories)
permet d'enrichir chaque demande de variables prédictives (localisation, budget,
urgence, volume, distance, historique…). Ce sont ces données structurées —
plus que l'algorithme — qui font la performance du matching, du pricing, de la
détection de fraude et du dispatch.

## Utilisation

```python
from backend.catalog import get_sector, SECTORS, find_commune, features_for_model

sector = get_sector("demenagement")
for f in sector.client_fields:
    print(f.key, f.type, f.required, f.feature_role)

find_commune("Cocody").key          # -> "cocody"
features_for_model("pricing")        # -> variables utiles au modèle de prix
```

Régénérer l'export JSON consommé par le frontend :

```bash
python -m backend.catalog.export        # -> src/data/catalog.json
```

## Statut

Cette brique est **additive et stable** : elle alimente (1) les formulaires
dynamiques par secteur côté React, (2) la validation des payloads côté API,
(3) le feature engineering ML. L'intégration API (`GET /api/catalog/...`) et le
branchement des formulaires React seront ajoutés dans les phases suivantes.
