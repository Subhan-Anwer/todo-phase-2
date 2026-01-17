from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.ext.asyncio import AsyncConnection
from sqlmodel import SQLModel
from src.core.config import settings


# Create async engine with connection pooling
# Using asyncpg driver which is async-compatible
engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL query logging
)


async def get_db_session():
    """Dependency to get database session"""
    async with engine.begin() as conn:
        yield conn