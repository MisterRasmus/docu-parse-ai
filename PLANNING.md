# Next.js SaaS App Plan

## Overview

This document outlines the plan and recommended file structure for transitioning the project to a unified Next.js-based SaaS application. The goal is to provide a clear, maintainable, and scalable foundation for PDF-to-JSON/CSV processing as a service.

---

## Phases

### Phase 1: Migrate to Next.js Unified Project
- Scaffold a new Next.js app (TypeScript).
- Move existing React components, pages, and styles into the new structure.

### Phase 2: Backend API Integration
- Implement API routes in `/pages/api/`:
  - `POST /api/upload`: Accepts PDF, processes with Google Document AI (server-side), returns JSON.
  - `GET /api/download?id=...&format=csv|json`: Returns processed result in requested format.
- Store Google Cloud credentials securely (env vars, not exposed to client).
- Implement server-side OAuth token refresh logic.

### Phase 3: Frontend Refactor
- Remove all API key/token handling from the UI.
- Update upload logic to send PDFs to `/api/upload`.
- Update download logic to fetch results from `/api/download`.

### Phase 4: Manual Upload/Download MVP
- User uploads PDF, receives JSON/CSV result via backend.

### Phase 5: SaaS Features (Future)
- Add user authentication, billing, API docs, etc.

---

## Example File Structure

```
/my-saas-app/
  /public/                # Static assets
  /src/
    /pages/
      index.tsx           # Home page
      upload.tsx          # Upload UI
      api/
        upload.ts         # PDF upload & processing API
        download.ts       # Download result API
    /components/          # Reusable UI components
    /lib/                 # Shared utilities (client/server)
    /services/            # Business logic, Google API integration
    /types/               # TypeScript types
  /testdata/              # Sample PDFs for testing
  .env.local              # Environment variables (not committed)
  package.json
  README.md
  PLANNING.md             # This plan
```

---

## Notes

- All Google Cloud credentials and sensitive logic are handled server-side in API routes.
- The frontend interacts only with the backend API, never directly with Google services.
- This structure is easy to understand, maintain, and scale as the app grows.

---