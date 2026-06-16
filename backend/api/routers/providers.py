"""Routes prestataires: inscription, profil, listing, matching réel depuis la DB."""
import json as json_mod

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.deps import get_current_user, require_role
from backend.catalog.distance import distance_km
from backend.db import get_db
from backend.db.models import (
    Listing,
    MatchingResult,
    Provider,
    ProviderService,
    User,
)
from backend.engines.matching import (
    Provider as MatchProvider,
    comparator,
    rank_providers,
)

router = APIRouter(prefix="/api/providers", tags=["providers"])


# ---- Schemas ----------------------------------------------------------------
class ProviderRegisterRequest(BaseModel):
    name: str
    commune: str
    description: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class ServiceRegisterRequest(BaseModel):
    sector: str
    business_model: str  # catalog | quote | time_based
    base_price: float | None = None
    price_min: float | None = None
    price_max: float | None = None


class ListingCreateRequest(BaseModel):
    provider_service_id: str
    title: str
    description: str | None = None
    commune: str
    latitude: float | None = None
    longitude: float | None = None
    price: float
    price_unit: str = "jour"
    attributes: dict | None = None
    photos: list[str] | None = None


class ProviderOut(BaseModel):
    id: str
    name: str
    commune: str
    average_rating: float
    review_count: int
    completed_jobs: int
    premium_provider: bool


class ListingOut(BaseModel):
    id: str
    title: str
    commune: str
    price: float
    price_unit: str
    available: bool


# ---- Provider CRUD ----------------------------------------------------------
@router.post("/register", status_code=201)
async def register_provider(
    body: ProviderRegisterRequest,
    user: User = Depends(require_role("provider", "admin")),
    db: AsyncSession = Depends(get_db),
):
    prov = Provider(
        user_id=user.id,
        name=body.name,
        commune=body.commune,
        description=body.description,
        latitude=body.latitude,
        longitude=body.longitude,
    )
    db.add(prov)
    await db.commit()
    await db.refresh(prov)
    return {"id": prov.id, "name": prov.name}


@router.post("/services", status_code=201)
async def add_service(
    body: ServiceRegisterRequest,
    user: User = Depends(require_role("provider", "admin")),
    db: AsyncSession = Depends(get_db),
):
    # Find the user's provider profile
    result = await db.execute(select(Provider).where(Provider.user_id == user.id))
    prov = result.scalar_one_or_none()
    if not prov:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Créez d'abord un profil prestataire")
    svc = ProviderService(
        provider_id=prov.id,
        sector=body.sector,
        business_model=body.business_model,
        base_price=body.base_price,
        price_min=body.price_min,
        price_max=body.price_max,
    )
    db.add(svc)
    await db.commit()
    await db.refresh(svc)
    return {"id": svc.id, "sector": svc.sector, "business_model": svc.business_model}


@router.post("/listings", status_code=201)
async def create_listing(
    body: ListingCreateRequest,
    user: User = Depends(require_role("provider", "admin")),
    db: AsyncSession = Depends(get_db),
):
    listing = Listing(
        provider_service_id=body.provider_service_id,
        title=body.title,
        description=body.description,
        commune=body.commune,
        latitude=body.latitude,
        longitude=body.longitude,
        price=body.price,
        price_unit=body.price_unit,
        attributes=json_mod.dumps(body.attributes) if body.attributes else None,
        photos=json_mod.dumps(body.photos) if body.photos else None,
    )
    db.add(listing)
    await db.commit()
    await db.refresh(listing)
    return {"id": listing.id, "title": listing.title}


# ---- Query ------------------------------------------------------------------
@router.get("/sector/{sector}", response_model=list[ProviderOut])
async def list_providers(sector: str, db: AsyncSession = Depends(get_db)):
    """Prestataires actifs dans un secteur."""
    result = await db.execute(
        select(Provider)
        .join(ProviderService, ProviderService.provider_id == Provider.id)
        .where(ProviderService.sector == sector, ProviderService.active == True)
    )
    return [
        ProviderOut(
            id=p.id, name=p.name, commune=p.commune,
            average_rating=p.average_rating, review_count=p.review_count,
            completed_jobs=p.completed_jobs, premium_provider=p.premium_provider,
        )
        for p in result.scalars()
    ]


@router.get("/sector/{sector}/listings", response_model=list[ListingOut])
async def list_listings(sector: str, commune: str | None = None, db: AsyncSession = Depends(get_db)):
    """Listings disponibles pour un secteur CATALOG."""
    q = (
        select(Listing)
        .join(ProviderService, ProviderService.id == Listing.provider_service_id)
        .where(ProviderService.sector == sector, Listing.available == True)
    )
    if commune:
        q = q.where(Listing.commune == commune)
    result = await db.execute(q)
    return [
        ListingOut(id=l.id, title=l.title, commune=l.commune,
                   price=l.price, price_unit=l.price_unit, available=l.available)
        for l in result.scalars()
    ]


@router.get("/sector/{sector}/match")
async def match_providers(
    sector: str,
    commune: str | None = None,
    lat: float | None = None,
    lng: float | None = None,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Matching V1: score provider puis Top-3. Distance calculée à la demande."""
    q = (
        select(Provider)
        .join(ProviderService, ProviderService.provider_id == Provider.id)
        .where(ProviderService.sector == sector, ProviderService.active == True)
    )
    result = await db.execute(q)
    providers = list(result.scalars())
    if not providers:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucun prestataire disponible")

    match_inputs = []
    for i, p in enumerate(providers):
        # Distance calculée, jamais stockée
        dist = distance_km(
            from_lat=lat, from_lng=lng,
            to_lat=p.latitude, to_lng=p.longitude,
            from_commune=commune, to_commune=p.commune,
        )
        match_inputs.append(
            MatchProvider(
                provider_id=i + 1,
                price=0,  # prix pas dans le score V1
                distance_km=dist or 0,
                note=p.average_rating,
                nombre_avis=p.review_count,
                temps_moyen_reponse_min=p.response_time_min,
                taux_acceptation=p.acceptance_rate,
                historique=p.completed_jobs,
                disponibilite=p.availability_score > 0,
                meta={"db_id": p.id, "name": p.name, "commune": p.commune, "distance_km": dist},
            )
        )

    scored = rank_providers(match_inputs)
    comp = comparator(scored)

    # Persister les résultats pour entraînement XGBoost futur
    for s in scored:
        db.add(MatchingResult(
            sector=sector,
            provider_id=s.provider.meta.get("db_id", "") if s.provider else "",
            score=s.score,
            reason=json_mod.dumps(s.breakdown),
            rank=s.rank,
        ))
    await db.commit()

    return {
        "ranked": [_scored_out(s) for s in scored],
        "top3": [_scored_out(s) for s in comp["top3"]],
        "cheapest": _scored_out(comp["cheapest"]) if comp["cheapest"] else None,
        "best_value": _scored_out(comp["best_value"]) if comp["best_value"] else None,
        "premium": _scored_out(comp["premium"]) if comp["premium"] else None,
    }


def _scored_out(s) -> dict:
    meta = s.provider.meta if s.provider else {}
    return {
        "provider_id": meta.get("db_id"),
        "name": meta.get("name"),
        "commune": meta.get("commune"),
        "score": s.score,
        "rank": s.rank,
        "distance_km": meta.get("distance_km"),
        "breakdown": s.breakdown,
    }
