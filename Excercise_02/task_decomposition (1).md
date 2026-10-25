# Exercise 2 — Interactive Scientist & Pioneer Directory

> **Course:** Web Application Development — In-Class Sprint 2  
> **Reference:** `ScientistDirectory.jsx` and Sprint 2 specifications supplied by the instructor  
> **Student:** Đặng Hoàng Anh  
> **Accessibility target:** WCAG 2.2 Level AA  
> **Estimated in-class sprint:** 45 minutes; allow extra time for testing and recording  
> **Status:** Planning document — change `Pending` to `Pass` only after actually testing.

## 1. Objective and non-negotiable contracts

Transform the original static `smartPeople` list into an interactive React directory. The application must support:

1. **Case-insensitive name search** (trim whitespace).
2. **Minimum IQ numeric filter**, reading the `<input type="number">` with `event.target.valueAsNumber` and handling `NaN`.
3. **Sorting by descending IQ or ascending age**, using ES2023 `toSorted()` without mutating state.
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

**Check:** Searching `einSTEIN` finds Einstein; clearing the query restores applicable results; IQ filtering remains numeric; switching IQ/age changes order; the `SMART_PEOPLE` source array remains unmodified. Test at least one **zero-results** combination. Lower minimum IQ to `0` to display the student record.

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

**Do:** Complete the matrices in Sections 5 and 6 below, including a React DevTools **Components** inspection and **Profiler** recording; run axe DevTools and manual WCAG checks. Record actual results in `evidence/README.md` and Section 9.

**Check:** Do not mark `Pass` solely because a procedure was written; attach evidence such as a screenshot filename, Profiler observation, or test log.

**Commit:**

```powershell
git add evidence/README.md task_decomposition.md
git commit -m "test(ex2): document functional React Profiler and WCAG checks"
```

### T5.1 — Record the Exercise 2 demonstration video

**Do:** Record the live browser demonstrating the actual app, not a static screenshot. Follow the precise storyboard in Section 7. Update `README.md` with the recording location/link and the verified test summary; do not invent a public URL.

**Check:** Play the entire recording and confirm that actions, live counter, Developer Tools, and focus/Profiler results are legible. Keep the raw `.mp4` out of ordinary Git commits if large; submit an externally shared link or use Git LFS only if the instructor requires that workflow.

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

## 5. Functional acceptance matrix

| ID | Action | Expected | Result | Evidence |
|---|---|---|---|---|
| F01 | Open page at initial defaults | 6 of 7 displayed at `minIq=160`; demo student's IQ 100 excluded | Pending | — |
| F02 | Set `Min IQ = 0` | All 7 people appear, including Đặng Hoàng Anh | Pending | — |
| F03 | Enter `einSTEIN` | Einstein is matched despite capitalization | Pending | — |
| F04 | Search with leading/trailing spaces | Trimmed match works | Pending | — |
| F05 | Set `Min IQ = 205` and clear name query | Only Goethe (210) and Einstein (205) remain | Pending | — |
| F06 | Clear numeric input | `valueAsNumber`'s `NaN` is handled; filter acts as 0 | Pending | — |
| F07 | Sort by IQ descending | Visible records are in non-increasing IQ order | Pending | — |
| F08 | Sort by age ascending | Visible records are in non-decreasing age order | Pending | — |
| F09 | Enter a search with no matches | Empty state appears; live count says 0 | Pending | — |
| F10 | Delete Johann Goethe | Goethe disappears, live count decrements, next/previous/reset control holds focus | Pending | — |
| F11 | Click Reset | Deleted people restored and controls return to declared defaults | Pending | — |
| F12 | Keyboard-only: Tab, Shift+Tab, Enter, Space | All inputs, select, delete and reset can be operated with visible focus | Pending | — |
| F13 | Check source data after sort/delete/reset | `SMART_PEOPLE` unchanged and every rendered list key remains a stable ID | Pending | — |

## 6. React Developer Tools, Profiler, and WCAG 2.2 AA

### React Developer Tools — Components

1. Open the app, press **F12 → Components** in React Developer Tools.
2. Verify `App → ScientistDirectory` (DOM elements may be shown or collapsed); inspect state or hooks for `people`, `query`, `minIq`, and `sortBy`.
3. Verify displayed results correspond to these states. `visible` **must not appear as an independent `useState` hook**.
4. Inspect `<li>` keys if exposed; verify `sp-1`, `sp-2`, etc., not array indices. Filter and delete while observing remaining items.
5. Confirm that keyboard focus is preserved after the selected Delete button disappears; use the Elements panel or `document.activeElement` if needed.

### React Developer Tools — Profiler

1. In **F12 → Profiler**, start a recording **after the page has settled**.
2. Focus the Name field and type **exactly one new character** (for example `E`). Stop recording.
3. Inspect **committed updates**: target **one update/commit for that single state change**, without an additional effect-driven update for `visible`.
4. Repeat with one IQ input change and one sort selection. Do not confuse **component render function calls** with **committed updates**; React `StrictMode` can invoke components twice in development. Document actual Profiler output and the React mode used; do not simply claim “exactly one render pass” without confirming it.
5. If Profiler reports unexpected extra commits, investigate effects, redundant state, parent rerenders, and development tooling before changing code.

### WCAG manual and automated audit

