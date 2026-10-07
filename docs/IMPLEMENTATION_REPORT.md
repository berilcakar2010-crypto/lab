# Lab — Implementation report

All ten phases were implemented in order. Each phase was verified with unit
tests, a typecheck, a production build and, from Phase 3 on, an end-to-end
browser smoke test before the next phase began. Each phase has its own commit.

## What was implemented

| Phase | Result |
|---|---|
| 1. Audit | The repository was empty (no commits locally or on the remote), so there was nothing to keep, modify or remove. The stack chosen was Vite, React 18, strict TypeScript and Vitest. See `PHASE1_AUDIT.md`. |
| 2. Core data model | All required entities. Milestones carry every required field and the nine statuses; prerequisites form a graph with maintained inverse edges. Status is *derived* from facts (mastery, skips, attempts, retention, prerequisites), so impossible states cannot persist. |
| 3. Curriculum builder and progression | AI builds a curriculum from a one-line request or a pasted/uploaded syllabus. Its output is validated and repaired (unknown prerequisites, loops, malformed questions). Offline: hand-written packs (olympiad mechanics, Calculus 1), a syllabus parser and an honest scaffold. Milestones vary in size (5–180 min) by type. The next-milestone engine ranks options by prerequisites, mastery gaps, recent performance, retention, difficulty fit, unlock value, novelty, engagement history and duration, then returns diverse kinds (Continue, Review, Practice, Challenge, Explore, Boss) with reasons. START HERE calibration uses self-ratings and diagnostic questions; known milestones are skipped only with consent, and never marked mastered. The editor supports edit, delete, reorder, skip, add, merge, split, regenerating a topic and moving milestones, all transactional and graph-validated. |
| 4. Session | One milestone in focus: objective, mastery criterion and progress, context, task, feedback, retry and help. Interactions: multiple choice, numeric, equations (equivalence by sampling), derivations, proofs, explanations, prediction, diagrams and drawing (stylus pressure, palm rejection), graph interpretation, ordering (drag and drop), code, simulation sliders, problem solving, classification and comparison. Completion shows a mastery mark, animated course progress, unlocked milestones, and "What's next?". |
| 5. Progression map | A layered SVG graph (top to bottom for portrait screens) showing mastered, active, in-progress, available, optional, locked, skipped, needs-review, review, challenge and boss milestones, plus START HERE and glowing recommendations. State changes since the last visit animate once. Tapping a node explains it and opens it. |
| 6. AI system | A provider interface with Gemini and Groq implementations (vision for drawings on Gemini). Ten roles run through it, each with a deterministic fallback. The help ladder runs from no help to a small hint, a conceptual hint, a strategic hint, partial guidance, and finally the full solution. It is capped by preference, and answers given after seeing the full solution don't count toward mastery. An answer-leak guard rejects AI text that reveals the result. The advisor only suggests. |
| 7. Raw analytics | Raw events cover sessions, idle time, interruptions, heartbeats, milestones, questions, attempts, retries, hints, AI calls, confidence, input method and stylus use, continuation, recommendations offered and chosen, retention checks, curriculum edits and engagement reports. Active time is derived from the log. `reconstructSession` rebuilds a session from events alone. Data is stored in IndexedDB (alternating slots, automatic migration from localStorage) and can be exported as CSV. |
| 8. Statistics and Focus Lab | Progress, engagement and learning metrics, kept separate from each other. Every rate shows k/n and a Wilson 95% interval and is withheld below a minimum sample. Focus Lab compares ten factors across four outcomes with a two-proportion test, using only associational wording, and tracks evidence for the user's design hypothesis. |
| 9. Retention and experiments | Immediate checks (on the completion screen), delayed checks (with expanding intervals) and transfer checks. A failed check moves the milestone to review, and a correct answer restores it. Six personal experiments alternate conditions across sessions, one at a time. Each is compared on engagement, completion, persistence, continuation, accuracy, retention and transfer, and no winner is named on small samples. |
| 10. Final UX and verification | Home shows the objective, the milestone in progress, recommendations and recent progress. The session summary covers results, a reflection and what's next. Also added: an integrity audit (in Settings and tests), graceful unknown routes, a loading state, and responsive checks at 390 px, 820 px and 1180 px. |

## Preserved features

None existed; the repository was empty (see Phase 1).

## Tests performed

- **Unit tests (61, Vitest):** `npm test`.
  - Phase-specific suites under `src/engines/phase*.test.ts`, `src/ai/phase6.test.ts` and `src/engines/expr.test.ts`.
  - A seeded **fuzz test** runs 4 × 250 random operations (split, merge, delete, connect, remove, reorder, edit, skip, unskip, master, revoke, regenerate topic, attempts, retention). After every step it asserts no loops, dead ends, impossible states, broken edges or dangling references, and that a next step always exists.
- **Typecheck:** `npm run typecheck` (strict TypeScript, unused-code checks on).
- **Production build:** `npm run build` succeeds.
- **End-to-end smoke test (`npm run smoke`):** runs in Chromium at tablet-portrait size with touch, and fails on any console error. It covers:
  - Building a curriculum, calibration, and data persisting across a reload.
  - Editing, merging and splitting milestones; the map.
  - The full session loop: wrong answer → feedback → hint → retry → correct → mastery → immediate check → next milestone.
  - Locked overrides, stylus drawing with palm rejection, rubric self-assessment and the offline guide.
  - Session summary, Home, Statistics, Focus Lab, Retention and experiments.
  - Swapping to Groq (mocked success) and Gemini (mocked failure falling back offline).
  - A boss milestone solved with an equation.
  - Unknown routes, the integrity check, and no horizontal overflow at phone, tablet-portrait and tablet-landscape widths.

## Known limitations

- **Single device.** Data lives in the browser (IndexedDB). There is no account or sync; use export/restore for backups.
- **API keys in the browser.** This is fine for a personal app, but not for a multi-user deployment, which would need a server-side proxy.
- **Offline content is limited.** Only mechanics and Calculus 1 have hand-written, auto-graded content offline. Other subjects become a structured scaffold with rubric self-assessment until an AI provider is connected.
- **Drawings are not stored.** Only stroke and stylus metadata is kept, to keep storage small; the image goes to Gemini for evaluation only. Groq's text models ignore images.
- **No code execution.** Code answers are evaluated by rubric or AI, not run.
- **Only what's observed.** Focus Lab and experiments analyse what is recorded. With one learner, sessions are not independent, so findings are framed as evidence rather than proof. Patterns need several weeks of use to appear.
- **No real-provider calls in tests.** The tests mock Gemini and Groq at the network level; nothing called the real APIs in this environment.
- **UI is in English.** AI-generated content follows the language of the request (e.g. Turkish).
