import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from src.main import app
from src.core.database import engine


@pytest.fixture(scope="module")
def test_client():
    """Create a test client for API testing."""
    with TestClient(app) as client:
        yield client


@pytest.fixture(scope="module")
def setup_test_database():
    """Set up a test database for integration tests."""
    # Create a separate test database engine
    test_engine = create_engine("sqlite:///./test.db", echo=True)

    # Create all tables
    SQLModel.metadata.create_all(test_engine)

    # Create a session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    yield TestingSessionLocal

    # Clean up after tests
    test_engine.dispose()