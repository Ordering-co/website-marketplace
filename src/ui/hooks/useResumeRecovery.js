import { useEffect, useRef } from 'react'

/**
 * Recovers data lost while the app was suspended/backgrounded.
 *
 * When the tab becomes visible again after having been hidden, or the network
 * comes back online, this checks whether a data view is currently stuck on its
 * empty state (marked with `data-resume-recover`). If so — and only then — it
 * performs a single silent reload to re-fetch, mirroring the manual refresh the
 * user does today. It never reloads on a normal empty result the user is just
 * looking at (only right after a resume), waits briefly so the app can settle
 * first, and a short sessionStorage guard prevents any reload loop.
 */
export const useResumeRecovery = () => {
  const wasHiddenRef = useRef(false)

  useEffect(() => {
    const RELOAD_GUARD_MS = 8000
    const SETTLE_MS = 700
    const recover = () => {
      setTimeout(() => {
        // Only act if a data view is stuck on its empty state.
        if (!document.querySelector('[data-resume-recover]')) return
        // Avoid reload loops: skip if we just reloaded for this reason.
        const last = Number(sessionStorage.getItem('resumeRecoverAt') || 0)
        if (Date.now() - last < RELOAD_GUARD_MS) return
        sessionStorage.setItem('resumeRecoverAt', String(Date.now()))
        window.location.reload()
      }, SETTLE_MS)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true
        return
      }
      if (wasHiddenRef.current) {
        wasHiddenRef.current = false
        recover()
      }
    }
    const onOnline = () => recover()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', onOnline)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('online', onOnline)
    }
  }, [])
}
