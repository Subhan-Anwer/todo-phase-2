# Implementation Plan: Backend Todo Application

**Branch**: `001-backend-todo-spec` | **Date**: 2026-01-17 | **Spec**: [link]
**Input**: Feature specification from `/specs/001-backend-todo-spec/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a secure backend service for the todo application with user authentication, task management, and access control. The system uses FastAPI with JWT-based authentication via Better Auth, PostgreSQL database with SQLModel ORM, and implements all required CRUD operations for todo tasks with proper user isolation.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, Better Auth, PostgreSQL driver
**Storage**: PostgreSQL database with SQLModel ORM
**Testing**: pytest for backend testing
**Target Platform**: Linux server (containerizable)
**Project Type**: Web backend service
**Performance Goals**: <200ms API response time (p95), support 1000 concurrent users
**Constraints**: <200ms p95 response time, proper user resource isolation
**Scale/Scope**: Support 1000 concurrent users, 10,000 tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification
- [x] Spec First: Implementation derived from approved spec and task (per constitution)
- [x] No Manual Coding: All implementation via Claude Code, humans edit specs only
- [x] Monorepo Architecture: Frontend and backend in same repo with clear separation
- [x] Stateless Backend: No session state in memory, all state in DB or passed explicitly
- [x] Multi-User by Design: Tasks belong to specific authenticated users
- [x] RESTful API Boundary: Frontend/backend communicate via HTTP APIs only
- [x] Authentication via JWT: Using Better Auth with verified JWT tokens
- [x] Test-Driven Development: All features have accompanying tests; tests are part of definition of done
- [x] Technology Constraints: Using Next.js, FastAPI, PostgreSQL, SQLModel, Better Auth
- [x] Core Todo Operations: System supports Add, Delete, Update, View, and Mark Complete operations
- [x] Task Management: Tasks persist across sessions and can be organized by users

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-todo-spec/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # SQLModel database models
│   │   ├── __init__.py
│   │   ├── user.py      # User model with authentication fields
│   │   └── task.py      # Task model with user relationship
│   ├── services/        # Business logic services
│   │   ├── __init__.py
│   │   ├── auth_service.py    # Authentication and JWT handling
│   │   └── task_service.py    # Task management operations
│   ├── api/             # API routes and controllers
│   │   ├── __init__.py
│   │   ├── auth.py      # Authentication endpoints
│   │   └── tasks.py     # Task management endpoints
│   ├── core/            # Core configurations
│   │   ├── __init__.py
│   │   ├── config.py    # Application settings
│   │   ├── database.py  # Database connection and session management
│   │   └── security.py  # Security utilities and JWT handling
│   ├── utils/           # Utility functions
│   │   ├── __init__.py
│   │   └── validators.py # Input validation utilities
│   └── main.py          # Application entry point
├── alembic/             # Database migration files
│   ├── versions/
│   └── env.py
├── tests/               # Backend tests
│   ├── unit/            # Unit tests for services and utilities
│   ├── integration/     # Integration tests for API endpoints
│   └── conftest.py      # Test configuration
├── requirements.txt     # Python dependencies
├── alembic.ini          # Alembic configuration
└── .env.example         # Example environment variables
```

**Structure Decision**: Backend-only structure with clear separation of concerns following FastAPI best practices. Models, services, and API routes are organized in separate directories to maintain clean architecture and facilitate testing.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All constitutional requirements have been satisfied.

## Security Considerations

*Required for all features. Reference: Constitution v1.2.0 - Security Principles*

### Input Validation
- [x] All user input validated on backend (frontend validation for UX only)
- [x] Pydantic/SQLModel models defined for request validation
- [x] Input sanitization to prevent injection attacks

### Authentication & Authorization
- [x] JWT token verification on all protected endpoints
- [x] User identity extracted from JWT payload (not request parameters)
- [x] User resource isolation enforced (user_id checks)

### SQL Injection Prevention
- [x] No string concatenation or f-strings for SQL queries
- [x] SQLModel ORM methods used exclusively
- [x] All query parameters validated and sanitized

### XSS Protection
- [x] User-generated content properly escaped
- [x] React's JSX auto-escaping leveraged
- [x] No use of `dangerouslySetInnerHTML` (or properly sanitized if required)

### CORS Policy
- [x] Explicit CORS origins configured (no wildcards in production)
- [x] Allowed methods and headers restricted

### Rate Limiting
- [x] Rate limits applied on authentication endpoints
- [x] Reasonable rate limits on all API endpoints
- [x] 429 responses with retry-after headers

### Secrets Management
- [x] No hardcoded secrets, API keys, or credentials
- [x] Environment variables used for all secrets
- [x] `.env` files in `.gitignore`
- [x] `.env.example` documents all required variables

