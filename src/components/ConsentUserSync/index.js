import { useEffect, useRef } from 'react'
import { useSession } from '~components/contexts/SessionContext'
import { useApi } from '~components/contexts/ApiContext'
import { useCookieConsent, CURRENT_CONSENT_VERSION } from '../../contexts/CookieConsentContext'

const ConsentUserSync = () => {
  const [{ user, token, loading }, { changeUser }] = useSession()
  const [ordering] = useApi()
  const { consentStatus, consentTimestamp, setConsentFromServer, isFromServer } = useCookieConsent()
  const prevUserIdRef = useRef(null)
  const hasSyncedRef = useRef(false)
  const serverSettingsRef = useRef(null)

  const saveConsentToServer = async (status) => {
    if (!ordering?.project || !token || !user?.id) return
    try {
      const currentSettings = serverSettingsRef.current || {}
      const { content: { error, result } } = await ordering.setAccessToken(token).users(user.id).save(
        { settings: { ...currentSettings, cookie_consent: { status, version: CURRENT_CONSENT_VERSION, timestamp: new Date().toISOString(), acknowledged: true } } }
      )
      if (!error && result) {
        serverSettingsRef.current = result.settings
        changeUser({ ...user, settings: result.settings })
      }
    } catch (err) {
      console.warn('Failed to save cookie consent to user settings:', err)
    }
  }

  useEffect(() => {
    if (loading || !user?.id || !token) {
      prevUserIdRef.current = null
      hasSyncedRef.current = false
      return
    }
    if (!ordering?.project) return
    if (prevUserIdRef.current === user.id && hasSyncedRef.current) return
    prevUserIdRef.current = user.id
    hasSyncedRef.current = true

    const syncConsent = async () => {
      try {
        const { content: { error, result } } = await ordering.setAccessToken(token).users(user.id).select(['settings']).get()
        if (error) return

        serverSettingsRef.current = result?.settings || {}
        const serverConsent = result?.settings?.cookie_consent

        if (consentStatus !== 'unknown' && serverConsent?.status && serverConsent.status !== 'unknown') {
          const localTime = consentTimestamp
          const serverTime = serverConsent?.timestamp
          if (localTime && serverTime && new Date(serverTime) > new Date(localTime)) {
            if (serverConsent.status !== consentStatus) {
              setConsentFromServer(serverConsent)
            }
          } else if (serverConsent.status !== consentStatus) {
            saveConsentToServer(consentStatus)
          }
        } else if (consentStatus !== 'unknown') {
          saveConsentToServer(consentStatus)
        } else if (serverConsent?.status && serverConsent.status !== 'unknown') {
          setConsentFromServer(serverConsent)
        }
      } catch (err) {
        console.warn('Failed to fetch user settings for cookie consent:', err)
      }
    }

    syncConsent()
  }, [loading, user?.id, token, ordering?.project])

  useEffect(() => {
    if (loading || !user?.id || !token || !ordering?.project || consentStatus === 'unknown') return
    if (isFromServer.current) {
      isFromServer.current = false
      return
    }
    if (!hasSyncedRef.current) return
    saveConsentToServer(consentStatus)
  }, [consentStatus])

  return null
}

export default ConsentUserSync
