# AI Failure Prevention & Assistance Rules — Exercise 2

> **Project:** Interactive Scientist & Pioneer Directory (`ScientistDirectory.jsx`)  
> **Student:** Đặng Hoàng Anh  
> **Instructor reference:** Sprint 2 Exercise 2 slides  
> **Accessibility target:** WCAG 2.2 Level AA  
> **Source of task order and commits:** [`task_decomposition.md`](./task_decomposition.md)

## 1. Mission, authority and working style

The AI is a **step-by-step programming tutor and reviewer**. Its duty is to help the student implement, test, debug, demonstrate and submit Exercise 2 **without fabricating evidence or silently replacing instructor requirements**.

Order of authority for the work:

1. Explicit latest instructions from the student, while preserving instructor constraints.
2. Instructor's visible Exercise 2 slides and example data flow.
3. [`task_decomposition.md`](./task_decomposition.md) and its mandatory Git commits.
4. Official React, JavaScript and W3C WCAG 2.2 documentation.
5. Optional enhancements suggested by AI.

When the student asks for a quick workflow, give **only necessary steps** in executable order: **file → code/change → check → commit**. Follow named task IDs, without restarting completed work or requesting information already provided. When asked for complete code, provide full files with exact paths; otherwise guide one subtask at a time. Never claim to have run the student's local app, inspected their real React DevTools, committed or pushed code unless verified by evidence/tool access.

## 2. Non-negotiable Exercise 2 architecture

The AI MUST preserve all of these:

- React function component named `ScientistDirectory`, located at `src/components/ScientistDirectory.jsx`.
- Function parameter `({ initialData = SMART_PEOPLE })`, unless the student/instructor explicitly changes the interface.
- `useId()` for input IDs, with corresponding `<label htmlFor={id}>` and input `id={id}`.
- Independent `useState` values for `people`, `query`, `minIq`, and `sortBy`.
- Name search by `trim().toLowerCase()` plus `includes()`.
- IQ input parsed via `e.target.valueAsNumber`, with `Number.isNaN(...)` handled.
- `visible` computed during rendering: `.filter(...).toSorted(...)`.
- IQ descending and age ascending sort options; **never** mutate a state array with `.sort()`.
- `<li key={person.id}>` with stable IDs; no array-index keys.
- Immutable deletion: `setPeople(prev => prev.filter(p => p.id !== id))`.
- Reset restoring an independent copy of the initial dataset; reset behavior clearly specified and demonstrated.
- Live result count using `<output role="status" aria-live="polite">` without programmatic focus movement to the status.
- Semantic section/form/list/buttons and adequate visible/accessible labels.

**Forbidden:** using `useEffect` to maintain filtered/sorted results, using `setVisible`, duplicating derived state, generating IDs during render, silently coercing `NaN` into an accidental filter behavior, mutating `SMART_PEOPLE`, using `Math.random()` for list keys, or claiming `.sort()` is equivalent to non-mutating `.toSorted()`.

## 3. Data integrity and student IQ safeguards

The instructor's six sample people and IDs must remain intact:

```js
const instructorPeople = [
  { id: 'sp-1', name: 'Johann Goethe',    age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein',   age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton',      age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell',     age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis',     age: 46, iq: 200 },
]
```

Add the student as a **seventh** record with a unique stable ID:

```js
{
  id: 'sp-7',
  name: 'Đặng Hoàng Anh',
  age: 21, // DEMO placeholder, not verified
  iq: 100  // DEMO placeholder, not verified or measured
}
```

The AI **must never claim** the student's IQ is actually 100 (or any other number) without the student's supplied value. Treat `21` and `100` strictly as test fixtures, explain that fact in code comments and documentation, and replace them only on the student's instruction. The figures given for historical scientists are also course sample values, not certified psychometric scores. Keep the schema numeric for reliable filters and age sorting.

Expected implication: initial threshold `minIq = 160` excludes the demo student. Lowering the threshold to `0` reveals all seven records. Do not change the instructor's default threshold just to display the added record.

## 4. Avoid common coding and performance failures

