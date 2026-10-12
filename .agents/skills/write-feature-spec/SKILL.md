---
name: write-feature-spec
description: >-
  Guides the creation of a comprehensive feature specification for a roadmap phase in any Spec-Driven Development (SDD) project. Identifies the next phase on specs/roadmap.md, creates a feature branch, reviews stakeholder mission and tech stack, drafts requirements.md, plan.md, and validation.md, and prompts the user for review across all three documents before writing to specs/YYYY-MM-DD-<feature-name>/. Use when asked to write a feature spec, create a feature spec, plan a new roadmap phase, or prepare a new feature branch and specification.
---

# Write Feature Spec Skill

This skill guides the preparation and creation of a complete feature specification for a new phase in any software project following Spec-Driven Development (SDD).

It identifies the next phase from `specs/roadmap.md`, initializes a dedicated feature branch, incorporates project-specific mission and tech stack context, drafts the three core specification documents (`requirements.md`, `plan.md`, `validation.md`), and enforces an interactive review gate before writing any files to disk.

---

## Workflow Overview

```
                      ┌────────────────────────────┐
                      │    Read specs/roadmap.md   │
                      │ Identify Next Target Phase │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │ Create Git Feature Branch  │
                      │ feature/<feature-name>     │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │ Review Project Context     │
                      │ specs/mission.md           │
                      │ specs/tech-stack.md        │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                      ┌────────────────────────────┐
                      │ Draft 3 Spec Documents:    │
                      │ 1. requirements.md         │
                      │ 2. plan.md                 │
                      │ 3. validation.md           │
                      └─────────────┬──────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │    MANDATORY INTERACTIVE GATEWAY     │
                 │ Present draft grouped on all 3 files │
                 │      Ask user for confirmation       │
                 └──────────────────┬───────────────────┘
                                    │
                         [Approved by User]
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │ Write files to disk:                 │
                 │ specs/YYYY-MM-DD-<feature-name>/     │
                 │ ├── requirements.md                  │
                 │ ├── plan.md                          │
                 │ └── validation.md                    │
                 └──────────────────────────────────────┘
```

---

## Step-by-Step Procedure

### 1. Identify Target Phase on `specs/roadmap.md`

