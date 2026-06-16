"""Familles métier — regroupement de haut niveau des 20 secteurs.

Objectif UX : l'utilisateur voit d'abord ~9 grandes familles lisibles
(au lieu d'une taxonomie abstraite), puis est routé vers le bon secteur
(directement, ou via la détection d'intention de la barre de recherche unique).
"""
from __future__ import annotations

from dataclasses import dataclass, asdict


@dataclass(frozen=True)
class Family:
    key: str
    label: str
    emoji: str
    icon: str
    sectors: tuple[str, ...]

    def to_dict(self) -> dict:
        return asdict(self)


FAMILIES: list[Family] = [
    Family("logement", "Logement", "🏠", "home",
           ("location_villa", "location_appartement")),
    Family("transport_demenagement", "Transport & Déménagement", "🚚", "truck",
           ("demenagement",)),
    Family("travaux_btp", "Travaux & BTP", "🛠️", "hammer",
           ("location_caterpillar", "materiaux_btp", "plomberie",
            "electricite", "climatisation")),
    Family("agriculture_elevage", "Agriculture & Élevage", "🐔", "wheat",
           ("livraison_poulets",)),
    Family("evenementiel", "Événementiel", "🎉", "party-popper",
           ("fleuriste", "traiteur", "dj_sono", "photographe")),
    Family("vehicules_chauffeurs", "Véhicules & Chauffeurs", "🚗", "car",
           ("chauffeur_prive", "mecanique_auto")),
    Family("livraison", "Livraison", "📦", "package",
           ("livraison_express",)),
    Family("services_pro", "Services professionnels", "💼", "briefcase",
           ("securite_privee",)),
]

_FAMILY_OF = {s: f.key for f in FAMILIES for s in f.sectors}


def family_of(sector_key: str) -> str | None:
    return _FAMILY_OF.get(sector_key)


def family_keys() -> list[str]:
    return [f.key for f in FAMILIES]
