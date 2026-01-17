from typing import Optional
from sqlmodel import Session, select
from src.models.user import User, UserCreate, UserLogin
from src.core.security import verify_password, get_password_hash
from src.utils.validators import is_valid_email, is_strong_password
from src.core.config import settings


class AuthService:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    def register_user(self, user_create: UserCreate) -> Optional[User]:
        """Register a new user."""
        # Validate email format
        if not is_valid_email(user_create.email):
            raise ValueError("Invalid email format")

        # Validate password strength
        if not is_strong_password(user_create.password):
            raise ValueError("Password must be at least 8 characters with uppercase, lowercase, and special character")

        # Check if user already exists
        existing_user = self.db_session.exec(
            select(User).where(User.email == user_create.email)
        ).first()

        if existing_user:
            raise ValueError("Email already registered")

        # Create new user
        hashed_password = get_password_hash(user_create.password)
        db_user = User(
            email=user_create.email,
            hashed_password=hashed_password
        )

        self.db_session.add(db_user)
        self.db_session.commit()
        self.db_session.refresh(db_user)

        return db_user

    def authenticate_user(self, user_login: UserLogin) -> Optional[User]:
        """Authenticate user with email and password."""
        # Find user by email
        user = self.db_session.exec(
            select(User).where(User.email == user_login.email)
        ).first()

        if not user or not verify_password(user_login.password, user.hashed_password):
            return None

        # Check if user is active
        if not user.is_active:
            return None

        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db_session.exec(
            select(User).where(User.email == email)
        ).first()

    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        return self.db_session.exec(
            select(User).where(User.id == user_id)
        ).first()