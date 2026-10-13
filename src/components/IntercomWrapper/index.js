import React, { useEffect } from 'react'
import { useSession } from '~components/contexts/SessionContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useCookieConsent } from '../../contexts/CookieConsentContext'

const INTERCOM_MARKER_ID = 'intercom_widget'
const INTERCOM_MOBILE_STYLE_ID = 'intercom_mobile_position_override'
const MOBILE_BREAKPOINT = 576
const MOBILE_LAUNCHER_BOTTOM = '80px'

const pickFirstTruthy = (...vals) => vals.find((v) => v != null && v !== '')

const getVerticalPadding = () => (
  typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT ? 90 : 20
)

const injectIntercomMobileStyles = () => {
  if (document.getElementById(INTERCOM_MOBILE_STYLE_ID)) return

  const style = document.createElement('style')
  style.id = INTERCOM_MOBILE_STYLE_ID
  style.textContent = `
    @media (max-width: ${MOBILE_BREAKPOINT - 1}px) {
      .intercom-lightweight-app-launcher,
      .intercom-launcher,
      .intercom-launcher-frame,
      #intercom-container .intercom-launcher,
      #intercom-container .intercom-app-launcher-enabled {
        bottom: ${MOBILE_LAUNCHER_BOTTOM} !important;
      }
      iframe[name="intercom-notifications-frame"] {
        bottom: calc(${MOBILE_LAUNCHER_BOTTOM} + 60px) !important;
      }
    }
  `
  document.head.appendChild(style)
}

const removeIntercomMobileStyles = () => {
  document.getElementById(INTERCOM_MOBILE_STYLE_ID)?.remove()
}

const toUnixSeconds = (value) => {
  if (value == null) return null
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value)
  }
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return null
  return Math.floor(parsed / 1000)
}

const buildIntercomSettings = ({
  user,
  configs,
  userName,
  phoneNumber,
  intercomAppId
}) => {
  const apiBase = pickFirstTruthy(
    configs?.intercom_api_base?.value,
    'https://api-iam.intercom.io'
  )

  const userId = pickFirstTruthy(
    user?.id != null ? String(user.id) : null,
    user?.email
  )

  const intercomUserJwt = pickFirstTruthy(
    user?.intercom_user_jwt,
    user?.metadata?.intercom_user_jwt,
    configs?.intercom_user_jwt?.value,
    configs?.intercom_jwt?.value
  )

  const userHash = pickFirstTruthy(
    user?.intercom_user_hash,
    user?.metadata?.intercom_user_hash,
    configs?.intercom_user_hash?.value,
    configs?.intercom_identity_hash?.value
  )

  const intercomSettings = {
    api_base: apiBase,
    app_id: String(intercomAppId),
    name: userName,
    email: user?.email,
    vertical_padding: getVerticalPadding()
  }

  if (userId) {
    intercomSettings.user_id = userId
  }
  if (phoneNumber) {
    intercomSettings.phone = phoneNumber
  }

  const createdAt = toUnixSeconds(user?.created_at)
  if (createdAt != null) {
    intercomSettings.created_at = createdAt
  }

  if (intercomUserJwt) {
    intercomSettings.intercom_user_jwt = intercomUserJwt
  }
  if (userHash) {
    intercomSettings.user_hash = userHash
  }

  return intercomSettings
}

const isConfigTruthy = (raw) => (
  raw === '1' || raw === 1 || String(raw).toLowerCase() === 'true'
)

export const IntercomWrapper = (props) => {
  const [{ user, auth }] = useSession()
  const [{ configs }] = useConfig()
  const { hasConsented, isConsentEnabled } = useCookieConsent()

  const intercomOnRaw = configs?.intercom_enabled?.value
  const isIntercomEnabled = isConfigTruthy(intercomOnRaw)
  const intercomAppId = pickFirstTruthy(
    configs?.intercom_app_id?.value,
    configs?.intercom_api_key?.value
  )

  const userName = user?.lastname ? `${user?.name} ${user?.lastname}` : user?.name
  const phoneNumber = user?.country_phone_code && user?.cellphone
    ? `+${user?.country_phone_code} ${user?.cellphone}`
    : user?.cellphone

  const runIntercomLoader = (appId) => {
    const w = window
    const ic = w.Intercom
    if (typeof ic === 'function') {
      ic('reattach_activator')
      ic('update', w.intercomSettings)
      return
    }
    const d = document
    const i = function () { i.c(arguments) }
    i.q = []
    i.c = function (args) { i.q.push(args) }
    w.Intercom = i
    const l = () => {
      const s = d.createElement('script')
      s.type = 'text/javascript'
      s.async = true
      s.src = `https://widget.intercom.io/widget/${String(appId)}`
      const x = d.getElementsByTagName('script')[0]
      x.parentNode.insertBefore(s, x)
    }
    if (document.readyState === 'complete') {
      l()
    } else if (w.attachEvent) {
      w.attachEvent('onload', l)
    } else {
      w.addEventListener('load', l, false)
    }
  }

  useEffect(() => {
    const consentOk = !isConsentEnabled || hasConsented
    const shouldLoad = auth && isIntercomEnabled && intercomAppId && consentOk

    const handleResize = () => {
      window.intercomSettings = {
        ...window.intercomSettings,
        vertical_padding: getVerticalPadding()
      }
      window.Intercom?.('update', window.intercomSettings)
    }

    if (!shouldLoad) {
      window?.Intercom?.('shutdown')
      document.getElementById(INTERCOM_MARKER_ID)?.remove()
      removeIntercomMobileStyles()
      return
    }

    const isBlockUpdate = user?.email?.includes('@ordering.co')
    if (isBlockUpdate) {
      window?.Intercom?.('shutdown')
      document.getElementById(INTERCOM_MARKER_ID)?.remove()
      removeIntercomMobileStyles()
      return
    }

    injectIntercomMobileStyles()

    const intercomSettings = buildIntercomSettings({
      user,
      configs,
      userName,
      phoneNumber,
      intercomAppId
    })
    window.intercomSettings = intercomSettings

    if (document.getElementById(INTERCOM_MARKER_ID)) {
      window.Intercom?.('update', window.intercomSettings)
    } else {
      runIntercomLoader(intercomAppId)

      const marker = document.createElement('script')
      marker.id = INTERCOM_MARKER_ID
      marker.type = 'text/javascript'
      document.body.appendChild(marker)

      window.Intercom?.('boot', window.intercomSettings)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [user, configs, auth, isIntercomEnabled, intercomAppId, userName, phoneNumber, isConsentEnabled, hasConsented])

  return <>{props.children}</>
}
