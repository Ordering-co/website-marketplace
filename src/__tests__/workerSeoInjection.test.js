import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import { DEFAULT_SEO_DESCRIPTION } from '../utils/seoDescription'

// Partial mock: real seo helpers (mapSeoEndpoint, buildSiteSeoFallback,
// mergeSeoData, getTitle, escapeJsonForScript...) run for real; only the
// network-facing fetchers are stubbed.
const workerMockState = vi.hoisted(() => ({
  firstLoad: null,
  seoData: null,
  bootI18n: null
}))

vi.mock('../../worker/seo.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    fetchFirstLoad: vi.fn(async () => workerMockState.firstLoad),
    fetchSeo: vi.fn(async () => workerMockState.seoData),
    fetchBootI18n: vi.fn(async () => workerMockState.bootI18n),
    fetchSitemap: vi.fn(async () => null)
  }
})

const SHELL_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="theme-color" content="#000000" />
    <meta name="author" content="Shell template" />
    <meta name="description" content="Food marketplace by ordering.inc" />
    <meta property="og:title" content="Shell OG title" />
    <meta property="og:description" content="Food marketplace by ordering.inc" />
    <title>Ordering</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`

// Minimal HTMLRewriter stand-in: records .on() registrations and replays them
// over a jsdom parse of the asset HTML the fake ASSETS binding served last.
class FakeHTMLRewriter {
  constructor () {
    this.handlers = []
  }

  on (selector, handler) {
    this.handlers.push({ selector, handler })
    return this
  }

  transform (response) {
    const doc = new JSDOM(globalThis.__testAssetHtml || '').window.document
    const facade = (el) => ({
      remove: () => el.remove(),
      setInnerContent: (content) => { el.textContent = content },
      append: (content) => el.insertAdjacentHTML('beforeend', content)
    })
    for (const { selector, handler } of this.handlers) {
      doc.querySelectorAll(selector).forEach(el => handler.element?.(facade(el)))
    }
    return {
      body: `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    }
  }
}

const buildEnv = (html) => ({
  PROJECT: 'synthetic-project',
  ASSETS: {
    fetch: async (request) => {
      const url = new URL(request.url)
      if (url.pathname === '/config.json') {
        return new Response(JSON.stringify({
          project: 'synthetic-project',
          app_id: 'synthetic-app',
          api: { url: 'https://api.synthetic-fixture.invalid' }
        }), { headers: { 'content-type': 'application/json' } })
      }
      globalThis.__testAssetHtml = html
      return new Response(html, { headers: { 'content-type': 'text/html; charset=UTF-8' } })
    }
  }
})

const firstLoadFixture = (site = {}, themeValues = {}) => ({
  site: { name: 'Synthetic Tenant', code: 'synthetic-app', ...site },
  configs: {},
  theme: {
    my_products: {
      components: {
        website_settings: { components: { values: { name: 'Synthetic Tenant', ...themeValues } } }
      }
    }
  }
})

const extractSeoPayload = (html) => {
  const match = html.match(/window\.__SEO__ = (\{[^<]*?\});/)
  return match ? JSON.parse(match[1]) : null
}

const callWorker = async (pathname = '/') => {
  // Fresh module graph each call so the module-level cachedBaseConfig in
  // worker/index.js is reset between tests.
  vi.resetModules()
  const { default: worker } = await import('../../worker/index.js')
  const request = new Request(`http://localhost${pathname}`, {
    headers: { accept: 'text/html' }
  })
  const response = await worker.fetch(request, buildEnv(SHELL_HTML), { waitUntil: vi.fn() })
  return response.text()
}

