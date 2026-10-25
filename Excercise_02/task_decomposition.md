# Exercise 2 — Interactive Scientist & Pioneer Directory

> **Course:** Web Application Development — In-Class Sprint 2  
> **Reference:** `ScientistDirectory.jsx` and Sprint 2 specifications supplied by the instructor  
> **Student:** Đặng Hoàng Anh  
> **Accessibility target:** WCAG 2.2 Level AA  
> **Estimated in-class sprint:** 45 minutes; allow extra time for testing and recording  
> **Progress as of 2026-10-25:** T0–T3 completed; **all implemented user-facing functions (Search, Minimum IQ, IQ/Age Sort, zero-results state, Delete, Reset, and live count) were retested successfully — student-reported**. T4.1 UI is implemented; **T4.2 React Components, Profiler (1/1 commit), axe DevTools, and manual WCAG testing have been completed according to the student**. The **Exercise 2 demo video has been recorded — student-reported**. Individual WCAG findings/evidence, the actual video path or share link, reference-code alignment, final lint/build, and GitHub submission still need documentation or verification.
> **Evidence integrity:** `PASS/Completed — student-reported` records the student’s own confirmation, not independent verification. This document has not been provided the final axe results, a criterion-by-criterion manual WCAG report, the video file/link, or final GitHub checks. Do not infer an axe violation count or certify full WCAG 2.2 AA conformance from the reported checks alone.

## Current task status

| Task | Description | Current status |
|---|---|---|
| T0 | Create planning files and React/Vite project | Complete — student-reported |
| T1 | Normalize seven records and stable IDs | Complete — student-reported |
| T2 | Case-insensitive search, numeric IQ filter, and `toSorted()` | **PASS — all implemented Search / IQ Filter / IQ & Age Sort functions retested, student-reported**; reference alignment remains open |
| T3 | Delete, Reset, live status, and focus management | **PASS — Delete / Reset / live counter retested, student-reported**; keyboard-only focus evidence is separate |
| T4.1 | Responsive UI with accessible controls | Implemented; manual WCAG checks completed — student-reported; specific measurements not attached |
| T4.2 — functional regression | Search, IQ Filter, Sort, empty state, Delete, Reset, live count | **PASS — student explicitly confirmed all functions work (2026-10-25)** |
| T4.2 — Step 3 | React DevTools Profiler | **PASS — 1/1 recorded commit for the one-character action**, per captured screenshot |
| T4.2 — Step 4 | axe DevTools scan | **PASS — student confirmed successful scan**; actual findings count and report screenshot not supplied |
| T4.2 — manual | WCAG 2.2 AA manual test matrix | **Checked — PASS reported by student (2026-10-25)**; per-criterion evidence not supplied |
| T4.3 | Align reference defaults and age sorting with slide | Pending review/fix before final submission; video already recorded |
| T5.1 | Record and review the demo video | **Recorded — completed per student (2026-10-25)**; playback review/link not independently verified |
| T5.2 | Lint, build, GitHub validation, submission | Pending final evidence/verification |

## 1. Objective and non-negotiable contracts

Transform the original static `smartPeople` list into an interactive React directory. The application must support:

1. **Case-insensitive name search** (trim whitespace).
2. **Minimum IQ numeric filter**, reading the `<input type="number">` with `event.target.valueAsNumber` and handling `NaN`.
3. **Sorting by descending IQ or ascending age according to the instructor's reference**, using ES2023 `toSorted()` without mutating state. The implementation previously demonstrated an `age-desc` option; see T4.3 before final submission (the demo video has already been recorded).
4. **Delete an individual and Reset the directory**, without unstable React keys or lost keyboard focus.
5. **An announced result count** using `<output role="status" aria-live="polite">`.

### React data-flow contract

- Store **only independent inputs** in `useState`: `people`, `query`, `minIq`, `sortBy`.
- Compute `visible` directly from state during rendering: **filter → `toSorted()`**. Never store `visible` in state.
- **Never use `useEffect` for filtering or sorting.** No `setVisible` synchronization loop.
- Use `useId()` for the search, IQ, and sort labels (`htmlFor` must match `id`).
- Use a stable `id` as the `<li key={p.id}>`; never array indices or generated IDs during render.
- The directory accepts `initialData = SMART_PEOPLE` so it remains independently testable.
- The first **three feature commits below are mandatory**, in the order and wording shown on the slides. Documentation, setup, styling, and test commits are additional and do not replace them.

