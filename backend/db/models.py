"""Modèles SQLAlchemy — Users, Providers, ServiceRequests, Escrow."""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from backend.db.session import Base


def _uuid() -> str:
    return uuid.uuid4().hex


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    commune: Mapped[str | None] = mapped_column(String(60), nullable=True)
    role: Mapped[str] = mapped_column(String(20), default="client")  # client | provider | admin
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class Provider(Base):
    """Prestataire inscrit sur la plateforme."""
    __tablename__ = "providers"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    sector: Mapped[str] = mapped_column(String(60), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    commune: Mapped[str] = mapped_column(String(60), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    note: Mapped[float] = mapped_column(Float, default=0.0)
    nombre_avis: Mapped[int] = mapped_column(Integer, default=0)
    temps_moyen_reponse_min: Mapped[float] = mapped_column(Float, default=60.0)
    taux_acceptation: Mapped[float] = mapped_column(Float, default=0.5)
    historique: Mapped[int] = mapped_column(Integer, default=0)
    disponible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class ServiceRequest(Base):
    """Demande publiée par un client ('Publier un besoin')."""
    __tablename__ = "service_requests"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    client_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    sector: Mapped[str] = mapped_column(String(60), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    commune: Mapped[str | None] = mapped_column(String(60), nullable=True)
    urgency: Mapped[str] = mapped_column(String(20), default="normale")
    status: Mapped[str] = mapped_column(String(20), default="open")  # open | matched | closed | cancelled
    payload: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON form data
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Proposal(Base):
    """Proposition d'un prestataire en réponse à un besoin."""
    __tablename__ = "proposals"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    request_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    provider_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending | accepted | rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class EscrowPayment(Base):
    """Paiement séquestré (escrow)."""
    __tablename__ = "escrow_payments"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    request_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    client_id: Mapped[str] = mapped_column(String(32), nullable=False)
    provider_id: Mapped[str] = mapped_column(String(32), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="FCFA")
    status: Mapped[str] = mapped_column(String(20), default="held")  # held | released | refunded | disputed
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    released_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
