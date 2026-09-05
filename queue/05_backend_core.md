AG PROMPT 5 — BACKEND CORE REBUILD: APP FACTORY & MODULAR ROUTER REGISTRY
CONTEXT: services/api/ is a bare skeleton.
OBJECTIVE: Build FastAPI application factory, dynamic module registry, structured logging, health/readiness endpoints.
ACTIONS:
1. Implement services/api/app/core/config.py with pydantic-settings, feature flags defaulting to false.
2. Implement services/api/app/core/logging.py with JSON logging and request-id correlation.
3. Implement create_app() factory in services/api/app/main.py.
4. Implement services/api/app/core/module_registry.py supporting auto-discovery of enabled modules.
5. Implement RFC 7807 problem+json global exception handling.
6. Implement GET /healthz and GET /readyz.
7. Configure strict CORS and rate limiting middleware.
8. Write unit tests for module registry and health endpoints.
ACCEPTANCE CRITERIA: uvicorn factory boots cleanly, /healthz returns 200, dummy module test passes.
