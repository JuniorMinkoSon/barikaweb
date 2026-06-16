"""Variables prédictives canoniques pour les modèles ML (XGBoost & co).

L'idée directrice : ce sont les *données structurées* (et non l'algorithme)
qui font la performance. On centralise ici la définition de chaque feature,
son type, sa source et les modèles qui la consomment, afin que le feature
engineering soit cohérent entre entraînement et inférence.
"""
from __future__ import annotations

from dataclasses import dataclass, asdict

# Modèles cibles
MODELS = (
    "recommendation",   # moteur de recommandation
    "matching",         # matching client ↔ fournisseur
    "conversion",       # prédiction de conversion
    "pricing",          # estimation de prix
    "fraud",            # détection de fraude
    "eta",              # estimation de délai
    "dispatch",         # dispatch livreur optimal
    "quality_score",    # scoring qualité fournisseur
)


@dataclass(frozen=True)
class Feature:
    name: str
    dtype: str            # categorical | numeric | datetime | boolean | geo
    source: str           # request | client_profile | provider_profile | context | derived
    used_by: tuple[str, ...]
    description: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


AI_FEATURES: list[Feature] = [
    Feature("commune", "categorical", "request",
            ("recommendation", "matching", "pricing", "eta", "dispatch"),
            "Commune normalisée (référentiel géo)."),
    Feature("quartier", "categorical", "request",
            ("matching", "eta", "dispatch"), "Quartier normalisé."),
    Feature("secteur", "categorical", "request",
            ("recommendation", "matching", "pricing", "conversion"), "Secteur d'activité."),
    Feature("sous_secteur", "categorical", "request",
            ("recommendation", "matching", "pricing"), "Type/variante au sein du secteur."),
    Feature("budget", "numeric", "request",
            ("matching", "pricing", "conversion", "fraud"), "Budget annoncé (FCFA)."),
    Feature("distance_km", "numeric", "derived",
            ("pricing", "eta", "dispatch", "matching"), "Distance départ→arrivée/fournisseur."),
    Feature("urgence", "categorical", "request",
            ("pricing", "dispatch", "conversion"), "normale | prioritaire | immédiate."),
    Feature("date", "datetime", "request",
            ("pricing", "conversion", "eta"), "Date souhaitée."),
    Feature("saison", "categorical", "derived",
            ("pricing", "conversion"), "Saison dérivée de la date."),
    Feature("heure", "numeric", "context",
            ("eta", "dispatch", "pricing"), "Heure de la demande."),
    Feature("jour_ferie", "boolean", "derived",
            ("pricing", "conversion", "eta"), "Jour férié / événement local."),
    Feature("meteo", "categorical", "context",
            ("eta", "dispatch", "conversion"), "Conditions météo."),
    Feature("volume", "numeric", "request",
            ("pricing", "matching", "eta"), "Volume/quantité/taille du projet."),
    Feature("historique_client", "numeric", "client_profile",
            ("recommendation", "conversion", "fraud"), "Nb commandes passées du client."),
    Feature("clv", "numeric", "client_profile",
            ("recommendation", "conversion"), "Valeur vie client estimée."),
    Feature("frequence_commandes", "numeric", "client_profile",
            ("recommendation", "conversion", "fraud"), "Fréquence de commande."),
    Feature("historique_fournisseur", "numeric", "provider_profile",
            ("matching", "quality_score"), "Volume traité par le fournisseur."),
    Feature("taux_acceptation_fournisseur", "numeric", "provider_profile",
            ("matching", "dispatch", "quality_score"), "Taux d'acceptation des demandes."),
    Feature("temps_moyen_reponse", "numeric", "provider_profile",
            ("matching", "dispatch", "quality_score", "eta"), "Temps de réponse moyen."),
    Feature("note_fournisseur", "numeric", "provider_profile",
            ("matching", "recommendation", "quality_score"), "Note moyenne (avis)."),
    Feature("nombre_avis", "numeric", "provider_profile",
            ("matching", "quality_score"), "Nombre d'avis."),
    Feature("disponibilite", "boolean", "provider_profile",
            ("matching", "dispatch"), "Disponibilité au moment de la demande."),
    Feature("revenu_estime_transaction", "numeric", "derived",
            ("pricing", "dispatch"), "Revenu estimé de la transaction."),
]

_BY_MODEL = {
    m: [f for f in AI_FEATURES if m in f.used_by] for m in MODELS
}


def features_for_model(model: str) -> list[Feature]:
    return _BY_MODEL.get(model, [])
