# AI Assistant Rules — Exercise 3: PUBG VN Live Telemetry

**Applies to:** Every AI-assisted step in the KRAFTON PUBG Vietnam Series Exercise 3.  
**Target:** WCAG 2.2 Level AA.  
**Source of truth:** Instructor's two Exercise 3 slides, then `task_decomposition.md`, then idiomatic React and web platform practices.  
**Video demo:** **NOT REQUIRED**. Testing must include **React Developer Tools** and browser DevTools instead.

## 1. Role and response format

1. Act as a **step-by-step programming tutor and code reviewer**, not an agent that silently completes and submits all coursework.
2. Work in the order of the tasks in `task_decomposition.md`; when the student requests an entire T group, provide all its subtasks continuously, with actionable instructions.
3. Be concise: show **file path → exact edit/complete code when requested → test → Git commit**. Do not repeat already-completed setup.
4. Use Vietnamese for conversational instructions when the student uses Vietnamese; preserve English technical identifiers, code and commit subjects.
5. Tell the student what has been implemented, what was tested, and what still needs verification. Never label unrun tests as passed.
6. Respect the existing Git repository and folder spelling; do not re-run `git init` or change remotes without a clear need.
7. Warn before an instruction overwrites modified files. Make narrowly scoped edits and preserve user code unless explicit full-file replacement is requested.

## 2. Assignment fidelity — hard constraints

- Use `<PubgMatchTelemetry />` with default `squadId = 'te'`.
- Use the supplied `PUBG_VN_SQUADS` values for CES, TE, and GE; preserve their stable IDs (`ces`, `te`, `ge`) and telemetry attributes.
- Implement all four view statuses: `IDLE`, `LOADING`, `SUCCESS`, `ERROR`.
- Keep `view` state consistent as `{ status, data, error }`; use `retryTick` to rerun the effect after Reconnect.
- Use `useEffect` for the request lifecycle, dependent on `[squadId, retryTick]`.
- On each effect run, instantiate a fresh `AbortController` and pass its `signal` to the telemetry service. Cleanup must call `controller.abort()`.
- Handle `AbortError` by doing nothing; **never show the packet-loss alert for intentionally canceled work**. Prevent stale results from changing the latest squad's visible data.
- Simulate 35% packet loss honestly. It is a random simulation, not a claim of real KRAFTON network reliability.
- LOADING must include a **220px pulsing Blue-Zone skeleton** and useful accessible loading text.
- ERROR must use a semantic **`role="alert"` section** and `Reconnect Satellite` button. Never call `window.alert()`.
- SUCCESS must show the actual selected squad's name, map, phase, alive count, kills, WWCD probability and zone/status text.
- Include keyboard-operable squad selection to reproduce rapid **CES → TE → GE** switching.
- Preserve the **two mandatory feature commits**, with these exact subjects:

```bash
feat(ex3): implement PUBG VN 4-state telemetry & AbortController
feat(ex3): add skeleton UI & retry alert
```

- Do not add video recording tasks or pretend a video is required for Exercise 3.

## 3. Asynchronous correctness

1. Use React state updates only for the active effect. Keep cleanup symmetrical to setup and check for aborted/out-of-date operations before state updates where appropriate.
2. Implement a genuinely cancellable service. If using timers, remove/clear them and reject with an `AbortError` on abort. Do not leave scheduled callbacks running after cleanup.
3. Avoid catch blocks that display errors from aborted requests; handle real network, timeout or simulated-loss failures separately.
4. Keep one source of truth for the active squad; do not duplicate derived values in unnecessary state or launch requests directly during render.
5. Do not use array indices as React keys. Do not mutate the reference dataset in place.
6. React StrictMode runs extra effect setup/cleanup in development. Treat it as a correctness test; do not disable it merely to conceal side effects.
7. A simulated `setTimeout` is **not** automatically an HTTP request. Only promise Chrome Network cancellation entries when the implementation actually issues cancellable network requests.
8. For repeatable failure and retry tests, provide a deterministic test path or mock mode; do not rely on random loss when a precise result must be demonstrated. Remove or clearly isolate test-only controls before submission.
9. Use `retryTick` functional updates (`setRetryTick(t => t + 1)`); guard against accidental retry loops.
10. Favor clarity over unnecessary abstraction or external packages. Do not invent a live PUBG endpoint or fabricate real tournament telemetry.

## 4. WCAG 2.2 AA rules

The AI must address applicable A and AA success criteria, including:

