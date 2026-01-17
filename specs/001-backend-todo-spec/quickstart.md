# Quickstart Guide: Backend Todo Application

## Prerequisites

- Python 3.11+
- PostgreSQL database
- pip package manager

## Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd <project-root>
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Set Up Environment Variables

Copy the example environment file and update with your values:

```bash
cp backend/.env.example .env
# Edit .env with your actual configuration
```

Required environment variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
JWT_SECRET=your-super-secret-jwt-key
BETTER_AUTH_SECRET=your-better-auth-secret
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=INFO
```

### 5. Set Up Database

```bash
# Navigate to backend directory
cd backend

# Initialize database with Alembic
alembic upgrade head

# Alternatively, create tables directly
python -c "from src.core.database import engine; from src.models import Base; Base.metadata.create_all(bind=engine)"
```

### 6. Run the Application

```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token

### Tasks

- `GET /api/v1/tasks` - Get user's tasks with pagination/filtering
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{task_id}` - Get specific task
- `PUT /api/v1/tasks/{task_id}` - Update task completely
- `DELETE /api/v1/tasks/{task_id}` - Delete task

## Testing

### Run Unit Tests

```bash
cd backend
pytest tests/unit/
```

### Run Integration Tests

```bash
cd backend
pytest tests/integration/
```

### Run All Tests

```bash
cd backend
pytest tests/
```

## Development

### Generate New Database Migration

```bash
cd backend
alembic revision --autogenerate -m "description of changes"
alembic upgrade head
```

### Update Dependencies

Add new dependencies to `backend/requirements.in` and run:

```bash
pip-compile backend/requirements.in
```

## Environment Configuration

### Development
```
LOG_LEVEL=DEBUG
DATABASE_URL=postgresql://localhost:5432/todo_dev
```

### Production
```
LOG_LEVEL=INFO
DATABASE_URL=postgresql://production-db-url
```

## Common Commands

- Start development server: `uvicorn src.main:app --reload`
- Run tests: `pytest`
- Format code: `black . && ruff check . --fix`
- Check types: `mypy .`
- Run migrations: `alembic upgrade head`