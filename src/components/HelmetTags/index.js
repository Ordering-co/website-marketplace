import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTheme } from 'styled-components'
import helmetData from '../../helmetdata.json'
import { useConfig } from '~components/contexts/ConfigContext'
import { useSite } from '~components/contexts/SiteContext'
import { DEFAULT_SEO_DESCRIPTION, resolveSeoDescription } from '../../utils/seoDescription'
import { useCookieConsent } from '../../contexts/CookieConsentContext'

const orderingSubdomains = ['tryordering.com', 'ordering.co', 'orderingplus.com']

const isOrderingHost = () => {
  if (typeof window === 'undefined') return false
  return orderingSubdomains.some(subdomain => window.location.hostname.includes(subdomain))
}

export const HelmetTags = (props) => {
  const {
    page
  } = props

  const theme = useTheme()
  const [configs] = useConfig()
  const [{ site }] = useSite()
  const { hasConsented } = useCookieConsent()
  const enabledPoweredByOrdering = (typeof window !== 'undefined' ? window.__CONFIG__?.disable_powered_by : undefined) !== undefined
    ? !window.__CONFIG__.disable_powered_by
    : configs?.powered_by_ordering_module?.value
  const metaTag = page ? helmetData[page] : helmetData.app
  const seoInjected = typeof window !== 'undefined' &&
    (!window.__SEO__?.pathname || window.__SEO__.pathname === window.location.pathname)
    ? window.__SEO__
    : null

  useEffect(() => {
    if (!hasConsented || !theme?.third_party_code?.head) return

    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = theme.third_party_code.head

    const scripts = tempDiv.querySelectorAll('script')
    scripts.forEach(script => {
      const scriptExists = [...document.head.querySelectorAll('script')].some(existingScript => {
        if (script.src && existingScript.src === script.src) {
          return true
        }

        if (!script.src && existingScript.innerHTML === script.innerHTML) {
          return true
        }

        return false
      })
      if (!scriptExists) {
        const newScript = document.createElement('script')
        if (script.src) {
          newScript.src = script.src
        } else {
          newScript.innerHTML = script.innerHTML
        }
        document.head.appendChild(newScript)
      }
    })
  }, [hasConsented, theme?.third_party_code?.head])

  const noscriptContent = (() => {
    if (!theme?.third_party_code?.head) return ''
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = theme.third_party_code.head
    const noscript = tempDiv.querySelector('noscript')
    return noscript ? noscript.innerHTML : ''
  })()

  const siteName = theme?.my_products?.components?.website_settings?.components?.values?.name
  const siteDescription = resolveSeoDescription(
    site?.description,
    theme?.my_products?.components?.website_settings?.components?.values?.description
  )
  const effectiveDescription = resolveSeoDescription(
    props.helmetMetaTags?.description,
    seoInjected?.description,
    siteDescription,
    seoInjected?.ogDescription,
    metaTag?.description
  ) || DEFAULT_SEO_DESCRIPTION
  // Page meta loads only a normal description (onChangeMetaTag); it must not
  // displace a valid injected OG. An explicit page ogDescription still wins.
  const effectiveOgDescription = resolveSeoDescription(
    props.helmetMetaTags?.ogDescription,
    seoInjected?.ogDescription,
    effectiveDescription
  ) || DEFAULT_SEO_DESCRIPTION
  const themeReady = !!siteName
  const canRenderTitle = !!page && themeReady
  const effectiveSeoTitle = seoInjected?.title && seoInjected.title !== siteName ? seoInjected.title : null
  const titleTemplate = !canRenderTitle || (effectiveSeoTitle && !props.helmetMetaTags?.title)
    ? ''
    : `${siteName} - %s`
  // Customer-host robots are page-owned: the global instance must not reset a
  // page's noindex when it mounts later. Provider hosts keep the safeguard.
  const robotsContent = isOrderingHost()
    ? 'noindex, nofollow'
    : (page ? (props.robots || metaTag?.robots) : null)

  return (
    <Helmet titleTemplate={titleTemplate}>
      {canRenderTitle && (
        <title id={`route-${page}`}>{props.helmetMetaTags?.title || effectiveSeoTitle || metaTag.title} {enabledPoweredByOrdering ? '- Powered by Orderingplus' : ''}</title>
      )}
      {page && effectiveDescription && (
        <meta name='description' content={effectiveDescription} />
      )}
      {page && effectiveOgDescription && (
        <meta property='og:description' content={effectiveOgDescription} />
      )}
      <meta name='keywords' content={props.helmetMetaTags?.keywords || metaTag.keywords} />
      {robotsContent && <meta name='robots' content={robotsContent} />}
      {props.canonicalUrl
        ? (
        <link rel='canonical' href={props.canonicalUrl} />
          )
        : (
            metaTag.canonicalUrl && <link rel='canonical' href={metaTag.canonicalUrl} />
          )}
      {noscriptContent && (
        <noscript>{noscriptContent}</noscript>
      )}
    </Helmet>
  )
}

export default HelmetTags
