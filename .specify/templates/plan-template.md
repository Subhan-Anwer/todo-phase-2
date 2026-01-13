# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification
- [ ] Spec First: Implementation derived from approved spec and task (per constitution)
- [ ] No Manual Coding: All implementation via Claude Code, humans edit specs only
- [ ] Monorepo Architecture: Frontend and backend in same repo with clear separation
- [ ] Stateless Backend: No session state in memory, all state in DB or passed explicitly
- [ ] Multi-User by Design: Tasks belong to specific authenticated users
- [ ] RESTful API Boundary: Frontend/backend communicate via HTTP APIs only
- [ ] Authentication via JWT: Using Better Auth with verified JWT tokens
- [ ] Test-Driven Development: All features have accompanying tests; tests are part of definition of done
- [ ] Technology Constraints: Using Next.js, FastAPI, PostgreSQL, SQLModel, Better Auth
- [ ] Core Todo Operations: System supports Add, Delete, Update, View, and Mark Complete operations
- [ ] Task Management: Tasks persist across sessions and can be organized by users

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Security Considerations

*Required for all features. Reference: Constitution v1.2.0 - Security Principles*

### Input Validation
- [ ] All user input validated on backend (frontend validation for UX only)
- [ ] Pydantic/SQLModel models defined for request validation
- [ ] Input sanitization to prevent injection attacks

### Authentication & Authorization
- [ ] JWT token verification on all protected endpoints
- [ ] User identity extracted from JWT payload (not request parameters)
- [ ] User resource isolation enforced (user_id checks)

### SQL Injection Prevention
- [ ] No string concatenation or f-strings for SQL queries
- [ ] SQLModel ORM methods used exclusively
- [ ] All query parameters validated and sanitized

### XSS Protection
- [ ] User-generated content properly escaped
- [ ] React's JSX auto-escaping leveraged
- [ ] No use of `dangerouslySetInnerHTML` (or properly sanitized if required)

### CORS Policy
- [ ] Explicit CORS origins configured (no wildcards in production)
- [ ] Allowed methods and headers restricted

### Rate Limiting
- [ ] Rate limits applied on authentication endpoints
- [ ] Reasonable rate limits on all API endpoints
- [ ] 429 responses with retry-after headers

### Secrets Management
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Environment variables used for all secrets
- [ ] `.env` files in `.gitignore`
- [ ] `.env.example` documents all required variables

**Security Risks Identified**: [List specific security concerns for this feature]

## Testing Strategy

*Required for all features. Reference: Constitution v1.2.0 - Testing Requirements*

### Test Coverage Targets
- [ ] Backend: Minimum 80% code coverage
- [ ] All API endpoints have integration tests
- [ ] Critical business logic has unit tests

### Testing Approach
- **Unit Tests**: [Describe units to test - functions, methods, classes]
- **Integration Tests**: [Describe API endpoint tests with database]
- **E2E Tests**: [Optional - describe critical user flows if applicable]

### Test-Driven Development
- [ ] Tests written BEFORE implementation (fail-first approach)
- [ ] Each task in tasks.md includes test cases
- [ ] Tests are part of definition of done

### Testing Tools & Setup
- **Backend**: pytest for FastAPI
- **Frontend**: Jest + React Testing Library
- **E2E**: [Playwright/Cypress if implemented]
- **Test Data**: [Fixtures, factories, cleanup strategy]

**Testing Risks**: [Identify hard-to-test scenarios or dependencies]

## Error Handling Standards

*Required for all features. Reference: Constitution v1.2.0 - Error Handling Standards*

### HTTP Status Code Usage
Document expected status codes for this feature:
- **200 OK**: [Successful operations]
- **201 Created**: [Resource creation endpoints]
- **204 No Content**: [Delete operations]
- **400 Bad Request**: [Validation failures]
- **401 Unauthorized**: [Missing/invalid auth]
- **403 Forbidden**: [Insufficient permissions]
- **404 Not Found**: [Resource not found scenarios]
- **409 Conflict**: [State conflicts]
- **422 Unprocessable Entity**: [Field validation errors]
- **429 Too Many Requests**: [Rate limit exceeded]
- **500 Internal Server Error**: [Unexpected errors]

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
- [ ] No sensitive information in error messages
- [ ] Detailed errors logged server-side
- [ ] Sanitized errors returned to clients
- [ ] Actionable error messages provided

### Logging Approach
- [ ] Structured logging (JSON format)
- [ ] Appropriate severity levels (ERROR, WARNING, INFO)
- [ ] Request context included (user_id, endpoint, timestamp)
- [ ] No sensitive data logged (passwords, tokens, PII)

**Error Scenarios**: [List specific error cases for this feature]

## API Design

*Required for API features. Reference: Constitution v1.2.0 - API Design Principles*

