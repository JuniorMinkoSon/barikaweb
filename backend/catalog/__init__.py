"""Référentiel métier LocaConnecté.

Source de vérité, indépendante du framework, pour :
- les 20 secteurs d'activité et leurs champs (client / fournisseur),
- le référentiel géographique normalisé de Côte d'Ivoire,
- les variables prédictives utilisées par les modèles ML (XGBoost).

Le module n'a aucune dépendance FastAPI / SQLAlchemy : il peut être importé
par l'API, par les scripts de seed, par les pipelines ML, ou exporté en JSON
pour alimenter les formulaires dynamiques du frontend React.
"""
from .fields import Field, FieldType
from .sectors import SECTORS, get_sector, sector_keys
from .families import FAMILIES, family_of, family_keys
from .geo import CITIES, COMMUNES, find_commune, city_keys, commune_keys
from .ai_features import AI_FEATURES, features_for_model

__all__ = [
    "Field",
    "FieldType",
    "SECTORS",
    "get_sector",
    "sector_keys",
    "FAMILIES",
    "family_of",
    "family_keys",
    "CITIES",
    "COMMUNES",
    "find_commune",
    "city_keys",
    "commune_keys",
    "AI_FEATURES",
    "features_for_model",
]
