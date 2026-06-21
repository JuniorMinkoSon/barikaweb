"""Quotation Engine — devis intelligents.

Donne à l'utilisateur une estimation immédiate et transparente (fourchette
basse/haute + hypothèses), avant même de contacter un prestataire. Les barèmes
sont des heuristiques métier (FCFA) volontairement explicites et ajustables ;
elles peuvent être remplacées plus tard par le modèle ML `pricing`.
"""
from __future__ import annotations

from dataclasses import dataclass, field as dc_field
from datetime import date
from typing import Optional

from backend.catalog import get_sector

CURRENCY = "FCFA"
TVA_RATE = 0.18  # TVA Côte d'Ivoire, appliquée sur la commission de la plateforme
_URGENCY_MULT = {"normale": 1.0, "prioritaire": 1.15, "immédiate": 1.3, "immediate": 1.3}


@dataclass
class Quote:
    sector: str
    price_min: float
    price_max: float
    currency: str = CURRENCY
    estimated: dict = dc_field(default_factory=dict)   # ex: {"volume_m3": 42, "camion": "10t"}
    breakdown: list[dict] = dc_field(default_factory=list)
    assumptions: list[str] = dc_field(default_factory=list)
    confidence: str = "estimation"  # estimation | indisponible
    financials: dict = dc_field(default_factory=dict)  # prix unitaire, commission, TVA, escrow, total


def _round(v: float, step: int = 500) -> float:
    return float(int(round(v / step)) * step)


def _range(base: float, spread: float = 0.13) -> tuple[float, float]:
    return _round(base * (1 - spread)), _round(base * (1 + spread))


def _urgency(payload: dict) -> float:
    return _URGENCY_MULT.get(str(payload.get("urgence", "normale")).lower(), 1.0)


_DATE_START_KEYS = ("date_arrivee", "date_debut", "date_souhaitee")
_DATE_END_KEYS = ("date_depart", "date_fin")


def _parse_date(v) -> Optional[date]:
    if not v:
        return None
    try:
        return date.fromisoformat(str(v)[:10])
    except ValueError:
        return None


def _days_from_dates(p: dict) -> Optional[float]:
    """Nombre de nuits déduit d'une plage de dates (calendrier client)."""
    start = next((_parse_date(p.get(k)) for k in _DATE_START_KEYS if p.get(k)), None)
    end = next((_parse_date(p.get(k)) for k in _DATE_END_KEYS if p.get(k)), None)
    if start and end and end > start:
        return float((end - start).days)
    return None


def _financials(
    sector_key: str,
    subtotal: float,
    *,
    urgency: float = 1.0,
    unit_price: Optional[float] = None,
    units: Optional[float] = None,
    unit_label: Optional[str] = None,
) -> dict:
    """Récapitulatif financier transparent d'une réservation.

    subtotal = montant de la prestation (séquestré en escrow pour le prestataire),
    majoration d'urgence incluse pour rester cohérent avec la fourchette de prix.
    commission = part plateforme (taux du secteur). TVA appliquée sur la commission.
    total = ce que paie le client (prestation + commission + TVA).
    """
    sec = get_sector(sector_key)
    rate = sec.commission_rate if sec else 0.10
    escrow_required = sec.escrow_required if sec else True
    subtotal_base = _round(subtotal)
    subtotal = _round(subtotal_base * urgency)
    commission = _round(subtotal * rate)
    tva = _round(commission * TVA_RATE)
    f: dict = {
        "subtotal": subtotal,
        "commission_rate": rate,
        "commission": commission,
        "tva_rate": TVA_RATE,
        "tva": tva,
        "escrow_required": escrow_required,
        "escrow_amount": subtotal if escrow_required else 0.0,
        "total": subtotal + commission + tva,
        "currency": CURRENCY,
    }
    if abs(urgency - 1.0) > 1e-9:
        f["urgency_mult"] = urgency
        f["subtotal_base"] = subtotal_base
    if unit_price is not None:
        f["unit_price"] = _round(unit_price)
    if units is not None:
        f["units"] = units
    if unit_label is not None:
        f["unit_label"] = unit_label
    return f


def _camion_for_volume(v: float) -> str:
    for vol, name in [(8, "3m³ (utilitaire)"), (12, "8m³"), (20, "12m³ (5t)"),
                      (35, "20m³ (10t)"), (10**9, "30m³ (20t)")]:
        if v <= vol:
            return name
    return "30m³ (20t)"


