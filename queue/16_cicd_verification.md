AG PROMPT 16 — CI/CD, TESTING FOUNDATION, DOCUMENTATION
CONTEXT: Lock down foundation and prevent regressions.
OBJECTIVE: Complete CI/CD gates, consolidate documentation, tag release.
ACTIONS:
1. Create .github/workflows/ci.yml with lint, typecheck, test suites, and regression guards (grep for pyswisseph, flatlib, html2canvas, timezones[0], sync requests in async def).
2. Add pre-commit hooks.
3. Write master docs/ARCHITECTURE.md mapping all 8 fixed fractures with updated Mermaid diagrams.
4. Archive PURGE_MANIFEST.json into docs/adr/0000-purge-manifest-archive.json.
5. Run full CI locally and tag git commit as foundation-v1.0.0.
ACCEPTANCE CRITERIA: CI passes, ARCHITECTURE.md complete, git tag exists, clean zero-module boot verified.
