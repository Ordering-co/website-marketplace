import { useEffect, useSyncExternalStore } from 'react'
import { useApi } from '~components/contexts/ApiContext'

// Tiny reactive store for the enabled-languages list, shared across the app so
// every consumer (the persistent SidebarMenu + the profile page) reads the same
// value and a single source of truth drives them all.
//
// `languages === null` means "not known yet". The always-mounted header
// language selector primes this early (primeEnabledLanguages), and any consumer
// will fetch once as a fallback. Because it's an external store, priming
// re-renders every consumer immediately — so the language menu/page know the
// count without a load-then-hide flash.
let languages = null
let inFlight = null
const listeners = new Set()

const emit = () => { listeners.forEach((listener) => listener()) }
const subscribe = (listener) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
const getSnapshot = () => languages

/**
 * Seed the store from a list the app already loaded elsewhere (the header
 * language selector). Reactive: re-renders every consumer.
 */
export const primeEnabledLanguages = (list) => {
  if (Array.isArray(list)) {
    languages = list
    emit()
  }
}

export const useEnabledLanguages = () => {
  const [ordering] = useApi()
  const list = useSyncExternalStore(subscribe, getSnapshot)

  useEffect(() => {
    if (languages !== null || inFlight) return
    inFlight = ordering
      .languages()
      .where([{ attribute: 'enabled', value: true }])
      .get()
      .then(({ content: { error, result } }) => {
        if (languages === null) languages = error ? [] : (result || [])
        inFlight = null
        emit()
      })
      .catch(() => {
        if (languages === null) languages = []
        inFlight = null
        emit()
      })
  }, [])

  return {
    loading: list === null,
    languages: list || [],
    hasMultiple: (list?.length ?? 0) > 1
  }
}
