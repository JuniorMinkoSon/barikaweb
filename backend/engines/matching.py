"""Matching + Provider Ranking Engine.

Produit un `matching_score` unique et transparent par prestataire à partir des
signaux métier (distance, prix, note, temps de réponse, taux d'acceptation,
historique, disponibilité), puis classe les prestataires.

Architecture pensée pour le ML : `Ranker` est une interface ; `HeuristicRanker`
est l'implémentation par défaut (transparente, sans entraînement), et
`XGBoostRanker` peut la remplacer dès qu'un modèle `XGBoostRanker` est entraîné,
sans changer l'appelant.
"""
from __future__ import annotations

import math
from abc import ABC, abstractmethod
from dataclasses import dataclass, field as dc_field
from typing import Optional

# Poids par défaut du score (somme = 1.0)
DEFAULT_WEIGHTS: dict[str, float] = {
    "distance": 0.20,
    "price": 0.20,
    "note": 0.20,
    "response": 0.10,
    "acceptance": 0.10,
    "history": 0.10,
    "availability": 0.10,
}


@dataclass
class Provider:
    provider_id: int
    price: float = 0.0
    distance_km: float = 0.0
    note: float = 0.0                 # 0..5
    nombre_avis: int = 0
    temps_moyen_reponse_min: float = 60.0
    taux_acceptation: float = 0.5     # 0..1
    historique: int = 0               # nb prestations terminées
    disponibilite: bool = True
    meta: dict = dc_field(default_factory=dict)


@dataclass
class ProviderScore:
    provider_id: int
    score: float
    rank: int = 0
    breakdown: dict = dc_field(default_factory=dict)
    provider: Optional[Provider] = None


def _clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def _minmax_inverse(value: float, lo: float, hi: float) -> float:
    """1.0 pour le moins cher, 0.0 pour le plus cher (robuste si lo==hi)."""
    if hi <= lo:
        return 1.0
    return _clamp01(1.0 - (value - lo) / (hi - lo))


class Ranker(ABC):
    @abstractmethod
    def rank(self, providers: list[Provider], weights: Optional[dict] = None) -> list[ProviderScore]:
        ...


class HeuristicRanker(Ranker):
    """Score pondéré transparent. Sert aussi de baseline / fallback ML."""

    def rank(self, providers: list[Provider], weights: Optional[dict] = None) -> list[ProviderScore]:
        if not providers:
            return []
        w = {**DEFAULT_WEIGHTS, **(weights or {})}
        prices = [p.price for p in providers if p.price > 0]
        plo, phi = (min(prices), max(prices)) if prices else (0.0, 0.0)

        scored: list[ProviderScore] = []
        for p in providers:
            sub = {
                "distance": _clamp01(1.0 / (1.0 + p.distance_km / 5.0)),
                "price": _minmax_inverse(p.price, plo, phi) if p.price > 0 else 0.5,
                "note": _clamp01(p.note / 5.0),
                "response": _clamp01(1.0 / (1.0 + p.temps_moyen_reponse_min / 30.0)),
                "acceptance": _clamp01(p.taux_acceptation),
                "history": _clamp01(math.log1p(max(p.historique, 0)) / math.log1p(100)),
                "availability": 1.0 if p.disponibilite else 0.0,
            }
            score = sum(w[k] * sub[k] for k in w)
            scored.append(ProviderScore(
                provider_id=p.provider_id,
                score=round(score, 4),
                breakdown={k: round(v, 3) for k, v in sub.items()},
                provider=p,
            ))
        scored.sort(key=lambda s: s.score, reverse=True)
        for i, s in enumerate(scored, 1):
            s.rank = i
        return scored


class XGBoostRanker(Ranker):
    """Classement par modèle XGBoost entraîné (optionnel).

    Charge un modèle si `model_path` est fourni et xgboost disponible ; sinon
    retombe automatiquement sur le HeuristicRanker. L'interface reste identique.
    """

    def __init__(self, model_path: Optional[str] = None):
        self.model = None
        self._fallback = HeuristicRanker()
        if model_path:
            try:  # import paresseux : xgboost n'est pas une dépendance dure
                import xgboost  # type: ignore

                self.model = xgboost.Booster()
                self.model.load_model(model_path)
            except Exception:
                self.model = None

    def rank(self, providers: list[Provider], weights: Optional[dict] = None) -> list[ProviderScore]:
        if self.model is None:
            return self._fallback.rank(providers, weights)
        import numpy as np  # type: ignore
        import xgboost  # type: ignore

        feats = np.array([[p.distance_km, p.price, p.note, p.nombre_avis,
                           p.temps_moyen_reponse_min, p.taux_acceptation,
                           p.historique, 1.0 if p.disponibilite else 0.0]
                          for p in providers], dtype=float)
        preds = self.model.predict(xgboost.DMatrix(feats))
        scored = [ProviderScore(provider_id=p.provider_id, score=float(s), provider=p)
                  for p, s in zip(providers, preds)]
        scored.sort(key=lambda s: s.score, reverse=True)
        for i, s in enumerate(scored, 1):
            s.rank = i
        return scored


_DEFAULT_RANKER = HeuristicRanker()


def rank_providers(providers: list[Provider], ranker: Optional[Ranker] = None,
                   weights: Optional[dict] = None) -> list[ProviderScore]:
    return (ranker or _DEFAULT_RANKER).rank(providers, weights)


def comparator(scored: list[ProviderScore]) -> dict:
    """Buckets prêts pour l'UI : Top 3, moins cher, meilleur rapport, premium."""
    if not scored:
        return {"top3": [], "cheapest": None, "best_value": None, "premium": None}
    with_price = [s for s in scored if s.provider and s.provider.price > 0]
    cheapest = min(with_price, key=lambda s: s.provider.price) if with_price else None
    premium = max(scored, key=lambda s: (s.provider.note if s.provider else 0))
    best_value = scored[0]  # meilleur score global = meilleur rapport qualité/prix
    return {
        "top3": scored[:3],
        "cheapest": cheapest,
        "best_value": best_value,
        "premium": premium,
    }
