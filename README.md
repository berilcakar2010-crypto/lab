# Lab

A personal academic operating system. Lab turns a big academic goal into a
graph of small, meaningful milestones. You attempt each one, get feedback, retry
until you master it, see the progress, and then answer the only question that
matters: **what's next?** While you work, Lab records enough raw data to learn
how *you* actually learn best.

```
BIG GOAL → MICRO-MILESTONE → ACTIVE ATTEMPT → IMMEDIATE FEEDBACK → RETRY
        → MASTERY → VISIBLE PROGRESS → "WHAT'S NEXT?" → NEXT MILESTONE
```

## Run it

```bash
npm install
npm run dev        # development server (http://localhost:5173)
npm test           # unit tests (Vitest)
npm run typecheck  # TypeScript, strict
npm run build      # production build → dist/
npm run smoke      # end-to-end browser test against dist/ (run `npm run build` first)
```

`dist/` is a static site; any static host works. Routing is hash-based, so
there is no server configuration. The smoke test uses the Chromium at
`/opt/pw-browsers/chromium` by default; set `CHROMIUM_PATH` to use another one.

### AI providers

Lab works fully offline. It ships hand-written knowledge packs for olympiad
mechanics and Calculus 1, a syllabus parser, and deterministic fallbacks for
every AI role. For AI-generated curricula, hints, guidance and evaluation, open
**Settings → AI provider**, choose **Gemini** or **Groq** and paste an API key.
Keys stay in the browser and are sent only to the chosen provider. If a call
fails or times out, Lab falls back to its offline behaviour and logs the
fallback.

## What's inside

| Area | Where |
|---|---|
| Domain model (subjects, courses, curricula, units, topics, concepts, milestones, questions, attempts, sessions, AI interactions, mastery, retention, experiments, engagement, preferences, raw events) | `src/domain/types.ts` |
| Store: IndexedDB with a localStorage fallback, transactional edits | `src/data/` |
| Curriculum engine: graph edits, split, merge, delete, reorder, validation | `src/engines/curriculum.ts`, `graph.ts` |
| Spec import: validates and repairs AI output | `src/engines/curriculumSpec.ts` |
| Progression engine: status derivation, recommendations, START HERE calibration | `src/engines/progress.ts`, `progression.ts` |
| Session sequencing and evaluation (numeric, expression equivalence, ordering, classification, rubrics) | `src/engines/sessionPlan.ts`, `evaluation.ts`, `expr.ts` |
| Raw analytics and reconstruction | `src/engines/analytics.ts` |
| Statistics, Focus Lab, experiments | `src/engines/statistics.ts`, `focusLab.ts`, `experiments.ts` |
| Integrity audit | `src/engines/integrity.ts` |
| AI layer: provider abstraction plus ten roles | `src/ai/` |
| UI: Home, Session, Builder, Map, Statistics, Focus Lab, Retention, Settings | `src/ui/` |

Principles: the curriculum is independent of the UI; the AI provider can be
swapped; analytics come from raw events; milestones are graph nodes, not
checklist items; the user can always override.

See `docs/IMPLEMENTATION_REPORT.md` for the full report.
