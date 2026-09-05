AG PROMPT 4 — REPOSITORY RESTRUCTURE: NEW FOUNDATION SKELETON
CONTEXT: The purge is complete. Both server/ and client/ are stripped. 100% architectural freedom.
OBJECTIVE: Establish enterprise monorepo (apps/web, services/api, packages/*, modules/*, docs/, infra/).
ACTIONS:
1. Restructure repo root to apps/web, services/api, packages/ui-kit, packages/webgl-core, packages/shared-types, packages/config, modules/western-astrology, modules/vedic-astrology, modules/compatibility-checker, modules/mbti-checker, docs/adr, infra/docker.
2. Move non-feature code from server/ to services/api/ using git mv.
3. Move non-feature code from client/ to apps/web/ using git mv.
4. Set up pnpm/npm workspaces and Python uv/poetry workspace pattern.
5. Update import paths and confirm 0 broken imports.
6. Write README.md in each top-level directory.
ACCEPTANCE CRITERIA: Exact tree exists, apps/web and services/api build cleanly, old root client/server directories deleted.
