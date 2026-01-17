from fastapi import FastAPI
from src.api.auth import router as auth_router
from src.api.tasks import router as tasks_router
from src.core.config import settings
from src.core.database import engine
from src.core.logging_config import setup_logging
from sqlmodel import SQLModel
import uvicorn
import logging

# Setup logging
setup_logging()

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_title,
    description=settings.app_description,
    version=settings.app_version,
    openapi_url=f"{settings.api_v1_prefix}/openapi.json"
)

# Include routers
app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(tasks_router, prefix=settings.api_v1_prefix)

@app.on_event("startup")
async def on_startup():
    """Create database tables on startup"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        # Continue without crashing the app - for development purposes

@app.get("/")
def read_root():
    return {"message": "Todo Backend API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "todo-backend"}

@app.get(f"{settings.api_v1_prefix}/health")
def api_health_check():
    return {"status": "healthy", "service": "todo-backend", "api": "v1"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)