const ORDERING_DOMAINS = ['tryordering.com', 'ordering.co', 'orderingplus.com']
export const ORDERING_FAVICON = '/favicon.png'
export const WHITE_LABEL_LOGO = '/default-logo.png'
export const WHITE_LABEL_FAVICON = '/default-favicon.png'

const PLACEHOLDER_ASSETS = new Set([WHITE_LABEL_LOGO, WHITE_LABEL_FAVICON])

export const isOrderingHost = (hostname) => {
  if (!hostname) return false
  return ORDERING_DOMAINS.some(d => hostname.includes(d))
}

const brandAssetPath = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  try {
    return raw.includes('://') ? new URL(raw).pathname : raw.split('?')[0]
  } catch (_) {
    return raw
  }
}

export const isConfiguredBrandAsset = (value) => {
  const path = brandAssetPath(value)
  return !!path && !PLACEHOLDER_ASSETS.has(path)
}

export const getFallbackFaviconPath = (hostname) =>
  isOrderingHost(hostname) ? ORDERING_FAVICON : WHITE_LABEL_FAVICON

export const resolveTenantFaviconUrl = (
  configuredFavicon,
  siteLogo,
  hostname
) =>
  (isConfiguredBrandAsset(configuredFavicon) ? String(configuredFavicon).trim() : '') ||
  (isConfiguredBrandAsset(siteLogo) ? String(siteLogo).trim() : '') ||
  getFallbackFaviconPath(hostname)

export const deriveProjectFromHost = (hostname, baseConfig) => {
  if (!hostname || !baseConfig) return baseConfig?.project ?? null

  let candidate = hostname.split('.').slice(0, 1).join('')
  if (candidate.startsWith('v26-') && hostname.endsWith('orderingplus.com')) {
    candidate = candidate.replace('v26-', '')
  }

  const orderingHost = isOrderingHost(hostname)
  if (baseConfig.use_project_subdomain && orderingHost) return candidate
  if (baseConfig.use_project_domain && !orderingHost) return '_'
  return baseConfig.project ?? null
}

const RESERVED_SEGMENTS = new Set([
  'home',
  'wallets',
  'signup_business',
  'signup-driver',
  'password',
  'profile',
  'verify',
  'messages',
  'help',
  'search',
  'business_search',
  'promotions',
  'checkout',
  'multi-checkout',
  'multi-cart',
  'multi-orders',
  'orders',
  'pages',
  'favorite',
  'sessions',
  'store'
])

const buildBusinessSeoPath = (businessSlug, categoryParam, productParam) => {
  const biz = encodeURIComponent(businessSlug)
  if (categoryParam && productParam) {
    return `/seo/business/${biz}/category/${encodeURIComponent(categoryParam)}/product/${encodeURIComponent(productParam)}`
  }
  if (categoryParam) {
    return `/seo/business/${biz}/category/${encodeURIComponent(categoryParam)}`
  }
  return `/seo/business/${biz}`
}

// decodeURIComponent throws a URIError on a malformed percent-escape (e.g. `/%`).
// The fetch handler has no outer try/catch, so decode defensively and fall back
// to the raw segment rather than 500-ing instead of serving the SPA.
const safeDecodeURIComponent = (value) => {
  try {
    return decodeURIComponent(value)
  } catch (_) {
    return value
  }
}

export const mapSeoEndpoint = (pathname, searchParams) => {
  const segments = pathname.split('/').filter(Boolean).map(safeDecodeURIComponent)
  const categoryParam = searchParams?.get('category') || null
  const productParam = searchParams?.get('product') || null

  if (segments.length === 0 || segments[0] === 'home') {
    return '/seo/general'
  }

  if (segments[0] === 'pages' && segments[1]) {
    return `/seo/pages/slug/${encodeURIComponent(segments[1])}`
  }

  if (segments[0] === 'store') {
    const rest = segments.slice(1)
    if (rest.length === 1) {
      return buildBusinessSeoPath(rest[0], categoryParam, productParam)
    }
    if (rest.length === 2) {
      return `/seo/business/${encodeURIComponent(rest[0])}/category/${encodeURIComponent(rest[1])}${productParam ? `/product/${encodeURIComponent(productParam)}` : ''}`
    }
    if (rest.length === 3) {
      return `/seo/business/${encodeURIComponent(rest[0])}/category/${encodeURIComponent(rest[1])}/product/${encodeURIComponent(rest[2])}`
    }
    return '/seo/general'
  }

  if (!RESERVED_SEGMENTS.has(segments[0])) {
    if (segments.length === 1) {
      return buildBusinessSeoPath(segments[0], categoryParam, productParam)
    }
    if (segments.length === 2) {
      return `/seo/business/${encodeURIComponent(segments[0])}/category/${encodeURIComponent(segments[1])}${productParam ? `/product/${encodeURIComponent(productParam)}` : ''}`
    }
    if (segments.length === 3) {
      return `/seo/business/${encodeURIComponent(segments[0])}/category/${encodeURIComponent(segments[1])}/product/${encodeURIComponent(segments[2])}`
    }
  }

  return '/seo/general'
}

