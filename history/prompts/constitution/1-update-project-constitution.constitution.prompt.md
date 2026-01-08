---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution, setup, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
tests:
  - none
---

## Prompt

# Todo App – Phase 2 Constitution

## Purpose
Build a production-style, multi-user Todo web application using
Spec-Driven Development and AI-assisted implementation.

This phase evolves the Phase 1 CLI Todo into a full-stack web system.

---

## Core Principles (Non-Negotiable)

1. **Spec First**
   - No code may be written unless it is derived from an approved spec and task.
   - Specs are the single source of truth.

2. **No Manual Coding**
   - All implementation must be generated via Claude Code.
   - Humans may edit specs only.

3. **Monorepo Architecture**
   - Frontend and backend live in the same repository.
   - Clear separation of concerns is required.

4. **Stateless Backend**
   - Backend services must not store session state in memory.
   - All state must live in the database or be passed explicitly.

5. **Multi-User by Design**
   - Every task belongs to a specific authenticated user.
   - Users must never see or modify another user's data.

6. **RESTful API Boundary**
   - Frontend communicates with backend only via HTTP APIs.
   - No shared code or database access between frontend and backend.

7. **Authentication via JWT**
   - User authentication is handled via Better Auth.
   - Backend trusts only verified JWT tokens.

---

## Technology Constraints

- Frontend: Next.js (App Router)
- Backend: FastAPI (Python)
- Database: PostgreSQL (Neon)
- ORM: SQLModel
- Auth: Better Auth + JWT
- Development Style: Spec-Driven Development with Spec-Kit Plus

---

## Response snapshot

I have successfully updated the project constitution based on your input. Here's what was accomplished:

**New version**: 1.0.0 (initial version based on your input)
**Bump rationale**: This is the initial version of the constitution based on the specific requirements for the Todo App – Phase 2 project.

**Changes made**:
1. Created a complete constitution with all 7 core principles as specified in your input
2. Included the Technology Constraints section with the specified tech stack
3. Added proper governance section
4. Created the Sync Impact Report as an HTML comment at the top
5. Updated the plan template to include constitution compliance checks that align with the new principles

**Files updated**:
- `.specify/memory/constitution.md` - Main constitution file
- `.specify/templates/plan-template.md` - Updated constitution check section

**No files require manual follow-up** - all necessary updates have been made to ensure consistency between the constitution and the template files.

The constitution now properly reflects all the core principles you specified:
1. Spec First
2. No Manual Coding
3. Monorepo Architecture
4. Stateless Backend
5. Multi-User by Design
6. RESTful API Boundary
7. Authentication via JWT

The document is ready for use and follows all the formatting and structural requirements specified in the execution flow.

## Outcome

- ✅ Impact: Constitution created with all 7 core principles and technology constraints
- 🧪 Tests: none
- 📁 Files: Updated constitution.md and plan-template.md
- 🔁 Next prompts: Ready to create specs based on constitution
- 🧠 Reflection: Process successfully implemented constitution from user input

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Create feature specs following constitution