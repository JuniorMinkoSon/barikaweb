"""Routes escrow: paiement séquestré (hold → release | refund)."""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from backend.auth.deps import get_current_user, require_role
from backend.db import get_db
from backend.db.models import EscrowPayment, User

router = APIRouter(prefix="/api/escrow", tags=["escrow"])


class HoldRequest(BaseModel):
    provider_id: str
    amount: float
    request_id: str | None = None
    currency: str = "FCFA"


class EscrowOut(BaseModel):
    id: str
    client_id: str
    provider_id: str
    amount: float
    currency: str
    status: str
    created_at: str
    released_at: str | None


# ---- Hold -------------------------------------------------------------------
@router.post("/hold", status_code=201, response_model=EscrowOut)
async def hold(
    body: HoldRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Séquestre un montant. L'argent est retenu jusqu'à release ou refund."""
    if body.amount <= 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Montant invalide")
    esc = EscrowPayment(
        client_id=user.id,
        provider_id=body.provider_id,
        amount=body.amount,
        currency=body.currency,
        request_id=body.request_id,
    )
    db.add(esc)
    await db.commit()
    await db.refresh(esc)
    return _to_out(esc)


# ---- Release ----------------------------------------------------------------
@router.post("/{escrow_id}/release", response_model=EscrowOut)
async def release(
    escrow_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Client confirme la prestation → fonds libérés au prestataire."""
    esc = await db.get(EscrowPayment, escrow_id)
    if not esc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Escrow introuvable")
    if esc.client_id != user.id and user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    if esc.status != "held":
        raise HTTPException(status.HTTP_409_CONFLICT, f"Status actuel: {esc.status}")
    esc.status = "released"
    esc.released_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(esc)
    return _to_out(esc)


# ---- Refund -----------------------------------------------------------------
@router.post("/{escrow_id}/refund", response_model=EscrowOut)
async def refund(
    escrow_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Client annule ou litige → fonds retournés au client."""
    esc = await db.get(EscrowPayment, escrow_id)
    if not esc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Escrow introuvable")
    if esc.client_id != user.id and user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Accès refusé")
    if esc.status != "held":
        raise HTTPException(status.HTTP_409_CONFLICT, f"Status actuel: {esc.status}")
    esc.status = "refunded"
    esc.released_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(esc)
    return _to_out(esc)


# ---- My escrows -------------------------------------------------------------
@router.get("/mine", response_model=list[EscrowOut])
async def my_escrows(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EscrowPayment)
        .where(EscrowPayment.client_id == user.id)
        .order_by(EscrowPayment.created_at.desc())
    )
    return [_to_out(e) for e in result.scalars()]


def _to_out(e: EscrowPayment) -> EscrowOut:
    return EscrowOut(
        id=e.id, client_id=e.client_id, provider_id=e.provider_id,
        amount=e.amount, currency=e.currency, status=e.status,
        created_at=e.created_at.isoformat() if e.created_at else "",
        released_at=e.released_at.isoformat() if e.released_at else None,
    )
