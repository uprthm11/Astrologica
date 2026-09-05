AG PROMPT 11 — FRONTEND GLOBAL ROUTING
CONTEXT: Replace linear numeric steps (0-7) with client-side router.
OBJECTIVE: Real route tree with persistent WebGL background.
ACTIONS:
1. Configure router in apps/web/src/app/router.tsx: / (Hub), /m/:moduleId/* (lazy modules), /not-found.
2. Mount UniverseCanvas once in shell/ outside router Outlet to prevent canvas context recreation.
3. Remove advanceStep, numeric step indices, and legacy routing hacks.
4. Implement route error boundaries and Framer Motion page cross-fades.
5. Add routing tests verifying hub, placeholders, 404s, and context preservation.
ACCEPTANCE CRITERIA: Route transitions trigger 0 canvas unmounts, zero legacy step machine variables remain.