describe('worker SEO injection', () => {
  beforeEach(() => {
    vi.stubGlobal('HTMLRewriter', FakeHTMLRewriter)
    workerMockState.firstLoad = null
    workerMockState.seoData = null
    workerMockState.bootI18n = null
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete globalThis.__testAssetHtml
  })

  it('injects theme description, OG and __SEO__ on the homepage when only the theme is configured', async () => {
    workerMockState.firstLoad = firstLoadFixture({}, { description: 'Theme configured description' })
    workerMockState.seoData = null

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    const desc = doc.querySelector('meta[name="description"]')
    expect(desc?.getAttribute('content')).toBe('Theme configured description')
    expect(desc?.getAttribute('data-react-helmet')).toBe('true')
    const og = doc.querySelector('meta[property="og:description"]')
    expect(og?.getAttribute('content')).toBe('Theme configured description')
    expect(og?.getAttribute('data-react-helmet')).toBe('true')
    expect(doc.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(doc.querySelectorAll('meta[property="og:description"]')).toHaveLength(1)
    expect(doc.querySelector('title')?.textContent).toBe('Synthetic Tenant')

    expect(extractSeoPayload(html)).toEqual({
      title: null,
      description: 'Theme configured description',
      ogDescription: 'Theme configured description',
      pathname: '/'
    })
  })

  it('marks only the two description tags as Helmet-managed', async () => {
    workerMockState.firstLoad = firstLoadFixture({}, { description: 'Theme configured description' })
    workerMockState.seoData = null

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    const managed = [...doc.querySelectorAll('meta[data-react-helmet="true"]')]
    expect(managed.length).toBe(2)
    const keys = managed.map(m => m.getAttribute('name') || m.getAttribute('property'))
    expect(keys.sort()).toEqual(['description', 'og:description'])
  })

  it('preserves configured SEO API descriptions on page routes when the site has none', async () => {
    workerMockState.firstLoad = firstLoadFixture()
    workerMockState.seoData = {
      title: { innerHtml: 'Store SEO title' },
      metas: [
        { name: 'description', content: 'API page description' },
        { property: 'og:description', content: 'API page OG description' }
      ]
    }

    const html = await callWorker('/store/synthetic-store')
    const doc = new JSDOM(html).window.document

    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('API page description')
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('API page OG description')
    expect(doc.querySelector('title')?.textContent).toBe('Store SEO title')

    expect(extractSeoPayload(html)).toEqual({
      title: 'Store SEO title',
      description: 'API page description',
      ogDescription: 'API page OG description',
      pathname: '/store/synthetic-store'
    })
  })

  it('keeps valid API descriptions on the general route when site and theme descriptions are blank', async () => {
    workerMockState.firstLoad = firstLoadFixture(
      { description: '   ' },
      { description: ' ' }
    )
    workerMockState.seoData = {
      metas: [
        { name: 'description', content: 'API general description' },
        { property: 'og:description', content: 'API general OG description' }
      ]
    }

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('API general description')
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('API general OG description')
  })

  it('emits exactly one of each default description and __SEO__ when nothing is configured', async () => {
    workerMockState.firstLoad = firstLoadFixture()
    workerMockState.seoData = null

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    const desc = doc.querySelector('meta[name="description"]')
    expect(desc?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(desc?.getAttribute('data-react-helmet')).toBe('true')
    const og = doc.querySelector('meta[property="og:description"]')
    expect(og?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(og?.getAttribute('data-react-helmet')).toBe('true')
    expect(doc.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(doc.querySelectorAll('meta[property="og:description"]')).toHaveLength(1)

    expect(extractSeoPayload(html)).toEqual({
      title: null,
      description: DEFAULT_SEO_DESCRIPTION,
      ogDescription: DEFAULT_SEO_DESCRIPTION,
      pathname: '/'
    })
  })

  it('escapes quotes and angle brackets in attributes and the __SEO__ script', async () => {
    workerMockState.firstLoad = firstLoadFixture(
      { description: 'A "quoted" <special> description' }
    )
    workerMockState.seoData = null

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content'))
      .toBe('A "quoted" <special> description')
    // Serialized HTML keeps < and > literal inside quoted attributes (valid
    // HTML5) but they must round-trip as attribute text, never as markup.
    expect(doc.getElementsByTagName('special')).toHaveLength(0)
    expect(html).toContain('&quot;quoted&quot;')
    expect(html).toContain('A \\"quoted\\" \\u003cspecial> description')

    expect(extractSeoPayload(html)?.description).toBe('A "quoted" <special> description')
  })

  it('canonicalizes alias OG and drops legacy twitter on the general route', async () => {
    workerMockState.firstLoad = firstLoadFixture()
    workerMockState.seoData = {
      metas: [
        { name: 'description', content: 'Food marketplace by ordering.inc' },
        { name: 'og:description', content: '   ' },
        { property: 'og:description', content: 'Valid API OG' },
        { name: 'twitter:description', content: 'a dummy description about this page' }
      ]
    }

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document
    const allMetas = [...doc.querySelectorAll('meta')]

    const ogTags = allMetas.filter(m =>
      m.getAttribute('property') === 'og:description' || m.getAttribute('name') === 'og:description'
    )
    expect(ogTags).toHaveLength(1)
    expect(ogTags[0].getAttribute('property')).toBe('og:description')
    expect(ogTags[0].getAttribute('name')).toBeNull()
    expect(ogTags[0].getAttribute('content')).toBe('Valid API OG')
    expect(ogTags[0].getAttribute('data-react-helmet')).toBe('true')

    // Missing normal description inherits the valid custom OG via the fill rule.
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Valid API OG')
    expect(allMetas.some(m =>
      m.getAttribute('name') === 'twitter:description' || m.getAttribute('property') === 'twitter:description'
    )).toBe(false)
    for (const meta of allMetas) {
      expect(meta.getAttribute('content') || '').not.toContain('ordering.inc')
      expect(meta.getAttribute('content') || '').not.toContain('dummy description')
    }
  })

  it('emits canonical OG and twitter shapes with __SEO__ on a page route', async () => {
    workerMockState.firstLoad = firstLoadFixture()
    workerMockState.seoData = {
      title: { innerHtml: 'Store title' },
      metas: [
        { name: 'description', content: 'Store page description' },
        { name: 'og:description', content: 'Custom OG copy' },
        { property: 'twitter:description', content: 'Tweet copy' }
      ]
    }

    const html = await callWorker('/store/synthetic-store')
    const doc = new JSDOM(html).window.document
    const allMetas = [...doc.querySelectorAll('meta')]

    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Store page description')
    const og = doc.querySelector('meta[property="og:description"]')
    expect(og?.getAttribute('content')).toBe('Custom OG copy')
    expect(og?.getAttribute('data-react-helmet')).toBe('true')
    expect(allMetas.filter(m => m.getAttribute('name') === 'og:description')).toHaveLength(0)

    const tw = doc.querySelector('meta[name="twitter:description"]')
    expect(tw?.getAttribute('content')).toBe('Tweet copy')
    expect(allMetas.filter(m => m.getAttribute('property') === 'twitter:description')).toHaveLength(0)

    expect(extractSeoPayload(html)?.ogDescription).toBe('Custom OG copy')
    expect(extractSeoPayload(html)?.description).toBe('Store page description')
  })

  it('emits only the shared defaults when every description source is a template or blank', async () => {
    workerMockState.firstLoad = firstLoadFixture()
    workerMockState.seoData = {
      metas: [
        { name: 'description', content: 'Food Marketplace by Ordering.co.' },
        { property: 'og:description', content: 'food marketplace by orderingplus' },
        { name: 'twitter:description', content: '  ' }
      ]
    }

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document
    const allMetas = [...doc.querySelectorAll('meta')]

    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(doc.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(doc.querySelectorAll('meta[property="og:description"]')).toHaveLength(1)
    expect(allMetas.some(m =>
      m.getAttribute('name') === 'twitter:description' || m.getAttribute('property') === 'twitter:description'
    )).toBe(false)
    for (const meta of allMetas) {
      const content = meta.getAttribute('content') || ''
      expect(content).not.toContain('ordering.inc')
      expect(content).not.toContain('orderingplus')
      expect(content).not.toContain('dummy description')
    }
  })

  it('removes shell template metas without duplicating worker metadata', async () => {
    workerMockState.firstLoad = firstLoadFixture({}, { description: 'Theme configured description' })
    workerMockState.seoData = null

    const html = await callWorker('/')
    const doc = new JSDOM(html).window.document

    expect(doc.querySelector('meta[name="author"]')).toBeNull()
    const ogTitles = doc.querySelectorAll('meta[property="og:title"]')
    expect(ogTitles).toHaveLength(1)
    expect(ogTitles[0].getAttribute('content')).toBe('Synthetic Tenant')
    expect(ogTitles[0].getAttribute('data-react-helmet')).toBeNull()
  })
})