const DEFAULT_SEO_TTL = 3600
const DEFAULT_FIRST_LOAD_TTL = 300
const DEFAULT_MAX_RESPONSE_BYTES = 2 * 1024 * 1024
const DEFAULT_SEO_TIMEOUT_MS = 3000
const DEFAULT_FIRST_LOAD_TIMEOUT_MS = 4000
const DEFAULT_SITEMAP_TTL = 3600
const DEFAULT_SITEMAP_TIMEOUT_MS = 8000

const resolvePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const CACHE_VERSION = 'v5'
const SEO_CACHE_KEY_BASE = `https://website-marketplace-v26.internal/${CACHE_VERSION}`
// Shared with worker/index.js sanitizeRouterCacheKey — keep a single source of truth.
export const ROUTER_CACHE_KEY_BASE = 'https://websites-router.internal'

const FIRST_LOAD_PARAMS = 'features,configs,site(name,description,code,domain,temporal_domain,type,logo,header,image,social_share,deployment_provider_settings,business(name,slug),franchise(name,slug)),theme'

export const DEFAULT_SEO_TITLE = 'Ordering'
export const DEFAULT_SEO_DESCRIPTION = 'Food marketplace by ordering.inc'

const pickNonEmptyString = (value) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const buildSeoCacheKey = (hostname, seoPath) =>
  `${SEO_CACHE_KEY_BASE}/seo?host=${encodeURIComponent(hostname || '')}&path=${encodeURIComponent(seoPath || '')}`

const buildFirstLoadCacheKey = (origin) =>
  `${ROUTER_CACHE_KEY_BASE}/first-load?origin=${encodeURIComponent(origin || '')}`

const buildCurrentCacheKey = (project) =>
  `${SEO_CACHE_KEY_BASE}/current?project=${encodeURIComponent(project || '')}`

const buildSitemapCacheKey = (project) =>
  `${SEO_CACHE_KEY_BASE}/sitemap?project=${encodeURIComponent(project || '')}`

const isCacheDisabled = (env) => {
  if (!env) return false
  const v = typeof env.DISABLE_CACHE === 'string' ? env.DISABLE_CACHE.trim().toLowerCase() : env.DISABLE_CACHE
  return v === true || v === 'true' || v === '1'
}

const cacheRead = async (cacheKeyUrl, env) => {
  if (!cacheKeyUrl || isCacheDisabled(env)) return null
  try {
    const cached = await caches.default.match(new Request(cacheKeyUrl, { method: 'GET' }))
    if (!cached) return null
    return await cached.json()
  } catch (_) {
    return null
  }
}

const cacheWrite = (cacheKeyUrl, data, ttlSeconds, ctx, env) => {
  if (!cacheKeyUrl || !ctx || isCacheDisabled(env)) return
  const res = new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'cache-control': `public, s-maxage=${ttlSeconds}`
    }
  })
  ctx.waitUntil(caches.default.put(new Request(cacheKeyUrl, { method: 'GET' }), res))
}

const DEFAULT_HARD_TTL = 86400

/**
 * Stale-while-revalidate over the edge cache: entries live for HARD_TTL but
 * are only considered fresh for their soft TTL. Stale entries are served
 * immediately (no origin round trip on the request path) while refreshFn runs
 * in the background via ctx.waitUntil. NOT used for the first_load entries —
 * their cache keys/format are shared with the external websites-router worker.
 */
const swrRead = async (cacheKeyUrl, env, softTtlSeconds) => {
  const cached = await cacheRead(cacheKeyUrl, env)
  if (!cached) return null
  if (cached.__swr) {
    return { data: cached.data, isStale: (Date.now() - cached.storedAt) / 1000 > softTtlSeconds }
  }
  return { data: cached, isStale: false } // pre-SWR entry: expires via its own s-maxage
}