| Criterion | Level | Practical test | Result |
|---|---|---|---|
| 1.3.1 Info and Relationships | A | All labels correctly bound to text field, number field and sort select | Pending |
| 1.4.3 Contrast (Minimum) | AA | Text ≥ 4.5:1; large text ≥ 3:1 | Pending |
| 1.4.4 Resize Text | AA | At 200% text resize, content remains usable | Pending |
| 1.4.10 Reflow | AA | 320 CSS px: no loss of information or two-direction scrolling | Pending |
| 1.4.11 Non-text Contrast | AA | Essential UI boundaries/graphics and states ≥ 3:1 where applicable | Pending |
| 1.4.12 Text Spacing | AA | 1.5 line, 2em paragraph, 0.12em letter, 0.16em word: no clipping | Pending |
| 2.1.1 Keyboard | A | Every action works without a mouse | Pending |
| 2.4.3 Focus Order | A | Logical Tab sequence before and after delete | Pending |
| 2.4.7 Focus Visible | AA | Visible focus indication for controls | Pending |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused controls not entirely hidden by author content | Pending |
| 2.5.3 Label in Name | A | Visible `Delete` is included in its accessible name | Pending |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets ≥ 24×24 CSS px or meet an exception | Pending |
| 3.3.2 Labels or Instructions | A | Search, IQ and sort controls have meaningful labels | Pending |
| 4.1.2 Name, Role, Value | A | Inputs/buttons have correct accessible names and states | Pending |
| 4.1.3 Status Messages | AA | Result count updates announced without stealing focus | Pending |
| Automated axe DevTools scan | Supporting audit | Run scan, investigate every finding; record actual number | Pending |

Reference: <https://www.w3.org/TR/WCAG22/>. An axe scan with zero automated findings **does not establish full WCAG conformance** without manual testing.

## 7. Mandatory video storyboard — `ex2_demo.mp4`

**Suggested duration:** approximately 3–5 minutes, unless the instructor specifies otherwise. Record at readable browser zoom. If using Windows, use Xbox Game Bar screen recording (`Win + Alt + R`, where supported) or OBS; ensure Chrome and React DevTools are captured. Avoid exposing personal accounts or unrelated private browser tabs.

| Sequence | Show on screen | What must be visible / explained |
|---|---|---|
| 01 — Introduction | Running site + title | “Exercise 2 — Interactive Scientist & Pioneer Directory”; student name |
| 02 — Dataset | Initial list and 160 IQ threshold | Show 6 displayed, then change IQ minimum to 0 and show the 7th student record; IQ 100 is demo data |
| 03 — Name search | Type `einSTEIN`, then clear | Case-insensitive search and reactive result count |
| 04 — IQ filter | Enter `205`, then clear numeric input | Numeric filtering and blank-input fallback |
| 05 — Sorting | Toggle IQ descending ↔ Age ascending | Correct ordering; original dataset not mutated |
| 06 — Empty state | Type an impossible name | “Found 0 pioneers”, usable empty-state message |
| 07 — Delete & focus | Restore query/filter, keyboard-activate Delete on Goethe | Goethe removed, counter changes, remaining items keep stable keys, keyboard focus remains meaningful |
| 08 — Reset | Activate Reset | Original records/controls restored |
| 09 — React DevTools Components | Expand `ScientistDirectory` | Show 4 independent states and stable list identity |
| 10 — Profiler | Record typing **one character** | Point to actual committed updates, explain StrictMode caveat if applicable |
| 11 — WCAG evidence | Keyboard tab, responsive 320px, axe result | Demonstrate accessibility checks and actual results, without fabricated scores |
| 12 — Final | VS Code Terminal or GitHub | `npm run lint`, `npm run build`, and mandatory Git commits |

**Video QA:** The `.mp4` must contain actual interaction, legible result counts and labels, the React Profiler view, and clear demonstration of delete/reset/focus. Record the final URL/path inside `README.md` or `evidence/README.md`.

## 8. Git history and submission checklist

The **required feature-commit sequence** is:

```text
feat(ex2): normalize smartPeople schema with stable IDs
feat(ex2): add search, IQ filter and toSorted
feat(ex2): add delete/reset & live status
```

Use `git log --oneline --reverse` to verify their chronological order. Setup, documentation, styling and testing commits are allowed **in addition**, and must not replace the three feature commits.

- [ ] Both Markdown files committed and pushed.
- [ ] Student record is included and its IQ is honestly marked as a demonstration value until replaced.
- [ ] Four interactive features demonstrated.
- [ ] No `useEffect` is used for filtering/sorting; no derived `visible` state.
- [ ] Labels + `useId()` correctly wired.
- [ ] Result count announced via polite status.
- [ ] Delete does not lose keyboard focus; Reset works.
- [ ] `toSorted()` does not mutate `SMART_PEOPLE` or `people`.
- [ ] React Developer Tools **Components** and **Profiler** checked and recorded.
- [ ] Functional and WCAG test evidence accurately logged.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] Demo video watched end-to-end; submission location/link recorded.
- [ ] GitHub contains all three mandatory feature commits and `git status` is clean.

## 9. QA evidence log — complete after testing

| Checkpoint | Expected | Actual / file reference | Status |
|---|---|---|---|
| T1 — Data schema | Seven stable unique IDs; numeric age and IQ | Not tested | Pending |
| T2 — Search/filter/sort | Functional cases F01–F09 pass | Not tested | Pending |
| T3 — Delete/Reset/focus | F10–F13 pass | Not tested | Pending |
| T4 — React Components | Expected independent state and stable keys | Not tested | Pending |
| T4 — React Profiler | One expected committed update for one typed character, subject to actual environment | Not tested | Pending |
| T4 — WCAG manual | Applicable AA criteria pass | Not tested | Pending |
| T4 — axe scan | Findings resolved and actual count recorded | Not tested | Pending |
| T5 — Video | Playable, demonstrates every required scene | Not recorded | Pending |
| T5 — Lint / build | Both commands pass | Not run | Pending |
| T5 — GitHub | Mandatory commits present in correct sequence | Not verified | Pending |

**Completion rule:** Never change `Pending` to `Pass` without performing the test; when a test fails, record `Fail`, its reproduction steps, and the fix/ret-test result.
