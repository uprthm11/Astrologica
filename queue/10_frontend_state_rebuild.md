AG PROMPT 10 — FRONTEND STATE MANAGEMENT REBUILD
CONTEXT: Monolithic useAppStore coupled UI navigation with domain data.
OBJECTIVE: Module-agnostic Zustand slices with clean boundaries.
ACTIONS:
1. In apps/web/src/stores/, implement sessionStore.ts, uiStore.ts, and webglStore.ts (cameraTargetZ only).
2. Combine slices using typed root store slice pattern.
3. Enforce that modules maintain isolated local stores; write docs/adr/0003-state-management-boundaries.md.
4. Update hub screen to drive cameraTargetZ on hover via webglStore.
5. Write unit tests for store actions and selectors.
ACCEPTANCE CRITERIA: Zero feature fields in core stores, hover interaction updates cameraTargetZ, tests pass.