const swrWrite = (cacheKeyUrl, data, env, ctx) =>
  cacheWrite(cacheKeyUrl, { __swr: true, storedAt: Date.now(), data }, resolvePositiveInt(env.HARD_TTL, DEFAULT_HARD_TTL), ctx, env)

const readJsonWithLimit = async (response, maxBytes) => {
  const contentLength = parseInt(response.headers.get('content-length') || '0', 10)
  if (contentLength > maxBytes) return null

  const text = await response.text()
  if (text.length > maxBytes) return null

  try {
    return JSON.parse(text)
  } catch (_) {
    return null
  }
}

const buildOrderingApiHeaders = (config, origin, requestUrl) => {
  const headers = { accept: 'application/json' }
  if (config?.app_id) headers['x-app-x'] = config.app_id
  if (origin) headers.origin = origin
  if (requestUrl) headers.referer = requestUrl
  return headers
}

export const validateProjectViaCurrent = async (baseConfig, project, env, ctx, origin, requestUrl) => {
  if (!baseConfig?.api?.url || !project) return project ?? null

  const cacheKeyUrl = `${buildCurrentCacheKey(project)}&origin=${encodeURIComponent(origin || '')}`

  const fetchAndCache = async () => {
    const base = baseConfig.api.url.replace(/\/$/, '')
    const version = baseConfig.api.version ?? 'v400'
    const language = baseConfig.api.language ?? 'en'
    const url = `${base}/${version}/${language}/${project}/current`

    try {
      const headers = buildOrderingApiHeaders(baseConfig, origin, requestUrl)

      const response = await fetch(url, {
        signal: AbortSignal.timeout(resolvePositiveInt(env.FIRST_LOAD_TIMEOUT_MS, DEFAULT_FIRST_LOAD_TIMEOUT_MS)),
        headers
      })
      if (!response.ok) {
        console.warn('validateProjectViaCurrent failed', { status: response.status, project, origin })
        return null
      }
      const json = await readJsonWithLimit(response, resolvePositiveInt(env.MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_BYTES))
      if (!json || json.error || !json.result?.code) {
        console.warn('validateProjectViaCurrent returned invalid payload', { project, origin, hasJson: !!json, error: json?.error })
        return null
      }

      swrWrite(cacheKeyUrl, { code: json.result.code }, env, ctx)
      return json.result.code
    } catch (error) {
      console.warn('validateProjectViaCurrent threw', { project, origin, message: error?.message })
      return null
    }
  }

  const cached = await swrRead(cacheKeyUrl, env, resolvePositiveInt(env.FIRST_LOAD_TTL, DEFAULT_FIRST_LOAD_TTL))
  if (cached?.data?.code) {
    if (cached.isStale) ctx?.waitUntil?.(fetchAndCache())
    return cached.data.code
  }

  return (await fetchAndCache()) ?? baseConfig.project ?? project
}

const buildApiBase = (config) => {
  const base = config?.api?.url?.replace(/\/$/, '') ?? ''
  const version = config?.api?.version ?? 'v400'
  const language = config?.api?.language ?? 'en'
  const project = config?.project ?? ''
  return `${base}/${version}/${language}/${project}`
}

export const fetchSeo = async (config, seoPath, env, ctx, hostname) => {
  if (!config || !seoPath) return null

  const url = `${buildApiBase(config)}${seoPath}?type=advanced`
  const cacheKeyUrl = buildSeoCacheKey(hostname, seoPath)

  const fetchAndCache = async () => {
    try {
      const headers = { accept: 'application/json' }
      if (config.app_id) headers['x-app-x'] = config.app_id

      const response = await fetch(url, {
        signal: AbortSignal.timeout(resolvePositiveInt(env.SEO_TIMEOUT_MS, DEFAULT_SEO_TIMEOUT_MS)),
        headers
      })
      if (!response.ok) return null
      const json = await readJsonWithLimit(response, resolvePositiveInt(env.MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_BYTES))
      if (!json || json.error || !json.result) return null

      swrWrite(cacheKeyUrl, json.result, env, ctx)
      return json.result
    } catch (_) {
      return null
    }
  }

  const cached = await swrRead(cacheKeyUrl, env, resolvePositiveInt(env.SEO_TTL, DEFAULT_SEO_TTL))
  if (cached?.data) {
    if (cached.isStale) ctx?.waitUntil?.(fetchAndCache())
    return cached.data
  }

  return fetchAndCache()
}

