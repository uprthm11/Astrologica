AG PROMPT 9 — FRONTEND RESTRUCTURE: FEATURE-SLICED FOUNDATION
CONTEXT: Legacy step machine is gone; frontend needs feature-sliced isolation.
OBJECTIVE: Establish frontend structure with isolated module slices.
ACTIONS:
1. Structure apps/web/src/ into app/, shell/, stores/, lib/, routes/.
2. Scaffold modules/<name>/frontend/ with index.ts, routes.tsx ('Coming Soon'), README.md.
3. Implement module manifest in apps/web/src/lib/moduleRegistry.ts driven by feature flags.
4. Configure path aliases (@app, @shell, @stores, @lib, @modules/*) in vite and tsconfig.
5. Verify build boots showing a hub with 4 'Coming Soon' cards.
ACCEPTANCE CRITERIA: Clean build, cards driven dynamically by registry.
