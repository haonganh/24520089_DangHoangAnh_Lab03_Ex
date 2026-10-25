
import { useState } from 'react'
import { SMART_PEOPLE } from '../data/smartPeople'

export function ScientistDirectory({
  initialData = SMART_PEOPLE
}) {
  const [people] = useState(initialData)

  return (
    <section aria-labelledby="directory-heading">
      <h2 id="directory-heading">
        Scientist & Pioneer Directory
      </h2>

      <p>Total pioneers: {people.length}</p>

      <ul>
        {people.map((person) => (
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