export const fetchSitemap = async (config, env, ctx) => {
  if (!config?.api?.url || !config?.project) return null

  const ttl = resolvePositiveInt(env.SITEMAP_TTL, DEFAULT_SITEMAP_TTL)
  const cacheKeyUrl = buildSitemapCacheKey(config.project)

  if (!isCacheDisabled(env)) {
    try {
      const cached = await caches.default.match(new Request(cacheKeyUrl, { method: 'GET' }))
      if (cached) return { xml: await cached.text(), ttl }
    } catch (_) {}
  }

  const url = `${buildApiBase(config)}/xml/sitemap`

  try {
    const headers = { accept: 'application/xml' }
    if (config.app_id) headers['x-app-x'] = config.app_id

    const response = await fetch(url, {
      signal: AbortSignal.timeout(resolvePositiveInt(env.SITEMAP_TIMEOUT_MS, DEFAULT_SITEMAP_TIMEOUT_MS)),
      headers
    })
    if (!response.ok) return null

    const xml = await response.text()
    if (!xml || (!xml.includes('<urlset') && !xml.includes('<sitemapindex'))) return null

    if (ctx && !isCacheDisabled(env)) {
      const cacheRes = new Response(xml, {
        headers: {
          'content-type': 'text/xml; charset=UTF-8',
          'cache-control': `public, s-maxage=${ttl}`
        }
      })
      ctx.waitUntil(caches.default.put(new Request(cacheKeyUrl, { method: 'GET' }), cacheRes))
    }

    return { xml, ttl }
  } catch (_) {
    return null
  }
}

export const fetchFirstLoad = async (config, env, ctx, origin, requestUrl, routerCacheKey) => {
  if (!config) return null

  const cacheKeyUrl = routerCacheKey || buildFirstLoadCacheKey(origin)

  const cached = await cacheRead(cacheKeyUrl, env)
  if (cached) {
    if (cached.result) return cached.result
    return cached
  }

  const base = config?.api?.url?.replace(/\/$/, '') ?? ''
  const version = config?.api?.version ?? 'v400'
  const language = config?.api?.language ?? 'en'
  const params = encodeURIComponent(FIRST_LOAD_PARAMS)
  const urls = [`${base}/${version}/${language}/${config.project}/frontends/first_load?params=${params}`]

  const headers = buildOrderingApiHeaders(config, origin, requestUrl)

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(resolvePositiveInt(env.FIRST_LOAD_TIMEOUT_MS, DEFAULT_FIRST_LOAD_TIMEOUT_MS)),
        headers
      })
      if (!response.ok) {
        console.warn('fetchFirstLoad failed', { status: response.status, url, origin, project: config.project })
        continue
      }
      const json = await readJsonWithLimit(response, resolvePositiveInt(env.MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_BYTES))
      if (!json || json.error || !json.result) {
        console.warn('fetchFirstLoad returned invalid payload', { url, origin, project: config.project, hasJson: !!json, error: json?.error })
        continue
      }

      cacheWrite(cacheKeyUrl, json, resolvePositiveInt(env.FIRST_LOAD_TTL, DEFAULT_FIRST_LOAD_TTL), ctx, env)
      return json.result
    } catch (error) {
      console.warn('fetchFirstLoad threw', { url, origin, project: config.project, message: error?.message })
    }
  }

  return null
}

const buildBootI18nCacheKey = (project, language, kind) =>
  `${SEO_CACHE_KEY_BASE}/boot-i18n?project=${encodeURIComponent(project || '')}&lang=${encodeURIComponent(language || '')}&kind=${kind}`

/**
 * Pre-fetches the i18n payloads the SPA requests on boot (/translations and the
 * default /languages lookup) so they can be injected as window.__EDGE_XHR__ and
 * served instantly by the client-side XHR shim (src/shims/network-boot.js)
 * instead of blocking the first render. The queries mirror the SDK requests in
 * LanguageContext (refreshTranslations / loadDefaultLanguage). Fail-open: any
 * error drops the entry and the client falls back to the network.
 */
