
import { useEffect, useId, useState } from 'react'
import { PUBG_VN_SQUADS } from '../data/pubg-vn-telemetry-spec'
import { fetchTelemetry } from '../services/mockTelemetry'

export function PubgMatchTelemetry({
  squadId = 'te'
}) {
  const [selectedSquad, setSelectedSquad] = useState(squadId)

  const [view, setView] = useState({
    status: 'IDLE',
    data: null,
    error: null
  })

  const selectorId = useId()

  useEffect(() => {
    const controller = new AbortController()

    setView({
      status: 'LOADING',
      data: null,
      error: null
    })

    fetchTelemetry(selectedSquad, controller.signal)
      .then((payload) => {
        if (controller.signal.aborted) return

        setView({
          status: 'SUCCESS',
          data: payload,
          error: null
        })
      })
      .catch((err) => {
        if (
          err.name === 'AbortError' ||
          controller.signal.aborted
        ) {
          return
        }

        setView({
          status: 'ERROR',
          data: null,
          error: err.message
        })
      })

    // Cancel the previous request
    return () => controller.abort()
  }, [selectedSquad])

  return (
    <section aria-label="PUBG Vietnam Match Telemetry">
      <h2>PUBG Vietnam Live Telemetry</h2>

      <label htmlFor={selectorId}>
        Select PUBG Squad
      </label>

      <select
        id={selectorId}
        value={selectedSquad}
        onChange={(e) => setSelectedSquad(e.target.value)}
      >
        {PUBG_VN_SQUADS.map((squad) => (
          <option key={squad.id} value={squad.id}>
            {squad.name}
          </option>
        ))}
      </select>

      {view.status === 'IDLE' && (
        <p>Waiting for telemetry...</p>
      )}

      {view.status === 'LOADING' && (
        <section role="status" aria-live="polite">
          <p>Syncing KRAFTON Radar...</p>
        </section>
      )}

      {view.status === 'ERROR' && (
        <section role="alert">
          <h3>Blue-Zone Link Lost</h3>
          <p>{view.error}</p>
        </section>
      )}

      {view.status === 'SUCCESS' && (
        <article aria-live="polite">
          <h3>
            {view.data.name} — Kills: {view.data.kills}
          </h3>

          <p>Map: {view.data.map}</p>
          <p>Phase: {view.data.phase}</p>
          <p>Players Alive: {view.data.alive}</p>
          <p>WWCD Probability: {view.data.wwcdProb}</p>
          <p>Status: {view.data.status}</p>
        </article>
      )}
    </section>
  )
}
