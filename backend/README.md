# Backend LocaConnecté (FastAPI)

API propre et autonome qui expose le **référentiel métier** (`backend/catalog`)
et les **moteurs universels** (`backend/engines`).

## Lancer en local

```bash
cd <racine du repo>
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.api.app:app --reload --port 8000
```

- Docs interactives : http://localhost:8000/docs
- Santé : http://localhost:8000/api/health

## Endpoints actuels

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/api/catalog/families` | Les 9 familles métier. |
| GET | `/api/catalog/sectors?family=...` | Les secteurs (filtrables par famille). |
| GET | `/api/catalog/sectors/{sector}/form?audience=client\|provider` | **Dynamic Forms Engine** : schéma de formulaire (jamais codé en dur). |
| POST | `/api/search/intent` | Barre unique : `{query}` → secteur/famille + entités (commune, budget…). |
| POST | `/api/quotation` | Devis intelligent : `{sector, payload}` → fourchette de prix + hypothèses. |
| POST | `/api/matching` | Classement prestataires : `{providers[]}` → `ranked`, `top3`, comparateur. |

## Tests

```bash
pip install pytest httpx
python -m pytest backend/tests -q
```

## Architecture

```
backend/
  catalog/    # source de vérité métier (secteurs, familles, géo, features ML)
  engines/    # moteurs : forms, intent, quotation, matching (XGBoost-ready)
  api/        # couche HTTP FastAPI (routers + app)
  tests/      # tests unitaires + intégration
```

Les couches `auth`, `base de données MySQL`, `escrow` et la connexion complète
du frontend React arrivent dans les phases suivantes (cf. roadmap PR).
