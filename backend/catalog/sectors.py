"""Les 20 secteurs d'activité LocaConnecté, modélisés selon les données métier.

Chaque secteur décrit deux jeux de champs :
- `client_fields`  : la demande (utilisés pour le matching, le devis, la fraude),
- `provider_fields`: l'offre/capacité du fournisseur (filtrage & scoring).

Les champs marqués `feature=True` alimentent le vecteur ML (cf. ai_features).
"""
from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Optional

from .business_model import BusinessModel
from .fields import Field, select, multiselect
from .geo import commune_options

_COMMUNES = commune_options()

PricingModel = str  # "quote" | "per_km" | "per_day" | "per_hour" | "per_unit" | "fixed"


@dataclass(frozen=True)
class Sector:
    key: str
    label: str
    icon: str
    pricing_model: PricingModel
    urgency_enabled: bool
    client_fields: list[Field]
    provider_fields: list[Field]
    business_model: BusinessModel = BusinessModel.QUOTE
    commission_rate: float = 0.10
    escrow_required: bool = True
    v1_priority: bool = False  # True = focus V1

    def to_dict(self) -> dict:
        return {
            "key": self.key,
            "label": self.label,
            "icon": self.icon,
            "pricing_model": self.pricing_model,
            "urgency_enabled": self.urgency_enabled,
            "business_model": self.business_model.value,
            "commission_rate": self.commission_rate,
            "escrow_required": self.escrow_required,
            "v1_priority": self.v1_priority,
            "client_fields": [f.to_dict() for f in self.client_fields],
            "provider_fields": [f.to_dict() for f in self.provider_fields],
        }


# --- Champs réutilisables ----------------------------------------------------
def commune(key: str, label: str, **kw) -> Field:
    return Field(key=key, label=label, type="commune", options=_COMMUNES,
                 feature=True, feature_role="location", **kw)


def quartier(key: str, label: str, depends_on: str, **kw) -> Field:
    return Field(key=key, label=label, type="quartier", depends_on=depends_on,
                 feature=True, feature_role="location", **kw)


F_BUDGET = Field(key="budget", label="Budget (FCFA)", type="currency",
                 feature=True, feature_role="budget")
F_DATE = Field(key="date_souhaitee", label="Date souhaitée", type="date",
               required=True, feature=True, feature_role="date")
F_URGENCE = select("urgence", "Urgence",
                   ["normale", "prioritaire", "immédiate"],
                   feature=True, feature_role="urgency")
F_PHOTOS = Field(key="photos", label="Photos", type="photos")
F_NOTES = Field(key="notes", label="Précisions", type="textarea")
F_AVAIL = Field(key="disponibilites", label="Disponibilités", type="textarea",
                feature=True, feature_role="availability")
F_ZONES = Field(key="zones_couvertes", label="Zones couvertes", type="multiselect",
                options=_COMMUNES, feature=True, feature_role="location")


