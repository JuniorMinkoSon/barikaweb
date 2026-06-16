"""Tests auth: register, login, refresh, me, RBAC."""
import os

# Set JWT_SECRET before importing anything that triggers auth module.
os.environ.setdefault("JWT_SECRET", "test-secret-for-auth-min-32-chars!!")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.api.app import app
from backend.db.session import Base, engine

pytestmark = pytest.mark.asyncio(loop_scope="module")


@pytest_asyncio.fixture(loop_scope="module")
async def client():
    # Fresh DB for each test module
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def test_register_and_login(client: AsyncClient):
    # Register
    r = await client.post("/api/auth/register", json={
        "email": "test@loca.ci",
        "password": "Secure1234!",
        "name": "Aminata Test",
        "phone": "+2250700000001",
        "commune": "cocody",
    })
    assert r.status_code == 201, r.text
    tokens = r.json()
    assert "access_token" in tokens and "refresh_token" in tokens

    # Login
    r = await client.post("/api/auth/login", json={
        "email": "test@loca.ci",
        "password": "Secure1234!",
    })
    assert r.status_code == 200
    tokens2 = r.json()
    assert tokens2["access_token"]

    # Me
    r = await client.get("/api/auth/me", headers={
        "Authorization": f"Bearer {tokens2['access_token']}"
    })
    assert r.status_code == 200
    me = r.json()
    assert me["email"] == "test@loca.ci"
    assert me["role"] == "client"


async def test_register_duplicate(client: AsyncClient):
    await client.post("/api/auth/register", json={
        "email": "dup@loca.ci", "password": "abc123", "name": "Dup"
    })
    r = await client.post("/api/auth/register", json={
        "email": "dup@loca.ci", "password": "abc123", "name": "Dup"
    })
    assert r.status_code == 409


async def test_login_wrong_password(client: AsyncClient):
    await client.post("/api/auth/register", json={
        "email": "wrong@loca.ci", "password": "good", "name": "W"
    })
    r = await client.post("/api/auth/login", json={
        "email": "wrong@loca.ci", "password": "bad"
    })
    assert r.status_code == 401


async def test_refresh(client: AsyncClient):
    r = await client.post("/api/auth/register", json={
        "email": "refresh@loca.ci", "password": "p", "name": "R"
    })
    refresh_token = r.json()["refresh_token"]
    r = await client.post("/api/auth/refresh", json={
        "refresh_token": refresh_token
    })
    assert r.status_code == 200
    assert "access_token" in r.json()


async def test_me_unauthenticated(client: AsyncClient):
    r = await client.get("/api/auth/me")
    assert r.status_code == 401
