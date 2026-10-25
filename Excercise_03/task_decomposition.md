# Exercise 3 — Task Decomposition

**Project:** KRAFTON PUBG Vietnam Series (PVS) Live Telemetry  
**Component:** `src/components/PubgMatchTelemetry.jsx`  
**Accessibility target:** WCAG 2.2 Level AA  
**Workflow:** Step-by-step implementation → test → atomic Git commit → push at the end of each major task  
**Video recording:** **NOT REQUIRED** for Exercise 3.

> **Assignment source:** Sprint 3 specification and reference-contract slides supplied by the instructor. The two required feature commits are preserved verbatim below. Do not mark a test **PASS** until it has actually been performed.

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

- [ ] Open Chrome DevTools → **Network**, enable **Slow 3G**, and clear the log.
- [ ] Reload. Confirm LOADING and a reserved skeleton; inspect whether a network request is observable **for the chosen mock implementation**.
- [ ] Click **CES → TE → GE** rapidly (while previous work is pending).
- [ ] Confirm last selected squad is GE, outdated results are absent, and cancellation does not show the ERROR banner.
- [ ] If actual HTTP fetches are in flight, inspect *canceled* entries in Network. If using Promise/timer simulation, verify signal cancellation with instrumentation and document that no HTTP cancellation entries are expected.
- [ ] Open **Performance**, measure CLS; target **0.00** for the skeleton transition, report the **measured** number and correct shifts if necessary.

**T3.2 — React Developer Tools (Components and Profiler)**

- [ ] Open React Developer Tools → **Components**; inspect `App`, the selector, and `PubgMatchTelemetry`.
- [ ] Verify default `squadId='te'`, then props update to `ces`, `te`, `ge` on user selection.
- [ ] Verify `view.status` transitions `IDLE` (initial state) → `LOADING` → `SUCCESS` or `ERROR`; inspect `retryTick` increment on Retry.
- [ ] Use **Profiler** to record a squad change, an error and Retry; inspect actual commits and make sure there is no persistent render/effect loop. Do not assume a fixed render count under React StrictMode.
- [ ] Inspect **Console** for React warnings, uncaught rejected promises, and errors caused by aborted requests.
- [ ] If taking evidence screenshots, store them under `evidence/`; **no video required**.
- [ ] Update Section 5 evidence log with observations; make a test/documentation commit:

```bash
git add task_decomposition.md
# Include evidence screenshots only if actually saved, reviewed, and safe to publish.
git commit -m "test(ex3): document Network cancellation and React DevTools audit"
```

### T4 — WCAG 2.2 AA manual and automated accessibility audit

**T4.1 — Manual accessibility checks**

- [ ] **1.3.1 Info and Relationships (A):** semantic section/article, headings, labels, and controls.
- [ ] **1.4.1 Use of Color (A):** status distinctions have textual labels; not blue/orange color alone.
- [ ] **1.4.3 Contrast (AA):** normal text ≥ 4.5:1; large text ≥ 3:1.
- [ ] **1.4.4 Resize Text (AA):** 200% text zoom does not lose content or function.
- [ ] **1.4.10 Reflow (AA):** 320 CSS px equivalent width does not require horizontal scrolling for ordinary content.
- [ ] **1.4.12 Text Spacing (AA):** increased line, paragraph, letter and word spacing does not obscure information.
- [ ] **2.1.1 Keyboard (A):** selection and Retry work with keyboard alone; focus remains usable across state changes.
- [ ] **2.4.7 Focus Visible (AA)** and **2.4.11 Focus Not Obscured (Minimum) (AA):** focus indicator is visible and not covered.
- [ ] **2.5.8 Target Size (Minimum) (AA):** interactive targets meet 24×24 CSS px or a valid exception; prefer 44×44 px.
- [ ] **3.1.1 Language of Page (A):** `<html lang="en">` for English UI; choose `lang="vi"` for a Vietnamese UI.
- [ ] **4.1.3 Status Messages (AA):** loading/updates announced appropriately, and `role="alert"` exposes genuine errors without forcing focus or spamming announcements.
- [ ] **2.3.3 Animation from Interactions (AAA, advisory):** not required for AA, but honor `prefers-reduced-motion` as good practice for pulsing skeleton.

