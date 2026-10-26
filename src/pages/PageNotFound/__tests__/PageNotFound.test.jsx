import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { HelmetTags } from '../../../components/HelmetTags'
import { DEFAULT_SEO_DESCRIPTION } from '../../../utils/seoDescription'
import { PageNotFound } from '../index'

vi.mock('~ui/src/components/PageNotFound', () => ({
  PageNotFound: () => <div data-testid='page-not-found-ui' />
}))

const mockSeo = vi.hoisted(() => ({ site: {} }))
vi.mock('~components/contexts/ConfigContext', () => ({ useConfig: () => [{}] }))
vi.mock('~components/contexts/SiteContext', () => ({ useSite: () => [{ site: mockSeo.site }, {}] }))
vi.mock('../../../contexts/CookieConsentContext', () => ({ useCookieConsent: () => ({ hasConsented: false }) }))

const theme = {
  colors: { backgroundPage: '#fff', colorPage: '#000', darkTextColor: '#000' },
  fonts: { primary: { name: 'Helvetica' } },
  my_products: {
    components: {
      website_settings: {
        components: {
          values: { name: 'Test Marketplace' }
        }
      }
    }
  },
  third_party_code: {}
}

const seedManagedDescriptions = () => {
  document.head.insertAdjacentHTML(
    'beforeend',
    '<meta name="description" content="Worker normal" data-react-helmet="true">' +
    '<meta property="og:description" content="Worker OG" data-react-helmet="true">'
  )
}
const descMetas = () => document.querySelectorAll('meta[name="description"]')
const ogMetas = () => document.querySelectorAll('meta[property="og:description"]')
const robotsMetas = () => document.querySelectorAll('meta[name="robots"]')

afterEach(() => {
  cleanup()
  delete window.__SEO__
  mockSeo.site = {}
  window.history.replaceState({}, '', '/')
  document.head.innerHTML = ''
})

describe('PageNotFound page', () => {
  it('renders page not found controller', () => {
    const { getByTestId } = renderWithProviders(<PageNotFound />)
    expect(getByTestId('page-not-found-ui')).toBeInTheDocument()
  })
})

describe('PageNotFound route metadata ownership', () => {
  it.each(['together', 'root-mounted-late'])(
    'keeps worker descriptions and noindex on 404 regardless of root mount order (%s)',
    async (order) => {
      window.history.replaceState({}, '', '/route-that-does-not-exist')
      window.__SEO__ = {
        title: null,
        description: 'Worker normal',
        ogDescription: 'Worker OG',
        pathname: '/route-that-does-not-exist'
      }
      seedManagedDescriptions()

      const Screen = ({ showRoot }) => (
        <>
          {showRoot && <HelmetTags key='root' />}
          <PageNotFound key='page' />
        </>
      )
      const { rerender } = renderWithProviders(
        <Screen showRoot={order === 'together'} />,
        { theme }
      )
      await waitFor(() => {
        expect(descMetas()).toHaveLength(1)
      })

      if (order === 'root-mounted-late') {
        rerender(<Screen showRoot />)
      }
      // The root emits the canonical link and the page never does, so its
      // arrival signals the aggregate Helmet commit in either mount order.
      await waitFor(() => {
        expect(document.querySelector('link[rel="canonical"]')).toBeTruthy()
      })

      expect(descMetas()).toHaveLength(1)
      expect(descMetas()[0].getAttribute('content')).toBe('Worker normal')
      expect(ogMetas()).toHaveLength(1)
      expect(ogMetas()[0].getAttribute('content')).toBe('Worker OG')
      expect(robotsMetas()).toHaveLength(1)
      expect(robotsMetas()[0].getAttribute('content')).toBe('noindex, nofollow')
    }
  )

  it('uses the configured site description and falls back to the shared default', async () => {
    window.history.replaceState({}, '', '/route-that-does-not-exist')
    mockSeo.site = { description: 'Site configured description' }
    const { rerender } = renderWithProviders(
      <>
        <HelmetTags />
        <PageNotFound />
      </>,
      { theme }
    )
    await waitFor(() => {
      expect(descMetas()[0]?.getAttribute('content')).toBe('Site configured description')
    })
    expect(ogMetas()[0].getAttribute('content')).toBe('Site configured description')

    mockSeo.site = {}
    rerender(
      <>
        <HelmetTags />
        <PageNotFound />
      </>
    )
    await waitFor(() => {
      expect(descMetas()[0]?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(descMetas()).toHaveLength(1)
    expect(ogMetas()).toHaveLength(1)
    expect(ogMetas()[0].getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })

  it('ignores stale injected metadata after navigation to a missing route', async () => {
    mockSeo.site = { description: 'Site configured description' }
    window.history.replaceState({}, '', '/route-that-does-not-exist')
    window.__SEO__ = {
      title: null,
      description: 'Old home description',
      ogDescription: 'Old home OG',
      pathname: '/'
    }
    renderWithProviders(
      <>
        <HelmetTags />
        <PageNotFound />
      </>,
      { theme }
    )
    await waitFor(() => {
      expect(descMetas()[0]?.getAttribute('content')).toBe('Site configured description')
    })
    expect(ogMetas()[0].getAttribute('content')).toBe('Site configured description')
    expect(descMetas()).toHaveLength(1)
    expect(ogMetas()).toHaveLength(1)
  })

  it('renders the 404 title/noindex then home navigation restores index without dupes', async () => {
    window.history.replaceState({}, '', '/route-that-does-not-exist')
    const { rerender } = renderWithProviders(
      <>
        <HelmetTags />
        <PageNotFound />
      </>,
      { theme }
    )
    await waitFor(() => {
      expect(document.title).toContain('Page not found')
    })
    expect(robotsMetas()).toHaveLength(1)
    expect(robotsMetas()[0].getAttribute('content')).toBe('noindex, nofollow')

    window.history.replaceState({}, '', '/')
    rerender(
      <>
        <HelmetTags />
        <HelmetTags page='home' />
      </>
    )
    await waitFor(() => {
      expect(robotsMetas()[0]?.getAttribute('content')).toBe('index, follow')
    })
    expect(robotsMetas()).toHaveLength(1)
    expect(descMetas()).toHaveLength(1)
    expect(ogMetas()).toHaveLength(1)
  })
})
