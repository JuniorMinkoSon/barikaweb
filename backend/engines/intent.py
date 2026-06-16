"""Détection d'intention — barre de recherche unique « Que recherchez-vous ? ».

Approche déterministe (sans dépendance externe) : on score chaque secteur par
mots-clés/synonymes présents dans la requête, on extrait quelques entités utiles
(commune, budget, quantité, urgence) et on renvoie le meilleur candidat + des
alternatives. Conçu pour être remplaçable par un classifieur ML sans changer
l'interface publique (`detect_intent`).
"""
from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass, field as dc_field
from typing import Optional

from backend.catalog import SECTORS, family_of
from backend.catalog.geo import COMMUNES

# Mots-clés par secteur (lemmes simples, sans accents, en minuscule).
_KEYWORDS: dict[str, list[str]] = {
    "demenagement": ["demenage", "demenagement", "demenageur", "carton", "demnagement"],
    "livraison_poulets": ["poulet", "poulets", "poule", "volaille", "poussin"],
    "fleuriste": ["fleur", "fleurs", "fleuriste", "bouquet", "decoration florale"],
    "chauffeur_prive": ["chauffeur", "vtc", "taxi", "aeroport", "transfert", "conducteur"],
    "location_villa": ["villa", "villas", "residence", "maison a louer"],
    "location_appartement": ["appartement", "appart", "studio", "meuble", "logement"],
    "location_caterpillar": ["caterpillar", "engin", "pelle", "bulldozer", "chargeuse", "grue", "niveleuse"],
    "materiaux_btp": ["ciment", "sable", "gravier", "fer", "materiaux", "brique", "btp"],
    "plomberie": ["plombier", "plomberie", "fuite", "tuyau", "robinet", "debouchage", "canalisation"],
    "electricite": ["electricien", "electricite", "panne electrique", "groupe electrogene", "courant", "cablage"],
    "climatisation": ["clim", "climatisation", "climatiseur", "split", "frigorifique"],
    "mecanique_auto": ["mecanicien", "mecanique", "garage", "voiture en panne", "depannage auto", "vidange"],
    "livraison_express": ["livraison", "livrer", "colis", "coursier", "course", "document", "medicament"],
    "traiteur": ["traiteur", "repas", "buffet", "cuisine evenement", "couverts"],
    "dj_sono": ["dj", "sono", "sonorisation", "musique", "son", "animation"],
    "photographe": ["photographe", "photo", "video", "videaste", "drone", "shooting"],
    "securite_privee": ["securite", "agent de securite", "garde du corps", "vigile", "gardiennage"],
    "aide_menagere": ["menagere", "menage", "femme de menage", "nettoyage", "aide menagere"],
    "garde_enfants": ["nounou", "garde enfant", "baby sitter", "babysitter", "garderie"],
    "sante_domicile": ["infirmier", "infirmiere", "kine", "kinesitherapeute", "medecin", "soins a domicile"],
}

_URGENCE_WORDS = ["urgent", "urgence", "immediat", "tout de suite", "maintenant", "asap"]


def _norm(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", text.lower()).strip()


@dataclass
class IntentCandidate:
    sector: str
    family: Optional[str]
    score: float


@dataclass
class IntentResult:
    query: str
    sector: Optional[str]
    family: Optional[str]
    confidence: float
    candidates: list[IntentCandidate] = dc_field(default_factory=list)
    entities: dict = dc_field(default_factory=dict)


def _extract_entities(norm_query: str) -> dict:
    ent: dict = {}
    # commune
    for c in COMMUNES:
        if _norm(c.name) in norm_query:
            ent["commune"] = c.key
            break
    # budget (ex: "100 000 fcfa", "100000f")
    rest = norm_query
    m = re.search(r"(\d[\d\s.]{2,})\s*(?:fcfa|cfa|f\b|francs?)", norm_query)
    if m:
        ent["budget"] = float(re.sub(r"[\s.]", "", m.group(1)))
        rest = norm_query[:m.start()] + " " + norm_query[m.end():]
    # quantité (ex: "500 poulets") — cherchée hors du montant budget
    q = re.search(r"\b(\d{1,6})\b", rest)
    if q:
        ent["quantity"] = int(q.group(1))
    # urgence
    if any(w in norm_query for w in _URGENCE_WORDS):
        ent["urgence"] = "immédiate"
    return ent


def detect_intent(query: str, top_k: int = 3) -> IntentResult:
    nq = _norm(query)
    scores: list[IntentCandidate] = []
    for sector in SECTORS:
        kws = _KEYWORDS.get(sector.key, [])
        s = 0.0
        for kw in kws:
            if kw in nq:
                # mot-clé plus long = signal plus fort
                s += 1.0 + 0.1 * len(kw.split())
        # le libellé du secteur lui-même
        if _norm(sector.label) in nq:
            s += 1.5
        if s > 0:
            scores.append(IntentCandidate(sector.key, family_of(sector.key), round(s, 3)))

    scores.sort(key=lambda c: c.score, reverse=True)
    entities = _extract_entities(nq)

    if not scores:
        return IntentResult(query=query, sector=None, family=None,
                            confidence=0.0, candidates=[], entities=entities)

    total = sum(c.score for c in scores) or 1.0
    best = scores[0]
    confidence = round(best.score / total, 3)
    return IntentResult(
        query=query,
        sector=best.sector,
        family=best.family,
        confidence=confidence,
        candidates=scores[:top_k],
        entities=entities,
    )
