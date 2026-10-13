import { useEffect, useRef } from 'react'
import { useCookieConsent } from '../../contexts/CookieConsentContext'
import settings from '../../config'

const isAllowedDomain = () => {
  const allowedDomain = 'orderingplus.com'
  return window.location.hostname.endsWith(allowedDomain) && window?.location?.hostname !== 'localhost'
}

export const SentryInitializer = () => {
  const { hasConsented } = useCookieConsent()
  const initialized = useRef(false)

  useEffect(() => {
    if (!hasConsented || initialized.current || !isAllowedDomain()) return

    initialized.current = true
    // Dynamic import keeps @sentry/react out of the entry chunk; it only
    // loads after consent on an allowed domain.
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        environment: window?.location?.hostname === 'localhost' ? 'development' : process.env.NODE_ENV,
        release: process.env.npm_package_version ? 'react-ordering-website@' + process.env.npm_package_version : 'react-ordering-website@' + '1.0.1',
        dsn: settings.sentry_key,
        integrations: [
          Sentry.browserTracingIntegration()
        ],
        tracesSampleRate: window?.location?.hostname === 'localhost' ? 0 : 0.5,
        autoSessionTracking: true
      })
    })
  }, [hasConsented])

  return null
}