### API Versioning
- [ ] All endpoints versioned: `/api/v1/...`
- [ ] Backwards compatibility maintained within version

### RESTful Endpoints
Document endpoints for this feature:
- `GET /api/v1/[resource]`: [List resources]
- `POST /api/v1/[resource]`: [Create resource]
- `GET /api/v1/[resource]/{id}`: [Get specific resource]
- `PUT /api/v1/[resource]/{id}`: [Full update]
- `PATCH /api/v1/[resource]/{id}`: [Partial update]
- `DELETE /api/v1/[resource]/{id}`: [Delete resource]

### Pagination
- [ ] List endpoints support pagination (`?page=1&limit=20`)
- [ ] Default limit: 20, max limit: 100
- [ ] Pagination metadata in response:
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

### Filtering & Sorting
- [ ] Filtering via query parameters: `?status=completed&priority=high`
- [ ] Sorting support: `?sort_by=due_date&order=desc`
- [ ] Documented supported filters and sort fields

### Response Format
- [ ] Consistent response structure:
  ```json
  {
    "data": {},
    "meta": {}
  }
  ```

**API Design Decisions**: [Document specific API design choices and rationale]

## Data Management

*Required for database features. Reference: Constitution v1.2.0 - Data Management*

### Database Migrations
- [ ] Alembic used for schema migrations
- [ ] Migration scripts for all schema changes
- [ ] Migrations tested before production
- [ ] Rollback strategy defined

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
- [ ] Database constraints enforce integrity
- [ ] Foreign key relationships defined
- [ ] Transactions used for multi-step operations
- [ ] Data relationships validated at application level

### Data Retention
- [ ] Data retention policy documented
- [ ] Soft delete vs hard delete decided: [CHOICE]
- [ ] User data deletion requirements considered (GDPR)

**Data Model Decisions**: [Document schema design choices]

## Performance Guidelines

*Required for all features. Reference: Constitution v1.2.0 - Performance Guidelines*

### Response Time Targets
- [ ] API endpoints: <200ms (p95)
- [ ] Database queries: <100ms (p95)
- [ ] Frontend pages: <2s (initial load)

### Database Optimization
- [ ] Indexes on frequently queried columns (user_id, created_at, status)
- [ ] N+1 queries avoided (use eager loading/joins)
- [ ] Result sets limited with pagination
- [ ] Slow queries monitored and optimized

### Caching Strategy
- [ ] Static assets cached with appropriate headers
- [ ] Frequently accessed data caching considered
- [ ] ETag headers for conditional requests

### Resource Management
- [ ] Database connections closed properly
- [ ] Connection pooling configured
- [ ] Request timeouts implemented

**Performance Risks**: [Identify potential bottlenecks]

## Observability & Monitoring

*Required for all features. Reference: Constitution v1.2.0 - Observability*

### Logging Standards
- **ERROR**: Failures requiring immediate attention
- **WARNING**: Issues requiring investigation
- **INFO**: Important business events (user actions, API calls)
- **DEBUG**: Detailed diagnostics (development only)

### Health Checks
- [ ] `/health` endpoint implemented
- [ ] Database connectivity checked
- [ ] Appropriate status codes (200 healthy, 503 unhealthy)

### Monitoring Requirements
- [ ] API response times tracked
- [ ] Error rates monitored
- [ ] Database connection pool usage monitored
- [ ] Authentication success/failure rates tracked

### Structured Logging
- [ ] JSON format for logs
- [ ] Include: timestamp, level, message, user_id, request_id, endpoint
- [ ] Logs searchable and parsable

**Monitoring Strategy**: [Define specific metrics to track for this feature]

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
[Add feature-specific variables]
```

### Configuration Management
- [ ] Pydantic Settings used for configuration
- [ ] Environment variables validated on startup
- [ ] Fail fast if required configuration missing
- [ ] `.env.example` updated with new variables

**Configuration Decisions**: [Document configuration approach]

## Code Quality Standards

*Required for all features. Reference: Constitution v1.2.0 - Code Quality*

### Backend (Python/FastAPI)
- [ ] Black for code formatting
- [ ] Ruff for linting
- [ ] mypy for type checking
- [ ] Type hints on all function signatures
- [ ] PEP 8 compliance

### Frontend (TypeScript/Next.js)
- [ ] Prettier for code formatting
- [ ] ESLint for linting
- [ ] TypeScript strict mode enabled
- [ ] Explicit types (avoid `any`)
- [ ] Style guide followed (Airbnb/Google)

### Documentation
- [ ] API endpoints documented with docstrings
- [ ] Request/response examples included
- [ ] README updated with setup instructions
- [ ] Environment variables documented

**Code Quality Checks**: [Define specific quality gates for this feature]
