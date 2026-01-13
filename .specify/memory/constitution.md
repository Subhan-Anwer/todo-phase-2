<!--
SYNC IMPACT REPORT
Version change: 1.1.0 → 1.2.0 (Added comprehensive technical and operational standards)
Modified principles: Added Test-Driven Development as core principle
Added sections: Security Principles, Testing Requirements, Error Handling Standards, API Design Principles, Data Management, Performance Guidelines, Observability, Environment Management, Code Quality Standards
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated with security, testing, error handling, API design, performance, monitoring, and code quality sections
  - .specify/templates/spec-template.md ✅ updated with security requirements, API design, data validation, error handling, performance, and testing requirements
  - .specify/templates/tasks-template.md ✅ updated with mandatory testing, comprehensive security tasks, error handling, code quality checks, and constitution compliance verification
Follow-up TODOs: None - all templates synchronized with Constitution v1.2.0
-->
# Todo App – Phase 2 Constitution

## Core Principles

### Spec First
No code may be written unless it is derived from an approved spec and task. Specs are the single source of truth.

### No Manual Coding
All implementation must be generated via Claude Code. Humans may edit specs only.

### Monorepo Architecture
Frontend and backend live in the same repository. Clear separation of concerns is required.

### Stateless Backend
Backend services must not store session state in memory. All state must live in the database or be passed explicitly.

### Multi-User by Design
Every task belongs to a specific authenticated user. Users must never see or modify another user's data.

### RESTful API Boundary
Frontend communicates with backend only via HTTP APIs. No shared code or database access between frontend and backend.

### Authentication via JWT
User authentication is handled via Better Auth. Backend trusts only verified JWT tokens.

### Test-Driven Development
All features must have accompanying tests before being marked complete. Tests are part of the definition of done.

## Functional Requirements

### Core Todo Operations
The system MUST support the following essential todo app operations:

- **Add Task**: Create new todo items with title, description, due date, and priority
- **Delete Task**: Remove tasks from the user's list permanently
- **Update Task**: Modify existing task details including title, description, due date, priority, and other attributes
- **View Task List**: Display all tasks for the authenticated user with filtering and sorting capabilities
- **Mark as Complete**: Toggle task completion status (incomplete ↔ complete)

### Task Management Features
- Tasks MUST be associated with individual users and not accessible by other users
- Tasks MUST persist across sessions and device usage
- The system MUST allow users to categorize or organize tasks (e.g., by project, priority, or due date)

## Security Principles

### Input Validation
- ALL user input MUST be validated on the backend before processing
- Frontend validation is for UX only; never trust client-side validation
- Use Pydantic models or SQLModel for request validation
- Sanitize all inputs to prevent injection attacks

### SQL Injection Prevention
- NEVER construct SQL queries using string concatenation or f-strings
- ALWAYS use SQLModel ORM methods and parameterized queries
- Validate and sanitize all query parameters

### Cross-Site Scripting (XSS) Protection
- Escape all user-generated content before rendering in the frontend
- Use React's built-in XSS protection (JSX automatically escapes)
- Never use `dangerouslySetInnerHTML` without proper sanitization

### CORS Policy
- Configure explicit CORS origins in FastAPI
- Do not use wildcard (`*`) CORS in production
- Restrict allowed methods and headers

### Rate Limiting
- Implement rate limiting on authentication endpoints
- Apply reasonable rate limits on all API endpoints to prevent abuse
- Return `429 Too Many Requests` with retry-after headers

### Secrets Management
- NEVER hardcode secrets, API keys, or credentials in source code
- Use environment variables (`.env` files) for all secrets
- Keep `.env` files out of version control (`.gitignore`)
- Document all required environment variables in `.env.example`

### Authorization
- Every API endpoint MUST verify the JWT token
- Verify user identity from JWT payload, not from request parameters
- Ensure users can only access their own resources (enforce user_id checks)

## Testing Requirements

### Test Coverage
- Minimum 80% code coverage for backend services
- All API endpoints MUST have integration tests
- Critical business logic MUST have unit tests

### Testing Strategy
- **Unit Tests**: Test individual functions and methods in isolation
- **Integration Tests**: Test API endpoints end-to-end with database
- **E2E Tests**: Test critical user flows through the frontend (optional but recommended)

### Test-Driven Development (TDD)
- Write tests BEFORE implementing features when possible
- Each task in `tasks.md` MUST include test cases
- Tests are part of the definition of done

### Testing Tools
- Backend: pytest for Python/FastAPI
- Frontend: Jest and React Testing Library
- E2E: Playwright or Cypress (if implemented)

### Test Data Management
- Use test fixtures and factories for consistent test data
- Tests MUST clean up after themselves (database rollback or cleanup)
- Never rely on production data for testing

## Error Handling Standards

### HTTP Status Codes
- `200 OK`: Successful GET, PUT, PATCH requests
- `201 Created`: Successful POST requests creating resources
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid input or validation errors
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Valid auth but insufficient permissions
- `404 Not Found`: Resource does not exist
- `409 Conflict`: Resource state conflict (e.g., duplicate)
- `422 Unprocessable Entity`: Validation errors with detailed field errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Unexpected server errors

