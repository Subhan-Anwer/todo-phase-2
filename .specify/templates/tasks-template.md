---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Constitution Compliance**: All tasks must adhere to Constitution v1.2.0 standards including Security Principles, Testing Requirements, Error Handling Standards, and Code Quality Standards.

**Tests**: Tests are MANDATORY per Constitution v1.2.0 - Test-Driven Development principle. All features must have accompanying tests before being marked complete.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /sp.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

### Database & Migrations
- [ ] T004 Setup database schema and migrations framework (Alembic)
- [ ] T005 Create initial migration for base tables

### Authentication & Authorization (Constitution: Security Principles)
- [ ] T006 [P] Implement JWT token verification middleware
- [ ] T007 [P] Setup Better Auth integration
- [ ] T008 [P] Create user authentication endpoints
- [ ] T009 Implement user resource isolation checks (user_id enforcement)

### API Infrastructure (Constitution: API Design Principles)
- [ ] T010 [P] Setup API routing structure (`/api/v1/...`)
- [ ] T011 [P] Implement CORS configuration (no wildcards)
- [ ] T012 [P] Add rate limiting middleware
- [ ] T013 Create base response formatters (standardized format)
- [ ] T014 Implement pagination utilities (default 20, max 100)

### Error Handling (Constitution: Error Handling Standards)
- [ ] T015 [P] Configure structured logging (JSON format)
- [ ] T016 [P] Create error response formatter (standardized error format)
- [ ] T017 [P] Implement global exception handler
- [ ] T018 Setup logging levels and context (user_id, request_id, endpoint)

### Security Infrastructure (Constitution: Security Principles)
- [ ] T019 [P] Setup input validation framework (Pydantic/SQLModel)
- [ ] T020 [P] Configure secrets management (environment variables)
- [ ] T021 Create `.env.example` with required variables
- [ ] T022 Implement request sanitization

### Monitoring & Health Checks (Constitution: Observability)
- [ ] T023 [P] Create `/health` endpoint with database check
- [ ] T024 [P] Setup monitoring for API response times
- [ ] T025 Configure error rate tracking

### Configuration Management
- [ ] T026 Setup Pydantic Settings for configuration
- [ ] T027 Implement fail-fast validation on startup

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (MANDATORY per Constitution v1.2.0) ✅

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [ ] T030 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T031 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T032 [P] [US1] Unit test for [business logic] in tests/unit/test_[name].py

### Data Models for User Story 1

- [ ] T033 [P] [US1] Create [Entity1] model with SQLModel in src/models/[entity1].py
- [ ] T034 [P] [US1] Create [Entity2] model with SQLModel in src/models/[entity2].py
- [ ] T035 [P] [US1] Add database constraints (NOT NULL, UNIQUE, FOREIGN KEY)
- [ ] T036 Create Alembic migration for User Story 1 models

### Business Logic for User Story 1

- [ ] T037 [US1] Implement [Service] in src/services/[service].py (depends on T033, T034)
- [ ] T038 [US1] Add business rule validation
- [ ] T039 [US1] Implement transactions for multi-step operations

### API Endpoints for User Story 1 (Constitution: API Design)

- [ ] T040 [US1] Implement [GET endpoint] in src/api/[resource].py
- [ ] T041 [US1] Implement [POST endpoint] in src/api/[resource].py
- [ ] T042 [US1] Implement [PUT/PATCH endpoint] in src/api/[resource].py
- [ ] T043 [US1] Implement [DELETE endpoint] in src/api/[resource].py
- [ ] T044 [US1] Add pagination to list endpoints (default 20, max 100)
- [ ] T045 [US1] Add filtering and sorting support

### Security for User Story 1 (Constitution: Security Principles)

- [ ] T046 [P] [US1] Add JWT token verification to all endpoints
- [ ] T047 [P] [US1] Implement user resource isolation (user_id checks)
- [ ] T048 [P] [US1] Add input validation using Pydantic models
- [ ] T049 Add rate limiting to endpoints

### Error Handling for User Story 1 (Constitution: Error Handling)

- [ ] T050 [P] [US1] Implement error responses (400, 401, 403, 404, 422, 500)
- [ ] T051 [P] [US1] Add structured logging with context (user_id, endpoint)
- [ ] T052 Ensure no sensitive data in error messages or logs

### Code Quality for User Story 1 (Constitution: Code Quality)

- [ ] T053 [P] [US1] Add type hints to all functions
- [ ] T054 [P] [US1] Add docstrings to API endpoints
- [ ] T055 Run Black formatter on Python code
- [ ] T056 Run Ruff linter and fix issues
- [ ] T057 Run mypy type checker and fix issues
- [ ] T058 Verify 80% test coverage for User Story 1

**Checkpoint**: At this point, User Story 1 should be fully functional, secure, tested, and independently deliverable

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (MANDATORY per Constitution v1.2.0) ✅

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [ ] T060 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T061 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T062 [P] [US2] Unit test for [business logic] in tests/unit/test_[name].py

### Data Models for User Story 2

- [ ] T063 [P] [US2] Create [Entity] model with SQLModel in src/models/[entity].py
- [ ] T064 [P] [US2] Add database constraints
- [ ] T065 Create Alembic migration for User Story 2 models

### Business Logic & API for User Story 2

- [ ] T066 [US2] Implement [Service] in src/services/[service].py
- [ ] T067 [US2] Implement API endpoints with pagination/filtering
- [ ] T068 [US2] Integrate with User Story 1 components (if needed)

### Security, Error Handling & Quality for User Story 2

