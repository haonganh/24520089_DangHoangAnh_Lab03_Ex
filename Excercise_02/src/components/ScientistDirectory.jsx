
import { useId, useRef, useState } from 'react'
import { SMART_PEOPLE } from '../data/smartPeople'

export function ScientistDirectory({
  initialData = SMART_PEOPLE
}) {
  // Four independent states
  const [people, setPeople] = useState(() =>
    initialData.map((person) => ({ ...person }))
  )
  const [query, setQuery] = useState('')
  const [minIq, setMinIq] = useState(0)
  const [sortBy, setSortBy] = useState('iq-desc')

  const headingId = useId()
  const searchId = useId()
  const iqId = useId()
  const sortId = useId()
  const resetButtonRef = useRef(null)

  // Derived state: no useEffect
  const visible = people
    .filter((person) =>
      person.name
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      person.iq >= minIq
    )
    .toSorted((a, b) => {
      if (sortBy === 'age-desc') {
        return b.age - a.age ||
          a.name.localeCompare(b.name)
      }

      return b.iq - a.iq ||
        a.name.localeCompare(b.name)
    })

  // Delete by stable ID and preserve keyboard focus
  function handleDelete(id, event) {
    const item = event.currentTarget.closest('li')

    const nextButton =
      item?.nextElementSibling?.querySelector('button')

    const previousButton =
      item?.previousElementSibling?.querySelector('button')

    const focusTarget =
      nextButton ?? previousButton ?? resetButtonRef.current

    focusTarget?.focus()

    setPeople((prev) =>
      prev.filter((person) => person.id !== id)
    )
  }

  // Restore the original dataset and controls
  function handleReset() {
    setPeople(
      initialData.map((person) => ({ ...person }))
    )
    setQuery('')
    setMinIq(0)
    setSortBy('iq-desc')
  }

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>
        Scientist & Pioneer Directory
      </h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={searchId}>
          Search by Name
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter scientist name"
        />

        <label htmlFor={iqId}>
          Minimum IQ
        </label>
        <input
          id={iqId}
          type="number"
          min="0"
          step="1"
          value={minIq}
          onChange={(e) => {
            const value = e.target.valueAsNumber
            setMinIq(Number.isNaN(value) ? 0 : value)
          }}
        />

        <label htmlFor={sortId}>
          Sort By
        </label>
        <select
          id={sortId}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="iq-desc">
            IQ (High to Low)
          </option>
          <option value="age-desc">
            Age (Oldest First)
          </option>
        </select>
      </form>

      <button
        ref={resetButtonRef}
        type="button"
        onClick={handleReset}
      >
        Reset Directory
      </button>

      <p>
        <output role="status" aria-live="polite">
          Found {visible.length} pioneers
        </output>
      </p>

      <ul>
        {visible.map((person) => (
          <li key={person.id}>
            <strong>{person.name}</strong>
            {' — '}
            Age: {person.age}
            {' | '}
            IQ: {person.iq}
            {' '}
            <button
              type="button"
              aria-label={`Delete ${person.name}`}
              onClick={(e) => handleDelete(person.id, e)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
