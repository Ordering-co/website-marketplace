import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { HelmetTags } from '../../../components/HelmetTags'
import { DEFAULT_SEO_DESCRIPTION } from '../../../utils/seoDescription'
import { PagesList } from '../index'

vi.mock('~ui/src/components/PagesList', () => ({
  PagesList: ({ routes }) => (
    <div data-testid='pages-list-ui' data-route-count={routes.length} />
  )
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

afterEach(() => {
  cleanup()
  delete window.__SEO__
  mockSeo.site = {}
  window.history.replaceState({}, '', '/')
  document.head.innerHTML = ''
})

describe('PagesList page', () => {
  it('passes default routes to pages list controller', () => {
    const { getByTestId } = renderWithProviders(<PagesList />)
    expect(getByTestId('pages-list-ui')).toHaveAttribute('data-route-count', '10')
  })
})

describe('PagesList route metadata ownership', () => {
  it.each(['together', 'root-mounted-late'])(
    'keeps worker descriptions on /pages regardless of root mount order (%s)',
    async (order) => {
      window.history.replaceState({}, '', '/pages')
      window.__SEO__ = {
        title: null,
        description: 'Worker normal',
        ogDescription: 'Worker OG',
        pathname: '/pages'
      }
      seedManagedDescriptions()

      const Screen = ({ showRoot }) => (
        <>
          {showRoot && <HelmetTags key='root' />}
          <PagesList key='page' />
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
    }
  )

  it('uses the configured site description and falls back to the shared default', async () => {
    window.history.replaceState({}, '', '/pages')
    mockSeo.site = { description: 'Site configured description' }
    const { rerender } = renderWithProviders(
      <>
        <HelmetTags />
        <PagesList />
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
        <PagesList />
      </>
    )
    await waitFor(() => {
      expect(descMetas()[0]?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(descMetas()).toHaveLength(1)
    expect(ogMetas()).toHaveLength(1)
    expect(ogMetas()[0].getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })

  it('ignores stale injected metadata after navigation to /pages', async () => {
    mockSeo.site = { description: 'Site configured description' }
    window.history.replaceState({}, '', '/pages')
    window.__SEO__ = {
      title: null,
      description: 'Old home description',
      ogDescription: 'Old home OG',
      pathname: '/'
    }
    renderWithProviders(
      <>
        <HelmetTags />
        <PagesList />
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
})