### Student record and IQ disclaimer

Add the student as the **seventh** record, in addition to the instructor's six records. Use:

```js
{
  id: 'sp-7',
  name: 'Đặng Hoàng Anh',
  age: 21, // DEMO PLACEHOLDER — replace if appropriate
  iq: 100  // DEMO PLACEHOLDER — not a measured IQ score
}
```

**Important:** `21` and `100` are application test data, **not claims** about the student's actual age or IQ. Ask the student for a real or intentionally fictional numeric value before presenting it as personal data. The reference scientists' IQ figures are educational sample data as well, not validated measurements. The numeric schema stays consistent so IQ and age sorting work. With the instructor's default `minIq = 160`, the sample student record is hidden until the threshold is lowered.

## 2. Reference dataset and data shape

Create `src/data/smartPeople.js` exporting `SMART_PEOPLE` as an array of plain objects with **exactly** these fields: `{ id: string, name: string, age: number, iq: number }`.

| ID | Name | Age | IQ | Source |
|---|---|---:|---:|---|
| `sp-1` | Johann Goethe | 82 | 210 | Instructor slide |
| `sp-2` | Albert Einstein | 76 | 205 | Instructor slide |
| `sp-3` | Leonardo da Vinci | 67 | 180 | Instructor slide |
| `sp-4` | Isaac Newton | 84 | 190 | Instructor slide |
| `sp-5` | James Maxwell | 48 | 190 | Instructor slide |
| `sp-6` | William Sidis | 46 | 200 | Instructor slide |
| `sp-7` | Đặng Hoàng Anh | 21* | 100* | **Example values only** |

*Replace demo values if the student supplies different values; do not assert that demo IQ is a test result.*

## 3. Expected project layout

```text
<repository-root>/
├── Excercise_01/                  # Existing Exercise 1 — leave untouched
└── Excercise_02/                  # Exercise 2; keep the actual spelling consistent
    ├── ai_failure.md
    ├── task_decomposition.md
    ├── README.md
    ├── package.json
    ├── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── ScientistDirectory.jsx
    │   │   └── ScientistDirectory.module.css
    │   └── data/
    │       └── smartPeople.js
    └── evidence/
        └── README.md             # Test findings + link/location of demo video
```

Use the name of the folder actually created in VS Code if it differs from `Excercise_02`. Run the commands below **from inside that folder**, which may share the parent Git repository with Exercise 1. Do **not** run `git init` inside a nested folder if the parent is already a Git repository.

## 4. Task breakdown and commit checkpoints

### T0.1 — Add planning documents before implementation

**Do:** Place `task_decomposition.md` and `ai_failure.md` in the Exercise 2 folder. Verify that they are readable Markdown and contain the WCAG, React, Git, and video contracts.

**Check:** Both files exist; Exercise 1 files are unchanged.

**Commit:**

```powershell
git add task_decomposition.md ai_failure.md
git commit -m "docs(ex2): define task decomposition and AI failure prevention"
```

### T0.2 — Initialize the React + Vite workspace

**Do:** Create a React JavaScript Vite app in the Exercise 2 folder (only if one does not already exist), install packages, remove unused starter UI, and add a clear page title and correct `<html lang="en">` or the actual page language.

```powershell
# Example if already inside an empty Exercise 2 folder:
npm create vite@latest . -- --template react
npm install
npm run dev
```

**Check:** The local Vite page loads; `npm run build` succeeds; `.gitignore` excludes `node_modules/` and `dist/`.

**Commit:**

```powershell
git add -A
git commit -m "chore(ex2): initialize React Vite directory app"
```

### T1.1 — Normalize the people schema (MANDATORY COMMIT 1)

**Do:** Create `src/data/smartPeople.js` containing the six instructor records **and the student's seventh example record**. Add immutable, unique string IDs `sp-1` through `sp-7`; age and IQ remain numbers. Create `ScientistDirectory.jsx` as a minimal component and render it from `App.jsx`.

**Check:** Seven records exist; every ID is unique; `typeof age === 'number'` and `typeof iq === 'number'` for all records; student values are explicitly marked as demo data.

**Commit — exact instructor-mandated message:**

```powershell
git add src/data/smartPeople.js src/components/ScientistDirectory.jsx src/App.jsx
git commit -m "feat(ex2): normalize smartPeople schema with stable IDs"
```

