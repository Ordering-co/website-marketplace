/**
 * Boot-time network shims. Must be the FIRST import in src/index.js so they
 * are installed before any SDK/context code runs.
 *
 * The shared components submodule (off-limits for edits) blocks the first
 * render on network requests the Cloudflare worker can answer ahead of time:
 *
 * 1. Geo — Config loading awaits a third-party fetch(https://ipapi.co/json/)
 *    whose data is only a fallback for the default country code. The worker
 *    knows the visitor's country (request.cf.country) and injects it as
 *    window.__GEO__; the fetch shim answers that request locally.
 * 2. i18n — LanguageContext always fetches /translations (and, on first
 *    visit, the default /languages) via the SDK's XMLHttpRequest before the
 *    spinner can clear. The worker pre-fetches both (edge-cached) and injects
 *    them as window.__EDGE_XHR__; the XHR shim serves them instantly, once —
 *    later requests (e.g. switching language) go to the network as usual.
 *
 * Both shims are fail-open: without the injected globals (local dev, worker
 * fetch failure) every request goes through unchanged.
 */
const IPAPI_URL = 'https://ipapi.co/json/'

const buildGeoResponse = async (countryCode) => {
  const { CODES } = await import('~components/constants/code-numbers')
  const phoneCode = CODES.find((code) => code.countryCode === countryCode)?.phoneCode
  return new Response(
    JSON.stringify({
      country_code: countryCode,
      ...(phoneCode && { country_calling_code: `+${phoneCode}` })
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  )
}

const installGeoShim = () => {
  const nativeFetch = window.fetch.bind(window)
  window.fetch = (resource, options) => {
    const countryCode = window.__GEO__?.country_code
    const url = typeof resource === 'string' ? resource : resource?.url
    if (countryCode && url === IPAPI_URL) {
      return buildGeoResponse(countryCode)
    }
    return nativeFetch(resource, options)
  }
}

/**
 * Matches a GET request against the injected __EDGE_XHR__ payloads and takes
 * (one-shot) the matching one. URLs look like {api}/v400/{lang}/{project}/...
 * with the query unencoded by the SDK; matching is loose (endpoint + language
 * + project + distinguishing query marker) so it survives param reordering.
 */
const takeInjectedXhrPayload = (method, url) => {
  const store = window.__EDGE_XHR__
  if (!store || method?.toUpperCase() !== 'GET') return null
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const segments = parsed.pathname.split('/').filter(Boolean)
  const [, lang, project, endpoint] = segments
  if (segments.length !== 4 || lang !== store.language || project !== store.project) return null

  let search
  try {
    search = decodeURIComponent(parsed.search)
  } catch {
    search = parsed.search
  }
  if (endpoint === 'translations' && store.translations && search.includes('mode=dictionary')) {
    const payload = store.translations
    store.translations = null
    return payload
  }
  if (endpoint === 'languages' && store.languages_default && search.includes('"attribute":"default"')) {
    const payload = store.languages_default
    store.languages_default = null
    return payload
  }
  return null
}

const installXhrShim = () => {
  if (!window.__EDGE_XHR__) return
  const XHR_RESPONSE_FIELDS = { status: 200, statusText: 'OK', readyState: 4 }

  window.XMLHttpRequest = class extends window.XMLHttpRequest {
    open (method, url, ...rest) {
      this._interceptMethod = method
      this._interceptUrl = url
      return super.open(method, url, ...rest)
    }

    send (body) {
      const payload = this._interceptUrl && takeInjectedXhrPayload(this._interceptMethod, this._interceptUrl)
      if (!payload) return super.send(body)

      const responseText = JSON.stringify(payload)
      Object.entries({ ...XHR_RESPONSE_FIELDS, response: responseText, responseText }).forEach(([key, value]) => {
        Object.defineProperty(this, key, { value, configurable: true })
      })
      queueMicrotask(() => {
        this.onreadystatechange?.(new Event('readystatechange'))
        this.onload?.(new ProgressEvent('load'))
        this.onloadend?.(new ProgressEvent('loadend'))
      })
    }
  }
}

installGeoShim()
installXhrShim()
