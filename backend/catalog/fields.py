"""Modèle de description d'un champ de formulaire métier.

Ce schéma est volontairement déclaratif : il décrit *quoi* demander, *comment*
le valider et *si* la valeur sert de variable prédictive au ML. Le frontend
React l'utilise pour générer les formulaires dynamiques ; le backend l'utilise
pour valider les payloads et construire le vecteur de features.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Literal, Optional

FieldType = Literal[
    "text",
    "textarea",
    "integer",
    "number",
    "currency",
    "select",
    "multiselect",
    "boolean",
    "date",
    "time",
    "datetime",
    "phone",
    "photos",
    "commune",   # référence géo (ville/commune)
    "quartier",  # texte libre normalisé, dépend de la commune
    "gps",       # {lat, lng}
]

# Rôle prédictif d'un champ pour les modèles ML (cf. ai_features.py).
FeatureRole = Literal[
    "location",
    "budget",
    "urgency",
    "volume",
    "distance",
    "duration",
    "date",
    "category",
    "capacity",
    "quality",
    "availability",
]


@dataclass(frozen=True)
class Field:
    key: str
    label: str
    type: FieldType
    required: bool = False
    options: Optional[list[str]] = None
    unit: Optional[str] = None
    min: Optional[float] = None
    max: Optional[float] = None
    placeholder: Optional[str] = None
    help: Optional[str] = None
    depends_on: Optional[str] = None          # ex: quartier dépend de commune
    feature: bool = False                      # variable prédictive ML
    feature_role: Optional[FeatureRole] = None

    def to_dict(self) -> dict:
        d = asdict(self)
        return {k: v for k, v in d.items() if v not in (None, False, [])}


def select(key: str, label: str, options: list[str], **kw) -> Field:
    return Field(key=key, label=label, type="select", options=options, **kw)


def multiselect(key: str, label: str, options: list[str], **kw) -> Field:
    return Field(key=key, label=label, type="multiselect", options=options, **kw)