**T4.2 — Automated accessibility scan**

- [ ] Run axe DevTools (or equivalent) against LOADING, SUCCESS, and ERROR states, not only the default screen.
- [ ] Investigate every finding; manually examine remaining cases. **0 automated violations does not establish total WCAG conformance**.
- [ ] Record actual contrast, keyboard, axe, reflow and focus outcomes in Section 5.
- [ ] Commit updated evidence after testing:

```bash
git add task_decomposition.md
git commit -m "test(ex3): document WCAG 2.2 AA accessibility audit"
```

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

## 4. Test matrix

| Test ID | Action | Expected outcome | Status |
|---|---|---|---|
| EX3-01 | Open app with default squad | TE telemetry initiates; four-state lifecycle behaves correctly | Pending |
| EX3-02 | Select CES | CES data; no TE stale result | Pending |
| EX3-03 | Select TE, then GE rapidly | GE wins; older asynchronous work canceled/ignored | Pending |
| EX3-04 | Trigger simulated 35% packet loss (force failure for test) | ERROR alert is displayed, no JS popup | Pending |
| EX3-05 | Press Reconnect Satellite | retryTick increases; LOADING → SUCCESS/ERROR | Pending |
| EX3-06 | Abort pending request | No fake ERROR banner from AbortError | Pending |
| EX3-07 | Slow 3G, watch skeleton | 220px loader; layout stable; measure actual CLS | Pending |
| EX3-08 | React DevTools Components | Correct squadId, view, retryTick | Pending |
| EX3-09 | React DevTools Profiler | No sustained update loop; commits recorded | Pending |
| EX3-10 | Keyboard selection, Retry, focus | Controls fully operable; visible, preserved focus | Pending |
| EX3-11 | Reflow at 320px, 200% zoom, text spacing | No loss of essential content or function | Pending |
| EX3-12 | axe / manual WCAG 2.2 AA assessment in 3 states | No unresolved applicable issues; evidence recorded | Pending |
| EX3-13 | `npm run lint` and `npm run build` | Both succeed | Pending |
| EX3-14 | GitHub remote and commits | Both required commit subjects present; clean Git | Pending |

## 5. QA evidence log (update after testing)

| Area | Evidence / actual observation | Status |
|---|---|---|
| 4-state machine | Not tested yet | Pending |
| 35% simulated loss and deterministic failure case | Not tested yet | Pending |
| AbortController cleanup / rapid CES → TE → GE | Not tested yet | Pending |
| Network Slow 3G and cancellation visibility | Not tested yet | Pending |
| Skeleton height and measured CLS | Not tested yet | Pending |
| Retry / `role="alert"` / keyboard focus | Not tested yet | Pending |
| React DevTools Components | Not tested yet | Pending |
| React DevTools Profiler | Not tested yet | Pending |
| axe DevTools | Not tested yet | Pending |
| Manual WCAG 2.2 AA checks | Not tested yet | Pending |
| Lint and production build | Not tested yet | Pending |
| GitHub push and both mandatory commits | Not tested yet | Pending |

**Evidence policy:** Change `Pending` to `PASS` only for verified outcomes, adding a short observation, date, environment and optionally an evidence screenshot. Use `FAIL` or `BLOCKED` and a corrective commit when checks do not pass. Never invent measurements or screenshot results.

## 6. References

- Instructor's Exercise 3 specification and `PubgMatchTelemetry.jsx` contract slides.
- WCAG 2.2 Level AA: https://www.w3.org/TR/WCAG22/
- React `useEffect`: https://react.dev/reference/react/useEffect
- React Developer Tools: https://react.dev/learn/react-developer-tools
- MDN AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- web.dev layout stability: https://web.dev/articles/cls
