import { useEffect, useRef } from 'react'
import { useCookieConsent } from '../../contexts/CookieConsentContext'
import settings from '../../config'

const allowedDomains = ['orderingplus.com', '-stores.my-sites.app']

const isAllowedDomain = () => {
  const hostname = window?.location?.hostname || ''
  return hostname !== 'localhost' && allowedDomains.some(domain => hostname.endsWith(domain))
}

export const SentryInitializer = () => {
  const { hasConsented } = useCookieConsent()
  const initialized = useRef(false)

  useEffect(() => {
    if (!import.meta.env.VITE_SENTRY_RELEASE || !hasConsented || initialized.current || !isAllowedDomain()) return

    initialized.current = true
    // Dynamic import keeps @sentry/react out of the entry chunk; it only
    // loads after consent on an allowed domain.
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        environment: 'production',
        release: `website-marketplace-2@${import.meta.env.VITE_SENTRY_RELEASE}`,
        dsn: settings.sentry_key,
        integrations: [
          Sentry.browserTracingIntegration()
        ],
        tracesSampleRate: 0.1,
        autoSessionTracking: true
      })
    })
  }, [hasConsented])

  return null
}
