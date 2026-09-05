AG PROMPT 6 — BACKEND DATABASE LAYER: ASYNC POSTGRES + REDIS FOUNDATION
CONTEXT: App must support sessions, cached results, and shared birth profiles without feature coupling.
OBJECTIVE: Async migration-driven database and Redis cache layer.
ACTIONS:
1. Configure SQLAlchemy 2.0 async engine + asyncpg in services/api/app/db/session.py.
2. Setup Alembic in services/api/migrations/.
3. Define core models: User, BirthProfile, ModuleResultCache.
4. Implement BaseRepository[T] generic async pattern.
5. Add Redis async client in services/api/app/core/cache.py.
6. Wire /readyz to ping Postgres and Redis.
7. Add infra/docker/docker-compose.yml for Postgres 16 and Redis 7.
8. Generate and run initial Alembic migration.
9. Write integration tests for BaseRepository CRUD.
ACCEPTANCE CRITERIA: docker-compose up boots DB/Redis, alembic upgrade head passes, zero astrology-specific columns.
