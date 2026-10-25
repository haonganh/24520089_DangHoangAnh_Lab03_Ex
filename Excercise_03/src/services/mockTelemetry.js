
import { PUBG_VN_SQUADS } from '../data/pubg-vn-telemetry-spec'

export function fetchTelemetry(squadId, signal) {
  return new Promise((resolve, reject) => {
    const squad = PUBG_VN_SQUADS.find(
      (item) => item.id === squadId
    )

    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const onAbort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)

      // Simulate 35% satellite packet loss
      if (Math.random() < 0.35) {
        reject(new Error('Satellite packet timeout'))
        return
      }

      if (!squad) {
        reject(new Error('Squad not found'))
        return
      }

      resolve({ ...squad })
    }, 1200)

    signal.addEventListener('abort', onAbort, {
      once: true
    })
  })
}
