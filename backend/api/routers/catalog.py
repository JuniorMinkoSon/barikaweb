"""Endpoints du référentiel métier + Dynamic Forms Engine."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.catalog import FAMILIES, SECTORS, family_of, get_sector
from backend.engines.forms import get_form

router = APIRouter(prefix="/api/catalog", tags=["catalog"])


@router.get("/families")
def list_families() -> list[dict]:
    return [f.to_dict() for f in FAMILIES]


@router.get("/sectors")
def list_sectors(family: str | None = Query(default=None)) -> list[dict]:
    items = []
    for s in SECTORS:
        fam = family_of(s.key)
        if family and fam != family:
            continue
        items.append({
            "key": s.key,
            "label": s.label,
            "icon": s.icon,
            "family": fam,
            "pricing_model": s.pricing_model,
            "urgency_enabled": s.urgency_enabled,
        })
    return items


@router.get("/sectors/{sector_key}/form")
def sector_form(sector_key: str, audience: str = Query(default="client")) -> dict:
    if get_sector(sector_key) is None:
        raise HTTPException(status_code=404, detail=f"secteur inconnu: {sector_key}")
    if audience not in ("client", "provider"):
        raise HTTPException(status_code=400, detail="audience: client|provider")
    form = get_form(sector_key, audience)
    return {
        "sector": form.sector,
        "family": form.family,
        "label": form.label,
        "pricing_model": form.pricing_model,
        "urgency_enabled": form.urgency_enabled,
        "audience": form.audience,
        "fields": form.fields,
    }
