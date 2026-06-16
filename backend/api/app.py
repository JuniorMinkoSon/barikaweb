"""Application FastAPI LocaConnecté.

Lancement local :
    uvicorn backend.api.app:app --reload --port 8000
"""
from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from .routers import catalog, engines

app = FastAPI(title="LocaConnecté API", version="0.1.0")

# CORS : origines autorisées via env (jamais wildcard en prod).
_origins = os.getenv("CORS_ALLOW_ORIGINS",
                     "http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
)

_SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        for k, v in _SECURITY_HEADERS.items():
            response.headers.setdefault(k, v)
        return response


app.add_middleware(SecurityHeadersMiddleware)

app.include_router(catalog.router)
app.include_router(engines.router)


@app.get("/api/health", tags=["health"])
def health() -> dict:
    return {"status": "ok", "service": "locaconnecte-api"}
