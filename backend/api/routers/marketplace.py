"""Routes marketplace: 'Publier un besoin' + propositions prestataires."""
import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.auth.deps import get_current_user, require_role
from backend.db import get_db
from backend.db.models import Proposal, ServiceRequest, User

router = APIRouter(prefix="/api/marketplace", tags=["marketplace"])


# ---- Schemas ----------------------------------------------------------------
class PublishRequest(BaseModel):
    sector: str
    title: str
    description: str | None = None
    budget: float | None = None
    commune: str | None = None
    urgency: str = "normale"
    payload: dict | None = None


class ProposalRequest(BaseModel):
    request_id: str
    price: float
    message: str | None = None


class RequestOut(BaseModel):
    id: str
    sector: str
    title: str
    description: str | None
    budget: float | None
    commune: str | None
    urgency: str
    status: str
    created_at: str


class ProposalOut(BaseModel):
    id: str
    provider_id: str
    price: float
    message: str | None
    status: str


# ---- Endpoints Client --------------------------------------------------------
@router.post("/publish", status_code=201)
async def publish_need(
    body: PublishRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Client publie un besoin — les prestataires pourront proposer."""
    req = ServiceRequest(
        client_id=user.id,
        sector=body.sector,
        title=body.title,
        description=body.description,
        budget=body.budget,
        commune=body.commune,
        urgency=body.urgency,
        payload=json.dumps(body.payload) if body.payload else None,
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return {"id": req.id, "status": req.status}


@router.get("/my-requests", response_model=list[RequestOut])
async def my_requests(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ServiceRequest)
        .where(ServiceRequest.client_id == user.id)
        .order_by(ServiceRequest.created_at.desc())
    )
    return [
        RequestOut(
            id=r.id, sector=r.sector, title=r.title, description=r.description,
            budget=r.budget, commune=r.commune, urgency=r.urgency, status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in result.scalars()
    ]


@router.get("/requests/open", response_model=list[RequestOut])
async def open_requests(
    sector: str | None = None,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_role("provider", "admin")),
):
    """Liste des besoins ouverts (pour les prestataires)."""
    q = select(ServiceRequest).where(ServiceRequest.status == "open")
    if sector:
        q = q.where(ServiceRequest.sector == sector)
    q = q.order_by(ServiceRequest.created_at.desc())
    result = await db.execute(q)
    return [
        RequestOut(
            id=r.id, sector=r.sector, title=r.title, description=r.description,
            budget=r.budget, commune=r.commune, urgency=r.urgency, status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in result.scalars()
    ]


# ---- Endpoints Prestataire ---------------------------------------------------
@router.post("/propose", status_code=201)
async def propose(
    body: ProposalRequest,
    user: User = Depends(require_role("provider", "admin")),
    db: AsyncSession = Depends(get_db),
):
    """Prestataire propose un prix en réponse à un besoin."""
    req = await db.get(ServiceRequest, body.request_id)
    if not req or req.status != "open":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Besoin introuvable ou fermé")
    prop = Proposal(
        request_id=body.request_id,
        provider_id=user.id,
        price=body.price,
        message=body.message,
    )
    db.add(prop)
    await db.commit()
    await db.refresh(prop)
    return {"id": prop.id, "price": prop.price, "status": prop.status}


@router.get("/requests/{request_id}/proposals", response_model=list[ProposalOut])
async def list_proposals(
    request_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    req = await db.get(ServiceRequest, request_id)
    if not req:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Besoin introuvable")
    if req.client_id != user.id and user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    result = await db.execute(
        select(Proposal).where(Proposal.request_id == request_id).order_by(Proposal.price)
    )
    return [
        ProposalOut(id=p.id, provider_id=p.provider_id, price=p.price, message=p.message, status=p.status)
        for p in result.scalars()
    ]


@router.post("/requests/{request_id}/accept/{proposal_id}")
async def accept_proposal(
    request_id: str,
    proposal_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    req = await db.get(ServiceRequest, request_id)
    if not req or req.client_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    prop = await db.get(Proposal, proposal_id)
    if not prop or prop.request_id != request_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Proposition introuvable")
    # Accept
    prop.status = "accepted"
    req.status = "matched"
    # Reject others
    others = await db.execute(
        select(Proposal).where(
            Proposal.request_id == request_id,
            Proposal.id != proposal_id,
            Proposal.status == "pending",
        )
    )
    for o in others.scalars():
        o.status = "rejected"
    await db.commit()
    return {"ok": True, "matched_provider": prop.provider_id, "price": prop.price}
