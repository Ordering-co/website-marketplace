import { useEffect } from 'react'

import { applyWebManifestLink } from '../../../../utils/applyWebManifestLink'
import { buildWebManifest } from '../../../../utils/buildWebManifest'
import { resolvePwaBranding } from '../../../../utils/resolvePwaBranding'

export const WebManifest = ({
  ready,
  theme,
  site,
  settings,
  languageCode,
  hostname,
  origin = typeof window !== 'undefined' ? window.location.origin : ''
}) => {
  useEffect(() => {
    if (!ready) return undefined

    return applyWebManifestLink(buildWebManifest({
      ...resolvePwaBranding({
        theme,
        site,
        settings,
        languageCode,
        hostname
      }),
      origin
    }))
  }, [ready, theme, site, settings, languageCode, hostname, origin])

  return null
}

export default WebManifest