### T2.1 — Search, numeric IQ filter, and immutable sorting (MANDATORY COMMIT 2)

**Do:** Inside `ScientistDirectory({ initialData = SMART_PEOPLE })`, initialize:

```jsx
const searchId = useId()
const iqId = useId()
const sortId = useId()
const [people, setPeople] = useState(initialData)
const [query, setQuery] = useState('')
const [minIq, setMinIq] = useState(160)
const [sortBy, setSortBy] = useState('iq-desc')
```

Use controlled and labeled fields in `<form role="search" onSubmit={(e) => e.preventDefault()}>`. For the numeric field, the handler must use `event.target.valueAsNumber` and a deterministic fallback (the slide uses `0` when the field is blank/`NaN`). Use a labeled `<select>` for `iq-desc` and `age-asc`.

Calculate `visible` in render (not an effect and not independent state):

```jsx
const normalizedQuery = query.trim().toLowerCase()
const visible = people
  .filter((p) =>
    p.name.toLowerCase().includes(normalizedQuery) && p.iq >= minIq
  )
  .toSorted((a, b) =>
    sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age
  )
```

**Check:** Searching `einSTEIN` finds Einstein; clearing the query restores applicable results; IQ filtering remains numeric; switching IQ/age changes order; the `SMART_PEOPLE` source array remains unmodified. Test at least one **zero-results** combination. Lower minimum IQ to `0` to display the student record. **As built during T2–T4:** the app used `minIq = 0` by default and `age-desc`. These are real implementation differences from the instructor's `160` and `age-asc` reference and must not be silently marked compliant; see T4.3.

**Commit — exact instructor-mandated message:**

```powershell
git add src/components/ScientistDirectory.jsx
git commit -m "feat(ex2): add search, IQ filter and toSorted"
```

### T3.1 — Delete, Reset, and live count (MANDATORY COMMIT 3)

**Do:** Render a semantic list and a delete button for every item:

```jsx
<ul>
  {visible.map((p) => (
    <li key={p.id}>
      <span>{p.name} — Age {p.age}, IQ {p.iq}</span>
      <button type="button" aria-label={`Delete ${p.name}`}>Delete</button>
    </li>
  ))}
</ul>
```

Complete the button's `onClick` with immutable removal `setPeople((prev) => prev.filter((p) => p.id !== id))`. **Do not** mutate the array or delete by index. Add Reset, restoring a fresh copy of `initialData` (normally `SMART_PEOPLE`); state clearly whether Reset also clears search/IQ/sort inputs. For this exercise, prefer **Reset restores records AND default filters** so users can immediately see the entire reference directory under the original `minIq = 160` filter.

Place the live counter near the results:

```jsx
<output role="status" aria-live="polite" aria-atomic="true">
  Found {visible.length} pioneers
</output>
```

**Focus preservation:** When deleting a row with the keyboard, focus the next remaining row's Delete button, otherwise the preceding row's button, otherwise the Reset button. Do so before the focused row is removed (using a real DOM target or refs); verify `document.activeElement` remains a meaningful control. Reset must remain keyboard accessible and keep its own focus.

**Check:** Delete `Johann Goethe` (after making it visible); only its stable key disappears; focused keyboard users are not stranded; `Found N pioneers` updates; Reset restores Goethe and the original controls.

**Commit — exact instructor-mandated message:**

```powershell
git add src/components/ScientistDirectory.jsx
git commit -m "feat(ex2): add delete/reset & live status"
```

### T4.1 — Responsive layout and keyboard-visible styling

**Do:** Implement `ScientistDirectory.module.css` and `index.css` using readable typography, fluid layout, clear list spacing, large enough buttons (at least 24×24 CSS px; preferably 44×44 for ease of use), visible `:focus-visible` styles, and sufficient contrast. Do not hide focus outlines.

**Check:** Text and controls reflow at 320 CSS px without horizontal scrolling; zoom to 200%; test text spacing; inspect focus rings and button labels. Do not claim full WCAG compliance on styling alone.

**Commit:**

```powershell
git add src/components/ScientistDirectory.module.css src/components/ScientistDirectory.jsx src/index.css
git commit -m "style(ex2): add responsive WCAG-conscious directory UI"
```

### T4.2 — Functional, React DevTools, and WCAG QA evidence

