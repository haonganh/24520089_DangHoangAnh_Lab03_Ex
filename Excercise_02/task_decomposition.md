# Exercise 2 — Interactive Scientist & Pioneer Directory

> **Course:** Web Application Development — In-Class Sprint 2  
> **Reference:** `ScientistDirectory.jsx` and Sprint 2 specifications supplied by the instructor  
> **Student:** Đặng Hoàng Anh  
> **Accessibility target:** WCAG 2.2 Level AA  
> **Estimated in-class sprint:** 45 minutes; allow extra time for testing and recording  
> **Progress as of 2026-10-25:** T0–T3 reported complete; T4.1 UI implemented; **T4.2 Step 3 (React Profiler) and Step 4 (axe DevTools) completed successfully**. Manual WCAG review, reference-code alignment, video, and final submission remain open.
> **Evidence integrity:** A `Pass` marked *student-reported* means the student confirmed the test; no numerical axe findings or full WCAG conformance is inferred without a saved report.

## Current task status

| Task | Description | Current status |
|---|---|---|
| T0 | Create planning files and React/Vite project | Complete — student-reported |
| T1 | Normalize seven records and stable IDs | Complete — student-reported |
| T2 | Case-insensitive search, numeric IQ filter, and `toSorted()` | Complete — student-reported; slide alignment to check |
| T3 | Delete, Reset, live status, and focus management | Complete — student-reported |
| T4.1 | Responsive UI with accessible controls | Implemented; 320px/manual audit still to be confirmed |
| T4.2 — Step 3 | React DevTools Profiler | **PASS — 1/1 recorded commit for the one-character action**, per captured screenshot |
| T4.2 — Step 4 | axe DevTools scan | **PASS — student confirmed successful scan**; actual findings count and report screenshot not supplied |
| T4.2 — manual | WCAG 2.2 AA manual test matrix | Pending evidence for individual criteria |
| T4.3 | Align reference defaults and age sorting before filming | Pending review/fix |
| T5.1 | Record and review the demo video | Not started |
| T5.2 | Lint, build, GitHub validation, submission | Not started |

## 1. Objective and non-negotiable contracts

Transform the original static `smartPeople` list into an interactive React directory. The application must support:

1. **Case-insensitive name search** (trim whitespace).
2. **Minimum IQ numeric filter**, reading the `<input type="number">` with `event.target.valueAsNumber` and handling `NaN`.
3. **Sorting by descending IQ or ascending age according to the instructor's reference**, using ES2023 `toSorted()` without mutating state. The implementation previously demonstrated an `age-desc` option; see T4.3 before the final recording.
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

- **Step 3 — React DevTools Profiler: PASS.** The recorded session displayed `1 / 1` commit, with `ScientistDirectory` around **6 ms** of an approximately **7 ms** update and **Immediate** priority. The student confirmed the one-character-input test. This supports **one recorded commit for that action**, *not* a blanket claim that React invoked the render function exactly once.
- **Step 4 — axe DevTools: PASS (student-reported).** The student stated the scan completed successfully. **Do not invent `0 violations`:** the scan's exact critical/serious/moderate/minor counts and report screenshot have not been supplied. Save the real report before submission.
- **Components panel:** Four independent state values and the seven-person dataset were inspected in earlier steps (student-confirmed). `visible` is computed, not stored as a fifth state.

**Still required:** Finish the **manual WCAG 2.2 AA criteria in Section 6**, note any failures and fixes, and copy/screenshoot results into the project `evidence/` folder. A clean axe scan alone is insufficient for a WCAG 2.2 AA conformance claim.

**Suggested evidence paths** (only list these as files after saving them): `evidence/react-profiler.png`, `evidence/axe-results.png`, and `evidence/README.md`. The Profiler screenshot was supplied in chat but is not automatically committed to the repository.

**Commit after the evidence log has been updated:**

```powershell
git add task_decomposition.md
# Add the following only if the files actually exist:
# git add evidence/README.md evidence/react-profiler.png evidence/axe-results.png
git commit -m "test(ex2): document functional React Profiler and WCAG checks"
```

If this test commit already exists, do **not** create a duplicate; commit only newly changed evidence with a distinct message.