SECTORS: list[Sector] = [
    # 1 ----------------------------------------------------------------------
    Sector(
        key="demenagement", label="Déménagement", icon="truck",
        pricing_model="quote", urgency_enabled=True,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=True,
        client_fields=[
            commune("commune_depart", "Commune départ", required=True),
            quartier("quartier_depart", "Quartier départ", "commune_depart"),
            commune("commune_arrivee", "Commune arrivée", required=True),
            quartier("quartier_arrivee", "Quartier arrivée", "commune_arrivee"),
            select("type_logement_depart", "Type logement départ",
                   ["studio", "appartement", "villa", "bureau", "magasin"]),
            select("type_logement_arrivee", "Type logement arrivée",
                   ["studio", "appartement", "villa", "bureau", "magasin"]),
            Field(key="etage_depart", label="Étage départ", type="integer", min=0),
            Field(key="etage_arrivee", label="Étage arrivée", type="integer", min=0),
            Field(key="ascenseur", label="Ascenseur disponible", type="boolean"),
            Field(key="nb_pieces", label="Nombre de pièces", type="integer", min=1,
                  feature=True, feature_role="volume"),
            Field(key="nb_cartons", label="Nombre de cartons", type="integer", min=0,
                  feature=True, feature_role="volume"),
            Field(key="nb_meubles", label="Nombre de meubles", type="integer", min=0,
                  feature=True, feature_role="volume"),
            Field(key="volume_estime", label="Volume estimé (m³)", type="number",
                  unit="m³", min=0, feature=True, feature_role="volume"),
            Field(key="meubles_lourds", label="Meubles lourds", type="boolean"),
            Field(key="electromenager", label="Électroménager", type="boolean"),
            F_DATE, F_URGENCE, F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            select("taille_camion", "Taille camion",
                   ["3m³", "8m³", "12m³", "20m³", "30m³"], feature=True,
                   feature_role="capacity"),
            Field(key="nb_demenageurs", label="Nombre de déménageurs",
                  type="integer", min=1, feature=True, feature_role="capacity"),
            F_ZONES,
            Field(key="prix_km", label="Prix / km (FCFA)", type="currency"),
            Field(key="prix_minimum", label="Prix minimum (FCFA)", type="currency"),
            F_AVAIL,
        ],
    ),
    # 2 ----------------------------------------------------------------------
    Sector(
        key="livraison_poulets", label="Livraison de poulets", icon="drumstick",
        pricing_model="per_unit", urgency_enabled=True,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=False,
        client_fields=[
            select("type_produit", "Type produit",
                   ["poulet vivant", "poulet abattu"], required=True,
                   feature=True, feature_role="category"),
            Field(key="quantite", label="Quantité", type="integer", min=1,
                  required=True, feature=True, feature_role="volume"),
            Field(key="poids_kg", label="Poids (kg)", type="number", unit="kg",
                  feature=True, feature_role="volume"),
            Field(key="livraison_immediate", label="Livraison immédiate",
                  type="boolean", feature=True, feature_role="urgency"),
            commune("commune_depart", "Adresse départ", required=True),
            commune("commune_arrivee", "Adresse arrivée", required=True),
            F_NOTES,
        ],
        provider_fields=[
            Field(key="capacite_journaliere", label="Capacité journalière",
                  type="integer", feature=True, feature_role="capacity"),
            Field(key="stock_disponible", label="Stock disponible", type="integer",
                  feature=True, feature_role="availability"),
            select("type_vehicule", "Type de véhicule",
                   ["moto", "tricycle", "voiture", "camionnette réfrigérée"]),
            F_ZONES,
        ],
    ),
    # 3 ----------------------------------------------------------------------
    Sector(
        key="fleuriste", label="Fleuriste événementiel", icon="flower",
        pricing_model="quote", urgency_enabled=False,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=False,
        client_fields=[
            select("type_evenement", "Type d'événement",
                   ["mariage", "funérailles", "anniversaire", "baptême", "conférence"],
                   required=True, feature=True, feature_role="category"),
            Field(key="nb_invites", label="Nombre d'invités", type="integer", min=1,
                  feature=True, feature_role="volume"),
            Field(key="nb_bouquets", label="Nombre de bouquets", type="integer", min=1,
                  feature=True, feature_role="volume"),
            F_BUDGET,
            Field(key="couleurs", label="Couleur dominante", type="text"),
            commune("commune", "Lieu", required=True),
            Field(key="adresse_livraison", label="Adresse de livraison", type="text"),
            F_DATE,
            Field(key="heure_livraison", label="Heure de livraison", type="time"),
            Field(key="message", label="Message personnalisé", type="textarea"),
            F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            multiselect("types_fleurs", "Types de fleurs",
                        ["roses", "orchidées", "tournesols", "lys", "tropicales", "artificielles"]),
            Field(key="stock", label="Stock", type="integer",
                  feature=True, feature_role="availability"),
            Field(key="livraison", label="Livraison", type="boolean"),
            Field(key="decoration_sur_site", label="Décoration sur site", type="boolean"),
            F_ZONES,
        ],
    ),
    # 4 ----------------------------------------------------------------------
    Sector(
        key="chauffeur_prive", label="Chauffeur privé", icon="car-front",
        pricing_model="per_hour", urgency_enabled=True,
        business_model=BusinessModel.TIME_BASED, commission_rate=0.15, escrow_required=True, v1_priority=True,
        client_fields=[
            select("motif", "Motif",
                   ["aéroport", "mariage", "tourisme", "mission entreprise", "VIP"],
                   required=True, feature=True, feature_role="category"),
            Field(key="nb_passagers", label="Nombre de passagers", type="integer",
                  min=1, feature=True, feature_role="capacity"),
            Field(key="bagages", label="Bagages", type="integer", min=0),
            Field(key="avec_chauffeur", label="Avec chauffeur", type="boolean"),
            Field(key="duree_heures", label="Durée (heures)", type="number",
                  unit="h", feature=True, feature_role="duration"),
            commune("commune", "Zone", required=True),
            Field(key="lieu_depart", label="Lieu de départ", type="text"),
            Field(key="lieu_retour", label="Lieu de retour", type="text"),
            F_DATE,
            Field(key="date_fin", label="Date de fin", type="date",
                  feature=True, feature_role="date"),
            Field(key="permis", label="Permis de conduire", type="photos"),
            F_URGENCE, F_NOTES,
        ],
        provider_fields=[
            multiselect("langues", "Langues",
                        ["français", "anglais", "espagnol", "arabe", "dioula", "baoulé"]),
            select("type_vehicule", "Type véhicule",
                   ["berline", "SUV", "van", "minibus", "luxe"], feature=True,
                   feature_role="capacity"),
            Field(key="climatisation", label="Climatisation", type="boolean"),
            Field(key="wifi", label="Wifi", type="boolean"),
            F_AVAIL,
        ],
    ),
    # 5 ----------------------------------------------------------------------
    Sector(
        key="location_villa", label="Location villa", icon="home",
        pricing_model="per_day", urgency_enabled=False,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=True,
        client_fields=[
            commune("commune", "Commune", required=True),
            quartier("quartier", "Quartier", "commune"),
            F_BUDGET,
            Field(key="piscine", label="Piscine", type="boolean"),
            Field(key="wifi", label="Wifi", type="boolean"),
            Field(key="climatisation", label="Climatisation", type="boolean"),
            Field(key="generateur", label="Générateur", type="boolean"),
            Field(key="nb_adultes", label="Nombre d'adultes", type="integer", min=1,
                  feature=True, feature_role="capacity"),
            Field(key="nb_enfants", label="Nombre d'enfants", type="integer", min=0,
                  feature=True, feature_role="capacity"),
            Field(key="nb_personnes", label="Nombre de personnes", type="integer",
                  min=1, feature=True, feature_role="capacity"),
            Field(key="duree_jours", label="Durée (jours)", type="integer", min=1,
                  feature=True, feature_role="duration"),
            Field(key="date_arrivee", label="Date d'arrivée", type="date",
                  required=True, feature=True, feature_role="date"),
            Field(key="date_depart", label="Date de départ", type="date",
                  feature=True, feature_role="date"),
            Field(key="heure_arrivee", label="Heure estimée d'arrivée", type="time"),
            Field(key="demandes", label="Demandes particulières", type="textarea"),
            F_NOTES,
        ],
        provider_fields=[
            Field(key="capacite", label="Capacité (personnes)", type="integer",
                  feature=True, feature_role="capacity"),
            multiselect("equipements", "Équipements",
                        ["piscine", "wifi", "générateur", "climatisation", "parking", "sécurité"]),
            F_AVAIL,
            Field(key="prix_saisonnier", label="Prix saisonnier (FCFA/jour)", type="currency"),
        ],
    ),
    # 6 ----------------------------------------------------------------------
    Sector(
        key="location_appartement", label="Location appartement", icon="building",
        pricing_model="per_day", urgency_enabled=False,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=True,
        client_fields=[
            select("type", "Type",
                   ["studio", "meublé", "non meublé"], required=True,
                   feature=True, feature_role="category"),
            select("sejour", "Durée séjour",
                   ["court séjour", "long séjour"], feature=True, feature_role="duration"),
            commune("commune", "Commune", required=True),
            quartier("quartier", "Quartier", "commune"),
            F_BUDGET, F_DATE, F_NOTES,
        ],
        provider_fields=[
            Field(key="charges_incluses", label="Charges incluses", type="boolean"),
            Field(key="parking", label="Parking", type="boolean"),
            Field(key="securite", label="Sécurité", type="boolean"),
            Field(key="internet", label="Internet", type="boolean"),
            F_AVAIL,
        ],
    ),
    # 7 ----------------------------------------------------------------------
    Sector(
        key="location_caterpillar", label="Location Caterpillar (engins BTP)",
        icon="construction", pricing_model="per_day", urgency_enabled=True,
        business_model=BusinessModel.CATALOG, commission_rate=0.12, escrow_required=True, v1_priority=True,
        client_fields=[
            select("type_engin", "Type engin",
                   ["pelle", "chargeuse", "bulldozer", "niveleuse", "compacteur", "grue"],
                   required=True, feature=True, feature_role="category"),
            Field(key="chantier", label="Type de chantier", type="text"),
            commune("region", "Région", required=True),
            Field(key="adresse_chantier", label="Adresse chantier", type="text"),
            Field(key="duree_jours", label="Durée (jours)", type="integer", min=1,
                  feature=True, feature_role="duration"),
            Field(key="nb_heures", label="Nombre d'heures / jour", type="number",
                  unit="h", min=1, feature=True, feature_role="duration"),
            Field(key="avec_operateur", label="Opérateur nécessaire", type="boolean"),
            F_DATE,
            Field(key="date_fin", label="Date fin estimée", type="date",
                  feature=True, feature_role="date"),
            F_NOTES,
        ],
        provider_fields=[
            Field(key="modele", label="Modèle", type="text"),
            Field(key="annee", label="Année", type="integer"),
            F_AVAIL,
            Field(key="consommation_carburant", label="Consommation carburant (L/h)",
                  type="number", unit="L/h"),
        ],
    ),
    # 8 ----------------------------------------------------------------------
    Sector(
        key="materiaux_btp", label="Livraison matériaux BTP", icon="package",
        pricing_model="per_unit", urgency_enabled=True,
        business_model=BusinessModel.CATALOG, commission_rate=0.08, escrow_required=True, v1_priority=False,
        client_fields=[
            multiselect("materiaux", "Matériaux",
                        ["ciment", "sable", "gravier", "fer"], required=True,
                        feature=True, feature_role="category"),
            Field(key="quantite", label="Quantité", type="number",
                  feature=True, feature_role="volume"),
            commune("commune", "Zone de livraison", required=True),
            F_DATE, F_URGENCE, F_NOTES,
        ],
        provider_fields=[
            Field(key="stock", label="Stock", type="number",
                  feature=True, feature_role="availability"),
            Field(key="camions", label="Nombre de camions", type="integer",
                  feature=True, feature_role="capacity"),
            F_ZONES,
        ],
    ),
    # 9 ----------------------------------------------------------------------
    Sector(
        key="plomberie", label="Plomberie", icon="wrench",
        pricing_model="quote", urgency_enabled=True,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=False,
        client_fields=[
            select("intervention", "Intervention",
                   ["fuite", "installation", "débouchage"], required=True,
                   feature=True, feature_role="category"),
            F_URGENCE,
            commune("commune", "Zone", required=True),
            quartier("quartier", "Quartier", "commune"),
            F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            Field(key="temps_intervention", label="Temps d'intervention (min)",
                  type="integer", unit="min", feature=True, feature_role="availability"),
            F_ZONES,
            Field(key="certification", label="Certification", type="text",
                  feature=True, feature_role="quality"),
        ],
    ),
    # 10 ---------------------------------------------------------------------
    Sector(
        key="electricite", label="Électricité", icon="zap",
        pricing_model="quote", urgency_enabled=True,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=False,
        client_fields=[
            select("intervention", "Intervention",
                   ["panne", "installation", "groupe électrogène"], required=True,
                   feature=True, feature_role="category"),
            F_URGENCE,
            commune("commune", "Zone", required=True),
            F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            Field(key="habilitations", label="Habilitations", type="text",
                  feature=True, feature_role="quality"),
            F_AVAIL,
            F_ZONES,
        ],
    ),
    # 11 ---------------------------------------------------------------------
    Sector(
        key="climatisation", label="Climatisation", icon="snowflake",
        pricing_model="quote", urgency_enabled=True,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=False,
        client_fields=[
            select("intervention", "Intervention",
                   ["installation", "réparation", "entretien"], required=True,
                   feature=True, feature_role="category"),
            commune("commune", "Zone", required=True),
            F_URGENCE, F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            multiselect("marques", "Marques maîtrisées",
                        ["LG", "Samsung", "Daikin", "Midea", "Hisense", "autres"]),
            Field(key="delai", label="Délai d'intervention (h)", type="integer",
                  unit="h", feature=True, feature_role="availability"),
            F_ZONES,
        ],
    ),
    # 12 ---------------------------------------------------------------------
    Sector(
        key="mecanique_auto", label="Mécanique automobile", icon="car",
        pricing_model="quote", urgency_enabled=True,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=False,
        client_fields=[
            select("panne", "Type de panne",
                   ["moteur", "freins", "batterie", "pneus", "diagnostic", "autre"],
                   required=True, feature=True, feature_role="category"),
            Field(key="marque", label="Marque", type="text"),
            Field(key="modele", label="Modèle", type="text"),
            Field(key="position_gps", label="Localisation GPS", type="gps",
                  feature=True, feature_role="location"),
            F_URGENCE, F_PHOTOS, F_NOTES,
        ],
        provider_fields=[
            Field(key="garage_mobile", label="Garage mobile", type="boolean"),
            Field(key="depannage", label="Dépannage", type="boolean"),
            F_ZONES,
        ],
    ),
    # 13 ---------------------------------------------------------------------
    Sector(
        key="livraison_express", label="Livraison express", icon="send",
        pricing_model="per_km", urgency_enabled=True,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=False,
        client_fields=[
            select("type_colis", "Type",
                   ["document", "colis", "médicament", "alimentaire"], required=True,
                   feature=True, feature_role="category"),
            commune("commune_depart", "Adresse départ", required=True),
            commune("commune_arrivee", "Adresse arrivée", required=True),
            F_URGENCE, F_NOTES,
        ],
        provider_fields=[
            select("vehicule", "Véhicule",
                   ["moto", "voiture", "camion"], required=True, feature=True,
                   feature_role="capacity"),
            F_ZONES,
        ],
    ),
    # 14 ---------------------------------------------------------------------
    Sector(
        key="traiteur", label="Traiteur", icon="utensils",
        pricing_model="per_unit", urgency_enabled=False,
        business_model=BusinessModel.QUOTE, commission_rate=0.12, escrow_required=True, v1_priority=False,
        client_fields=[
            Field(key="nb_invites", label="Nombre d'invités", type="integer", min=1,
                  required=True, feature=True, feature_role="volume"),
            select("type_evenement", "Type événement",
                   ["mariage", "anniversaire", "conférence", "funérailles", "entreprise"],
                   feature=True, feature_role="category"),
            F_BUDGET,
            commune("commune", "Lieu", required=True),
            F_DATE, F_NOTES,
        ],
        provider_fields=[
            multiselect("menus", "Menus",
                        ["ivoirien", "international", "halal", "végétarien", "cocktail"]),
            Field(key="capacite", label="Capacité (couverts)", type="integer",
                  feature=True, feature_role="capacity"),
            F_AVAIL,
        ],
    ),
    # 15 ---------------------------------------------------------------------
    Sector(
        key="dj_sono", label="DJ / Sonorisation", icon="music",
        pricing_model="quote", urgency_enabled=False,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=False,
        client_fields=[
            select("type_evenement", "Type événement",
                   ["mariage", "concert", "conférence"], required=True,
                   feature=True, feature_role="category"),
            Field(key="nb_invites", label="Nombre d'invités", type="integer",
                  feature=True, feature_role="volume"),
            commune("commune", "Lieu", required=True),
            F_DATE, F_BUDGET, F_NOTES,
        ],
        provider_fields=[
            Field(key="puissance_materiel", label="Puissance matériel (W)",
                  type="integer", unit="W", feature=True, feature_role="capacity"),
            Field(key="deplacement", label="Déplacement inclus", type="boolean"),
            F_ZONES,
        ],
    ),
    # 16 ---------------------------------------------------------------------
    Sector(
        key="photographe", label="Photographe / Vidéaste", icon="camera",
        pricing_model="quote", urgency_enabled=False,
        business_model=BusinessModel.CATALOG, commission_rate=0.10, escrow_required=True, v1_priority=False,
        client_fields=[
            multiselect("prestations", "Prestations",
                        ["photos", "vidéo", "drone"], required=True, feature=True,
                        feature_role="category"),
            select("type_evenement", "Événement",
                   ["mariage", "anniversaire", "corporate", "produit", "autre"]),
            commune("commune", "Lieu", required=True),
            F_DATE, F_BUDGET, F_NOTES,
        ],
        provider_fields=[
            Field(key="portfolio_url", label="Portfolio (URL)", type="text",
                  feature=True, feature_role="quality"),
            multiselect("materiel", "Matériel",
                        ["reflex", "hybride", "drone", "stabilisateur", "éclairage studio"]),
            F_AVAIL,
        ],
    ),
    # 17 ---------------------------------------------------------------------
    Sector(
        key="securite_privee", label="Sécurité privée", icon="shield",
        pricing_model="per_hour", urgency_enabled=True,
        business_model=BusinessModel.TIME_BASED, commission_rate=0.15, escrow_required=True, v1_priority=False,
        client_fields=[
            Field(key="nb_agents", label="Nombre d'agents", type="integer", min=1,
                  required=True, feature=True, feature_role="capacity"),
            Field(key="duree_mission_h", label="Durée mission (heures)", type="number",
                  unit="h", feature=True, feature_role="duration"),
            commune("commune", "Lieu", required=True),
            F_DATE, F_URGENCE, F_NOTES,
        ],
        provider_fields=[
            Field(key="agents_certifies", label="Agents certifiés", type="boolean",
                  feature=True, feature_role="quality"),
            select("armement", "Armement",
                   ["non armés", "armés"], feature=True, feature_role="category"),
            F_ZONES,
        ],
    ),
    # NOTE V1 : Santé à domicile, Garde d'enfants et Aide ménagère sont
    # exclus du lancement (réglementation, assurance, responsabilité civile,
    # vérifications professionnelles). À réintroduire en V2 si pertinent.
]

_BY_KEY = {s.key: s for s in SECTORS}


def get_sector(key: str) -> Optional[Sector]:
    return _BY_KEY.get(key)


def sector_keys() -> list[str]:
    return [s.key for s in SECTORS]
