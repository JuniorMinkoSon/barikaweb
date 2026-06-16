"""Tests d'intégration de l'API (TestClient)."""
from fastapi.testclient import TestClient

from backend.api.app import app

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_families_and_sectors():
    assert len(client.get("/api/catalog/families").json()) == 8  # V1: services_domicile exclu
    logement = client.get("/api/catalog/sectors", params={"family": "logement"}).json()
    assert {s["key"] for s in logement} == {"location_villa", "location_appartement"}


def test_form_endpoint_404():
    assert client.get("/api/catalog/sectors/nope/form").status_code == 404


def test_intent_endpoint():
    r = client.post("/api/search/intent", json={"query": "je cherche une Caterpillar"})
    assert r.json()["sector"] == "location_caterpillar"


def test_quotation_endpoint_with_validation():
    r = client.post("/api/quotation", json={
        "sector": "demenagement",
        "payload": {"nb_pieces": 3},
        "validate_fields": True,
    })
    body = r.json()
    assert body["ok"] is False and "commune_depart" in body["errors"]


def test_matching_endpoint():
    r = client.post("/api/matching", json={"providers": [
        {"provider_id": 1, "price": 120000, "distance_km": 3, "note": 4.8,
         "temps_moyen_reponse_min": 15, "taux_acceptation": 0.9, "historique": 180},
        {"provider_id": 2, "price": 90000, "distance_km": 12, "note": 4.1, "historique": 30},
    ]})
    body = r.json()
    assert body["cheapest"]["provider_id"] == 2
    assert len(body["ranked"]) == 2