### T4.3 — Reference contract alignment before filming (pending)

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
| F01 | Open page at initial defaults | **Slide:** 6 of 7 at `minIq=160` | **Needs alignment:** current demo showed 7 at `minIq=0` | Screenshot / T4.3 |
| F02 | Set `Min IQ = 0` | All 7 people appear, including Đặng Hoàng Anh | Pass — visible in browser screenshot | Earlier T2 / T4 screenshots |
| F03 | Enter `einSTEIN` | Einstein is matched despite capitalization | Pass — student-reported T2 test | T2 validation |
| F04 | Search with leading/trailing spaces | Trimmed match works | Not separately documented | Re-test before video |
| F05 | Set `Min IQ = 205` and clear name query | Only Goethe (210) and Einstein (205) remain | Not separately documented | Re-test before video |
| F06 | Clear numeric input | `valueAsNumber`'s `NaN` is handled; filter acts as 0 | Not separately documented | Re-test before video |
| F07 | Sort by IQ descending | Visible records are in non-increasing IQ order | Pass — screenshot showed descending IQ | Browser screenshot |
| F08 | Sort by age ascending | Visible records are in non-decreasing age order | **Needs alignment:** implementation currently uses `age-desc` | T4.3 change/re-test |
| F09 | Enter a search with no matches | Empty state appears; live count says 0 | Pass — student-reported T2/T3 test | T2/T3 validation |
| F10 | Delete Johann Goethe | Goethe disappears, live count decrements, next/previous/reset control holds focus | Pass — student-reported T3 test | T3 validation; capture focus evidence |
| F11 | Click Reset | Deleted people restored and controls return to declared defaults | Pass — student-reported for existing defaults; retest after T4.3 | T3 validation |
| F12 | Keyboard-only: Tab, Shift+Tab, Enter, Space | All inputs, select, delete and reset can be operated with visible focus | Pending — complete manual keyboard audit | Capture during T5 |
| F13 | Check source data after sort/delete/reset | `SMART_PEOPLE` unchanged and every rendered list key remains a stable ID | Stable IDs inspected; source immutability not separately documented | React DevTools / source inspection |

## 6. React Developer Tools, Profiler, and WCAG 2.2 AA

### React Developer Tools — Components

1. Open the app, press **F12 → Components** in React Developer Tools.
2. Verify `App → ScientistDirectory` (DOM elements may be shown or collapsed); inspect state or hooks for `people`, `query`, `minIq`, and `sortBy`.
3. Verify displayed results correspond to these states. `visible` **must not appear as an independent `useState` hook**.
4. Inspect `<li>` keys if exposed; verify `sp-1`, `sp-2`, etc., not array indices. Filter and delete while observing remaining items.
5. Confirm that keyboard focus is preserved after the selected Delete button disappears; use the Elements panel or `document.activeElement` if needed.

### Verified React DevTools status (2026-10-25)

- **Components:** `App → ScientistDirectory`; the student inspected `people`, `query`, `minIq`, and `sortBy`. The initial `people` array contains 7 records with stable IDs, including `sp-7` for Đặng Hoàng Anh.
- **Profiler:** **PASS** — captured **1 / 1 commit** after the tested interaction. The Profiler screenshot displays `ScientistDirectory (6ms of 7ms)` and **Immediate** priority. The recorded screenshot is available in the conversation; copy it to the repository if a screenshot artifact is required for submission.
- **axe DevTools:** **PASS per student's explicit confirmation** of Step 4. Findings totals and screenshot still need to be saved; never substitute invented values.

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
| Automated axe DevTools scan | Supporting audit | Scan successfully completed (student-reported); log actual findings and screenshot before submitting | Pass — reported; count not provided |

Reference: <https://www.w3.org/TR/WCAG22/>. An axe scan with zero automated findings **does not establish full WCAG conformance** without manual testing.

## 7. Mandatory video storyboard — `ex2_demo.mp4`

**Suggested duration:** approximately 3–5 minutes, unless the instructor specifies otherwise. Record at readable browser zoom. If using Windows, use Xbox Game Bar screen recording (`Win + Alt + R`, where supported) or OBS; ensure Chrome and React DevTools are captured. Avoid exposing personal accounts or unrelated private browser tabs.

| Sequence | Show on screen | What must be visible / explained |
|---|---|---|
| 01 — Introduction | Running site + title | “Exercise 2 — Interactive Scientist & Pioneer Directory”; student name |
| 02 — Dataset | Initial list and reference 160 IQ threshold | **After T4.3 alignment:** show 6 displayed, then change IQ minimum to 0 and show the 7th student record; IQ 100 is demo data |
| 03 — Name search | Type `einSTEIN`, then clear | Case-insensitive search and reactive result count |
| 04 — IQ filter | Enter `205`, then clear numeric input | Numeric filtering and blank-input fallback |
| 05 — Sorting | Toggle IQ descending ↔ Age ascending | Show `age-asc` **after T4.3 alignment**; correct ordering and immutable dataset |
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

