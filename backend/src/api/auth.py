from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session
from typing import Dict
from src.models.user import UserCreate, UserLogin, Token, UserRead
from src.services.auth_service import AuthService
from src.core.database import get_db_session
from src.core.security import create_access_token, create_refresh_token
from src.core.config import settings


router = APIRouter()
security = HTTPBearer()


@router.post("/auth/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(user_create: UserCreate, db: Session = Depends(get_db_session)):
    """Register a new user."""
    auth_service = AuthService(db)

    try:
        db_user = auth_service.register_user(user_create)
        return UserRead(
            id=db_user.id,
            email=db_user.email,
            is_active=db_user.is_active,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/auth/login", response_model=Token)
async def login_user(user_login: UserLogin, db: Session = Depends(get_db_session)):
    """Authenticate user and return JWT tokens."""
    auth_service = AuthService(db)

    user = auth_service.authenticate_user(user_login)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(access_token_data)

    # Create refresh token
    refresh_token_data = {"sub": str(user.id)}
    refresh_token = create_refresh_token(refresh_token_data)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


# Additional authentication endpoints could be added here:
# - Password reset
# - Refresh token endpoint
# - Logout endpoint
# - User profile endpoint