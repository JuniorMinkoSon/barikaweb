"""Référentiel géographique normalisé — Côte d'Ivoire.

Normalisation : chaque entité a une `key` stable (slug) utilisée en base et
dans les features ML, et un `name` affichable. Cela évite les valeurs libres
incohérentes ("Cocody" / "cocody" / "COCODY") qui dégradent le matching.
"""
from __future__ import annotations

import unicodedata
from dataclasses import dataclass, asdict
from typing import Optional


def slugify(value: str) -> str:
    norm = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return "-".join(norm.lower().split())


@dataclass(frozen=True)
class Commune:
    key: str
    name: str
    city_key: str       # ville/agglomération de rattachement
    is_district: bool = False  # commune d'Abidjan vs ville autonome

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True)
class City:
    key: str
    name: str
    is_metro: bool = False  # Abidjan (multi-communes) vs ville simple

    def to_dict(self) -> dict:
        return asdict(self)


# --- Abidjan : communes prioritaires ----------------------------------------
_ABIDJAN_COMMUNES = [
    "Cocody",
    "Plateau",
    "Marcory",
    "Treichville",
    "Yopougon",
    "Adjamé",
    "Abobo",
    "Bingerville",
    "Anyama",
    "Port-Bouët",
    "Attécoubé",
    "Koumassi",
]

# --- Grandes villes prioritaires --------------------------------------------
_GRANDES_VILLES = [
    "Bouaké",
    "Yamoussoukro",
    "San-Pédro",
    "Daloa",
    "Korhogo",
    "Man",
    "Gagnoa",
    "Abengourou",
    "Bondoukou",
    "Odienné",
]

CITIES: list[City] = [City(key="abidjan", name="Abidjan", is_metro=True)] + [
    City(key=slugify(v), name=v) for v in _GRANDES_VILLES
]

COMMUNES: list[Commune] = [
    Commune(key=slugify(c), name=c, city_key="abidjan", is_district=True)
    for c in _ABIDJAN_COMMUNES
] + [
    # chaque grande ville est aussi une "commune" sélectionnable
    Commune(key=slugify(v), name=v, city_key=slugify(v), is_district=False)
    for v in _GRANDES_VILLES
]

_COMMUNE_BY_KEY = {c.key: c for c in COMMUNES}
_CITY_BY_KEY = {c.key: c for c in CITIES}


def find_commune(value: str) -> Optional[Commune]:
    """Résout une commune par clé ou par nom (tolérant à la casse/accents)."""
    if not value:
        return None
    return _COMMUNE_BY_KEY.get(value) or _COMMUNE_BY_KEY.get(slugify(value))


def city_keys() -> list[str]:
    return [c.key for c in CITIES]


def commune_keys() -> list[str]:
    return [c.key for c in COMMUNES]


def commune_options() -> list[str]:
    """Libellés pour les <select> du frontend, groupés Abidjan puis villes."""
    return [c.name for c in COMMUNES]
