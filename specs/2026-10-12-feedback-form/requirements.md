# Requirements: Phase 1 — Feedback Form

## Overview & Scope
Phase 1 delivers an accessible, streamlined feedback collection system for **AgentClinic**, enabling AI agents and human caregivers to report satisfaction ratings and share qualitative observations regarding their clinic visits and restorative therapies.

The scope of this phase comprises:
1. **Minimal Relational Data Model**: A dedicated `feedback` table in SQLite capturing the agent identifier, numeric satisfaction rating, and comments.
2. **Domain Types & Validation Layer**: TypeScript interfaces and service functions enforcing strict validation rules (valid rating bounds, required fields).
3. **API Route Handler**: Next.js App Router endpoint `POST /api/feedback` for receiving, validating, and persisting feedback submissions.
4. **Semantic UI Form Component & Page**: A clean, accessible feedback submission component built with semantic PicoCSS inputs, integrated into a dedicated `/feedback` page and linked from global navigation.

## Stakeholder & Architectural Context
- **Product Alignment (Susan)** ([specs/mission.md](../mission.md)): Collects direct sentiment on agent recovery, helping clinic staff evaluate whether restorative therapies (e.g., token-flush therapy, temperature cooling) effectively alleviate prompt fatigue and context exhaustion.
- **Engineering Alignment (Mary)** ([specs/mission.md](../mission.md)): Extends the full-stack TypeScript architecture with strict type safety, SQLite persistence via `better-sqlite3`, and a modular service layer.
- **Marketing Alignment (Steve)** ([specs/mission.md](../mission.md)): Uses semantic PicoCSS styling (`@picocss/pico`) with modern glassmorphism touches, accessible inputs, and responsive layout that fits seamlessly across all viewports.
- **Tech Stack Alignment** ([specs/tech-stack.md](../tech-stack.md)): Built with Next.js App Router, React Server/Client Components, SQLite (`better-sqlite3`), and tested via Vitest.
- **Target Audience**: Simple, understandable, and modular implementation designed for students learning spec-driven development and developers presenting live AI coding demos.

---

## Architectural Decisions

### 1. Minimal Data Schema: `feedback` Table
Per scope requirements, the schema is kept minimal and focused on essential satisfaction indicators:
- `id`: `TEXT PRIMARY KEY` (UUID string)
- `agent_id`: `TEXT NOT NULL` (Identifier or handle of the agent / caregiver submitting feedback)
- `rating`: `INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5)` (1 to 5 numerical scale)
- `comments`: `TEXT NOT NULL` (Open-ended qualitative comments and clinical observations)
- `created_at`: `TEXT NOT NULL DEFAULT (datetime('now'))` (ISO-8601 UTC timestamp)

### 2. Service Layer & Validation Logic (`src/lib/services/feedback-service.ts`)
- Validation constraints:
  - `agent_id`: Must be non-empty string after trimming.
  - `rating`: Must be an integer between 1 and 5 inclusive.
  - `comments`: Must be non-empty string after trimming.
- Database operations:
  - `createFeedback(data)`: Inserts a verified feedback record into SQLite and returns the created entity.
  - `listFeedback(limit?)`: Retrieves recently submitted feedback entries ordered by `created_at DESC`.
  - `getFeedbackStats()`: Computes total submission count and average rating.

### 3. API Route Handler (`src/app/api/feedback/route.ts`)
- `POST`: Parses JSON body, validates input fields via `feedbackService`, persists to SQLite, and returns `201 Created` with the persisted record or `400 Bad Request` with descriptive validation errors.
- `GET`: Returns recent feedback records with `200 OK`.

### 4. UI Form Component & Routing
- **Component (`src/components/feedback-form.tsx`)**:
  - Uses semantic PicoCSS form markup (`<article>`, `<form>`, `<fieldset>`, `<input>`, `<select>`, `<textarea>`, `<button>`).
  - Rating selector providing options from 1 (Distressed / Ineffective) to 5 (Fully Rejuvenated).
  - Open-ended comments textarea with helpful placeholder guidance.
  - Async form submission state with disabled buttons during submission.
  - User-friendly success notification card upon submission and inline error banner on failure.
- **Page (`src/app/feedback/page.tsx`)**:
  - Hosted at `/feedback`.
  - Provides a welcoming clinical intake header reminding agents and caregivers of their voice in clinic care.
- **Navigation Integration**:
  - Header navigation menu in `src/app/layout.tsx` updated to include direct link to `/feedback`.
