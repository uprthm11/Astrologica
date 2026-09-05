# ADR 0001: Backend Module Plugin Architecture & Gating Contract

## Status
Accepted

## Date
2026-09-05

## Context
Astrologica provides multiple independent astrological and psychometric domains:
- `western-astrology`
- `vedic-astrology`
- `compatibility-checker`
- `mbti-checker`

To avoid monolithic tight-coupling, domain fracture, and code sprawl, all domain computational services must adhere to an isolated, modular plugin contract.

## Decision
1. **Isolated Filesystem Structure:**
   Each module lives under `modules/<module-name>/` with a dedicated `backend/` directory containing:
   - `__init__.py`: Package entrypoint exposing `router`
   - `router.py`: FastAPI `APIRouter` exposing endpoints under `/api/<module-name>`
   - `schemas.py`: Pydantic input/output contracts
   - `service.py`: Domain computation business logic
   - `README.md`: Module documentation

2. **Standard Plugin Endpoints:**
   - `GET /api/<module-name>/status`: Returns `ModuleStatusResponse` (`{ "module": "<name>", "implemented": bool, "version": str }`)
   - `POST /api/<module-name>/calculate`: Returns `ModuleCalculateResponse` or HTTP 501 Not Implemented during scaffolding

3. **Feature-Flag Auto-Discovery & Gating:**
   - The central API (`services/api`) never imports domain math directly.
   - The `ModuleRegistry` dynamically scans `modules/` on boot.
   - Modules are gated via boolean feature flags in `Settings`:
     - `FEATURE_WESTERN_ASTROLOGY`
     - `FEATURE_VEDIC_ASTROLOGY`
     - `FEATURE_COMPATIBILITY_CHECKER`
     - `FEATURE_MBTI_CHECKER`
   - When a feature flag is `False`, the module's router is never mounted and requests to `/api/<module-name>/*` strictly return `404 Not Found`.

## Consequences
- Clean separation of concerns: core infrastructure has zero astrological or psychometric logic.
- Modules can be enabled, tested, or deployed independently.
- Zero breaking changes to client infrastructure when modules are refactored.
