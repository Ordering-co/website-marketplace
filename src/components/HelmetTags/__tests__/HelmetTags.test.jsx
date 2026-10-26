import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HelmetTags } from '../index'
import helmetData from '../../../helmetdata.json'
import { DEFAULT_SEO_DESCRIPTION } from '../../../utils/seoDescription'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'

const mockSeo = vi.hoisted(() => ({
  site: {},
  poweredBy: true
}))

vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      powered_by_ordering_module: { value: mockSeo.poweredBy }
    }
  }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: mockSeo.site }, {}]
}))
vi.mock('../../../contexts/CookieConsentContext', () => ({
  useCookieConsent: () => ({ hasConsented: true })
}))

const descriptionMeta = () => document.querySelector('meta[name="description"]')
const ogDescriptionMeta = () => document.querySelector('meta[property="og:description"]')
const descriptionMetas = () => document.querySelectorAll('meta[name="description"]')
const ogDescriptionMetas = () => document.querySelectorAll('meta[property="og:description"]')

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

  const themeWithoutDescription = {
    ...theme,
    my_products: {
      components: {
        website_settings: {
          components: {
            values: { name: 'Test Marketplace' }
          }
        }
      }
    }
  }

  const themeWithoutSettings = {
    colors: theme.colors,
    fonts: theme.fonts,
    third_party_code: {}
  }

  afterEach(() => {
    delete window.__SEO__
    delete window.__CONFIG__
    mockSeo.site = {}
    mockSeo.poweredBy = true
    window.history.replaceState({}, '', '/')
    // react-helmet leaves the <title> element behind on unmount and commits
    // asynchronously; clearing head forces each test to observe a fresh commit.
    document.head.innerHTML = ''
  })

  it('renders page title and description when theme is ready', async () => {
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(document.title).toContain('Home')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')
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

  it('prefers the SiteContext site description over the theme description', async () => {
    mockSeo.site = { description: 'Site context description' }
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Site context description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Site context description')
  })

  it('renders exactly one of each default description when nothing valid is configured', async () => {
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme: themeWithoutDescription }
    )
    await waitFor(() => {
      expect(document.title).toContain('Home')
    })
    expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('emits no description tags for a root mount, keeping other metadata', async () => {
    renderWithProviders(
      <HelmetTags />,
      { theme: themeWithoutSettings }
    )
    await waitFor(() => {
      expect(document.querySelector('meta[name="keywords"]')).toBeTruthy()
    })
    expect(descriptionMetas()).toHaveLength(0)
    expect(ogDescriptionMetas()).toHaveLength(0)
  })

  it('does not let an injected system default override configured or page descriptions', async () => {
    window.__SEO__ = {
      title: null,
      description: DEFAULT_SEO_DESCRIPTION,
      ogDescription: DEFAULT_SEO_DESCRIPTION,
      pathname: '/'
    }
    const { rerender } = renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')

    rerender(<HelmetTags page='home' helmetMetaTags={{ description: 'Page prop description' }} />)

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Page prop description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Page prop description')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('falls back to the theme description when the site has none', async () => {
    mockSeo.site = {}
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')
  })

  it('falls through blank and legacy injected descriptions to the configured site value', async () => {
    mockSeo.site = { description: 'Real site description' }
    window.__SEO__ = {
      title: null,
      description: 'Food marketplace by ordering.inc',
      ogDescription: 'a dummy description about this page',
      pathname: '/'
    }
    renderWithProviders(
      <HelmetTags page='home' helmetMetaTags={{ description: '   ' }} />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Real site description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Real site description')
  })

  it('keeps the powered-by title suffix without appending it to descriptions', async () => {
    window.__CONFIG__ = { disable_powered_by: false }
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(document.title).toBe('Test Marketplace - Home - Powered by Orderingplus')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')
  })

  it('omits the powered-by title suffix when disabled by the runtime flag', async () => {
    window.__CONFIG__ = { disable_powered_by: true }
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(document.title.trim()).toBe('Test Marketplace - Home')
    })
  })

  it('matches HEAD title behavior when no runtime config is present', async () => {
    // Without window.__CONFIG__ the component never emitted the provider
    // suffix (the configs fallback was unreachable); assert no regression.
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme }
    )
    await waitFor(() => {
      expect(document.title.trim()).toBe('Test Marketplace - Home')
    })
  })

  it('renders worker-injected descriptions while the theme is not ready', async () => {
    window.__SEO__ = {
      title: null,
      description: 'Worker general description',
      ogDescription: 'Worker general OG description',
      pathname: '/'
    }
    renderWithProviders(
      <HelmetTags page='home' />,
      { theme: themeWithoutSettings }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Worker general description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Worker general OG description')
    expect(document.title).toBe('')
  })

  it('applies a props description to both description tags', async () => {
    renderWithProviders(
      <HelmetTags page='home' helmetMetaTags={{ description: 'Prop description' }} />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Prop description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Prop description')
  })

  it('adopts worker-managed description tags instead of duplicating them', async () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      '<meta name="description" content="Worker description" data-react-helmet="true">' +
      '<meta property="og:description" content="Worker OG description" data-react-helmet="true">'
    )

    const { rerender } = renderWithProviders(
      <HelmetTags page='home' helmetMetaTags={{ description: 'React description' }} />,
      { theme: themeWithoutDescription }
    )

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('React description')
    })
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('React description')

    rerender(<HelmetTags page='home' />)

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })

  it('swaps hydrated default tags for the configured description once the site loads', async () => {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<meta name="description" content="${DEFAULT_SEO_DESCRIPTION}" data-react-helmet="true">` +
      `<meta property="og:description" content="${DEFAULT_SEO_DESCRIPTION}" data-react-helmet="true">`
    )

    const { rerender } = renderWithProviders(
      <HelmetTags page='home' />,
      { theme: themeWithoutSettings }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(descriptionMetas()).toHaveLength(1)

    mockSeo.site = { description: 'Loaded site description' }
    rerender(<HelmetTags page='home' />)

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded site description')
    })
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Loaded site description')
  })

  it('restores the shared default when a custom description is removed', async () => {
    const { rerender } = renderWithProviders(
      <HelmetTags page='home' helmetMetaTags={{ description: 'Custom description' }} />,
      { theme: themeWithoutDescription }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Custom description')
    })

    rerender(<HelmetTags page='home' />)

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })

  it('preserves worker-injected page metadata during hydration', async () => {
    window.history.replaceState({}, '', '/pages/about-us')
    window.__SEO__ = {
      title: 'Test Marketplace - CMS page title',
      description: 'CMS page description',
      ogDescription: 'CMS page OG description',
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
    expect(descriptionMeta()?.getAttribute('content')).toBe('CMS page description')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('CMS page OG description')
  })

  it('ignores worker metadata after client-side navigation', async () => {
    window.history.replaceState({}, '', '/pages/another-page')
    window.__SEO__ = {
      title: 'Previous CMS title',
      description: 'Previous CMS description',
      ogDescription: 'Previous CMS OG description',
      pathname: '/pages/about-us'
    }

    renderWithProviders(
      <HelmetTags page='pages' />,
      { theme }
    )

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(document.title).not.toContain('Previous CMS title')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')
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
    expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded CMS description')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Loaded CMS description')
  })

  it.each([
    ['pages', '/pages/about-us'],
    ['business', '/store/synthetic-store']
  ])(
    'preserves a distinct injected OG description when %s meta loads without one',
    async (page, pathname) => {
      window.history.replaceState({}, '', pathname)
      window.__SEO__ = {
        title: null,
        description: 'Worker normal description',
        ogDescription: 'Worker distinct OG description',
        pathname
      }

      // onChangeMetaTag loads { title, description[, keywords] } - never an OG
      const { rerender } = renderWithProviders(
        <HelmetTags page={page} />,
        { theme }
      )
      await waitFor(() => {
        expect(descriptionMeta()?.getAttribute('content')).toBe('Worker normal description')
      })
      expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Worker distinct OG description')

      rerender(
        <HelmetTags page={page} helmetMetaTags={{ title: 'Loaded page title', description: 'Loaded normal description' }} />
      )
      await waitFor(() => {
        expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded normal description')
      })
      expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Worker distinct OG description')
      expect(descriptionMetas()).toHaveLength(1)
      expect(ogDescriptionMetas()).toHaveLength(1)

      rerender(
        <HelmetTags page={page} helmetMetaTags={{ title: 'Loaded page title', description: 'Second normal update' }} />
      )
      await waitFor(() => {
        expect(descriptionMeta()?.getAttribute('content')).toBe('Second normal update')
      })
      expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Worker distinct OG description')
      expect(descriptionMetas()).toHaveLength(1)
      expect(ogDescriptionMetas()).toHaveLength(1)
    }
  )

  it('lets an explicit page ogDescription prop win over the injected OG', async () => {
    window.__SEO__ = {
      title: null,
      description: 'Worker normal description',
      ogDescription: 'Worker distinct OG description',
      pathname: '/'
    }
    renderWithProviders(
      <HelmetTags
        page='home'
        helmetMetaTags={{ description: 'Loaded normal', ogDescription: 'Explicit page OG' }}
      />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded normal')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Explicit page OG')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it.each([undefined, '   ', 'Food marketplace by ordering.inc', DEFAULT_SEO_DESCRIPTION])(
    'keeps the injected OG when the explicit page ogDescription is %j',
    async (explicitOg) => {
      window.__SEO__ = {
        title: null,
        description: 'Worker normal description',
        ogDescription: 'Worker distinct OG description',
        pathname: '/'
      }
      renderWithProviders(
        <HelmetTags
          page='home'
          helmetMetaTags={{ description: 'Loaded normal', ogDescription: explicitOg }}
        />,
        { theme }
      )
      await waitFor(() => {
        expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded normal')
      })
      expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Worker distinct OG description')
    }
  )

  it.each([undefined, '   ', 'Food marketplace by ordering.inc', DEFAULT_SEO_DESCRIPTION])(
    'falls back to the effective normal description when the injected OG is %j',
    async (injectedOg) => {
      window.__SEO__ = {
        title: null,
        description: 'Worker normal description',
        ogDescription: injectedOg,
        pathname: '/'
      }
      renderWithProviders(
        <HelmetTags page='home' helmetMetaTags={{ description: 'Loaded normal' }} />,
        { theme }
      )
      await waitFor(() => {
        expect(descriptionMeta()?.getAttribute('content')).toBe('Loaded normal')
      })
      expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Loaded normal')
    }
  )

  it('drops a stale injected OG after client-side navigation', async () => {
    window.history.replaceState({}, '', '/pages/another-page')
    window.__SEO__ = {
      title: 'Previous title',
      description: 'Previous normal description',
      ogDescription: 'Previous distinct OG description',
      pathname: '/pages/about-us'
    }

    const { rerender } = renderWithProviders(
      <HelmetTags page='pages' />,
      { theme }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Test description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Test description')

    rerender(<HelmetTags page='pages' helmetMetaTags={{ description: 'Next normal description' }} />)

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Next normal description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Next normal description')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('lets a page-level HelmetTags override the mounted root defaults', async () => {
    mockSeo.site = { description: 'Root site description' }
    const { rerender } = renderWithProviders(
      <>
        <HelmetTags />
        <HelmetTags page='pages' helmetMetaTags={{ description: 'Page description' }} />
      </>,
      { theme }
    )

    await waitFor(() => {
      expect(descriptionMetas()).toHaveLength(1)
      expect(descriptionMeta()?.getAttribute('content')).toBe('Page description')
    })
    expect(ogDescriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Page description')

    rerender(
      <>
        <HelmetTags />
        <HelmetTags page='pages' helmetMetaTags={{ description: 'Updated page description' }} />
      </>
    )

    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Updated page description')
    })
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Updated page description')
  })

  it('keeps page descriptions when a root instance mounts late at an earlier JSX position', async () => {
    mockSeo.site = { description: 'Site fallback' }
    window.history.replaceState({}, '', '/store/probe')
    window.__SEO__ = {
      title: null,
      description: 'Previous home description',
      ogDescription: 'Previous home OG',
      pathname: '/'
    }
    const Screen = ({ showRoot }) => (
      <>
        {showRoot && <HelmetTags key='root' />}
        <HelmetTags key='page' page='business' helmetMetaTags={{ description: 'Business description' }} />
      </>
    )
    const { rerender } = renderWithProviders(<Screen showRoot={false} />, { theme })
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Business description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Business description')

    rerender(<Screen showRoot />)
    // Give the late-mounted root Helmet commit a chance to run, then the page
    // instance's descriptions must still be the only description tags.
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(descriptionMeta()?.getAttribute('content')).toBe('Business description')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Business description')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('page descriptions win when the page instance mounts after the root', async () => {
    mockSeo.site = { description: 'Site fallback' }
    const Screen = ({ showPage }) => (
      <>
        <HelmetTags key='root' />
        {showPage && (
          <HelmetTags
            key='page'
            page='business'
            helmetMetaTags={{ description: 'Business description', ogDescription: 'Business OG' }}
          />
        )}
      </>
    )
    const { rerender } = renderWithProviders(<Screen showPage={false} />, { theme })
    await waitFor(() => {
      expect(document.querySelector('meta[name="keywords"]')).toBeTruthy()
    })
    expect(descriptionMetas()).toHaveLength(0)
    expect(ogDescriptionMetas()).toHaveLength(0)

    rerender(<Screen showPage />)
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Business description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Business OG')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('root cannot displace explicit page descriptions backed by matching injected data', async () => {
    mockSeo.site = { description: 'Site fallback' }
    window.history.replaceState({}, '', '/store/probe')
    window.__SEO__ = {
      title: null,
      description: 'Worker normal description',
      ogDescription: 'Worker distinct OG description',
      pathname: '/store/probe'
    }
    const Screen = ({ showRoot }) => (
      <>
        {showRoot && <HelmetTags key='root' />}
        <HelmetTags
          key='page'
          page='business'
          helmetMetaTags={{ description: 'Business description', ogDescription: 'Business OG' }}
        />
      </>
    )
    const { rerender } = renderWithProviders(<Screen showRoot={false} />, { theme })
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Business description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Business OG')

    rerender(<Screen showRoot />)
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(descriptionMeta()?.getAttribute('content')).toBe('Business description')
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Business OG')
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('a root instance emits no description tags but still renders other metadata', async () => {
    renderWithProviders(<HelmetTags />, { theme })
    await waitFor(() => {
      expect(document.querySelector('meta[name="keywords"]')).toBeTruthy()
    })
    expect(descriptionMetas()).toHaveLength(0)
    expect(ogDescriptionMetas()).toHaveLength(0)
    // Robots is page-owned on customer hosts; a bare root emits none.
    expect(document.querySelector('meta[name="robots"]')).toBeNull()
  })

  it('restores the real route description for tracking_home when nothing else is configured', async () => {
    renderWithProviders(<HelmetTags page='tracking_home' />, { theme: themeWithoutDescription })
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(helmetData.tracking_home.description)
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(helmetData.tracking_home.description)
    expect(descriptionMetas()).toHaveLength(1)
    expect(ogDescriptionMetas()).toHaveLength(1)
  })

  it('keeps the shared default when the route description is a dummy template', async () => {
    renderWithProviders(<HelmetTags page='home' />, { theme: themeWithoutDescription })
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })

  it('keeps configured and API descriptions ahead of the route default', async () => {
    mockSeo.site = { description: 'Site configured description' }
    const { rerender } = renderWithProviders(
      <HelmetTags page='tracking_home' />,
      { theme: themeWithoutDescription }
    )
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('Site configured description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('Site configured description')

    window.__SEO__ = {
      title: null,
      description: 'API description',
      ogDescription: 'API OG description',
      pathname: '/'
    }
    rerender(<HelmetTags page='tracking_home' />)
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe('API description')
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe('API OG description')
  })

  it('renders descriptions on an explicit page before the theme is ready', async () => {
    renderWithProviders(<HelmetTags page='home' />, { theme: themeWithoutSettings })
    await waitFor(() => {
      expect(descriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
    })
    expect(ogDescriptionMeta()?.getAttribute('content')).toBe(DEFAULT_SEO_DESCRIPTION)
  })
})
