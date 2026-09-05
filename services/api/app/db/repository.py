"""
BaseRepository[T] Generic Async CRUD Pattern using SQLAlchemy 2.0.
"""
from typing import Generic, TypeVar, Type, Optional, List, Any, Dict, Union
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import Base
from app.db.models import User, BirthProfile, ModuleResultCache

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic async repository providing standard CRUD operations."""

    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        """Fetch a single record by primary key."""
        result = await db.execute(select(self.model).where(self.model.id == str(id)))
        return result.scalar_one_or_none()

    async def list(
        self, db: AsyncSession, skip: int = 0, limit: int = 100
    ) -> List[ModelType]:
        """Fetch paginated records."""
        result = await db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(
        self, db: AsyncSession, obj_in: Union[Dict[str, Any], ModelType]
    ) -> ModelType:
        """Create and persist a new record."""
        if isinstance(obj_in, dict):
            db_obj = self.model(**obj_in)
        else:
            db_obj = obj_in
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, db_obj: ModelType, obj_in: Dict[str, Any]
    ) -> ModelType:
        """Update an existing record with dictionary values."""
        for field, value in obj_in.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, id: Any) -> Optional[ModelType]:
        """Delete a record by primary key."""
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj


# Typed Concrete Repositories
class UserRepository(BaseRepository[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


class BirthProfileRepository(BaseRepository[BirthProfile]):
    def __init__(self):
        super().__init__(BirthProfile)


class ModuleResultCacheRepository(BaseRepository[ModuleResultCache]):
    def __init__(self):
        super().__init__(ModuleResultCache)

    async def get_by_hash(
        self, db: AsyncSession, profile_id: str, module_name: str, input_hash: str
    ) -> Optional[ModuleResultCache]:
        stmt = select(ModuleResultCache).where(
            ModuleResultCache.profile_id == profile_id,
            ModuleResultCache.module_name == module_name,
            ModuleResultCache.input_hash == input_hash,
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


user_repo = UserRepository()
birth_profile_repo = BirthProfileRepository()
cache_repo = ModuleResultCacheRepository()
