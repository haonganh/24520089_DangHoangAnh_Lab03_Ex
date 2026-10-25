
import { useId, useState } from 'react'
import { SMART_PEOPLE } from '../data/smartPeople'

export function ScientistDirectory({
  initialData = SMART_PEOPLE
}) {
  const [people] = useState(initialData)
  const [query, setQuery] = useState('')
  const [minIq, setMinIq] = useState(0)
  const [sortBy, setSortBy] = useState('iq-desc')

  const searchId = useId()
  const iqId = useId()
  const sortId = useId()

  // Derived state: no useEffect required
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

  return (
    <section aria-label="Pioneer Directory">
      <h2>Scientist & Pioneer Directory</h2>

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

      <p>Found {visible.length} pioneers</p>

      <ul>
        {visible.map((person) => (
          <li key={person.id}>
            <strong>{person.name}</strong>
            {' — '}
            Age: {person.age}
            {' | '}
            IQ: {person.iq}
          </li>
        ))}
      </ul>
    </section>
  )
}
