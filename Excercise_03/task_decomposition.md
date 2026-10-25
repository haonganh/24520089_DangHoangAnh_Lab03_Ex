# Exercise 3 — Task Decomposition

**Project:** KRAFTON PUBG Vietnam Series (PVS) Live Telemetry  
**Component:** `src/components/PubgMatchTelemetry.jsx`  
**Accessibility target:** WCAG 2.2 Level AA  
**Workflow:** Step-by-step implementation → test → atomic Git commit → push at the end of each major task  
**Video recording:** **NOT REQUIRED** for Exercise 3.

> **Assignment source:** Sprint 3 specification and reference-contract slides supplied by the instructor. The two required feature commits are preserved verbatim below. Test results marked **PASS** below are based on the student’s confirmation on **2026-10-25**; values not supplied by the student are not invented.

## Current progress (updated 2026-10-25)

| Task | Scope | Status |
|---|---|---|
| T0 | Setup and Markdown documentation | **Completed — student-reported** |
| T1 | Dataset, four-state lifecycle, AbortController; mandatory feature commit 1 | **Completed — student-reported** |
| T2 | 220px skeleton, Retry, accessible error UI; mandatory feature commit 2 | **Completed — student-reported** |
| T3 | React Components, Profiler, rapid switching, AbortError, Slow 3G, CLS | **PASS — student-reported** |
| T4 | Comprehensive manual WCAG 2.2 AA and automated axe audit | **PASS — student-reported (2026-10-25)** |
| T5 | Final lint/build, README, GitHub submission | **Pending** |

**Scope note:** Exercise 3 uses a timer-based simulated telemetry Promise, not a real HTTP telemetry request. Successful cancellation/stale-response tests do **not** imply Chrome Network contains canceled HTTP requests. The student reports the CLS check passed, but has not supplied its numeric measurement; record that number when available. **No video recording is required.**

## 1. Assignment contract and acceptance criteria

Build a fault-tolerant live esports radar for Vietnamese PUBG professional squads. Preserve these core requirements:

