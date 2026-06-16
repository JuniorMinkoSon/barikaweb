"""JWT helpers — access & refresh tokens."""
import os
from datetime import datetime, timedelta, timezone

from jose import jwt

# Secret MUST venir d'une variable d'env en production.
# Read dynamically so tests can set it after import.


def _get_secret() -> str:
    secret = os.environ.get("JWT_SECRET", "")
    if not secret:
        raise RuntimeError(
            "JWT_SECRET env var is required. "
            "Set it to a secure random string (min 32 chars)."
        )
    return secret

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))


def create_access_token(sub: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": sub, "role": role, "exp": expire}, _get_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(sub: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    return jwt.encode({"sub": sub, "type": "refresh", "exp": expire}, _get_secret(), algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode & validate a token. Raises jose.JWTError on failure."""
    return jwt.decode(token, _get_secret(), algorithms=[JWT_ALGORITHM])