**Completed on 2026-10-25 (as reported and shown in this conversation):**

- **Functional regression — PASS (student-reported).** The student confirmed successful hands-on testing of Search (case-insensitive), Minimum IQ, IQ/Age sorting, empty results, Delete, Reset, and the reactive result count. The seven-record directory, including the student demonstration record, displayed correctly. See Section 5; individual edge cases that were not separately evidenced remain identified there.
- **Step 3 — React DevTools Profiler: PASS.** The recorded session displayed `1 / 1` commit, with `ScientistDirectory` around **6 ms** of an approximately **7 ms** update and **Immediate** priority. The student confirmed the one-character-input test. This supports **one recorded commit for that action**, *not* a blanket claim that React invoked the render function exactly once.
- **Step 4 — axe DevTools: PASS (student-reported).** The student stated the scan completed successfully. **Do not invent `0 violations`:** the scan's exact critical/serious/moderate/minor counts and report screenshot have not been supplied. Save the real report before submission.
- **Components panel:** Four independent state values and the seven-person dataset were inspected in earlier steps (student-confirmed). `visible` is computed, not stored as a fifth state.

**Manual accessibility update (2026-10-25):** The student confirmed that **manual WCAG checking was completed**. Mark the audit as **completed — student-reported**; do not infer verified results for every individual WCAG success criterion without the actual checklist. Save any available results/measurements (320px reflow, 200% text resize, contrast, keyboard and focus, text spacing, live status) to `evidence/`. The user-facing functional tests do not need to be repeated unless code changes (for example, in T4.3). Automated axe findings alone do not prove full WCAG 2.2 AA conformance.

**Suggested evidence paths** (only list these as files after saving them): `evidence/react-profiler.png`, `evidence/axe-results.png`, and `evidence/README.md`. The Profiler screenshot was supplied in chat but is not automatically committed to the repository.

**Commit after the evidence log has been updated:**

```powershell
git add task_decomposition.md
# Add the following only if the files actually exist:
# git add evidence/README.md evidence/react-profiler.png evidence/axe-results.png
git commit -m "test(ex2): document functional React Profiler and WCAG checks"
```

If this test commit already exists, do **not** create a duplicate; commit only newly changed evidence with a distinct message.

### T4.3 — Reference contract alignment before final submission (pending)

**Why:** The slide reference initializes `minIq` to **160** and sorts age **ascending**, while the completed demonstration used `minIq = 0` and `age-desc` (oldest first). The actual behavior is functional, but it is **not the same as the instructor's reference snippet**.