- Component: `<PubgMatchTelemetry />`, default prop `squadId = 'te'`.
- Teams: Cerberus Esports (CES), The Expendables (TE), Genius Esports (GE).
- State machine: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`.
- On squad changes and retry, re-run the telemetry effect. Every effect run creates its **own** `AbortController`; cleanup calls `controller.abort()`.
- Treat `AbortError` as expected cancellation; never render a false error banner from an aborted/obsolete request.
- Simulate **35% packet loss** and enough latency to inspect LOADING. Ensure simulation supports cancellation and deterministic testing.
- While loading, show a **220px-high pulsing Blue-Zone skeleton** and an accessible loading status.
- In ERROR, render an accessible `<section role="alert">` with **Blue-Zone Link Lost** and a **Reconnect Satellite** button; **do not use `window.alert()`**.
- In SUCCESS, show the selected squad's relevant telemetry, including name, map, phase, surviving players, kills, WWCD probability, and status.
- Squads must be selectable with keyboard-operable, visibly focused controls. Their accessible names must identify the squad.
- Inspect React Developer Tools (**Components**, optionally **Profiler**) and Chrome DevTools **Network** under **Slow 3G**; rapidly switch **CES → TE → GE** and verify stale responses do not overwrite the latest squad.
- **No demo video** is required. Use a written QA evidence log and optional screenshots instead.

### Reference squad data (keep these values)

Create `src/data/pubg-vn-telemetry-spec.js`:

```js
export const PUBG_VN_SQUADS = [
  { id: 'ces', name: 'Cerberus Esports', map: 'Erangel', phase: 'Phase 6',
    alive: 4, kills: 14, wwcdProb: '68%', status: 'In Safe Zone' },
  { id: 'te', name: 'The Expendables', map: 'Miramar', phase: 'Phase 7',
    alive: 4, kills: 18, wwcdProb: '82%', status: 'Holding High Ground' },
  { id: 'ge', name: 'Genius Esports', map: 'Taego', phase: 'Phase 5',
    alive: 3, kills: 9, wwcdProb: '41%', status: 'Rotating Blue Zone' },
];
```

Use the slide's literal properties (`id`, `name`, `map`, `phase`, `alive`, `kills`, `wwcdProb`, `status`) and stable IDs. Do not invent an external PUBG API or claim this sample data is live tournament data.

## 2. Required Git commit contract

These are the **two mandatory atomic feature commits**, with the exact subjects from the slide:

```bash
git commit -m "feat(ex3): implement PUBG VN 4-state telemetry & AbortController"
git commit -m "feat(ex3): add skeleton UI & retry alert"
```

Do not split one mandatory commit into several implementation commits. Instead, follow its subtasks, test, then make the corresponding commit. Separate setup, accessibility refinements, DevTools evidence, and documentation may receive their **own** commits. Never create an empty commit purely to match a plan. Push after the task group, not necessarily after every subtask.

## 3. Tasks and subtasks

### T0 — Project setup and documentation

**T0.1 — Prepare Exercise 3 directory**

- [ ] At the Lab 03 repository root, create `Excercise_03/` (or keep the instructor's required existing directory spelling).
- [ ] Place `task_decomposition.md` and `ai_rule.md` in the Exercise 3 directory **before** writing implementation code.
- [ ] Confirm `git status` from the repository root; **do not** run `git init` or `git remote add origin` again if the parent repository is already configured.
- [ ] Commit only the two documents:

```bash
git add Excercise_03/task_decomposition.md Excercise_03/ai_rule.md
git commit -m "docs(ex3): add WCAG 2.2 AA task plan and AI rules"
```

**T0.2 — Initialize React + Vite**

- [ ] Enter `Excercise_03`; run `npm create vite@latest . -- --template react` (if prompted, **keep the existing Markdown files**).
- [ ] Run `npm install`, `npm run dev`, and open the Vite local URL (the port may be 5173/5174/another available port).
- [ ] Verify `package.json` and `.gitignore`; ensure `node_modules/` and `dist/` are not committed.
- [ ] Commit generated app files:

```bash
git add Excercise_03
git commit -m "chore(ex3): initialize React Vite telemetry app"
```

> Git commands above assume the working directory is the **repository root**. If already inside `Excercise_03`, use `git add .` instead of `git add Excercise_03`.

### T1 — Telemetry dataset, state machine, and abortable effect

**T1.1 — Normalize squad telemetry (part of Mandatory Commit 1)**

- [ ] Create `src/data/pubg-vn-telemetry-spec.js` with the **exact three squad records** in Section 1.
- [ ] Create `src/components/PubgMatchTelemetry.jsx`; export a component with default `squadId = 'te'`.
- [ ] Model **one state object** for the view, e.g. `{ status: 'IDLE', data: null, error: null }`, and one `retryTick` number state. Keep status/data/error consistent.
- [ ] Render the component from `src/App.jsx`, initially for TE; prepare a `selectedSquadId` state in the parent or a dedicated selector component.
- [ ] Verify that all keys/selection values use `ces`, `te`, and `ge` rather than array indices.

**T1.2 — Implement abortable telemetry pipeline (part of Mandatory Commit 1)**

- [ ] Implement `fetchKraftonTelemetry(squadId, { signal })` in `src/services/telemetry.js` or an equivalent service. It must return a **Promise**, use the local squad dataset, simulate latency and **35% loss**, and support `AbortSignal` cancellation.
- [ ] For realistic DevTools **Network** evidence, consider fetching same-origin mock JSON in `public/` with a passed `signal`; any artificial latency must *also* listen for cancellation. If the simulation uses timers only, report that Network cannot display those synthetic operations as HTTP requests.
- [ ] In `useEffect`, create a new `AbortController`, set `LOADING`, call `fetchKraftonTelemetry(squadId, { signal: controller.signal })`, and set `SUCCESS` on resolution.
- [ ] In `.catch`, **return immediately on `err.name === 'AbortError'`**; set `ERROR` only for the active, genuinely failed operation. Cleanup returns `() => controller.abort()`.
- [ ] Include `[squadId, retryTick]` in effect dependencies. Ensure stale asynchronous work cannot update the view after cleanup; add an active-request guard when necessary.
- [ ] In development StrictMode, effect setup/cleanup may execute extra times. Verify it remains correct; do **not** disable StrictMode merely to hide broken cleanup.
- [ ] Test TE initially, then rapid CES → TE → GE switching. A cancelled request must not display an error or overwrite GE's telemetry.
- [ ] Run `npm run lint` and `npm run build`; correct any failures.
- [ ] Create **Mandatory Commit 1**:

```bash
git add src/App.jsx src/components/PubgMatchTelemetry.jsx src/data src/services
git commit -m "feat(ex3): implement PUBG VN 4-state telemetry & AbortController"
```

> If a listed path has not been created, omit it from `git add`; do not add nonexistent paths. Ensure the staged diff includes only this milestone.

### T2 — Skeleton, retry alert, and resilient user interface

**T2.1 — LOADING and SUCCESS interface (part of Mandatory Commit 2)**

- [ ] Create `src/components/PubgMatchTelemetry.module.css` (and any needed global layout CSS).
- [ ] LOADING: display an accessible, **220px-height** skeleton that visibly pulses. Provide real text such as `Syncing KRAFTON Radar…` for screen readers; set `aria-busy="true"` on the loading region.
- [ ] Prevent cumulative layout shift by reserving space for the skeleton and/or providing a sensible minimum height for the corresponding content. Measure actual CLS in DevTools; **do not claim 0.00 without checking**.
- [ ] SUCCESS: render a semantic `<article>` with squad name and requested telemetry fields. A concise polite status announcement may be used; avoid repeatedly announcing the entire card.
- [ ] Ensure responsive layout at 320 CSS px and 200% zoom, readable contrast, no clipped text, and reduced-motion treatment for skeleton animation.

**T2.2 — ERROR and retry recovery (part of Mandatory Commit 2)**

- [ ] ERROR: render a visible `<section role="alert">` containing `Blue-Zone Link Lost: ...` and `<button type="button">Reconnect Satellite</button>`.
- [ ] `onClick` increments `retryTick` via functional update `setRetryTick(t => t + 1)`; the effect must re-enter LOADING then SUCCESS/ERROR naturally.
- [ ] Never call `window.alert()`; never classify `AbortError` as a genuine packet-loss error.
- [ ] A Retry button must remain keyboard operable. After Retry, account for focus when ERROR unmounts; use a meaningful focus target or persistent status messaging instead of leaving focus lost.
- [ ] Provide an unambiguous current squad selection and a usable, visible `:focus-visible` outline.
- [ ] Test error recovery using a **deterministic forced-error scenario** (e.g., configurable test mode or mocked service). Do not rely only on random 35% failures for verification.
- [ ] Run `npm run lint` and `npm run build`; create **Mandatory Commit 2**:

```bash
git add src/components src/index.css src/App.jsx
git commit -m "feat(ex3): add skeleton UI & retry alert"
```

### T3 — Chrome Network and React Developer Tools verification

**T3.1 — Network Slow 3G, cancellation and stale-response test**

- [x] Open Chrome DevTools → **Network**, enable **Slow 3G**, and clear the log.
- [x] Reload. Confirm LOADING and a reserved skeleton; inspect whether a network request is observable **for the chosen mock implementation**.
- [x] Click **CES → TE → GE** rapidly (while previous work is pending).
- [x] Confirm last selected squad is GE, outdated results are absent, and cancellation does not show the ERROR banner.
- [x] **Timer-based mock:** No HTTP request cancellation entries expected in Network; cancellation and stale responses were checked via app/React state behavior. **HTTP Network cancellation: N/A.**
- [x] Check CLS during the skeleton transition: **PASS (student-reported)**; numeric CLS measurement **not provided**. Do not record `0.00` or any other value without actual evidence.

**T3.2 — React Developer Tools (Components and Profiler)**

- [x] Open React Developer Tools → **Components**; inspect `App`, the selector, and `PubgMatchTelemetry`.
- [x] Verify default `squadId='te'`, then props update to `ces`, `te`, `ge` on user selection.
- [x] Verify `view.status` transitions `IDLE` (initial state) → `LOADING` → `SUCCESS` or `ERROR`; inspect `retryTick` increment on Retry.
- [x] Use **Profiler** to record a squad change, an error and Retry; inspect actual commits and make sure there is no persistent render/effect loop. Do not assume a fixed render count under React StrictMode.
- [x] Inspect **Console** for React warnings, uncaught rejected promises, and errors caused by aborted requests.
- [ ] Optional: save DevTools evidence screenshots under `evidence/`; **no video required**. Screenshots are not yet provided.
- [x] Update Section 5 evidence log with student-reported observations. After replacing this file in the project, make the test/documentation commit:

```bash
git add task_decomposition.md
# Include evidence screenshots only if actually saved, reviewed, and safe to publish.
git commit -m "test(ex3): document Network cancellation and React DevTools audit"
```

### T4 — WCAG 2.2 AA manual and automated accessibility audit

**T4.1 — Manual accessibility checks — COMPLETED (student-reported, 2026-10-25)**

- [x] **1.3.1 Info and Relationships (A):** semantic section/article, headings, labels, and controls.
- [x] **1.4.1 Use of Color (A):** status distinctions include text, not color alone.
- [x] **1.4.3 Contrast (AA):** normal text ≥ 4.5:1; large text ≥ 3:1, as applicable. **Pass reported; ratios not provided.**
- [x] **1.4.4 Resize Text (AA):** 200% text resizing without content or function loss.
- [x] **1.4.10 Reflow (AA):** 320 CSS px equivalent width without horizontal scrolling for ordinary content.
- [x] **1.4.12 Text Spacing (AA):** increased line/paragraph/letter/word spacing without loss of content.
- [x] **2.1.1 Keyboard (A):** squad selection and Retry usable by keyboard; focus remains usable.
- [x] **2.4.7 Focus Visible (AA)** and **2.4.11 Focus Not Obscured (Minimum) (AA):** focus indicator visible and not obscured.
- [x] **2.5.8 Target Size (Minimum) (AA):** interactive targets meet 24×24 CSS px or applicable spacing exceptions.
- [x] **3.1.1 Language of Page (A):** page language matches the UI.
- [x] **4.1.3 Status Messages (AA):** loading and genuine errors are announced appropriately; `role="alert"` does not create misleading abort alerts.
- [x] **Reduced motion (advisory):** respect `prefers-reduced-motion` for pulsing skeleton; this is good practice and not a blanket substitute for WCAG success criteria.

**T4.2 — Automated accessibility scan — COMPLETED (student-reported, 2026-10-25)**

- [x] axe DevTools audit completed for the application's relevant LOADING, SUCCESS, and ERROR experiences, per student confirmation.
- [x] Student confirms all checked accessibility items passed. **No axe issue counts, raw report, or screenshots were supplied**, so no specific count is asserted here.
- [x] Record the results in Section 4 and Section 5. This is a report of completed checks, **not independent certification** of full WCAG 2.2 AA conformance.
- [ ] After replacing this Markdown file in the project, commit updated evidence once (unless already committed):

```bash
git add task_decomposition.md
git commit -m "test(ex3): document WCAG 2.2 AA accessibility audit"
```

#### T4 — WCAG 2.2 AA Accessibility QA results (2026-10-25)

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Semantic HTML | Correct semantic structure | Student confirms check passed | **PASS — reported** |
| Color Contrast | WCAG AA thresholds met | Student confirms check passed; ratios not supplied | **PASS — reported** |
| Responsive 320px | No horizontal overflow | Student confirms check passed | **PASS — reported** |
| Zoom 200% | No content loss | Student confirms check passed | **PASS — reported** |
| Text Spacing | No clipped or missing content | Student confirms check passed | **PASS — reported** |
| Keyboard Navigation | All controls operable | Student confirms check passed | **PASS — reported** |
| Focus Visible | Clear unobscured focus indicator | Student confirms check passed | **PASS — reported** |
| Target Size | Meets WCAG 2.2 AA minimum or exception | Student confirms check passed | **PASS — reported** |
| Loading Announcement | Accessible loading status | Student confirms check passed | **PASS — reported** |
| Error Alert | Accessible error announcement | Student confirms check passed | **PASS — reported** |
| Retry Focus | Focus handled correctly | Student confirms check passed | **PASS — reported** |
| axe DevTools | No unresolved applicable violations | Student confirms audit passed; raw scan report not provided | **PASS — reported** |

### T5 — Final integration and GitHub submission (no video)

**T5.1 — Final validation and README**

- [ ] Run `npm run lint` and `npm run build` successfully from `Excercise_03`.
- [ ] Check all three teams, packet-loss ERROR, Retry, rapid switching, state recovery, and keyboard use one final time.
- [ ] Write `README.md` with scope, setup, simulation disclosure, three squads, state machine, use of AbortController, keyboard/accessibility notes, test results and how to reproduce packet loss.
- [ ] Confirm both Markdown files are present, no secrets, and ignored build/dependency folders remain untracked.
- [ ] Commit changes:

```bash
git add README.md task_decomposition.md
git commit -m "docs(ex3): finalize telemetry validation and submission"
```

**T5.2 — Push and verify**

- [ ] From anywhere inside the existing repository, run `git push origin main` (unless your actual branch name differs).
- [ ] Run `git status`, `git log --oneline -15`, and `git remote -v`.
- [ ] Verify **both mandatory feature commits** and the two Markdown documents are visible on GitHub.
- [ ] Ensure `nothing to commit, working tree clean` and no unpushed commits.
- [ ] **Do not add a video**. Exercise 3 submission is source, docs, and real test evidence only.

## 4. Test matrix (updated 2026-10-25)

| Test ID | Action | Expected outcome | Actual result / source | Status |
|---|---|---|---|---|
| EX3-01 | Open app with default squad | TE starts telemetry lifecycle | Student confirms correct | **PASS — reported** |
| EX3-02 | Select CES | CES telemetry, no stale TE display | Student confirms correct | **PASS — reported** |
| EX3-03 | Rapid CES → TE → GE | Latest squad wins; stale results ignored | Student confirms correct | **PASS — reported** |
| EX3-04 | Simulated packet loss | Accessible ERROR; no JS alert | Student confirms correct | **PASS — reported** |
| EX3-05 | Reconnect Satellite | Retry increments; loading/recovery occurs | Student confirms correct | **PASS — reported** |
| EX3-06 | Abort pending work | No false ERROR banner from AbortError | Student confirms correct | **PASS — reported** |
| EX3-07 | Slow 3G, skeleton, CLS | Loading shown; stable layout | Student confirms passing check; CLS number not supplied | **PASS — reported; measurement pending documentation** |
| EX3-08 | React DevTools Components | Correct selected squad, view and retryTick | Student confirms correct | **PASS — reported** |
| EX3-09 | React DevTools Profiler | Recorded commits, no update loop | Student confirms correct | **PASS — reported** |
| EX3-10 | Keyboard, Retry, focus | Controls usable and focus visible | Student confirms T4 manual checks passed | **PASS — reported** |
| EX3-11 | 320px reflow, 200% zoom, spacing | No loss of content or functionality | Student confirms T4 manual checks passed | **PASS — reported** |
| EX3-12 | axe + manual WCAG audit for all states | No unresolved applicable issues | Student confirms completion; detailed report not supplied | **PASS — reported** |
| EX3-13 | `npm run lint` and `npm run build` | Both succeed in final validation | Final T5 check not yet confirmed | **Pending** |
| EX3-14 | GitHub push and required commits | Both commit subjects present, working tree clean | Final submission not yet confirmed | **Pending** |

## 5. QA evidence log — T3 and T4 verified by student (2026-10-25)

| Area | Evidence / actual observation | Status |
|---|---|---|
| Four-state lifecycle (`IDLE`, `LOADING`, `SUCCESS`, `ERROR`) | Functional checks completed, per student | **PASS — reported** |
| 35% simulated packet loss / ERROR recovery | Failure and recovery behavior checked, per student; exact random sequence not recorded | **PASS — reported** |
| AbortController / rapid CES → TE → GE | No stale squad data or spurious abort errors observed, per student | **PASS — reported** |
| Chrome Network Slow 3G | Loading/skeleton behavior checked, per student; mock uses timer rather than HTTP | **PASS — reported** |
| Canceled HTTP requests in Network | No real telemetry HTTP fetch in the timer-based mock | **N/A** |
| Skeleton 220px / CLS | Visual/layout check passed, per student; measured CLS number not supplied | **PASS — reported; numeric evidence pending** |
| Retry, `role="alert"`, status transitions | Functional checks completed, per student | **PASS — reported** |
| React DevTools Components | Selected squad, view and retryTick checked, per student | **PASS — reported** |
| React DevTools Profiler | Update commits recorded; no update loop observed, per student | **PASS — reported** |
| React Console | No unhandled AbortError or React runtime issue in T3 tests, per student | **PASS — reported** |
| Manual WCAG 2.2 AA audit across states (T4) | Completed per student confirmation; detailed measurements not supplied | **PASS — reported** |
| axe DevTools scan across states (T4) | Completed per student confirmation; raw results not supplied | **PASS — reported** |
| Final lint and build (T5) | Not yet recorded | **Pending** |
| GitHub push and both mandatory commits (T5) | Not yet independently verified | **Pending** |

### Test completion record

- **T3 outcome:** **PASS — student-confirmed on 2026-10-25.**
- **T4 outcome:** **PASS — student-confirmed on 2026-10-25** (manual accessibility checks and axe DevTools).
- **Evidence limitations:** No screenshots, numeric CLS measurement, contrast ratios, axe raw scan report or timestamped Profiler export have been supplied for this update. These can be attached later; do not fabricate them.
- **Next task:** T5 — final lint/build, README, GitHub submission. T4 checks do not need repeating unless the UI changes.
- **Video:** Not required for Exercise 3.

**Evidence policy:** Distinguish `PASS — reported` from independently audited evidence. Change Pending to PASS only after actually testing. Use FAIL/BLOCKED when needed, and do not invent measurements.

## 6. References

- Instructor's Exercise 3 specification and `PubgMatchTelemetry.jsx` contract slides.
- WCAG 2.2 Level AA: https://www.w3.org/TR/WCAG22/
- React `useEffect`: https://react.dev/reference/react/useEffect
- React Developer Tools: https://react.dev/learn/react-developer-tools
- MDN AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- web.dev layout stability: https://web.dev/articles/cls
