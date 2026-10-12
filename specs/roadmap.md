# Roadmap: AgentClinic

## Implementation Strategy
Implementation is structured into very small, incremental micro-phases of work based on [TODO.md](../TODO.md) and stakeholder priorities. Each phase is independently testable and verifiable.

---

### Phase 1: Feedback Form (Now)
- **Objective**: Allow agents and human caregivers to submit session and clinic feedback.
- **Scope & Deliverables**:
  - Design accessible feedback form component with semantic PicoCSS inputs (satisfaction rating, comments, agent ID / email).
  - Implement server route / API handler to validate and store feedback entries in SQLite.
  - Display user-friendly submission confirmation and error handling.
  - Add unit/integration tests verifying validation and storage.

---

### Phase 2: Customer Reviews (Next)
- **Objective**: Showcase testimonials and clinical satisfaction ratings from recovering agents.
- **Scope & Deliverables**:
  - Create database schema and queries for approved agent customer reviews.
  - Implement customer reviews feed / display component with ratings, testimonials, and agent badges.
  - Connect feedback submission flow to review moderation or approval.
  - Add automated tests for reviews retrieval and rendering.

---

### Phase 3: About Us Page with Address & Map (Next)
- **Objective**: Establish clinic presence and physical/virtual location details for marketing and transparency.
- **Scope & Deliverables**:
  - Build responsive "About Us" page detailing AgentClinic's mission, founding story, and clinical staff.
  - Include clinic facility address, operating hours, and contact information.
  - Embed an interactive or accessible map component showing the clinic location.
  - Ensure full responsiveness and aesthetic appeal across all modern browsers.
