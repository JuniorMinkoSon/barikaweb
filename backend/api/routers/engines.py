"""Endpoints des moteurs : intention, devis, matching/classement."""
from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from datetime import date

from backend.engines import detect_intent, estimate_quote, validate_submission, FormError
from backend.engines import month_availability
from backend.engines.matching import Provider, rank_providers, comparator

router = APIRouter(prefix="/api", tags=["engines"])


# --- Recherche unique / intention -------------------------------------------
class IntentRequest(BaseModel):
    query: str
    top_k: int = 3


@router.post("/search/intent")
def search_intent(req: IntentRequest) -> dict:
    r = detect_intent(req.query, top_k=req.top_k)
    return {
        "query": r.query,
        "sector": r.sector,
        "family": r.family,
        "confidence": r.confidence,
        "candidates": [c.__dict__ for c in r.candidates],
        "entities": r.entities,
    }


# --- Devis -------------------------------------------------------------------
class QuoteRequest(BaseModel):
    sector: str
    payload: dict[str, Any] = Field(default_factory=dict)
    validate_fields: bool = False


@router.post("/quotation")
def quotation(req: QuoteRequest) -> dict:
    payload = req.payload
    if req.validate_fields:
        try:
            payload = validate_submission(req.sector, req.payload, "client")
        except FormError as e:
            return {"ok": False, "errors": e.errors}
    q = estimate_quote(req.sector, payload)
    return {
        "ok": True,
        "sector": q.sector,
        "price_min": q.price_min,
        "price_max": q.price_max,
        "currency": q.currency,
        "estimated": q.estimated,
        "breakdown": q.breakdown,
        "assumptions": q.assumptions,
        "confidence": q.confidence,
        "financials": q.financials,
    }


# --- Disponibilité / calendrier ----------------------------------------------
@router.get("/availability/{sector}")
def availability(
    sector: str,
    year: int | None = None,
    month: int | None = None,
    listing_id: str | None = None,
    capacity: int | None = None,
) -> dict:
    """Disponibilité jour par jour (calendrier client) pour un mois.

    Capacity-aware : villa/BTP = verrou unique, véhicules = flotte, fleuriste =
    capacité/jour, déménageurs = équipes. Statut par jour :
    available | partial | occupied | past.
    """
    today = date.today()
    return month_availability(
        sector,
        year=year or today.year,
        month=month or today.month,
        listing_id=listing_id,
        capacity=capacity,
        today=today,
    )


# --- Matching / classement ---------------------------------------------------
class ProviderIn(BaseModel):
    provider_id: int
    price: float = 0.0
    distance_km: float = 0.0
    note: float = 0.0
    nombre_avis: int = 0
    temps_moyen_reponse_min: float = 60.0
    taux_acceptation: float = 0.5
    historique: int = 0
    disponibilite: bool = True
    meta: dict = Field(default_factory=dict)


class MatchRequest(BaseModel):
    providers: list[ProviderIn]
    weights: Optional[dict[str, float]] = None


def _score_dict(s) -> dict:
    return {
        "provider_id": s.provider_id,
        "score": s.score,
        "rank": s.rank,
        "breakdown": s.breakdown,
        "meta": s.provider.meta if s.provider else {},
        "price": s.provider.price if s.provider else None,
        "note": s.provider.note if s.provider else None,
    }


@router.post("/matching")
def matching(req: MatchRequest) -> dict:
    provs = [Provider(**p.model_dump()) for p in req.providers]
    scored = rank_providers(provs, weights=req.weights)
    comp = comparator(scored)
    return {
        "ranked": [_score_dict(s) for s in scored],
        "top3": [_score_dict(s) for s in comp["top3"]],
        "cheapest": _score_dict(comp["cheapest"]) if comp["cheapest"] else None,
        "best_value": _score_dict(comp["best_value"]) if comp["best_value"] else None,
        "premium": _score_dict(comp["premium"]) if comp["premium"] else None,
    }
