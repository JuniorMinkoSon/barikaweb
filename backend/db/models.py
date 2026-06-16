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
    """Prestataire (entreprise/personne). Peut offrir plusieurs services."""
    __tablename__ = "providers"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    commune: Mapped[str] = mapped_column(String(60), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Géo : stockée, distance calculée à la demande (jamais stockée).
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    # Scoring
    average_rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    response_time_min: Mapped[float] = mapped_column(Float, default=60.0)
    acceptance_rate: Mapped[float] = mapped_column(Float, default=0.5)
    completed_jobs: Mapped[int] = mapped_column(Integer, default=0)
    cancellation_rate: Mapped[float] = mapped_column(Float, default=0.0)
    availability_score: Mapped[float] = mapped_column(Float, default=1.0)
    verification_level: Mapped[int] = mapped_column(Integer, default=0)  # 0=non vérifié, 1=email, 2=CNI, 3=pro
    premium_provider: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class ProviderService(Base):
    """Un service qu'un prestataire offre dans un secteur donné.

    Un même Provider peut avoir plusieurs ProviderService
    (ex: Villa→catalog, Chauffeur→time_based, Déménagement→quote).
    """
    __tablename__ = "provider_services"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    provider_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    sector: Mapped[str] = mapped_column(String(60), index=True, nullable=False)
    business_model: Mapped[str] = mapped_column(String(20), nullable=False)  # catalog|quote|time_based
    # Tarifs selon le modèle (per_day, per_hour, base quote…)
    base_price: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_min: Mapped[float | None] = mapped_column(Float, nullable=True)
    price_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Listing(Base):
    """Une offre concrète d'un service CATALOG (ex: 'Villa Assinie A').

    Une agence (ProviderService catalog) peut avoir plusieurs Listings.
    Le matching CATALOG se fait souvent au niveau Listing, pas Provider.
    """
    __tablename__ = "listings"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    provider_service_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    commune: Mapped[str] = mapped_column(String(60), index=True, nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    price_unit: Mapped[str] = mapped_column(String(20), default="jour")  # jour|nuit|heure|unité
    attributes: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON (piscine, wifi…)
    photos: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON list d'URLs
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class MatchingResult(Base):
    """Trace d'un résultat de matching — dataset futur pour XGBoost."""
    __tablename__ = "matching_results"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    request_id: Mapped[str | None] = mapped_column(String(32), index=True, nullable=True)
    sector: Mapped[str] = mapped_column(String(60), nullable=False)
    provider_id: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    listing_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON sous-scores
    rank: Mapped[int] = mapped_column(Integer, default=0)
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