def _q_demenagement(p: dict) -> Quote:
    pieces = float(p.get("nb_pieces", 0) or 0)
    cartons = float(p.get("nb_cartons", 0) or 0)
    volume = round(pieces * 8.0 + cartons * 0.12, 1)
    if volume <= 0:
        volume = 12.0  # studio par défaut
    camion = _camion_for_volume(volume)
    base = volume * 4500            # ~4500 FCFA/m³
    floors = (float(p.get("etage_depart", 0) or 0) + float(p.get("etage_arrivee", 0) or 0))
    if not p.get("ascenseur"):
        base += floors * 5000
    if p.get("meubles_lourds"):
        base += 25000
    if p.get("electromenager"):
        base += 15000
    inter = p.get("commune_depart") and p.get("commune_arrivee") and \
        p.get("commune_depart") != p.get("commune_arrivee")
    if inter:
        base += 30000
    subtotal = base
    urg = _urgency(p)
    base *= urg
    lo, hi = _range(max(base, 40000))
    return Quote(
        sector="demenagement", price_min=lo, price_max=hi,
        estimated={"volume_m3": volume, "camion": camion},
        financials=_financials("demenagement", max(subtotal, 40000), urgency=urg,
                               unit_label="forfait déménagement"),
        breakdown=[
            {"label": "Volume estimé", "value": f"{volume} m³"},
            {"label": "Camion conseillé", "value": camion},
        ],
        assumptions=[
            "Volume ≈ 8 m³/pièce + 0,12 m³/carton",
            "Supplément étages si pas d'ascenseur, +30 000 si inter-communes",
        ],
    )


def _q_per_unit(sector_key: str, p: dict, unit_price: float, unit_label: str) -> Quote:
    qty = float(p.get("quantite", 0) or p.get("quantity", 0) or 1)
    subtotal = qty * unit_price
    urg = _urgency(p)
    base = subtotal * urg
    lo, hi = _range(max(base, unit_price))
    return Quote(sector=sector_key, price_min=lo, price_max=hi,
                 estimated={"quantite": qty},
                 breakdown=[{"label": unit_label, "value": f"{qty:g}"}],
                 assumptions=[f"Prix unitaire indicatif ≈ {int(unit_price)} {CURRENCY}"],
                 financials=_financials(sector_key, subtotal, urgency=urg, unit_price=unit_price,
                                        units=qty, unit_label=unit_label))


def _q_per_day(sector_key: str, p: dict, day_price: float) -> Quote:
    days = float(p.get("duree_jours", 0) or p.get("nb_nuits", 0) or _days_from_dates(p) or 1)
    subtotal = days * day_price
    urg = _urgency(p)
    base = subtotal * urg
    lo, hi = _range(max(base, day_price))
    return Quote(sector=sector_key, price_min=lo, price_max=hi,
                 estimated={"jours": days},
                 breakdown=[{"label": "Durée", "value": f"{days:g} jour(s)"}],
                 assumptions=[f"Tarif journalier indicatif ≈ {int(day_price)} {CURRENCY}"],
                 financials=_financials(sector_key, subtotal, urgency=urg, unit_price=day_price,
                                        units=days, unit_label="jour(s)"))


def _q_per_hour(sector_key: str, p: dict, hour_price: float) -> Quote:
    hours = float(p.get("duree_heures", 0) or p.get("duree_mission_h", 0) or 1)
    agents = float(p.get("nb_agents", 1) or 1)
    subtotal = hours * hour_price * agents
    urg = _urgency(p)
    base = subtotal * urg
    lo, hi = _range(max(base, hour_price))
    return Quote(sector=sector_key, price_min=lo, price_max=hi,
                 estimated={"heures": hours, "agents": agents},
                 breakdown=[{"label": "Durée", "value": f"{hours:g} h"}],
                 assumptions=[f"Tarif horaire indicatif ≈ {int(hour_price)} {CURRENCY}"],
                 financials=_financials(sector_key, subtotal, urgency=urg, unit_price=hour_price * agents,
                                        units=hours, unit_label="heure(s)"))


# Barèmes indicatifs par secteur (FCFA)
_UNIT_PRICE = {
    "livraison_poulets": (2500, "Poulets"),
    "materiaux_btp": (3000, "Unités"),
    "traiteur": (6000, "Couverts"),
    "livraison_express": (1500, "Course"),
}
_DAY_PRICE = {
    "location_villa": 75000,
    "location_appartement": 25000,
    "location_caterpillar": 180000,
}
_HOUR_PRICE = {
    "chauffeur_prive": 8000,
    "securite_privee": 3000,
}


def estimate_quote(sector_key: str, payload: dict) -> Quote:
    sector = get_sector(sector_key)
    if sector is None:
        return Quote(sector=sector_key, price_min=0, price_max=0,
                     confidence="indisponible",
                     assumptions=[f"secteur inconnu: {sector_key}"])

    if sector_key == "demenagement":
        return _q_demenagement(payload)
    if sector_key in _UNIT_PRICE:
        price, label = _UNIT_PRICE[sector_key]
        return _q_per_unit(sector_key, payload, price, label)
    if sector_key in _DAY_PRICE:
        return _q_per_day(sector_key, payload, _DAY_PRICE[sector_key])
    if sector_key in _HOUR_PRICE:
        return _q_per_hour(sector_key, payload, _HOUR_PRICE[sector_key])

    # secteurs sur devis (plomberie, élec, clim, fleuriste, dj, photo, mécanique, santé…)
    budget = float(payload.get("budget", 0) or 0)
    if budget > 0:
        lo, hi = _range(budget, 0.2)
        return Quote(sector=sector_key, price_min=lo, price_max=hi,
                     assumptions=["Fourchette autour du budget indiqué (±20%)"],
                     financials=_financials(sector_key, budget, unit_label="forfait"))
    return Quote(sector=sector_key, price_min=0, price_max=0,
                 confidence="indisponible",
                 assumptions=["Devis sur mesure — un prestataire vous proposera un prix."])
