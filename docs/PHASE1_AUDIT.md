# Phase 1 — Audit of the existing application

Date: 2026-10-07 · Branch: `ccr-2af93b6d-f90t4l`

## Findings

| Area | Finding |
|---|---|
| Framework | None. The repository had no commits, locally or on `origin`. |
| Package manager | None configured. Tooling available: Node 22, npm 10, pnpm 10. |
| Routes / pages / components | None. |
| State / storage / auth | None. |
| AI integration | None. |
| Curriculum logic / analytics | None. |
| Tests / build config / env vars | None. |

The project is greenfield, so nothing gets rewritten and there is nothing to preserve.

## Classification

- **KEEP**: nothing exists yet.
- **MODIFY**: nothing exists yet.
- **REMOVE**: nothing exists yet.
- **ADD**: the whole application, built in phases 2–10 (see below).
- **RISK**
  - *No backend.* Everything runs client-side, so data lives in browser storage. To guard against data loss, writes are versioned and JSON export/import is provided.
  - *AI keys in the browser.* Gemini and Groq are called directly from the client with a key the user enters. This is acceptable for a single-user personal app but not for a multi-user deployment.
  - *AI unavailable or offline.* A deterministic local provider is the fallback for every AI role, so the learning loop never depends on network access.
  - *Unvalidated AI output.* AI curriculum JSON is validated and repaired before it is stored, including removal of prerequisite cycles.

## Chosen stack

- Vite + React + TypeScript (strict).
- Vitest for unit tests of the pure engines.
- A small hash router written in-house; no router dependency.
- Plain CSS with design tokens: dark academic theme, portrait/tablet-first.
- Pointer Events for stylus/touch: `pointerType === "pen"` is detected and recorded.

## Commands

- `npm install`
- `npm run dev`: development server
- `npm test`: unit tests
- `npm run typecheck`
- `npm run build`: production build into `dist/`

## Architecture (target)

```
src/
  domain/      types for every entity (Phase 2)
  data/        persistent store + repository API (Phase 2)
  engines/     curriculum, milestone, progression, analytics,
               statistics, focusLab, retention, experiments, evaluation
  ai/          provider abstraction (gemini, groq, local) + role engine
  ui/          pages + components
```

Curriculum logic lives under `engines/` and is independent of the UI. The AI provider can be swapped. Analytics are derived from a raw event log.