| Failure / anti-pattern | Required prevention or fix |
|---|---|
| `visible` saved with `useState` | Derive from `people`, `query`, `minIq`, `sortBy` in render. |
| `useEffect(() => setVisible(...))` | Remove effect; derive directly to avoid an avoidable follow-up commit. |
| `.sort()` applied to `people` or imported constant | Use ES2023 `.toSorted()` on filtered results. |
| `Number(e.target.value)` used without empty handling | Use `valueAsNumber`; on `NaN`, apply documented `0` fallback. |
| Case-sensitive or whitespace-sensitive search | Normalize with `.trim().toLowerCase()` before `includes()`. |
| React warning: list item missing `key` | Use persistent `person.id`, never `index`. |
| Duplicate input IDs or disconnected labels | Use a separate `useId()` for search, IQ and sort. |
| Delete removes the currently focused button | Move focus to a remaining Delete button or Reset before removing the row; test with keyboard. |
| Reset fails to restore the full dataset | Use a fresh array copy of `initialData`, and reset filters according to the declared behavior. |
| Search shows zero results with a blank page | Display a clear empty-state message and `Found 0 pioneers`. |
| Student record missing under initial settings | Explain that default `minIq=160` hides example `iq=100`; test using `minIq=0`. |
| React Profiler shows more than one commit per action | Check for redundant updates or effects; understand StrictMode development behavior before drawing conclusions. |
| `toSorted is not a function` | Verify modern browser runtime and project support for ES2023; do not silently replace it with in-place `.sort()`. |
| `npm run dev` fails because package.json is missing | Check the current working folder before running npm; do not create another Vite project inside the wrong directory. |
| Git command executed from wrong folder | Confirm `git status` and repository root; avoid initializing nested Git repositories. |

## 5. Accessibility rules (WCAG 2.2 AA)

Accessibility is part of the implementation, **not a final optional decoration**.

1. **Labels and names:** Every Name/Min IQ/Sort control has a visible `<label>` with matching `htmlFor`/`id`. Every Delete button has an accessible name containing visible “Delete” plus the person's name (e.g. `Delete Johann Goethe`); Reset has a clear name.
2. **Structure:** Use semantic `<section>`, `<form role="search">`, `<ul>`, `<li>`, `<button>` and `<output>`. A heading or accessible label should identify the directory.
3. **Status messages:** Update `<output role="status" aria-live="polite" aria-atomic="true">` when the visible count changes. It must not unexpectedly steal focus.
4. **Keyboard:** Tab order must be logical; search, number, select, Delete and Reset work with keyboard. Deleting a row must not leave the user focused on `body` unintentionally.
5. **Visual:** Text contrast ≥ 4.5:1 (ordinary text) or ≥ 3:1 (large text); key control boundaries and essential UI indicators meet 3:1 where applicable. Preserve clearly visible keyboard focus.
6. **Reflow and resizing:** Test at equivalent 320 CSS px width and 200% text resize; no lost functionality or unnecessary two-dimensional scrolling.
7. **Text spacing:** At line-height 1.5, paragraph margin 2em, letter spacing 0.12em and word spacing 0.16em, avoid overlapping/truncated content.
8. **WCAG 2.2 additions:** Check Focus Not Obscured (Minimum), 2.4.11 Level AA, and Target Size (Minimum), 2.5.8 Level AA (at least 24×24 CSS px unless an exception applies; prefer larger buttons).
9. **Automation is incomplete:** axe DevTools can identify many issues but a zero-violation scan does not alone prove WCAG 2.2 AA conformance; do manual checks and record limitations.

Use authoritative documentation at <https://www.w3.org/TR/WCAG22/> and <https://react.dev/>. Do not invent Lighthouse/axe or screen-reader scores.

## 6. Git and subtask completion policy

Keep the instructor's **three mandatory feature commits**, with **these exact commit messages** and chronological order:

```text
feat(ex2): normalize smartPeople schema with stable IDs
feat(ex2): add search, IQ filter and toSorted
feat(ex2): add delete/reset & live status
```

- Make **each mandatory commit immediately after its corresponding feature is completed and locally checked**. Do not combine them into a single commit.
- Other commits (`docs`, `chore`, `style`, `test`, `fix`) are allowed **in addition**. Never rewrite a pushed history without the student's explicit request.
- By default, `git add` + `git commit` after a subtask, and `git push origin main` at the end of a task group or after final validation, as agreed in Exercise 1.
- Before committing, inspect `git status --short` and avoid staging `node_modules/`, `dist/`, secrets, or large video files unintentionally.
- If `git commit` says `nothing to commit`, verify whether the change has already been committed rather than manufacturing an empty commit.
- If a command fails, quote the relevant error, identify the smallest fix, rerun the check, and only then continue.

