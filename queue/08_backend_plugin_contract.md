AG PROMPT 8 — BACKEND MODULE PLUGIN CONTRACT
CONTEXT: modules/ directories are empty; establish pluggable interface.
OBJECTIVE: Define and enforce module plugin contract via scaffolds.
ACTIONS:
1. Create identical skeletons in modules/<name>/backend/: __init__.py, router.py (501 stubs), schemas.py, service.py, README.md.
2. Add GET /status endpoint returning {'module': name, 'implemented': False}.
3. Wire module auto-discovery gated by feature flags.
4. Write integration test verifying western-astrology mounts when enabled while others return 404.
5. Document contract in docs/adr/0001-module-plugin-architecture.md.
ACCEPTANCE CRITERIA: Skeletons match, tests pass, no computational logic in modules yet.