- [x] Both Markdown files added and pushed earlier — student-reported; verify remote again at T5.2.
- [x] Student record is included; IQ `100` remains explicitly marked as demo data.
- [x] Search, IQ filter, sort, Delete and Reset tested during T2/T3 — student-reported; final video still pending.
- [x] Derived `visible` is calculated without `useEffect` in the implemented code.
- [x] Labels + `useId()` implemented; final manual accessibility check remains open.
- [x] Live result count implemented with `<output role="status" aria-live="polite">`; manual announcement check remains open.
- [x] Delete/Reset behavior and focus handling tested — student-reported; capture focus evidence in video.
- [x] `toSorted()` used rather than mutating `.sort()`; separate source immutability test is still advisable.
- [x] React Developer Tools **Components** checked; **Profiler recorded 1 / 1 commit**.
- [ ] Profiler and axe checks logged; finish individual manual WCAG results, exact axe findings, and evidence screenshots.
- [ ] `npm run lint` and `npm run build` pass.
- [ ] Demo video has **not yet been recorded/reviewed**; submission location/link must be added.
- [ ] GitHub contains all three mandatory feature commits and `git status` is clean.

## 9. QA evidence log — updated 2026-10-25

| Checkpoint | Expected | Actual / evidence | Status |
|---|---|---|---|
| T0 — Setup | React/Vite, planning docs, Git initialized | Completed during guided steps | Complete — student-reported |
| T1 — Data schema | Seven stable IDs and numeric age/IQ | 7 records visible; `sp-7` is student demo record | Pass — student-reported |
| T2 — Search/filter/sort | Case-insensitive search, numeric minimum and immutable sort | Functionality tested, but default `0` and `age-desc` differ from reference | Pass for tested functions; **reference alignment pending** |
| T3 — Delete/Reset/focus | Immutable removal, counter and useful keyboard focus | Completed in guided T3 test | Pass — student-reported |
| T4.1 — Responsive styling | Clear form layout, reflow and keyboard-visible focus | CSS and 375px layout visible in browser screenshots | Implemented; **320px/manual audit pending** |
| T4.2 — React Components | Four independent states and stable list identity | `App → ScientistDirectory`; states inspected earlier | Pass — student-reported |
| **T4.2 — React Profiler (Step 3)** | One committed update after the one-character interaction | **1 / 1 commit**; `ScientistDirectory` ~6ms / ~7ms update; screenshot captured in conversation | **PASS** |
| **T4.2 — axe scan (Step 4)** | Scan runs and findings are evaluated | Student confirmed successful scan; **violation counts and export/screenshot not provided** | **PASS — student-reported**, evidence details pending |
| T4.2 — Manual WCAG 2.2 AA | Applicable criteria documented in Section 6 | No complete criterion-by-criterion audit yet supplied | Pending |
| T4.3 — Reference alignment | `minIq=160`, age ascending, Reset matches reference | Implementation currently uses `minIq=0`, `age-desc` | Pending review/fix |
| T5.1 — Video | `ex2_demo.mp4` contains all storyboard scenes | Not recorded | Pending |
| T5.2 — Lint/build | `npm run lint` and `npm run build` succeed | Final run results not supplied | Pending |
| T5.2 — GitHub | Three mandatory commits in correct sequence, clean working tree | Feature tasks reportedly committed and pushed; final remote audit not supplied | Pending final check |

### Immediate next actions (do these before submission)

1. **Save evidence:** Copy the React Profiler screenshot shown in chat into the project as `evidence/react-profiler.png`. Save a real axe result screenshot/report as `evidence/axe-results.png`, including counts if visible. If the scans showed issues, fix them and re-test; an unreported count cannot be assumed to be zero.
2. **Finish the manual checklist:** Run applicable 320 CSS px reflow, 200% text resize, contrast, keyboard-only interaction, focus and live-announcement checks from Section 6; update individual results truthfully.
3. **Resolve T4.3:** Match the slide's `minIq=160` and `age-asc` if strict reference behavior is required; re-run the relevant tests. This does not invalidate the earlier Profiler screenshot but the final app should be tested after changes.
4. **Commit the updated QA Markdown:** From inside `Excercise_02`, use `git add task_decomposition.md` and a descriptive `git commit -m "docs(ex2): update profiler and axe QA results"`. Do not repeat an existing commit unnecessarily.
5. **Proceed to T5:** Record the video, verify the recording, run `npm run lint` / `npm run build`, and push the final commits to the existing `main` branch.

**Completion rule:** A reported axe success is evidence that the scan ran, **not** independent certification of the entire page against WCAG 2.2 AA. Never fabricate test counts, screenshots, Git verification, or completion of the video.
