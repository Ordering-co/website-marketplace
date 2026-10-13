import { useEffect, useRef } from 'react'
import { useSession } from '~components/contexts/SessionContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { getForterSnippet } from './snippet'

export const ForterScript = () => {
  const [{ token }] = useSession()
  const [{ configs }] = useConfig()
  const initialized = useRef(false)

  useEffect(() => {
    if (!token || initialized.current) return

    const forterEnabled = configs?.braintree_forter_enabled?.value
    const forterSiteId = configs?.braintree_forter_site_id?.value
    const forterEnvironment = configs?.braintree_forter_environment?.value || 'production'

    if (!forterEnabled || forterEnabled === '0' || !forterSiteId) return

    if (document.getElementById('forter-tti') || document.getElementById('forter-snippet')) return

    const ttiScript = document.createElement('script')
    ttiScript.type = 'text/javascript'
    ttiScript.id = 'forter-tti'
    ttiScript.textContent = `
      (function () {
        window.__forterToken = null;
        document.addEventListener("ftr:tokenReady", function (evt) {
          window.__forterToken = evt.detail;
        });
      })();
    `
    document.head.appendChild(ttiScript)

    const forterScript = document.createElement('script')
    forterScript.type = 'text/javascript'
    forterScript.id = 'forter-snippet'
    forterScript.textContent = getForterSnippet(forterSiteId, forterEnvironment)
    document.head.appendChild(forterScript)

    initialized.current = true
  }, [token, configs?.braintree_forter_enabled?.value, configs?.braintree_forter_site_id?.value])

  return null
}