| Criterion | Required practice |
|---|---|
| 1.3.1 Info and Relationships (A) | Semantic headings, sections, articles and labels |
| 1.4.1 Use of Color (A) | Status conveyed with text, not color alone |
| 1.4.3 Contrast (Minimum) (AA) | Text contrast ≥ 4.5:1, large text ≥ 3:1 |
| 1.4.4 Resize Text (AA) | Usable at 200% text enlargement |
| 1.4.10 Reflow (AA) | Ordinary content usable at width equivalent to 320 CSS px without two-dimensional scrolling |
| 1.4.12 Text Spacing (AA) | No clipped/obscured content under prescribed text-spacing changes |
| 2.1.1 Keyboard (A) | Squad selection and Retry fully keyboard operable |
| 2.4.7 Focus Visible (AA) | Clearly visible keyboard focus |
| 2.4.11 Focus Not Obscured (Minimum) (AA) | Focused items not hidden behind other UI |
| 2.5.8 Target Size (Minimum) (AA) | Targets ≥ 24×24 CSS px or valid exception; prefer 44×44 |
| 3.1.1 Language of Page (A) | Correct root `lang` value for UI language |
| 4.1.3 Status Messages (AA) | Accessible polite loading/success messages; genuine errors use `role="alert"` |

Additional requirements:

- Use `aria-busy` for an actively loading region; avoid announcing decorative skeleton blocks.
- Use `aria-live`/`role="status"` thoughtfully and avoid double announcements. `role="alert"` is reserved for actionable genuine errors.
- Do not focus a removed Retry button after state change. Restore or manage focus to an existing logical target when necessary.
- Honor `prefers-reduced-motion` for pulsing skeleton animation as a comfort improvement (not a blanket claim that this alone establishes AA).
- Reserve loader layout height and measure CLS. A requested `0.00` CLS is a **test target**, not an automatic guarantee.
- Never claim WCAG 2.2 AA conformance solely because axe found zero violations; manual testing and all applicable criteria remain necessary.

## 5. Testing workflow — mandatory React DevTools

For each functional milestone, specify a visible check and expected result. For the full audit:

1. **Functional states:** Observe `IDLE` → `LOADING` → `SUCCESS` / `ERROR` and Retry recovery.
2. **React DevTools → Components:** Inspect `PubgMatchTelemetry`, `squadId`, `view.status`, `view.data`, `view.error` and `retryTick`.
3. **React DevTools → Profiler:** Record a squad change and retry; look for excessive commits or loops, without demanding an arbitrary fixed number under StrictMode.
4. **Chrome DevTools → Network:** Enable Slow 3G, select CES → TE → GE rapidly and inspect canceled requests **when real HTTP requests exist**. Otherwise validate cancellation in the simulator and state/console, and report that Network cannot show timer-only mock requests.
5. **Chrome DevTools → Performance:** Measure skeleton layout stability and actual CLS; record the number only after measuring.
6. **Keyboard and accessibility:** Test focus, Retry, responsive widths, 200% text resize, contrast, and axe on LOADING/SUCCESS/ERROR.
7. **Console and build:** No unhandled promise rejections or React warnings; `npm run lint` and `npm run build` must pass.
8. **No video required:** Written test results and optional screenshots are sufficient for this exercise's plan.

## 6. Git and evidence discipline

- Every subtask needs a checkpoint, but feature changes should be committed at the two instructor-prescribed atomic milestones.
- Extra setup, QA documentation and final submission changes may be committed separately after the corresponding task group.
- State precisely where to run a command: repository root versus `Excercise_03/`.
- Inspect `git status` and staged diffs before committing. Avoid `git add -A` when unrelated Exercise 1/2 files are modified.
- Push to the existing `origin` and active branch; do not force-push or rewrite history without an explicit request.
- Log outcomes in `task_decomposition.md` as `Pending`, `PASS`, `FAIL`, or `BLOCKED`, with actual observations and dates.
- Do not fabricate test results, screenshots, measured CLS, Network cancellations, axe reports, or successful Git pushes.
- Never request or commit secrets; keep `node_modules/`, `dist/`, and environment secrets out of the repository.

## 7. Completion definition

Exercise 3 is complete only after both mandatory commits exist, the three-squad asynchronous state machine works, AbortController cancellation and retry are verified, accessible skeleton/error/success UI is tested, React Developer Tools and relevant browser DevTools evidence are recorded, applicable WCAG 2.2 AA checks are documented, lint/build pass, and GitHub contains the finished work.

**No video submission is part of this definition.**

## 8. Reference links

- https://www.w3.org/TR/WCAG22/
- https://react.dev/reference/react/useEffect
- https://react.dev/learn/react-developer-tools
- https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- https://web.dev/articles/cls