export const fetchBootI18n = async (config, env, ctx, origin, requestUrl) => {
  if (!config?.api?.url || !config?.project) return null

  const language = config.api?.language ?? 'en'
  const apiBase = buildApiBase(config)
  const headers = buildOrderingApiHeaders(config, origin, requestUrl)
  const ttl = resolvePositiveInt(env.FIRST_LOAD_TTL, DEFAULT_FIRST_LOAD_TTL)
  const timeout = resolvePositiveInt(env.FIRST_LOAD_TIMEOUT_MS, DEFAULT_FIRST_LOAD_TIMEOUT_MS)
  const maxBytes = resolvePositiveInt(env.MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_BYTES)

  const appInternalName = config.app_internal_name || null
  const translationsQuery = appInternalName
    ? `version=v2&where=${encodeURIComponent(JSON.stringify([{ attribute: 'product', value: appInternalName }]))}&mode=dictionary`
    : 'mode=dictionary'
  const targets = [
    { kind: 'translations', url: `${apiBase}/translations?${translationsQuery}` },
    { kind: 'languages_default', url: `${apiBase}/languages?where=${encodeURIComponent(JSON.stringify([{ attribute: 'default', value: true }]))}` }
  ]

  const results = await Promise.all(targets.map(async ({ kind, url }) => {
    const cacheKeyUrl = buildBootI18nCacheKey(config.project, language, kind)

    const fetchAndCache = async () => {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(timeout), headers })
        if (!response.ok) return null
        const json = await readJsonWithLimit(response, maxBytes)
        if (!json || json.error) return null
        swrWrite(cacheKeyUrl, json, env, ctx)
        return json
      } catch (_) {
        return null
      }
    }

    const cached = await swrRead(cacheKeyUrl, env, ttl)
    if (cached?.data) {
      if (cached.isStale) ctx?.waitUntil?.(fetchAndCache())
      return [kind, cached.data]
    }
    return [kind, await fetchAndCache()]
  }))

  const payload = Object.fromEntries(results.filter(([, value]) => value))
  if (!Object.keys(payload).length) return null
  return { language, project: config.project, ...payload }
}

export const getTitle = (seoData) => {
  const innerHtml = seoData?.title?.innerHtml
  if (typeof innerHtml === 'string' && innerHtml.length > 0) return innerHtml

  const metas = seoData?.metas
  if (!Array.isArray(metas)) return null
  const entry = metas.find(m => m?.name === 'title' && typeof m?.content === 'string')
  return entry?.content ?? null
}

/**
 * Builds OG/meta fallbacks from first_load.site when the SEO API omits fields.
 * Defaults mirror index.html shell values.
 * site.image is the home hero — not used for social previews.
 * logo is what marketplace owners upload in Ordering Website settings.
 */
export const buildSiteSeoFallback = (site, requestUrl) => {
  const title = pickNonEmptyString(site?.name) || DEFAULT_SEO_TITLE
  const description = pickNonEmptyString(site?.description) || DEFAULT_SEO_DESCRIPTION
  const image = pickNonEmptyString(site?.social_share) ||
    pickNonEmptyString(site?.logo) ||
    pickNonEmptyString(site?.header) ||
    null

  const metas = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' }
  ]

  if (requestUrl) {
    metas.push({ property: 'og:url', content: requestUrl })
  }

  if (image) {
    metas.push({ property: 'og:image', content: image })
    metas.push({ name: 'twitter:image', content: image })
  }

  return { title, metas }
}

const metaKey = (meta) => {
  if (!meta) return null
  if (meta.property) return `p:${meta.property}`
  if (meta.name) return `n:${meta.name}`
  return null
}

/**
 * Merges SEO API metas with site fallbacks. On /seo/general, site fields win;
 * on page-specific routes, SEO API wins and site fills gaps.
 */
export const mergeSeoData = (seoData, siteFallback, { preferSite = false, site = null } = {}) => {
  const seoMetas = Array.isArray(seoData?.metas)
    ? seoData.metas.filter(m => m?.name !== 'title')
    : []
  const fallbackMetas = siteFallback?.metas || []
  const mergedMap = new Map()

  const addMeta = (meta) => {
    if (!meta || meta.content === null || meta.content === undefined) return
    const key = metaKey(meta)
    if (!key || mergedMap.has(key)) return
    mergedMap.set(key, meta)
  }

  if (preferSite) {
    for (const meta of fallbackMetas) addMeta(meta)
    for (const meta of seoMetas) addMeta(meta)
  } else {
    for (const meta of seoMetas) addMeta(meta)
    for (const meta of fallbackMetas) addMeta(meta)
  }

  const seoTitle = getTitle(seoData)
  const siteName = pickNonEmptyString(site?.name)
  const title = preferSite
    ? (siteName || seoTitle || siteFallback?.title || DEFAULT_SEO_TITLE)
    : (seoTitle || siteName || siteFallback?.title || DEFAULT_SEO_TITLE)

  return {
    title,
    metas: [...mergedMap.values()],
    links: seoData?.links || []
  }
}

export const escapeJsonForScript = (value) => {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
