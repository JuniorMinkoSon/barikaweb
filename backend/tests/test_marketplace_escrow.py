"""Tests marketplace (Publier un besoin) + escrow (hold/release/refund)."""
import os
os.environ.setdefault("JWT_SECRET", "test-secret-for-auth-min-32-chars!!")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.api.app import app
from backend.db.session import Base, engine

pytestmark = pytest.mark.asyncio(loop_scope="module")


def _h(token: str):
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(loop_scope="module")
async def ac():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


async def test_full_marketplace_flow(ac: AsyncClient):
    """Scénario complet: publish → propose → accept."""
    # Register client + provider
    r = await ac.post("/api/auth/register", json={
        "email": "mkt_client@loca.ci", "password": "p", "name": "Client", "role": "client"
    })
    client_token = r.json()["access_token"]

    r = await ac.post("/api/auth/register", json={
        "email": "mkt_prov@loca.ci", "password": "p", "name": "Presta", "role": "provider"
    })
    provider_token = r.json()["access_token"]

    # 1. Client publie un besoin
    r = await ac.post("/api/marketplace/publish", json={
        "sector": "demenagement",
        "title": "Déménagement samedi",
        "budget": 100000,
        "commune": "cocody",
        "urgency": "prioritaire",
    }, headers=_h(client_token))
    assert r.status_code == 201
    request_id = r.json()["id"]

    # 2. Client voit ses demandes
    r = await ac.get("/api/marketplace/my-requests", headers=_h(client_token))
    assert r.status_code == 200
    assert len(r.json()) == 1

    # 3. Prestataire voit les besoins ouverts
    r = await ac.get("/api/marketplace/requests/open?sector=demenagement", headers=_h(provider_token))
    assert r.status_code == 200
    assert len(r.json()) >= 1

    # 4. Prestataire propose
    r = await ac.post("/api/marketplace/propose", json={
        "request_id": request_id,
        "price": 90000,
        "message": "Disponible samedi 8h",
    }, headers=_h(provider_token))
    assert r.status_code == 201
    proposal_id = r.json()["id"]

    # 5. Client voit les propositions
    r = await ac.get(f"/api/marketplace/requests/{request_id}/proposals", headers=_h(client_token))
    assert r.status_code == 200
    proposals = r.json()
    assert len(proposals) == 1 and proposals[0]["price"] == 90000

    # 6. Client accepte
    r = await ac.post(
        f"/api/marketplace/requests/{request_id}/accept/{proposal_id}",
        headers=_h(client_token),
    )
    assert r.status_code == 200
    assert r.json()["ok"] is True


async def test_escrow_hold_release_refund(ac: AsyncClient):
    """Scénario escrow: hold → release, hold → refund, double release = 409."""
    r = await ac.post("/api/auth/register", json={
        "email": "esc_client@loca.ci", "password": "p", "name": "EscClient"
    })
    token = r.json()["access_token"]

    # Hold → Release
    r = await ac.post("/api/escrow/hold", json={
        "provider_id": "prov-1", "amount": 90000
    }, headers=_h(token))
    assert r.status_code == 201
    esc1_id = r.json()["id"]
    assert r.json()["status"] == "held"

    r = await ac.post(f"/api/escrow/{esc1_id}/release", headers=_h(token))
    assert r.status_code == 200
    assert r.json()["status"] == "released"

    # Hold → Refund
    r = await ac.post("/api/escrow/hold", json={
        "provider_id": "prov-2", "amount": 50000
    }, headers=_h(token))
    esc2_id = r.json()["id"]

    r = await ac.post(f"/api/escrow/{esc2_id}/refund", headers=_h(token))
    assert r.status_code == 200
    assert r.json()["status"] == "refunded"

    # Double release → 409
    r = await ac.post("/api/escrow/hold", json={
        "provider_id": "prov-3", "amount": 10000
    }, headers=_h(token))
    esc3_id = r.json()["id"]
    await ac.post(f"/api/escrow/{esc3_id}/release", headers=_h(token))
    r = await ac.post(f"/api/escrow/{esc3_id}/release", headers=_h(token))
    assert r.status_code == 409

    # My escrows
    r = await ac.get("/api/escrow/mine", headers=_h(token))
    assert r.status_code == 200
    assert len(r.json()) == 3
