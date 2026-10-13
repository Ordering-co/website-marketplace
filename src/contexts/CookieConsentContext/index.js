import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import settings from '../../config'

const CONSENT_STORAGE_KEY = 'cookie_consent'
export const CURRENT_CONSENT_VERSION = '1.0'

const CookieConsentContext = createContext()

const clearTrackingData = () => {
  // Clear Google Analytics cookies
  const gaCookies = ['_ga', '_gid', '_gat']
  gaCookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
  })

  // Clear Facebook Pixel cookies
  const fbCookies = ['_fbp', '_fbc']
  fbCookies.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`
  })

  // Clear Segment localStorage keys
  const segmentKeys = ['ajs_anonymous_id', 'ajs_user_id', 'ajs_user_traits']
  segmentKeys.forEach(key => {
    try { localStorage.removeItem(key) } catch (e) {}
  })

  // Shutdown Intercom if loaded
  if (window.Intercom) {
    window.Intercom('shutdown')
  }

  // Remove GA script tag if present
  const gaScript = document.getElementById('google-analytics-sdk')
  if (gaScript) gaScript.remove()

  // Remove intercom widget script
  const intercomScript = document.getElementById('intercom_widget')
  if (intercomScript) intercomScript.remove()
}

const getStoredConsent = () => {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data.version === CURRENT_CONSENT_VERSION && (data.status === 'accepted' || data.status === 'opted_out')) {
      return data
    }
  } catch (e) {}
  return null
}

const getInitialConsent = () => {
  const data = getStoredConsent()
  return data ? { status: data.status, timestamp: data.timestamp || null } : { status: 'unknown', timestamp: null }
}

const saveConsent = (status) => {
  try {
    const data = {
      status,
      version: CURRENT_CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      acknowledged: true
    }
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data))
  } catch (e) {}
}

export const CookieConsentProvider = ({ children }) => {
  const [initialConsent] = useState(getInitialConsent)
  const [consentStatus, setConsentStatus] = useState(initialConsent.status)
  const [consentTimestamp, setConsentTimestamp] = useState(initialConsent.timestamp)
  const [isConsentEnabled, setIsConsentEnabled] = useState(() => !!settings?.cookie_consent_enabled)
  const fromServerRef = useRef(false)

  const hasConsented = !isConsentEnabled || consentStatus === 'accepted'

  const acceptConsent = useCallback(() => {
    fromServerRef.current = false
    saveConsent('accepted')
    setConsentStatus('accepted')
    setConsentTimestamp(new Date().toISOString())
  }, [])

  const optOutConsent = useCallback(() => {
    fromServerRef.current = false
    saveConsent('opted_out')
    setConsentStatus('opted_out')
    setConsentTimestamp(new Date().toISOString())
    clearTrackingData()
  }, [])

  const setConsentFromServer = useCallback((consentData) => {
    fromServerRef.current = true
    saveConsent(consentData.status)
    setConsentStatus(consentData.status)
    setConsentTimestamp(new Date().toISOString())
    if (consentData.status === 'opted_out') clearTrackingData()
  }, [])

  // Sync consent state across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CONSENT_STORAGE_KEY) {
        try {
          const data = JSON.parse(e.newValue)
          setConsentStatus(data?.status || 'unknown')
        } catch {
          setConsentStatus('unknown')
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return (
    <CookieConsentContext.Provider value={{ consentStatus, consentTimestamp, hasConsented, acceptConsent, optOutConsent, isConsentEnabled, setIsConsentEnabled, setConsentFromServer, isFromServer: fromServerRef }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) {
    return { consentStatus: 'unknown', consentTimestamp: null, hasConsented: true, acceptConsent: () => {}, optOutConsent: () => {}, isConsentEnabled: false, setIsConsentEnabled: () => {}, setConsentFromServer: () => {}, isFromServer: { current: false } }
  }
  return ctx
}
