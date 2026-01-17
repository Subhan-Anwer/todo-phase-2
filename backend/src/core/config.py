from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    app_title: str = "Todo Backend API"
    app_description: str = "API for managing todo tasks with user authentication"
    app_version: str = "1.0.0"
    api_v1_prefix: str = "/api/v1"

    # Database
    database_url: str

    # JWT
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours
    refresh_token_expire_days: int = 30

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour in seconds

    # Logging
    log_level: str = "INFO"

    # Data retention
    task_retention_days: int = 30

    class Config:
        env_file = ".env"


settings = Settings()