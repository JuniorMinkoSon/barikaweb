"""Moteurs métier universels de LocaConnecté.

Ces moteurs sont la valeur centrale de la plateforme : un socle unique qui
gère n'importe quel secteur (déménagement, villa, poulets, Caterpillar…) avec
la même expérience.

- forms      : Dynamic Forms Engine (schéma + validation pilotés par le catalog)
- intent     : détection d'intention pour la barre de recherche unique
- quotation  : devis intelligents (fourchette de prix par secteur)
- matching   : score de matching + classement des prestataires (XGBoost-ready)
"""
from .forms import get_form, validate_submission, FormError
from .intent import detect_intent, IntentResult
from .quotation import estimate_quote, Quote
from .matching import rank_providers, ProviderScore, Ranker, HeuristicRanker
from .availability import month_availability, capacity_type, default_capacity

__all__ = [
    "get_form",
    "validate_submission",
    "FormError",
    "detect_intent",
    "IntentResult",
    "estimate_quote",
    "Quote",
    "month_availability",
    "capacity_type",
    "default_capacity",
    "rank_providers",
    "ProviderScore",
    "Ranker",
    "HeuristicRanker",
]
