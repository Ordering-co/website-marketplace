import { describe, expect, it } from 'vitest'

import { WHITE_LABEL_FAVICON, WHITE_LABEL_LOGO } from '../siteBranding'
import { resolvePwaBranding } from '../resolvePwaBranding'

const tenantTheme = {
  colors: {
    primary: '#0f766e',
    backgroundPage: '#ffffff'
  },
  images: {
    logos: {
      logotype: '/assets/logotype.svg'
    }
  },
  my_products: {
    components: {
      website_settings: {
        components: {
          values: {
            name: 'Wegoo',
            description: 'Servicios a domicilio'
          }
        }
      },
      images: {
        components: {
          logo: {
            components: {
              image: 'https://cdn.example.com/wegoo-logo.png'
            }
          }
        }
      }
    }
  },
  general: {
    components: {
      favicon: {
        components: {
          image: 'https://cdn.example.com/wegoo-favicon.png'
        }
      }
    }
  }
}

describe('resolvePwaBranding', () => {
  it('prefers website settings name, description, language, and tenant icons', () => {
    const branding = resolvePwaBranding({
      theme: tenantTheme,
      site: { name: 'Site fallback', description: 'Site description' },
      settings: { app_name: 'OrderingPlus' },
      languageCode: 'es',
      hostname: 'wegoo.es'
    })

    expect(branding.name).toBe('Wegoo')
    expect(branding.description).toBe('Servicios a domicilio')
    expect(branding.lang).toBe('es')
    expect(branding.themeColor).toBe('#0f766e')
    expect(branding.backgroundColor).toBe('#ffffff')
    expect(branding.icons[0].src).toBe('https://cdn.example.com/wegoo-favicon.png')
    expect(branding.icons[1].src).toBe('https://cdn.example.com/wegoo-logo.png')
  })

  it('falls back to site and settings when website settings are empty', () => {
    const branding = resolvePwaBranding({
      theme: { colors: {}, images: { logos: {} } },
      site: { name: 'Wegoo Site', description: '' },
      settings: { app_name: 'OrderingPlus' },
      languageCode: 'es',
      hostname: 'wegoo.es'
    })

    expect(branding.name).toBe('Wegoo Site')
    expect(branding.description).toBe('')
    expect(branding.icons[0].src).toBe(WHITE_LABEL_FAVICON)
    expect(branding.icons[1].src).toBe(WHITE_LABEL_LOGO)
  })

  it('uses site.logo for the tab icon when no custom favicon exists', () => {
    const branding = resolvePwaBranding({
      theme: {
        colors: {},
        images: { logos: {} },
        general: { components: { favicon: { components: { image: '' } } } }
      },
      site: { logo: 'https://cdn.example.com/site-logo.png' },
      hostname: 'wegoo.es'
    })

    expect(branding.icons[0].src).toBe('https://cdn.example.com/site-logo.png')
  })

  it('keeps a custom favicon ahead of site.logo', () => {
    const branding = resolvePwaBranding({
      theme: tenantTheme,
      site: { logo: 'https://cdn.example.com/site-logo.png' },
      hostname: 'wegoo.es'
    })

    expect(branding.icons[0].src).toBe('https://cdn.example.com/wegoo-favicon.png')
  })

  it('uses app_name when no tenant or site name exists', () => {
    const branding = resolvePwaBranding({
      settings: { app_name: 'OrderingPlus' },
      languageCode: 'en',
      hostname: 'localhost'
    })

    expect(branding.name).toBe('OrderingPlus')
  })
})
