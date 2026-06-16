"""Async engine & session factory.

DATABASE_URL env var détermine le backend :
  - MySQL   : mysql+aiomysql://user:pass@host:3306/locaconnecte
  - SQLite  : sqlite+aiosqlite:///./locaconnecte_dev.db   (défaut local)
"""
import os
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

_DEFAULT_URL = "sqlite+aiosqlite:///./locaconnecte_dev.db"
DATABASE_URL: str = os.environ.get("DATABASE_URL", _DEFAULT_URL)

engine = create_async_engine(
    DATABASE_URL,
    echo=os.environ.get("SQL_ECHO", "").lower() in ("1", "true"),
    future=True,
)

_session_factory = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with _session_factory() as session:
        yield session
