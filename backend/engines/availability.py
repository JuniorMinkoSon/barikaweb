"""Availability Engine — disponibilité capacity-aware (calendrier).

Le calendrier LocaConnecté est bidirectionnel : le fournisseur gère sa
disponibilité, le client voit un statut simplifié par jour. Le modèle de
capacité dépend de la catégorie :

- ``single``         : 1 ressource (villa, appartement, engin BTP) → dispo OU occupé.
- ``fleet``          : N unités identiques (véhicules) → partiel possible.
- ``daily_capacity`` : capacité par jour (fleuriste, matériaux) → partiel.
- ``teams``          : N équipes (déménagement) → partiel.

Tant que l'entité réservation/booking n'est pas branchée, les jours réservés
sont générés de façon **déterministe** (seed = listing + date) pour fournir un
calendrier cohérent et réaliste. La structure (capacity / reserved / available
par jour) est celle qu'utilisera la synchronisation réelle des réservations.
"""
from __future__ import annotations

import hashlib
from calendar import monthrange
from dataclasses import asdict, dataclass
from datetime import date

from backend.catalog import get_sector

# Type de capacité par secteur.
CAPACITY_TYPE: dict[str, str] = {
    "location_villa": "single",
    "location_appartement": "single",
    "location_caterpillar": "single",
    "chauffeur_prive": "fleet",
    "mecanique_auto": "fleet",
    "livraison_express": "fleet",
    "fleuriste": "daily_capacity",
    "materiaux_btp": "daily_capacity",
    "livraison_poulets": "daily_capacity",
    "traiteur": "daily_capacity",
    "demenagement": "teams",
}

# Capacité par défaut selon le type (overridable par listing).
_DEFAULT_CAPACITY: dict[str, int] = {
    "single": 1,
    "fleet": 3,
    "daily_capacity": 50,
    "teams": 3,
}

_CLIENT_STATUS = {
    "available": "Disponible",
    "partial": "Partiellement disponible",
    "occupied": "Occupé",
    "past": "Passé",
}


def capacity_type(sector_key: str) -> str:
    return CAPACITY_TYPE.get(sector_key, "single")


def default_capacity(sector_key: str) -> int:
    return _DEFAULT_CAPACITY[capacity_type(sector_key)]


@dataclass
class DayAvailability:
    date: str          # ISO yyyy-mm-dd
    status: str        # available | partial | occupied | past
    capacity: int
    reserved: int
    available: int


def _seeded_reserved(listing_id: str, day: date, capacity: int) -> int:
    """Nombre de ressources réservées pour ce jour (déterministe, démo)."""
    seed = f"{listing_id}:{day.isoformat()}".encode()
    h = int(hashlib.sha256(seed).hexdigest(), 16)
    if capacity <= 1:
        # ~22 % des jours occupés (vacances/maintenance/réservations).
        return 1 if (h % 100) < 22 else 0
    # Distribution douce : la plupart des jours peu réservés, certains pleins.
    bucket = h % 100
    if bucket < 55:
        reserved = h % max(1, capacity // 3 + 1)          # peu réservé
    elif bucket < 85:
        reserved = capacity // 2 + (h % 2)                 # moitié
    else:
        reserved = capacity - (h % 2)                      # presque/plein
    return max(0, min(capacity, reserved))


def _status(reserved: int, capacity: int) -> str:
    if reserved <= 0:
        return "available"
    if reserved >= capacity:
        return "occupied"
    return "partial"


def month_availability(
    sector_key: str,
    *,
    year: int,
    month: int,
    listing_id: str | None = None,
    capacity: int | None = None,
    today: date | None = None,
) -> dict:
    """Disponibilité jour par jour pour un mois donné."""
    today = today or date.today()
    cap = capacity if capacity and capacity > 0 else default_capacity(sector_key)
    listing = listing_id or f"{sector_key}-default"
    _, ndays = monthrange(year, month)

    days: list[DayAvailability] = []
    for d in range(1, ndays + 1):
        day = date(year, month, d)
        if day < today:
            days.append(DayAvailability(day.isoformat(), "past", cap, cap, 0))
            continue
        reserved = _seeded_reserved(listing, day, cap)
        days.append(
            DayAvailability(
                date=day.isoformat(),
                status=_status(reserved, cap),
                capacity=cap,
                reserved=reserved,
                available=max(0, cap - reserved),
            )
        )

    sector = get_sector(sector_key)
    ctype = capacity_type(sector_key)
    # Règles de réservation (min/max nuits) — surtout pour le logement.
    min_nights = 3 if ctype == "single" and sector_key in (
        "location_villa", "location_appartement") else 1
    max_nights = 30 if ctype == "single" else 90

    return {
        "sector": sector_key,
        "label": sector.label if sector else sector_key,
        "year": year,
        "month": month,
        "capacity_type": ctype,
        "capacity": cap,
        "min_nights": min_nights,
        "max_nights": max_nights,
        "legend": _CLIENT_STATUS,
        "days": [asdict(x) for x in days],
    }