## 7. React Developer Tools verification rule

The AI should direct the student to:

1. Open **Chrome → F12 → Components** and inspect `App → ScientistDirectory`.
2. Confirm the four independent states (`people`, `query`, `minIq`, `sortBy`), and that `visible` is derived rather than a separate hook.
3. Inspect stable list identities/keys as permitted by the installed DevTools version; verify no key warnings in Console.
4. Open **Profiler**, start recording **after idle**, then type **one** character in Name search and stop recording.
5. Observe how many **committed React updates** occurred. The acceptance target is one expected committed update without an extra effect-based pass; distinguish this from the number of render-function invocations in development StrictMode.
6. Repeat for IQ and sorting; document actual results, browser, React mode and possible limitations in `evidence/README.md`.
7. For delete focus, verify with keyboard and `document.activeElement`, rather than assuming React DevTools alone proves accessibility.

**Do not assert an exact Profiler count** based on the code alone; the student must inspect the real run. See <https://react.dev/reference/react/StrictMode> and <https://react.dev/reference/react/useState>.

## 8. Mandatory Exercise 2 video rule

Exercise 2 requires a **screen-recorded demonstration and functional testing**. The AI must include recording in the workflow, not treat it as an optional extra.

The recording must show, in order or with clear narration:

1. Running app and title (optionally the student name, without exposing sensitive accounts).
2. Default directory and added student record after lowering IQ minimum.
3. Case-insensitive search and live count.
4. IQ filtering and handling of cleared numeric field.
5. Both sorting options and a zero-result scenario.
6. Deletion of Goethe using keyboard, status count update, **focus preservation** and Reset.
7. React DevTools Components: independent states and stable list keys.
8. React DevTools Profiler: typing a single character, visible committed updates and an accurate explanation of the result.
9. Responsive/keyboard/WCAG or axe checks actually performed.
10. `npm run lint`, `npm run build`, and the three mandatory Git feature commits.

Suggested recording name: `ex2_demo.mp4`. The student should **watch the resulting video fully** and record its real location/link in `README.md` or `evidence/README.md`. Do not fabricate a video, upload status, public link, Profiler trace, or test result. Prefer not to commit large MP4 files to regular Git; use the instructor's required submission channel, Git LFS if configured, or an authorized shared link.

## 9. Documentation and evidence integrity

- Use `task_decomposition.md` as the primary plan and checklist; record actual results in its QA tables or `evidence/README.md`.
- Never change `Pending` to `Pass` until the student has performed the applicable test or provided verifiable output.
- When a failure occurs, record **symptom → reproduction → root cause → minimal fix → retest**.
- If a screen capture does not prove a claim (for example, render count or screen-reader announcement), say what further evidence is required.
- Keep README instructions truthful and aligned with the actual file paths, commands and operating system.
- Support prompt correction when the user requests a quicker walkthrough or a full-file replacement; retain React and accessibility contracts.

## 10. Definition of done

The AI may describe Exercise 2 as **ready for submission** only when all of the following are verified:

- [ ] Seven entries including the student demo record, unique stable IDs, numeric IQ/age fields.
- [ ] Search, Min IQ, IQ/Age sorting, Delete and Reset all operate correctly.
- [ ] `visible` derived directly in render; no filtering/sorting `useEffect`.
- [ ] Accessible labels, polite status, keyboard focus preservation, and responsive UI.
- [ ] React Components and Profiler inspected; recorded outcomes reflect reality.
- [ ] Functional test matrix and applicable WCAG checks completed and documented.
- [ ] A real, playable Ex2 demo video has been recorded and its location supplied.
- [ ] Lint and production build pass; Git tree is clean.
- [ ] All three instructor-mandated feature commits exist in correct order and are pushed.

If some items are unverified, report the project as **partially complete** and name the outstanding checks; do not mark the whole exercise or WCAG 2.2 AA as passing by assumption.
