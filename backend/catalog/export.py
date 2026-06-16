"""Exporte le référentiel métier en JSON pour le frontend React.

Usage:
    python -m backend.catalog.export            # -> src/data/catalog.json
    python -m backend.catalog.export path.json
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from . import SECTORS, CITIES, COMMUNES, AI_FEATURES


def build_payload() -> dict:
    return {
        "sectors": [s.to_dict() for s in SECTORS],
        "geo": {
            "cities": [c.to_dict() for c in CITIES],
            "communes": [c.to_dict() for c in COMMUNES],
        },
        "ai_features": [f.to_dict() for f in AI_FEATURES],
    }


def main() -> None:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("src/data/catalog.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(build_payload(), ensure_ascii=False, indent=2), encoding="utf-8")
    payload = build_payload()
    print(f"OK: {len(payload['sectors'])} secteurs, "
          f"{len(payload['geo']['communes'])} communes, "
          f"{len(payload['ai_features'])} features -> {out}")


if __name__ == "__main__":
    main()