**Security Risks Identified**:
- Brute force attacks on authentication endpoints (mitigated by rate limiting)
- JWT token hijacking (mitigated by short expiration and secure transmission)
- SQL injection (mitigated by ORM usage and parameterized queries)

## Testing Strategy

*Required for all features. Reference: Constitution v1.2.0 - Testing Requirements*

### Test Coverage Targets
- [x] Backend: Minimum 80% code coverage
- [x] All API endpoints have integration tests
- [x] Critical business logic has unit tests

### Testing Approach
- **Unit Tests**: Individual functions, services, and utility methods will be tested in isolation
- **Integration Tests**: API endpoints will be tested with real database connections to verify end-to-end functionality
- **E2E Tests**: Not applicable for backend-only service

### Test-Driven Development
- [x] Tests written BEFORE implementation (fail-first approach)
- [x] Each task in tasks.md includes test cases
- [x] Tests are part of definition of done

### Testing Tools & Setup
- **Backend**: pytest for FastAPI
- **Frontend**: Not applicable (backend-only feature)
- **E2E**: Not applicable (backend-only feature)
- **Test Data**: Pytest fixtures for database setup and teardown, factory pattern for generating test objects

**Testing Risks**:
- Complex authentication flows may be difficult to test without external dependencies
- Database transaction handling in tests may cause flakiness if not properly managed

## Error Handling Standards

*Required for all features. Reference: Constitution v1.2.0 - Error Handling Standards*