### Error Response Format
All error responses MUST follow this structure:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional: validation errors or additional context
  }
}
```

### Error Handling Principles
- NEVER expose sensitive information in error messages
- Log detailed errors server-side, return sanitized errors to clients
- Distinguish between client errors (4xx) and server errors (5xx)
- Provide actionable error messages when possible

### Logging Strategy
- Log all errors with appropriate severity levels (ERROR, WARNING, INFO)
- Include request context (user_id, endpoint, timestamp) in logs
- Use structured logging (JSON format) for easy parsing
- Never log sensitive data (passwords, tokens, PII)

## API Design Principles

### Versioning
- API endpoints MUST be versioned: `/api/v1/...`
- Breaking changes require a new version
- Maintain backwards compatibility within the same version

### RESTful Conventions
- `GET /api/v1/todos`: List all todos for authenticated user
- `POST /api/v1/todos`: Create a new todo
- `GET /api/v1/todos/{id}`: Get a specific todo
- `PUT /api/v1/todos/{id}`: Update a todo (full replacement)
- `PATCH /api/v1/todos/{id}`: Partially update a todo
- `DELETE /api/v1/todos/{id}`: Delete a todo

### Pagination
- List endpoints MUST support pagination
- Use query parameters: `?page=1&limit=20`
- Default limit: 20 items, max limit: 100 items
- Return pagination metadata:
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
  ```

### Filtering and Sorting
- Support filtering via query parameters: `?status=completed&priority=high`
- Support sorting: `?sort_by=due_date&order=desc`
- Document all supported filters and sort fields

### Response Format Standardization
Successful responses should follow consistent structures:
```json
{
  "data": { /* resource or array */ },
  "meta": { /* optional metadata */ }
}
```

## Data Management

### Database Schema Evolution
- Use Alembic for database migrations with SQLModel
- Never modify the database schema manually
- All schema changes MUST have migration scripts
- Test migrations on development before applying to production

### Migration Strategy
- Generate migrations: `alembic revision --autogenerate -m "description"`
- Apply migrations: `alembic upgrade head`
- Rollback: `alembic downgrade -1`
- Keep migrations idempotent and reversible

### Data Validation Boundaries
- **Frontend**: Basic validation for UX (format, required fields)
- **Backend**: Authoritative validation using Pydantic/SQLModel
- **Database**: Schema constraints (NOT NULL, UNIQUE, FOREIGN KEY)

### Data Integrity
- Use database constraints to enforce integrity
- Implement foreign key relationships correctly
- Use transactions for multi-step operations
- Validate data relationships at the application level

### Data Retention
- Soft delete for todos (keep deleted items with `deleted_at` timestamp) OR hard delete based on user preference
- Document data retention policy
- Consider GDPR and user data deletion requirements

## Performance Guidelines

### Response Time Targets
- API endpoints SHOULD respond within 200ms (p95)
- Database queries SHOULD complete within 100ms (p95)
- Frontend pages SHOULD load within 2 seconds (initial load)

### Database Query Optimization
- Use indexes on frequently queried columns (user_id, created_at, status)
- Avoid N+1 queries; use eager loading or joins
- Monitor slow queries and optimize as needed
- Limit result sets with pagination

### Caching Strategy
- Cache static assets with appropriate cache headers
- Consider caching frequently accessed data (future consideration)
- Use ETag headers for conditional requests

### Resource Management
- Close database connections properly
- Use connection pooling for database access
- Implement request timeouts to prevent hanging connections

## Observability and Monitoring

### Logging Standards
- **ERROR**: Failures requiring immediate attention
- **WARNING**: Issues that should be investigated
- **INFO**: Important business events (user actions, API calls)
- **DEBUG**: Detailed diagnostic information (development only)

### Health Check Endpoints
- Implement `/health` endpoint returning service status
- Include database connectivity check
- Return appropriate status codes (200 healthy, 503 unhealthy)

### Monitoring Requirements
- Monitor API response times and error rates
- Track database connection pool usage
- Monitor authentication success/failure rates
- Set up alerts for critical errors

### Structured Logging
- Use JSON format for logs
- Include: timestamp, level, message, user_id, request_id, endpoint
- Make logs searchable and parsable

## Environment Management

### Environment Separation
- **Development**: Local environment for feature development
- **Staging**: Pre-production environment for testing (future)
- **Production**: Live user-facing environment (future)

### Environment Variables
- Document all required environment variables in `.env.example`
- Required variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret for JWT signing
  - `BETTER_AUTH_SECRET`: Better Auth configuration
  - `CORS_ORIGINS`: Allowed CORS origins
  - `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

### Configuration Management
- Use Pydantic Settings for configuration management
- Validate environment variables on application startup
- Fail fast if required configuration is missing

## Code Quality Standards

### Python (Backend)
- Use **Black** for code formatting
- Use **Ruff** for linting
- Use **mypy** for type checking
- Write type hints for all function signatures
- Follow PEP 8 style guide

### TypeScript (Frontend)
- Use **Prettier** for code formatting
- Use **ESLint** for linting
- Enable TypeScript strict mode
- Define explicit types; avoid `any`
- Follow Airbnb or Google style guide

### Documentation Standards
- Document all API endpoints with docstrings
- Include request/response examples
- Document environment variables
- Maintain README with setup instructions

### Code Review Requirements
- All code MUST be generated via Claude Code
- Follow Spec-Driven Development workflow
- Review generated code for security and quality
- Ensure tests pass before accepting implementation

## Technology Constraints
Frontend: Next.js (App Router), Backend: FastAPI (Python), Database: PostgreSQL (Neon), ORM: SQLModel, Auth: Better Auth + JWT, Development Style: Spec-Driven Development with Spec-Kit Plus

## Governance
All implementation must follow the Core Principles and Technical Standards. No code changes without spec and task approval. All generated code must adhere to Security Principles, Testing Requirements, Error Handling Standards, and Code Quality Standards.

**Version**: 1.2.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-13