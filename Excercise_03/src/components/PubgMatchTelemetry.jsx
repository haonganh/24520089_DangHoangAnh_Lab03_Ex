
import { useEffect, useId, useRef, useState } from 'react'
import { PUBG_VN_SQUADS } from '../data/pubg-vn-telemetry-spec'
import { fetchTelemetry } from '../services/mockTelemetry'
import styles from './PubgMatchTelemetry.module.css'

export function PubgMatchTelemetry({ squadId = 'te' }) {
  const [selectedSquad, setSelectedSquad] = useState(squadId)

  const [view, setView] = useState({
    status: 'IDLE',
    data: null,
    error: null
  })

  const [retryTick, setRetryTick] = useState(0)

  const selectorId = useId()
  const selectorRef = useRef(null)

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

    return () => controller.abort()
  }, [selectedSquad, retryTick])

  function handleRetry() {
    // Move focus before the Retry button disappears.
    selectorRef.current?.focus()

    // Re-run the telemetry effect.
    setRetryTick((previous) => previous + 1)
  }

  return (
    <section
      className={styles.telemetry}
      aria-label="PUBG Vietnam Match Telemetry"
      aria-busy={view.status === 'LOADING'}
    >
      <h2>PUBG Vietnam Live Telemetry</h2>

      <label htmlFor={selectorId}>
        Select PUBG Squad
      </label>

      <select
        ref={selectorRef}
        id={selectorId}
        className={styles.selector}
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
        <p role="status">Waiting for telemetry...</p>
      )}

      {view.status === 'LOADING' && (
        <section
          className={styles.skeleton}
          role="status"
          aria-label="Syncing KRAFTON Radar"
        >
          <span className={styles.loadingText}>
            Syncing KRAFTON Radar...
          </span>

          <span
            className={styles.skeletonLine}
            aria-hidden="true"
          />

          <span
            className={styles.skeletonLine}
            aria-hidden="true"
          />

          <span
            className={styles.skeletonLine}
            aria-hidden="true"
          />
        </section>
      )}

      {view.status === 'ERROR' && (
        <section
          className={styles.error}
          role="alert"
        >
          <h3>Blue-Zone Link Lost</h3>

          <p>{view.error}</p>

          <button
            className={styles.retryButton}
            type="button"
            onClick={handleRetry}
          >
            Reconnect Satellite
          </button>
        </section>
      )}

      {view.status === 'SUCCESS' && (
        <article
          className={styles.radar}
          aria-live="polite"
        >
          <h3>{view.data.name}</h3>

          <dl className={styles.stats}>
            <dt>Map</dt>
            <dd>{view.data.map}</dd>

            <dt>Phase</dt>
            <dd>{view.data.phase}</dd>

            <dt>Players Alive</dt>
            <dd>{view.data.alive}</dd>

            <dt>Kills</dt>
            <dd>{view.data.kills}</dd>

            <dt>WWCD Probability</dt>
            <dd>{view.data.wwcdProb}</dd>

            <dt>Status</dt>
            <dd>{view.data.status}</dd>
          </dl>
        </article>
      )}
    </section>
  )
}
