# Plan: Phase 1 — Feedback Form

## Overview
This plan specifies the implementation steps for Phase 1 (Feedback Form) organized into 4 numbered task groups. Each task group must be verified before proceeding to the next.

---

### Task Group 1: Schema & Types
- **Task 1.1**: Create TypeScript domain interfaces in `src/types/feedback.ts`:
  - `Feedback` entity interface (`id`, `agent_id`, `rating`, `comments`, `created_at`).
  - `CreateFeedbackDTO` input interface (`agent_id`, `rating`, `comments`).
  - `FeedbackStats` summary interface (`total_count`, `average_rating`).
- **Task 1.2**: Re-export feedback types from barrel index `src/types/index.ts`.
- **Task 1.3**: Update `src/lib/schema.sql` with the DDL for the `feedback` table, including primary key, check constraints (`rating BETWEEN 1 AND 5`), and index on `created_at`.
- **Task 1.4**: Add a migration runner check in `src/lib/migrations.ts` or `src/lib/db.ts` ensuring the `feedback` table is initialized automatically on database connection.

---

### Task Group 2: Service Layer & API Route Handler
- **Task 2.1**: Create `src/lib/services/feedback-service.ts` implementing:
  - `validateFeedbackInput(data: unknown)`: Validates required non-empty string for `agent_id`, integer rating within $[1, 5]$, and non-empty string for `comments`.
  - `createFeedback(data: CreateFeedbackDTO)`: Inserts record into SQLite using `better-sqlite3` and returns the saved `Feedback` entity.
  - `listFeedback(limit?: number)`: Retrieves entries sorted by `created_at DESC`.
  - `getFeedbackStats()`: Returns aggregate count and average rating.
- **Task 2.2**: Export `feedbackService` from `src/lib/services/index.ts`.
- **Task 2.3**: Create Next.js API route handler in `src/app/api/feedback/route.ts`:
  - `POST`: Validates payload, calls `feedbackService.createFeedback`, and returns `201 Created` with JSON result, or `400 Bad Request` on invalid input.
  - `GET`: Returns list of feedback entries with `200 OK`.

---

### Task Group 3: UI Form Component & Navigation
- **Task 3.1**: Build interactive client component `src/components/feedback-form.tsx`:
  - Semantic PicoCSS inputs for Agent identifier / email, 1–5 numerical rating dropdown / buttons, and comments textarea.
  - Accessible labels and ARIA descriptors.
  - Client-side validation handling and submission loading states.
  - User-friendly success confirmation banner with reset option, and error alert on failed submissions.
- **Task 3.2**: Create route page `src/app/feedback/page.tsx` hosting the `FeedbackForm` with clear instructions and clinic sanctuary aesthetics.
- **Task 3.3**: Update `src/app/layout.tsx` to add "Feedback" to the primary header navigation menu (`nav-menu`).

---

### Task Group 4: Automated Tests
- **Task 4.1**: Create `tests/feedback-services.test.ts` to test:
  - Valid creation and persistence in SQLite.
  - Validation rejections for missing `agent_id`, empty `comments`, ratings below 1, and ratings above 5.
  - Aggregation of statistics (`getFeedbackStats`) and ordering of recent entries (`listFeedback`).
- **Task 4.2**: Create `tests/feedback-api.test.ts` to test:
  - `POST /api/feedback` with valid payload returns `201 Created`.
  - `POST /api/feedback` with invalid rating or missing fields returns `400 Bad Request`.
  - `GET /api/feedback` returns `200 OK` with submitted records.
- **Task 4.3**: Run `npm.cmd test` and verify that all feedback tests and existing test suites pass with 0 errors.
