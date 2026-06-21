---
name: testing-screen1-reservation
description: Test the LocaConnecté/UNEVIE Écran 1 (Offre/Réservation) flow end-to-end — per-category dynamic form, capacity-aware calendar, and transparent financials. Use when verifying reservation UI/API changes (forms, calendar, quotation/escrow).
---

# Testing — Écran 1 (Offre / Réservation)

End-to-end testing of the reservation experience: dynamic per-category form + capacity-aware
calendar + live financial breakdown (commission / TVA / escrow / total).

## Environment / how to run
- Frontend (Vite): `npm run dev` → http://localhost:5173
- Backend (FastAPI): from repo root, `JWT_SECRET=<32+ chars> uvicorn backend.api.app:app --port 8000`
  - The backend has **no `--reload`**; after editing backend code you MUST kill + relaunch it,
    otherwise the UI keeps serving stale logic.
- Lint/type/test before pushing: `npm run lint`, `npm run typecheck`, `pytest backend/tests`.

## Auth gotcha (important)
- The frontend keeps the JWT **in memory only** — a page reload logs you out (back to "Connexion").
- Login may fail with "Email ou mot de passe incorrect" for accounts created against a
  *previous* backend process. The fix that reliably works: register a fresh user against the
  **current** backend, then log in:
  ```bash
  TS=$(date +%s); E="t$TS@loca.ci"
  curl -s -X POST http://localhost:8000/api/auth/register -H 'Content-Type: application/json' \
    -d '{"email":"'$E'","password":"Passw0rd!","name":"Tester","role":"client"}'
  ```
  Then use that email + `Passw0rd!` in the UI login form. (Registration setup is fine to do
  outside the recording.)

## Navigating to the feature
1. Home → "Services populaires" grid → click a sector tile (e.g. "Location villa",
   "Chauffeur privé"). This opens the reservation form for that sector.
2. To switch sectors, click "← Retour" (top-left, ~33,305), then pick another tile.
   The bottom-nav "Accueil" button is unreliable for going back — prefer "Retour".

## What to assert (high-signal, would fail if broken)
- **Per-category fields**: villa shows adultes/enfants/date arrivée+départ/heure/climatisation;
  chauffeur shows passagers/zone/urgence/date début+fin. Fields are backend-driven (not hardcoded).
- **Capacity models differ by sector** — the strongest differentiator:
  - `single` (villa, BTP/caterpillar): days are only available OR occupied — **never partial**,
    no unit counters. Occupied days are `disabled`.
  - `fleet` (chauffeur_privé / véhicules): days show a **free-unit counter** (e.g. 2/3, 3/3),
    legend "Flotte de N unité(s)". Partial (amber) days exist.
- **min_nights / max_nights** (single sectors, e.g. villa min 3): selecting a range shorter than
  min must be **rejected** with message "Séjour minimum : N nuit(s)." and the récap must NOT
  advance. (Regression guard: an earlier version enforced only max, not min.)
- **Live financials**: selecting a valid range fills date fields + durée and recomputes
  `unit_price × units → subtotal → commission(rate) → TVA(18%) → total`, plus escrow "Bloqué".
  Villa 3 nuits @75 000 → subtotal 225 000, commission 22 500, TVA 4 000, total 251 500.
- **Urgency multiplier**: for sectors with `urgency_enabled`, the financial `subtotal` must
  include the urgency multiplier (×1.15 prioritaire, ×1.3 immédiate) so it stays consistent with
  the displayed price range. Villa form does NOT expose urgence, so verify via API:
  `POST /api/quotation {"sector":"location_caterpillar","payload":{"duree_jours":2,"urgence":"immédiate"}}`
  → `financials.subtotal == subtotal_base × 1.3`, and `price_min ≤ subtotal ≤ price_max`.

## Calendar interaction tips (computer use)
- The month grid is on the right ("Choisissez vos dates"). Day cells are ~30px apart.
  Use `zoom` on the calendar region to read per-day dots/counters reliably.
- Range selection = click start day, then click end day. Occupied/past days are disabled.
- Rounding: commission/TVA are rounded to a 500 FCFA step, so exact float equality can fail in
  tests — assert with a tolerance (`abs(...) <= 500`).

## Devin Secrets Needed
- None external. Only a local `JWT_SECRET` env var (any 32+ char string) for the backend.
