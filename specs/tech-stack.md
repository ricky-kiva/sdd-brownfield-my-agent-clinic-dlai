# Tech Stack: AgentClinic

## Architecture Overview
AgentClinic is architected as a full-stack TypeScript web application powered by Next.js and React, combining server-rendered reliability with client-side interactivity.

## Core Technologies

### Framework & Runtime
- **Runtime**: Node.js (v18+)
- **Application Framework**: [Next.js](https://nextjs.org/) (App Router)
  - Unified server-side execution and client-side rendering
  - Built-in API route handlers for clinical services
  - High reliability and developer ergonomics
- **Language**: TypeScript (`strict: true`)
  - Shared domain interfaces and data models across client and server
  - Strict type checking for ailment definitions, appointment states, and user sessions

### Frontend & UI
- **Library**: React (React Server Components + interactive Client Components)
- **Styling**: [PicoCSS](https://picocss.com/) (`@picocss/pico`) semantic CSS framework combined with custom modern styling
  - Clean semantic HTML elements (`<article>`, `<header>`, `<footer>`, `<nav>`, `.grid`) with zero runtime CSS-in-JS overhead
  - Modern, attractive visual aesthetic meeting marketing standards
  - Responsive layout adapting seamlessly across mobile, tablet, and desktop viewports
- **Browser Compatibility**: Optimized for evergreen modern browsers (Chrome, Edge, Firefox, Safari)

### Data & State Management
- **Database**: SQLite (via `better-sqlite3`), providing fast, reliable, zero-configuration local persistence suitable for clinical data, appointments, and feedback
- **Data Layer**: Strongly typed TypeScript data access layer and schema definitions

### Development & Tooling
- **Build & Package Management**: npm
- **Type Checking**: `tsc` (TypeScript compiler)
- **Testing**: [Vitest](https://vitest.dev/) for unit, repository, and component tests
