<!--
SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0 (Added functional requirements)
Modified principles: None
Added sections: Functional Requirements section with core todo operations
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated to reflect new functional requirements
  - .specify/templates/spec-template.md ✅ updated to align with functional requirements
  - .specify/templates/tasks-template.md ✅ updated to reflect functional requirements
Follow-up TODOs: None
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

## Technology Constraints
Frontend: Next.js (App Router), Backend: FastAPI (Python), Database: PostgreSQL (Neon), ORM: SQLModel, Auth: Better Auth + JWT, Development Style: Spec-Driven Development with Spec-Kit Plus

## Governance
All implementation must follow the Core Principles. No code changes without spec and task approval.

**Version**: 1.1.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08