- [ ] T069 [P] [US2] Add JWT verification and user isolation
- [ ] T070 [P] [US2] Implement input validation and error handling
- [ ] T071 [P] [US2] Add structured logging
- [ ] T072 [P] [US2] Add type hints and docstrings
- [ ] T073 Run code quality checks (Black, Ruff, mypy)
- [ ] T074 Verify 80% test coverage for User Story 2

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (MANDATORY per Constitution v1.2.0) ✅

> **CRITICAL: Write these tests FIRST, ensure they FAIL before implementation (TDD)**

- [ ] T080 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T081 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py
- [ ] T082 [P] [US3] Unit test for [business logic] in tests/unit/test_[name].py

### Data Models for User Story 3

- [ ] T083 [P] [US3] Create [Entity] model with SQLModel in src/models/[entity].py
- [ ] T084 [P] [US3] Add database constraints
- [ ] T085 Create Alembic migration for User Story 3 models

### Business Logic & API for User Story 3

- [ ] T086 [US3] Implement [Service] in src/services/[service].py
- [ ] T087 [US3] Implement API endpoints with pagination/filtering
- [ ] T088 [US3] Integrate with previous user stories (if needed)

### Security, Error Handling & Quality for User Story 3

- [ ] T089 [P] [US3] Add JWT verification and user isolation
- [ ] T090 [P] [US3] Implement input validation and error handling
- [ ] T091 [P] [US3] Add structured logging
- [ ] T092 [P] [US3] Add type hints and docstrings
- [ ] T093 Run code quality checks (Black, Ruff, mypy)
- [ ] T094 Verify 80% test coverage for User Story 3

**Checkpoint**: All user stories should now be independently functional, secure, and tested

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements affecting multiple user stories

### Constitution Compliance Verification ✅

- [ ] T100 Verify all Core Principles compliance (Spec First, No Manual Coding, etc.)
- [ ] T101 Verify Security Principles compliance (JWT, input validation, etc.)
- [ ] T102 Verify Testing Requirements met (80% coverage, all endpoints tested)
- [ ] T103 Verify Error Handling Standards followed (status codes, format)
- [ ] T104 Verify API Design Principles followed (versioning, pagination, RESTful)
- [ ] T105 Verify Code Quality Standards met (Black, Ruff, mypy, type hints)

### Code Quality & Testing

- [ ] T106 [P] Run full test suite and ensure all tests pass
- [ ] T107 [P] Verify minimum 80% backend code coverage
- [ ] T108 [P] Run Black formatter on all Python code
- [ ] T109 [P] Run Ruff linter and fix all issues
- [ ] T110 [P] Run mypy type checker and fix all issues
- [ ] T111 [P] Run Prettier formatter on all TypeScript code
- [ ] T112 [P] Run ESLint and fix all issues
- [ ] T113 Verify TypeScript strict mode enabled

### Security Hardening (Constitution: Security Principles)

- [ ] T114 [P] Audit all endpoints for JWT verification
- [ ] T115 [P] Audit all endpoints for user resource isolation
- [ ] T116 [P] Verify no hardcoded secrets in codebase
- [ ] T117 [P] Verify `.env` in `.gitignore`
- [ ] T118 Verify rate limiting configured
- [ ] T119 Verify CORS properly configured (no wildcards)
- [ ] T120 Verify input sanitization on all endpoints

### Performance Optimization (Constitution: Performance Guidelines)

- [ ] T121 [P] Verify database indexes on frequently queried columns
- [ ] T122 [P] Check for N+1 queries and optimize
- [ ] T123 Verify pagination implemented on all list endpoints
- [ ] T124 Test API response times (<200ms p95 target)

### Monitoring & Observability (Constitution: Observability)

- [ ] T125 [P] Verify structured logging (JSON format) in place
- [ ] T126 [P] Verify logging includes context (user_id, request_id, endpoint)
- [ ] T127 Verify `/health` endpoint functioning
- [ ] T128 Verify no sensitive data in logs

### Documentation

- [ ] T129 [P] Update README with setup instructions
- [ ] T130 [P] Document all API endpoints with examples
- [ ] T131 [P] Update `.env.example` with all required variables
- [ ] T132 Add docstrings to all public APIs
- [ ] T133 Run quickstart.md validation

### Final Integration & Deployment Readiness

- [ ] T134 Test all user stories work independently
- [ ] T135 Test all user stories work together
- [ ] T136 Verify database migrations run successfully
- [ ] T137 Verify environment configuration complete
- [ ] T138 Run full integration test suite
- [ ] T139 Final code review and cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

### Task Conventions
- **[P]** = Parallel tasks (different files, no dependencies)
- **[Story]** = User story label (US1, US2, etc.) for traceability
- Each user story should be independently completable and testable

### Constitution Compliance (v1.2.0)
- **Tests are MANDATORY** (not optional) - TDD approach required
- Write tests FIRST, ensure they FAIL before implementation
- Security checks required on all endpoints (JWT, input validation, user isolation)
- Error handling must follow standardized format
- Code quality checks must pass (Black, Ruff, mypy, ESLint, Prettier)
- 80% minimum test coverage for backend

### Best Practices
- Verify tests fail before implementing (Test-Driven Development)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run code quality checks frequently during development
- Ensure no sensitive data in logs or error messages
- Document all API endpoints with docstrings

### Anti-Patterns to Avoid
- Vague tasks without specific file paths
- Tasks modifying the same file (not marked [P])
- Cross-story dependencies that break independence
- Skipping security validation or error handling
- Writing code without tests
- Hardcoding secrets or credentials