**Do (if the slide's exact code semantics are required):**

1. In `ScientistDirectory.jsx`, initialize `minIq` to `160`; in `handleReset`, restore `160` too.
2. Replace the age option value with `age-asc`, label it `Age (Youngest First)`, and compare `a.age - b.age` in `toSorted()`.
3. Keep `valueAsNumber`, four `useState` values, derived `visible`, stable IDs, and keyboard-focus preservation unchanged.
4. With the sample IQ 100, opening/resetting the app should show **6 of 7** people; setting Minimum IQ to `0` must reveal **Đặng Hoàng Anh**.
5. Re-test search, filtering, sorting, Reset and the one-character Profiler action. Record any changes in Sections 5 and 9.

**Commit only if a code change is made:**

```powershell
git add src/components/ScientistDirectory.jsx
git commit -m "fix(ex2): align default IQ and age sort with slide reference"
```

**Note:** If the instructor explicitly permits `minIq = 0` and `age-desc`, keep the implementation but document that permission in the submission instead of claiming the reference is identical.

### T5.1 — Record the Exercise 2 demonstration video (completed — student-reported)

**Recorded status (2026-10-25):** The student confirmed the Exercise 2 demo video **has been recorded**. The file itself, its actual name/path, a playback check, and the submission link have not been provided for independent verification. Keep T5.1 **Completed — student-reported**, but do not claim a playable link is already attached.

**Submission follow-up:** Review the existing recording against the Section 7 storyboard, then add its **actual** location/share link and the test summary to `README.md` or `evidence/README.md`. Do not record the video again if the existing clip covers the required demonstrations. Keep the raw `.mp4` out of ordinary Git commits if large; submit an externally shared link or use Git LFS only if the instructor requires that workflow.

**Commit:**

```powershell
git add README.md evidence/README.md
git commit -m "docs(ex2): add demonstration and verification evidence"
```

### T5.2 — Final validation and GitHub submission

**Do:** Run `npm run lint` (when configured) and `npm run build`. Check `git status`, review `git log --oneline`, push the repository, and verify the Exercise 2 folder and required commits appear on GitHub.

```powershell
npm run lint
npm run build
git push origin main
git log --oneline -12
git status
```

**Check:** Both checks pass; Git working tree is clean; all **three mandatory feature commits** are present in the correct order; documentation and a playable video link/location are available for submission. If final QA notes change, commit those notes and push again.

## 5. Functional acceptance matrix — updated 2026-10-25

**Functional retest summary: PASS (student-reported).** On 2026-10-25, the student explicitly confirmed that **all user-facing features were tested and work correctly**. This covers name Search, Minimum IQ filter, both available Sort modes, the empty-result case, Delete, Reset, and the live result count. No defects were reported. These are hands-on confirmations, not exported automated test results.

| ID | Action | Expected | Recorded result | Status / follow-up |
|---|---|---|---|---|
| F01 | Open page with current defaults (`minIq = 0`) | Seven records are visible | Seven people displayed, including the student | **PASS for current app**; instructor's `160` default differs (T4.3) |
| F02 | Set Minimum IQ to `0` | All seven records, including Đặng Hoàng Anh, appear | Confirmed by browser screenshots and student's final retest | **PASS** |
| F03 | Search `einSTEIN` / uppercase name | Einstein is matched regardless of capitalization | Search feature confirmed working | **PASS — student-reported** |
| F04 | Search with leading/trailing spaces | Name query is trimmed | Normal search confirmed; exact whitespace case not separately logged | **Additional edge-case evidence optional** |
| F05 | Set Minimum IQ to `190` | Five records appear | IQ filter confirmed working in earlier steps and final retest | **PASS — student-reported** |
| F06 | Clear numeric input | `valueAsNumber` becomes `NaN`; fallback value is handled as `0` | Numeric filter confirmed; exact blank-input edge case not individually evidenced | **Additional edge-case evidence optional** |
| F07 | Sort by IQ descending | Records are ordered by non-increasing IQ | Descending IQ order visible; Sort feature confirmed | **PASS** |
| F08 | Sort by Age (current `age-desc`) | Oldest person appears first | Age sort confirmed working in the implemented mode | **PASS for current app**; slide uses `age-asc` (T4.3) |
| F09 | Search for nonexistent name | Count displays `Found 0 pioneers` | Empty-results functionality confirmed | **PASS — student-reported** |
| F10 | Delete a record | Selected person disappears; count decreases | Delete and count confirmed working | **PASS — student-reported**; focus also covered by student-reported manual WCAG check, specific evidence not attached |
| F11 | Click Reset | Seven original people and current default controls return | Reset confirmed working | **PASS — student-reported**; retest if default changes in T4.3 |
| F12 | Watch live result count while filtering/deleting | Count matches the visible list | Reactive live count confirmed working | **PASS — student-reported**; actual screen-reader announcement evidence not attached |
| F13 | Keyboard-only Tab, Shift+Tab, Enter, Space | Controls operate and focus remains visible after deletion | Student reports completion of manual WCAG testing; individual keyboard-step record not supplied | **Checked — student-reported**; evidence pending |
| F14 | Inspect dataset after sort/delete/reset | `SMART_PEOPLE` unchanged; list keys remain stable | Stable IDs inspected in React DevTools; source immutability not separately evidenced | **Source-code assertion pending, if required** |

**Reference-code difference, not a functional test failure:** The current implementation starts at Minimum IQ `0` and offers Age descending, whereas the instructor's displayed sample starts at `160` and uses Age ascending. Resolve T4.3 before claiming that the submitted implementation exactly matches the reference. If defaults/options change, retest those affected cases and revise F01/F08/F11 accordingly.

## 6. React Developer Tools, Profiler, and WCAG 2.2 AA

### React Developer Tools — Components

1. Open the app, press **F12 → Components** in React Developer Tools.
2. Verify `App → ScientistDirectory` (DOM elements may be shown or collapsed); inspect state or hooks for `people`, `query`, `minIq`, and `sortBy`.
3. Verify displayed results correspond to these states. `visible` **must not appear as an independent `useState` hook**.
4. Inspect `<li>` keys if exposed; verify `sp-1`, `sp-2`, etc., not array indices. Filter and delete while observing remaining items.
5. Confirm that keyboard focus is preserved after the selected Delete button disappears; use the Elements panel or `document.activeElement` if needed.

### Verified React DevTools status (2026-10-25)

- **Components:** **PASS — student-reported.** `App → ScientistDirectory`; the student inspected `people`, `query`, `minIq`, and `sortBy`. The initial `people` array contains 7 records with stable IDs, including `sp-7` for Đặng Hoàng Anh.
- **User-facing features:** **PASS — student-reported 2026-10-25.** Search, Minimum IQ, sorting, empty results, Delete, Reset, and live count all work in the current app.
- **Profiler:** **PASS** — captured **1 / 1 commit** after the tested interaction. The Profiler screenshot displays `ScientistDirectory (6ms of 7ms)` and **Immediate** priority. The recorded screenshot is available in the conversation; copy it to the repository if a screenshot artifact is required for submission.
- **axe DevTools:** **PASS per student's explicit confirmation** of Step 4. Findings totals and screenshot still need to be saved; never substitute invented values.

### React Developer Tools — Profiler

1. In **F12 → Profiler**, start a recording **after the page has settled**.
2. Focus the Name field and type **exactly one new character** (for example `E`). Stop recording.
3. Inspect **committed updates**: target **one update/commit for that single state change**, without an additional effect-driven update for `visible`.
4. Repeat with one IQ input change and one sort selection. Do not confuse **component render function calls** with **committed updates**; React `StrictMode` can invoke components twice in development. Document actual Profiler output and the React mode used; do not simply claim “exactly one render pass” without confirming it.
5. If Profiler reports unexpected extra commits, investigate effects, redundant state, parent rerenders, and development tooling before changing code.

### WCAG manual and automated audit

**Overall manual audit status: COMPLETED — student-reported (2026-10-25).** The student confirmed testing was performed. The rows below are marked **Checked — student-reported** to reflect that confirmation; detailed measurements/screenshots were not supplied, so they are not independent proof of WCAG conformance. Update any individual row to Fail if an actual result fails its success criterion.

| Criterion | Level | Practical test | Result |
|---|---|---|---|
| 1.3.1 Info and Relationships | A | All labels correctly bound to text field, number field and sort select | Checked — student-reported; details not attached |
| 1.4.3 Contrast (Minimum) | AA | Text ≥ 4.5:1; large text ≥ 3:1 | Checked — student-reported; details not attached |
| 1.4.4 Resize Text | AA | At 200% text resize, content remains usable | Checked — student-reported; details not attached |
| 1.4.10 Reflow | AA | 320 CSS px: no loss of information or two-direction scrolling | Checked — student-reported; details not attached |
| 1.4.11 Non-text Contrast | AA | Essential UI boundaries/graphics and states ≥ 3:1 where applicable | Checked — student-reported; details not attached |
| 1.4.12 Text Spacing | AA | 1.5 line, 2em paragraph, 0.12em letter, 0.16em word: no clipping | Checked — student-reported; details not attached |
| 2.1.1 Keyboard | A | Every action works without a mouse | Checked — student-reported; details not attached |
| 2.4.3 Focus Order | A | Logical Tab sequence before and after delete | Checked — student-reported; details not attached |
| 2.4.7 Focus Visible | AA | Visible focus indication for controls | Checked — student-reported; details not attached |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused controls not entirely hidden by author content | Checked — student-reported; details not attached |
| 2.5.3 Label in Name | A | Visible `Delete` is included in its accessible name | Checked — student-reported; details not attached |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets ≥ 24×24 CSS px or meet an exception | Checked — student-reported; details not attached |
| 3.3.2 Labels or Instructions | A | Search, IQ and sort controls have meaningful labels | Checked — student-reported; details not attached |
| 4.1.2 Name, Role, Value | A | Inputs/buttons have correct accessible names and states | Checked — student-reported; details not attached |
| 4.1.3 Status Messages | AA | Result count updates announced without stealing focus | Checked — student-reported; details not attached |
| Automated axe DevTools scan | Supporting audit | Scan successfully completed (student-reported); log actual findings and screenshot before submitting | Pass — reported; count not provided |

Reference: <https://www.w3.org/TR/WCAG22/>. An axe scan with zero automated findings **does not establish full WCAG conformance** without manual testing.

## 7. Mandatory video storyboard — `ex2_demo.mp4`

**Suggested duration:** approximately 3–5 minutes, unless the instructor specifies otherwise. Record at readable browser zoom. If using Windows, use Xbox Game Bar screen recording (`Win + Alt + R`, where supported) or OBS; ensure Chrome and React DevTools are captured. Avoid exposing personal accounts or unrelated private browser tabs.

| Sequence | Show on screen | What must be visible / explained |
|---|---|---|
| 01 — Introduction | Running site + title | “Exercise 2 — Interactive Scientist & Pioneer Directory”; student name |
| 02 — Dataset | Initial list and IQ threshold | Show actual initial count; changing minimum IQ to 0 reveals the student demo record. If T4.3 is applied, initial count is 6 with default 160; otherwise it is 7 with default 0. |
| 03 — Name search | Type `einSTEIN`, then clear | Case-insensitive search and reactive result count |
| 04 — IQ filter | Enter `205`, then clear numeric input | Numeric filtering and blank-input fallback |
| 05 — Sorting | Toggle IQ and Age modes | Demonstrate the actual implemented ordering and disclose any difference from the slide (`age-asc` required if T4.3 is applied). |
| 06 — Empty state | Type an impossible name | “Found 0 pioneers”, usable empty-state message |
| 07 — Delete & focus | Restore query/filter, keyboard-activate Delete on Goethe | Goethe removed, counter changes, remaining items keep stable keys, keyboard focus remains meaningful |
| 08 — Reset | Activate Reset | Original records/controls restored |
| 09 — React DevTools Components | Expand `ScientistDirectory` | Show 4 independent states and stable list identity |
| 10 — Profiler | Record typing **one character** | Point to actual committed updates, explain StrictMode caveat if applicable |
| 11 — WCAG evidence | Keyboard tab, responsive 320px, axe result | Demonstrate accessibility checks and actual results, without fabricated scores |
| 12 — Final | VS Code Terminal or GitHub | `npm run lint`, `npm run build`, and mandatory Git commits |

**Recording update (2026-10-25): COMPLETED — student-reported.** The student confirmed the video was recorded. The video file and its contents have not been provided here for independent review. The `.mp4` should contain actual interaction, legible result counts and labels, the React Profiler view, and demonstrations of delete/reset/focus. Before submission, verify the recorded scenes and document the **real** URL/path in `README.md` or `evidence/README.md`.

## 8. Git history and submission checklist

The **required feature-commit sequence** is:

```text
feat(ex2): normalize smartPeople schema with stable IDs
feat(ex2): add search, IQ filter and toSorted
feat(ex2): add delete/reset & live status
```

Use `git log --oneline --reverse` to verify their chronological order. Setup, documentation, styling and testing commits are allowed **in addition**, and must not replace the three feature commits.

- [x] Both Markdown files added and pushed earlier — student-reported; verify remote again at T5.2.
- [x] Student record is included; IQ `100` remains explicitly marked as demo data.
- [x] **All implemented user-facing functions re-tested successfully on 2026-10-25** — Search, IQ Filter, IQ/Age Sort, empty results, Delete, Reset, and live count (student-reported). The demo video has now been recorded (student-reported), with file/link still to be attached.
- [x] Derived `visible` is calculated without `useEffect` in the implemented code.
- [x] Labels + `useId()` implemented; student reports completion of manual accessibility checking, detailed evidence not attached.
- [x] Live result count implemented with `<output role="status" aria-live="polite">`; manual WCAG checking reported complete, screen-reader announcement evidence not attached.
- [x] Delete/Reset behavior and focus handling tested — student-reported; capture focus evidence in video.
- [x] `toSorted()` used rather than mutating `.sort()`; separate source immutability test is still advisable.
- [x] React Developer Tools **Components** checked; **Profiler recorded 1 / 1 commit**.
- [x] Profiler test logged (1/1 commit) and axe DevTools scan marked successful (student-reported).
- [x] **Manual WCAG testing completed — student-reported (2026-10-25).** Criterion-specific measurements/screenshots were not provided and should be attached where available.
- [ ] Save real axe scan findings/screenshots and any available individual WCAG test evidence; do not invent violation counts.
- [ ] `npm run lint` and `npm run build` pass.
- [x] **Demo video recorded — student-reported (2026-10-25).**
- [ ] Review the actual recording for completeness and put its real path/share link in `README.md` or `evidence/README.md`.
- [ ] GitHub contains all three mandatory feature commits and `git status` is clean.

## 9. QA evidence log — updated 2026-10-25

| Checkpoint | Expected | Actual / evidence | Status |
|---|---|---|---|
| T0 — Setup | React/Vite, planning docs, Git initialized | Completed during guided steps | Complete — student-reported |
| T1 — Data schema | Seven stable IDs and numeric age/IQ | 7 records visible; `sp-7` is student demo record | Pass — student-reported |
| T2 — Search/filter/sort | Case-insensitive search, numeric minimum and `toSorted()` | Search, IQ filtering, and IQ/Age sorting all re-tested successfully (2026-10-25, student-reported) | **PASS for implemented behavior**; slide defaults/age direction differ |
| T3 — Delete/Reset/live status | Immutable removal, Reset, reactive count | Delete, Reset and live count re-tested successfully (2026-10-25, student-reported) | **PASS for implemented behavior**; keyboard-only focus audit separate |
| T4.2 — Full functional regression | All implemented user-facing functions behave correctly | Student explicitly confirmed successful testing of all functions; see Section 5 | **PASS — student-reported** |
| T4.1 — Responsive styling | Clear form layout, reflow and keyboard-visible focus | CSS and 375px layout visible; student reports completing manual WCAG testing | **Checked — student-reported**; 320px measurements not attached |
| T4.2 — React Components | Four independent states and stable list identity | `App → ScientistDirectory`; states inspected earlier | Pass — student-reported |
| **T4.2 — React Profiler (Step 3)** | One committed update after the one-character interaction | **1 / 1 commit**; `ScientistDirectory` ~6ms / ~7ms update; screenshot captured in conversation | **PASS** |
| **T4.2 — axe scan (Step 4)** | Scan runs and findings are evaluated | Student confirmed successful scan; **violation counts and export/screenshot not provided** | **PASS — student-reported**, evidence details pending |
| T4.2 — Manual WCAG 2.2 AA | Applicable criteria documented in Section 6 | **Student confirmed manual WCAG testing completed (2026-10-25)**; no criterion-level report supplied | **COMPLETED — student-reported**, supporting evidence not attached |
| T4.3 — Reference alignment | `minIq=160`, age ascending, Reset matches reference | Implementation currently uses `minIq=0`, `age-desc` | Pending review/fix |
| T5.1 — Video | Demo recording completed and reviewed | **Student confirmed video recorded (2026-10-25)**; actual file/link and scene coverage not independently reviewed | **RECORDED — student-reported**; attach location/link before submission |
| T5.2 — Lint/build | `npm run lint` and `npm run build` succeed | Final run results not supplied | Pending |
| T5.2 — GitHub | Three mandatory commits in correct sequence, clean working tree | Feature tasks reportedly committed and pushed; final remote audit not supplied | Done |

### Immediate next actions (do these before submission)

1. **Do not repeat completed tests or re-record the video solely to change this status.** Functional regression, React Profiler, axe, manual WCAG audit, and video recording are recorded as completed based on the student's confirmation.
2. **Attach available evidence:** Keep the Profiler screenshot, actual axe results, and any manual WCAG checks (contrast, 320px reflow, keyboard/focus, text spacing, status announcements) in `evidence/` if available. Do not invent test counts or claim independently verified criterion-level compliance.
3. **Link the recorded video:** Add its real file path or accessible share URL to `README.md` or `evidence/README.md`; verify that the recording is playable and shows the required demonstrations.
4. **Resolve T4.3 if strict slide alignment is required:** The current defaults (`minIq=0`, `age-desc`) differ from the instructor's snippet (`minIq=160`, `age-asc`). If changed, retest the affected cases and update the video only if the recording no longer represents the final version.
5. **Validate and submit:** Run `npm run lint` and `npm run build`; check the three required feature commits, `git status`, and push to the existing GitHub repository. Mark **GitHub Submission** complete only after a successful remote check.

**Completion rule:** Student-reported testing and recording are documented as done. Final submission is still pending until the actual video location, final validation results, and GitHub status are confirmed. An axe scan and manual check are useful evidence, but this document alone does not certify comprehensive WCAG 2.2 AA conformance.
