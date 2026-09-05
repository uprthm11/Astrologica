"""
Integration tests for BaseRepository CRUD and Resilient Cache.
"""
import pytest
from app.db.session import AsyncSessionLocal, engine, Base
from app.db.models import User, BirthProfile, ModuleResultCache
from app.db.repository import user_repo, birth_profile_repo, cache_repo
from app.core.cache import cache


@pytest.fixture(autouse=True)
async def prepare_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # No teardown needed for sqlite test db


@pytest.mark.anyio
async def test_user_repository_crud():
    async with AsyncSessionLocal() as session:
        # Create
        user = await user_repo.create(
            session,
            {
                "email": "traveler@astrologica.com",
                "hashed_password": "secure_argon2_hash",
                "is_active": True,
                "is_admin": False,
            },
        )
        assert user.id is not None
        assert user.email == "traveler@astrologica.com"
        user_id = user.id

        # Read by ID
        fetched = await user_repo.get(session, user_id)
        assert fetched is not None
        assert fetched.email == "traveler@astrologica.com"

        # Read by Email
        fetched_email = await user_repo.get_by_email(session, "traveler@astrologica.com")
        assert fetched_email is not None
        assert fetched_email.id == user_id

        # Update
        updated = await user_repo.update(session, fetched, {"is_admin": True})
        assert updated.is_admin is True

        # Delete
        deleted = await user_repo.delete(session, user_id)
        assert deleted is not None

        # Verify deletion
        assert await user_repo.get(session, user_id) is None


@pytest.mark.anyio
async def test_birth_profile_and_cache_crud():
    async with AsyncSessionLocal() as session:
        # Create Birth Profile
        profile = await birth_profile_repo.create(
            session,
            {
                "name": "Jane Doe",
                "date": "2000-01-01",
                "time": "12:00",
                "utc_offset": "+00:00",
                "timezone": "UTC",
                "lat": 51.5074,
                "lon": -0.1278,
                "location_name": "London, UK",
            },
        )
        assert profile.id is not None
        profile_id = profile.id

        # Create Cache Entry
        cache_entry = await cache_repo.create(
            session,
            {
                "profile_id": profile_id,
                "module_name": "western-astrology",
                "input_hash": "sha256-hash-abc-123",
                "result_json": '{"sun": "Capricorn", "moon": "Scorpio"}',
            },
        )
        assert cache_entry.id is not None

        # Query Cache by Hash
        found = await cache_repo.get_by_hash(
            session, profile_id, "western-astrology", "sha256-hash-abc-123"
        )
        assert found is not None
        assert "Capricorn" in found.result_json

        # Cleanup
        await birth_profile_repo.delete(session, profile_id)
        assert await birth_profile_repo.get(session, profile_id) is None


@pytest.mark.anyio
async def test_resilient_cache_operations():
    """Test cache get/set/delete with in-memory fallback."""
    key = "test_key_cosmos"
    val = '{"astronomy": "verified"}'

    await cache.set(key, val, expire=60)
    retrieved = await cache.get(key)
    assert retrieved == val

    await cache.delete(key)
    assert await cache.get(key) is None