### HTTP Status Code Usage
Document expected status codes for this feature:
- **200 OK**: Successful GET, PUT, PATCH operations
- **201 Created**: Successful POST operations creating resources
- **204 No Content**: Successful DELETE operations
- **400 Bad Request**: Invalid input or malformed requests
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid auth but insufficient permissions (accessing others' tasks)
- **404 Not Found**: Requested resource does not exist
- **409 Conflict**: Resource state conflict (e.g., duplicate email registration)
- **422 Unprocessable Entity**: Validation errors with detailed field errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server errors

### Error Response Format
All errors follow standardized format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### Error Handling Strategy
- [x] No sensitive information in error messages
- [x] Detailed errors logged server-side
- [x] Sanitized errors returned to clients
- [x] Actionable error messages provided

### Logging Approach
- [x] Structured logging (JSON format)
- [x] Appropriate severity levels (ERROR, WARNING, INFO)
- [x] Request context included (user_id, endpoint, timestamp)
- [x] No sensitive data logged (passwords, tokens, PII)

**Error Scenarios**:
- User registration with existing email (409 Conflict)
- Invalid login credentials (401 Unauthorized)
- Accessing another user's task (403 Forbidden)
- Malformed JWT token (401 Unauthorized)
- Empty task title (400 Bad Request)
- Expired JWT token (401 Unauthorized)
- Database connection failure (500 Internal Server Error)

## API Design

*Required for API features. Reference: Constitution v1.2.0 - API Design Principles*

### API Versioning
- [x] All endpoints versioned: `/api/v1/...`
- [x] Backwards compatibility maintained within version

### RESTful Endpoints
Document endpoints for this feature:
- `POST /api/v1/auth/register`: Register a new user account
- `POST /api/v1/auth/login`: Authenticate user and return JWT token
- `GET /api/v1/tasks`: Retrieve authenticated user's task list with pagination and filtering
- `POST /api/v1/tasks`: Create a new task for authenticated user
- `GET /api/v1/tasks/{id}`: Get a specific task for authenticated user
- `PUT /api/v1/tasks/{id}`: Update a task completely for authenticated user
- `DELETE /api/v1/tasks/{id}`: Delete a task for authenticated user

### Pagination
- [x] List endpoints support pagination (`?page=1&limit=20`)
- [x] Default limit: 20, max limit: 100
- [x] Pagination metadata in response:
  ```json
  {
    "data": [...],
    "meta": {
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 150,
        "total_pages": 8
      }
    }
  }
  ```

### Filtering & Sorting
- [x] Filtering via query parameters: `?completed=true&sort_by=created_at`
- [x] Sorting support: `?sort_by=due_date&order=desc`
- [x] Documented supported filters and sort fields

### Response Format
- [x] Consistent response structure:
  ```json
  {
    "data": {},
    "meta": {}
  }
  ```

**API Design Decisions**:
- Implemented full RESTful CRUD operations for tasks with proper authentication
- Used consistent response format across all endpoints
- Included pagination for list endpoints to handle large datasets efficiently
- Applied security by ensuring all task operations require authentication and enforce user isolation

## Data Management

*Required for database features. Reference: Constitution v1.2.0 - Data Management*

### Database Migrations
- [x] Alembic used for schema migrations
- [x] Migration scripts for all schema changes
- [x] Migrations tested before production
- [x] Rollback strategy defined

### Migration Commands
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1
```

### Data Validation Boundaries
- **Frontend**: Basic validation for UX (format, required fields)
- **Backend**: Authoritative validation (Pydantic/SQLModel)
- **Database**: Schema constraints (NOT NULL, UNIQUE, FOREIGN KEY)

### Data Integrity
- [x] Database constraints enforce integrity
- [x] Foreign key relationships defined
- [x] Transactions used for multi-step operations
- [x] Data relationships validated at application level

### Data Retention
- [x] Data retention policy documented
- [x] Soft delete vs hard delete decided: Hard delete for tasks when user is deleted, soft delete for user accounts
- [x] User data deletion requirements considered (GDPR)

**Data Model Decisions**:
- Used UUIDs for primary keys to ensure global uniqueness and distributed system compatibility
- Implemented proper foreign key relationships to enforce referential integrity
- Used appropriate data types and constraints to prevent data corruption
- Designed indexes on frequently queried fields to optimize performance

## Performance Guidelines

*Required for all features. Reference: Constitution v1.2.0 - Performance Guidelines*

### Response Time Targets
- [x] API endpoints: <200ms (p95)
- [x] Database queries: <100ms (p95)
- [x] Frontend pages: <2s (initial load) - Not applicable for backend-only service

### Database Optimization
- [x] Indexes on frequently queried columns (user_id, created_at, status)
- [x] N+1 queries avoided (use eager loading/joins)
- [x] Result sets limited with pagination
- [x] Slow queries monitored and optimized

### Caching Strategy
- [x] Static assets cached with appropriate headers - Not applicable for backend-only
- [x] Frequently accessed data caching considered
- [x] ETag headers for conditional requests

### Resource Management
- [x] Database connections closed properly
- [x] Connection pooling configured
- [x] Request timeouts implemented

**Performance Risks**:
- Large number of tasks per user could impact query performance if not properly indexed
- High concurrent user load could strain database connection pool
- Inefficient JWT validation could impact authentication performance

## Observability & Monitoring

*Required for all features. Reference: Constitution v1.2.0 - Observability*

### Logging Standards
- **ERROR**: Failures requiring immediate attention
- **WARNING**: Issues requiring investigation
- **INFO**: Important business events (user actions, API calls)
- **DEBUG**: Detailed diagnostics (development only)

### Health Checks
- [x] `/health` endpoint implemented
- [x] Database connectivity checked
- [x] Appropriate status codes (200 healthy, 503 unhealthy)

### Monitoring Requirements
- [x] API response times tracked
- [x] Error rates monitored
- [x] Database connection pool usage monitored
- [x] Authentication success/failure rates tracked

### Structured Logging
- [x] JSON format for logs
- [x] Include: timestamp, level, message, user_id, request_id, endpoint
- [x] Logs searchable and parsable

**Monitoring Strategy**:
- Monitor authentication endpoints for unusual activity or spikes
- Track API response times and error rates for performance degradation
- Monitor database connection pool usage for scaling requirements
- Log user activities for audit trails and debugging

## Environment & Configuration

*Required for all features. Reference: Constitution v1.2.0 - Environment Management*

### Environment Variables Required
Document all environment variables for this feature:
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
BETTER_AUTH_SECRET=...
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
TASK_RETENTION_DAYS=30
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600
```

### Configuration Management
- [x] Pydantic Settings used for configuration
- [x] Environment variables validated on startup
- [x] Fail fast if required configuration missing
- [x] `.env.example` updated with new variables

**Configuration Decisions**:
- Used Pydantic Settings for type-safe configuration management
- Implemented validation for all required environment variables
- Designed configuration to be environment-agnostic (dev/staging/prod)

## Code Quality Standards

*Required for all features. Reference: Constitution v1.2.0 - Code Quality*

### Backend (Python/FastAPI)
- [x] Black for code formatting
- [x] Ruff for linting
- [x] mypy for type checking
- [x] Type hints on all function signatures
- [x] PEP 8 compliance

### Frontend (TypeScript/Next.js)
- Not applicable for backend-only feature

### Documentation
- [x] API endpoints documented with docstrings
- [x] Request/response examples included
- [x] README updated with setup instructions
- [x] Environment variables documented

**Code Quality Checks**:
- All Python code must pass Black, Ruff, and mypy checks
- Test coverage must remain above 80%
- All endpoints must have proper API documentation
- Security scanning must pass before deployment