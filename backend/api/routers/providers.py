"""Routes prestataires: inscription, listing par secteur, matching réel depuis la DB."""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.deps import get_current_user, require_role
from backend.db import get_db
from backend.db.models import Provider, User
from backend.engines.matching import Provider as MatchProvider, rank_providers, comparator

router = APIRouter(prefix="/api/providers", tags=["providers"])


# ---- Schemas ----------------------------------------------------------------
class ProviderRegisterRequest(BaseModel):
    sector: str
    name: str
    commune: str
    description: str | None = None
    price_min: float | None = None
    price_max: float | None = None


class ProviderOut(BaseModel):
    id: str
    name: str
    sector: str
    commune: str
    note: float
    nombre_avis: int
    disponible: bool
    price_min: float | None
    price_max: float | None


# ---- Endpoints --------------------------------------------------------------
@router.post("/register", status_code=201)
async def register_provider(
    body: ProviderRegisterRequest,
    user: User = Depends(require_role("provider", "admin")),
    db: AsyncSession = Depends(get_db),
):
    prov = Provider(
        user_id=user.id,
        sector=body.sector,
        name=body.name,
        commune=body.commune,
        description=body.description,
        price_min=body.price_min,
        price_max=body.price_max,
    )
    db.add(prov)
    await db.commit()
    await db.refresh(prov)
    return {"id": prov.id, "sector": prov.sector, "name": prov.name}


@router.get("/sector/{sector}", response_model=list[ProviderOut])
async def list_providers(sector: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Provider).where(Provider.sector == sector, Provider.disponible == True)
    )
    return [
        ProviderOut(
            id=p.id, name=p.name, sector=p.sector, commune=p.commune,
            note=p.note, nombre_avis=p.nombre_avis, disponible=p.disponible,
            price_min=p.price_min, price_max=p.price_max,
        )
        for p in result.scalars()
    ]


@router.get("/sector/{sector}/match")
async def match_providers(
    sector: str,
    commune: str | None = None,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    """Matching réel: récupère les prestataires du secteur puis applique le ranking."""
    q = select(Provider).where(Provider.sector == sector, Provider.disponible == True)
    result = await db.execute(q)
    providers = list(result.scalars())
    if not providers:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Aucun prestataire disponible")

    # Calcul de distance simplifiée (même commune = 2km, sinon 10km)
    match_inputs = [
        MatchProvider(
            provider_id=i + 1,
            price=(p.price_min or 0),
            distance_km=2 if (commune and p.commune == commune) else 10,
            note=p.note,
            nombre_avis=p.nombre_avis,
            temps_moyen_reponse_min=p.temps_moyen_reponse_min,
            taux_acceptation=p.taux_acceptation,
            historique=p.historique,
            disponibilite=p.disponible,
            meta={"db_id": p.id, "name": p.name, "commune": p.commune},
        )
        for i, p in enumerate(providers)
    ]
    scored = rank_providers(match_inputs)
    comp = comparator(scored)
    return {
        "ranked": [s.__dict__ for s in scored],
        "top3": [s.__dict__ for s in comp["top3"]],
        "cheapest": comp["cheapest"].__dict__ if comp["cheapest"] else None,
        "best_value": comp["best_value"].__dict__ if comp["best_value"] else None,
        "premium": comp["premium"].__dict__ if comp["premium"] else None,
    }
