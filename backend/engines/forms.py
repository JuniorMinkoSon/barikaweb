"""Dynamic Forms Engine.

Le formulaire n'est jamais codé en dur : on charge le schéma du secteur depuis
`backend.catalog` et on valide les soumissions contre ce schéma. La même
définition sert au rendu React et à la validation serveur (cohérence garantie).
"""
from __future__ import annotations

from dataclasses import dataclass, field as dc_field
from datetime import date as _date, datetime
from typing import Any, Optional

from backend.catalog import get_sector, family_of
from backend.catalog.fields import Field
from backend.catalog.geo import find_commune


class FormError(ValueError):
    """Erreurs de validation par champ : {field_key: message}."""

    def __init__(self, errors: dict[str, str]):
        self.errors = errors
        super().__init__(f"{len(errors)} champ(s) invalide(s)")


@dataclass
class FormSchema:
    sector: str
    family: Optional[str]
    label: str
    pricing_model: str
    urgency_enabled: bool
    fields: list[dict]
    audience: str  # "client" | "provider"


def get_form(sector_key: str, audience: str = "client") -> FormSchema:
    sector = get_sector(sector_key)
    if sector is None:
        raise FormError({"sector": f"secteur inconnu: {sector_key}"})
    if audience not in ("client", "provider"):
        raise FormError({"audience": "doit être 'client' ou 'provider'"})
    fields = sector.client_fields if audience == "client" else sector.provider_fields
    return FormSchema(
        sector=sector.key,
        family=family_of(sector.key),
        label=sector.label,
        pricing_model=sector.pricing_model,
        urgency_enabled=sector.urgency_enabled,
        fields=[f.to_dict() for f in fields],
        audience=audience,
    )


# --- Validation --------------------------------------------------------------
def _coerce(field: Field, value: Any) -> Any:
    t = field.type
    if t in ("integer",):
        return int(value)
    if t in ("number", "currency"):
        return float(value)
    if t == "boolean":
        if isinstance(value, bool):
            return value
        return str(value).strip().lower() in ("1", "true", "oui", "yes", "on")
    if t in ("date",):
        if isinstance(value, (_date, datetime)):
            return value.isoformat()
        datetime.fromisoformat(str(value))  # validation
        return str(value)
    if t in ("commune",):
        c = find_commune(str(value))
        if c is None:
            raise ValueError("commune inconnue")
        return c.key
    if t in ("multiselect",):
        if not isinstance(value, (list, tuple)):
            raise ValueError("liste attendue")
        return list(value)
    return value


def validate_submission(
    sector_key: str, payload: dict, audience: str = "client"
) -> dict:
    """Valide et normalise une soumission. Lève FormError si invalide."""
    sector = get_sector(sector_key)
    if sector is None:
        raise FormError({"sector": f"secteur inconnu: {sector_key}"})
    fields = sector.client_fields if audience == "client" else sector.provider_fields

    errors: dict[str, str] = {}
    cleaned: dict[str, Any] = {}

    for f in fields:
        raw = payload.get(f.key, None)
        present = raw not in (None, "", [], {})
        if not present:
            if f.required:
                errors[f.key] = "champ requis"
            continue
        try:
            val = _coerce(f, raw)
        except (ValueError, TypeError):
            errors[f.key] = f"valeur invalide pour le type {f.type}"
            continue

        if f.options and f.type in ("select",) and val not in f.options:
            errors[f.key] = "valeur hors liste"
            continue
        if f.options and f.type == "multiselect":
            bad = [v for v in val if v not in f.options]
            if bad:
                errors[f.key] = f"valeurs hors liste: {bad}"
                continue
        if f.min is not None and isinstance(val, (int, float)) and val < f.min:
            errors[f.key] = f"minimum {f.min}"
            continue
        if f.max is not None and isinstance(val, (int, float)) and val > f.max:
            errors[f.key] = f"maximum {f.max}"
            continue
        cleaned[f.key] = val

    if errors:
        raise FormError(errors)
    return cleaned
