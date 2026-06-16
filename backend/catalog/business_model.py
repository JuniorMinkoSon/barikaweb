"""BusinessModel: les 3 workflows métier de LocaConnecté.

CATALOG — recherche → réservation → paiement → confirmation
  (villas, appartements, véhicules, caterpillar, matériaux BTP, fleuristes, DJ, photographes)

QUOTE — description du besoin → devis → acceptation → paiement → réalisation
  (déménagement, plomberie, électricité, climatisation, mécanique, traiteur, sécurité)

TIME_BASED — réservation → début mission → fin mission → validation durée → facturation
  (chauffeur à l'heure, sécurité horaire, ménage)
"""
from enum import Enum


class BusinessModel(str, Enum):
    CATALOG = "catalog"
    QUOTE = "quote"
    TIME_BASED = "time_based"