1. Read [specs/roadmap.md](file:///specs/roadmap.md) (and [TODO.md](file:///TODO.md) if present) to locate the next active or unstarted phase (e.g., status marked as `(Next)` or following the current `(Now)` phase).
2. Extract the phase title, objective, and proposed deliverables.
3. Derive a lowercase, hyphen-separated feature slug (e.g., `user-authentication`, `customer-reviews`, `analytics-dashboard`).
4. If ambiguous or if multiple phases qualify, prompt the user to confirm the target phase.

---

### 2. Create and Checkout Git Feature Branch

1. Check current git status:
   ```bash
   git status
   ```
2. Verify the working directory is clean or existing changes are committed.
3. Create and check out a dedicated branch using the convention `feature/<feature-name>`:
   ```bash
   git checkout -b feature/<feature-name>
   ```

---

### 3. Review Project Context and Architectural Constraints

Before drafting, review the project's foundational guidelines:
- [specs/mission.md](file:///specs/mission.md): Extract the project purpose, core user journeys, and stakeholder priorities (e.g., product requirements, engineering standards, user experience/design goals).
- [specs/tech-stack.md](file:///specs/tech-stack.md): Identify the technology choices, architectural patterns, framework versions, state management/database, and testing frameworks used by the project.
- **Existing Specs**: Inspect any prior directories under `specs/` (e.g., `specs/YYYY-MM-DD-*/`) to maintain consistency in style, conventions, and depth of technical detail.

---

### 4. Draft the Specification Documents

Determine the target directory path using today's local date:
`specs/YYYY-MM-DD-<feature-name>/`.

Draft the contents for the 3 required specification files:

#### Document 1: `requirements.md`
- **Title**: `# Requirements: Phase X — <Feature Name>`
- **Overview & Scope**: Bulleted definition of feature scope, in-scope deliverables, and explicit non-goals or boundary limits.
- **Stakeholder & Architectural Context**:
  - Alignment with stakeholder objectives identified in `specs/mission.md`.
  - Alignment with tech stack constraints identified in `specs/tech-stack.md`.
  - Target users and audience use cases.
- **Architectural Decisions**:
  - Data model and persistence schema changes (entities, fields, types, constraints, migrations).
  - Domain interfaces and service layer contracts.
  - API / Endpoint contracts (methods, routes, payloads, response status codes, error handling).
  - UI components, views, accessibility, and navigation routing integration.

#### Document 2: `plan.md`
- **Title**: `# Plan: Phase X — <Feature Name>`
- **Overview**: Executive summary of implementation strategy and dependencies.
- **Numbered Task Groups**: Organize implementation into progressive, independently verifiable task groups:
  - **Task Group 1: Schema & Types** (domain models, interfaces, DTOs, database migration/DDL).
  - **Task Group 2: Business Logic & APIs** (service implementations, input validation, endpoints/routes).
  - **Task Group 3: UI & User Flows** (components, views, pages, user feedback states, navigation).
  - **Task Group 4: Automated Tests & Verification** (unit tests, integration tests, end-to-end verification).
  Each task must identify target file paths and specific deliverables.

#### Document 3: `validation.md`
- **Title**: `# Validation: Phase X — <Feature Name>`
- **Overview**: Definition of verification steps and merge criteria.
- **Verification Pipeline**:
  - Step 1: Type checking / static analysis (e.g., TypeScript compilation or project linter) with 0 errors.
  - Step 2: Automated test suite (e.g., unit/integration test runner) with specific expected test cases and assertion criteria for the new feature.
  - Step 3: Regression verification ensuring existing project test suites continue to pass.
- **Merge Readiness Checklist**:
  - Verification checklist covering active feature branch, spec completeness, clean typecheck, automated test passes, and clean git working tree.

---

### 5. Mandatory Interactive Gateway (Ask Before Writing)

> [!IMPORTANT]
> **CRITICAL RULE**: You **MUST** present the drafted specifications to the user grouped across these three documents (`requirements.md`, `plan.md`, `validation.md`) and solicit their feedback or confirmation **BEFORE** writing any files or creating any directories on disk.

When presenting:
1. Provide a clear preview or summary for each of the 3 documents:
   - **Requirements**: Scope, domain decisions, API/schema contracts, stakeholder alignment.
   - **Plan**: Numbered task groups and step-by-step implementation tasks.
   - **Validation**: Test commands, expected assertions, and merge criteria.
2. Explicitly ask the user for approval or adjustments across all 3 documents.
3. Incorporate any feedback or revisions requested by the user.

---

### 6. Write Spec Files to Disk

Upon receiving explicit user approval:
1. Create directory `specs/YYYY-MM-DD-<feature-name>/`.
2. Write each file:
   - `specs/YYYY-MM-DD-<feature-name>/requirements.md`
   - `specs/YYYY-MM-DD-<feature-name>/plan.md`
   - `specs/YYYY-MM-DD-<feature-name>/validation.md`
3. Verify that all 3 files exist and are fully populated.

---

### 7. Wrap-up and Next Steps

1. Confirm directory creation and file paths with clickable links.
2. Provide a brief summary of the agreed-upon plan.
3. Prompt the user to proceed with **Task Group 1**.

---

## Verification & Quality Checklist

Before completing feature spec generation:
- [ ] Phase was identified from `specs/roadmap.md`.
- [ ] Feature branch `feature/<feature-name>` is checked out.
- [ ] Directory follows `specs/YYYY-MM-DD-<feature-name>/` format.
- [ ] `requirements.md` aligns with project `specs/mission.md` and `specs/tech-stack.md`.
- [ ] `plan.md` is structured into progressive, numbered task groups.
- [ ] `validation.md` specifies concrete test commands and merge acceptance criteria.
- [ ] User review was requested and approved prior to disk write.
