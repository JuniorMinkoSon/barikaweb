"""Tests des moteurs universels + référentiel métier."""
import pytest

from backend.catalog import SECTORS, FAMILIES, family_of, sector_keys, find_commune
from backend.engines import detect_intent, estimate_quote, validate_submission, FormError
from backend.engines.forms import get_form
from backend.engines.matching import Provider, rank_providers, comparator


def test_catalog_integrity():
    assert len(SECTORS) == 20
    assert len(FAMILIES) == 9
    covered = [s for f in FAMILIES for s in f.sectors]
    assert sorted(covered) == sorted(sector_keys())
    assert len(covered) == len(set(covered))  # un secteur = une famille
    assert find_commune("PORT-BOUËT").key == "port-bouet"


def test_form_schema_per_sector():
    for s in SECTORS:
        f = get_form(s.key, "client")
        assert f.fields and f.family == family_of(s.key)
        keys = [fld["key"] for fld in f.fields]
        assert len(keys) == len(set(keys))


def test_validation_required_and_options():
    with pytest.raises(FormError) as exc:
        validate_submission("demenagement", {"nb_pieces": 0})
    assert "commune_depart" in exc.value.errors
    assert "nb_pieces" in exc.value.errors

    clean = validate_submission("demenagement", {
        "commune_depart": "Cocody", "commune_arrivee": "Marcory",
        "nb_pieces": 4, "date_souhaitee": "2026-07-01",
    })
    assert clean["commune_depart"] == "cocody"


@pytest.mark.parametrize("query,expected", [
    ("Je veux louer une villa à Assinie", "location_villa"),
    ("Je cherche un déménageur", "demenagement"),
    ("Je veux livrer 500 poulets", "livraison_poulets"),
    ("Je cherche une Caterpillar", "location_caterpillar"),
    ("Je cherche un DJ", "dj_sono"),
])
def test_intent_detection(query, expected):
    r = detect_intent(query)
    assert r.sector == expected


def test_intent_entities():
    r = detect_intent("déménagement à Cocody budget 100 000 fcfa")
    assert r.entities.get("commune") == "cocody"
    assert r.entities.get("budget") == 100000.0


def test_quote_demenagement_range():
    q = estimate_quote("demenagement", {"nb_pieces": 4, "nb_cartons": 30})
    assert q.price_min > 0 and q.price_max > q.price_min
    assert "volume_m3" in q.estimated


def test_quote_unknown_sector():
    q = estimate_quote("inconnu", {})
    assert q.confidence == "indisponible"


def test_ranking_and_comparator():
    provs = [
        Provider(1, price=120000, distance_km=3, note=4.8, temps_moyen_reponse_min=15,
                 taux_acceptation=0.9, historique=180),
        Provider(2, price=90000, distance_km=12, note=4.1, historique=30),
        Provider(3, price=160000, distance_km=1, note=5.0, temps_moyen_reponse_min=8,
                 taux_acceptation=0.95, historique=400),
    ]
    scored = rank_providers(provs)
    assert [s.rank for s in scored] == [1, 2, 3]
    assert all(0 <= s.score <= 1 for s in scored)
    comp = comparator(scored)
    assert comp["cheapest"].provider_id == 2
    assert comp["premium"].provider_id == 3
    assert len(comp["top3"]) == 3
