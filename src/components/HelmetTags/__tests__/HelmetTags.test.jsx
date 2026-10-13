import { afterEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HelmetTags } from '../index'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      powered_by_ordering_module: { value: true }
    }
  }]
}))
vi.mock('../../../contexts/CookieConsentContext', () => ({
  useCookieConsent: () => ({ hasConsented: true })
}))

describe('HelmetTags', () => {
  const theme = {
    colors: { backgroundPage: '#fff', colorPage: '#000', darkTextColor: '#000' },
    fonts: { primary: { name: 'Helvetica' } },
    my_products: {
      components: {
        website_settings: {
          components: {
            values: {
              name: 'Test Marketplace',
              description: 'Test description'
            }
          }
        }
      }
    },
    third_party_code: { head: '<script>window.__thirdParty = true</script>' }
  }

  afterEach(() => {
    delete window.__SEO__
    window.history.replaceState({}, '', '/')
  })

  it('renders page title and description when theme is ready', async () => {
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(document.title).toContain('Home')
    })
    expect(document.querySelector('meta[name="description"]')).toBeTruthy()
  })

  it('renders keywords from helmet data', async () => {
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(document.querySelector('meta[name="keywords"]')).toBeTruthy()
    })
    expect(document.querySelector('meta[name="keywords"]')?.getAttribute('content')).toContain('test')
  })

  it('honors robots and canonicalUrl props', async () => {
    renderWithProviders(
      <HelmetTags page='home' robots='noindex' canonicalUrl='https://example.com/home' />,
      { theme }
    )
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex')
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://example.com/home')
    })
  })

  it('preserves worker-injected page metadata during hydration', async () => {
    window.history.replaceState({}, '', '/pages/about-us')
    window.__SEO__ = {
      title: 'Test Marketplace - CMS page title',
      description: 'CMS page description',
      pathname: '/pages/about-us'
    }

    renderWithProviders(
      <HelmetTags page='pages' />,
      { theme }
    )

    await waitFor(() => {
      expect(document.title).toContain('CMS page title')
    })
    expect(document.title.match(/Test Marketplace/g)).toHaveLength(1)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('CMS page description')
  })

  it('ignores worker metadata after client-side navigation', async () => {
    window.history.replaceState({}, '', '/pages/another-page')
    window.__SEO__ = {
      title: 'Previous CMS title',
      description: 'Previous CMS description',
      pathname: '/pages/about-us'
    }

    renderWithProviders(
      <HelmetTags page='pages' />,
      { theme }
    )

    await waitFor(() => {
      expect(document.title).not.toContain('Previous CMS title')
    })
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content') || '').not.toContain('Previous CMS description')
  })

  it('prioritizes loaded page metadata over site defaults', async () => {
    renderWithProviders(
      <HelmetTags
        page='pages'
        helmetMetaTags={{
          title: 'Loaded CMS title',
          description: 'Loaded CMS description'
        }}
      />,
      { theme }
    )

    await waitFor(() => {
      expect(document.title).toContain('Loaded CMS title')
    })
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Loaded CMS description')
  })
})
