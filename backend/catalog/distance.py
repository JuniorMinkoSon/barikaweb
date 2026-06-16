"""Calcul de distance — la distance est CALCULÉE, jamais stockée.

Fournit:
- haversine(lat1, lng1, lat2, lng2) -> km
- commune_centroid(commune_key) -> (lat, lng) | None  (centroïdes approximatifs CI)
- distance_km(...) tolérant aux coords manquantes (fallback commune).
"""
from __future__ import annotations

import math
from typing import Optional

from .geo import slugify

# Centroïdes approximatifs (lat, lng) — Abidjan + grandes villes CI.
_CENTROIDS: dict[str, tuple[float, float]] = {
    # Abidjan
    "cocody": (5.3599, -3.9874),
    "plateau": (5.3247, -4.0167),
    "marcory": (5.2846, -3.9869),
    "treichville": (5.2925, -4.0050),
    "yopougon": (5.3456, -4.0890),
    "adjame": (5.3667, -4.0167),
    "abobo": (5.4167, -4.0167),
    "bingerville": (5.3550, -3.8853),
    "anyama": (5.4944, -4.0517),
    "port-bouet": (5.2558, -3.9267),
    "attecoube": (5.3333, -4.0333),
    "koumassi": (5.2889, -3.9469),
    # Grandes villes
    "bouake": (7.6906, -5.0303),
    "yamoussoukro": (6.8276, -5.2893),
    "san-pedro": (4.7485, -6.6363),
    "daloa": (6.8772, -6.4503),
    "korhogo": (9.4580, -5.6294),
    "man": (7.4125, -7.5538),
    "gagnoa": (6.1319, -5.9506),
    "abengourou": (6.7297, -3.4964),
    "bondoukou": (8.0402, -2.8000),
    "odienne": (9.5079, -7.5640),
}


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Distance grand-cercle en km."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlambda / 2) ** 2
    return round(2 * r * math.asin(math.sqrt(a)), 2)


def commune_centroid(commune: str) -> Optional[tuple[float, float]]:
    if not commune:
        return None
    return _CENTROIDS.get(slugify(commune))


def distance_km(
    *,
    from_lat: Optional[float] = None,
    from_lng: Optional[float] = None,
    to_lat: Optional[float] = None,
    to_lng: Optional[float] = None,
    from_commune: Optional[str] = None,
    to_commune: Optional[str] = None,
) -> Optional[float]:
    """Distance calculée. Priorité aux coords exactes, sinon centroïdes commune."""
    a = (from_lat, from_lng) if from_lat is not None and from_lng is not None else commune_centroid(from_commune or "")
    b = (to_lat, to_lng) if to_lat is not None and to_lng is not None else commune_centroid(to_commune or "")
    if not a or not b:
        return None
    return haversine(a[0], a[1], b[0], b[1])
