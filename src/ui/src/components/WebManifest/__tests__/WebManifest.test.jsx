import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'

import { applyWebManifestLink } from '../../../../../utils/applyWebManifestLink'
import { WebManifest } from '../index'

vi.mock('../../../../../utils/applyWebManifestLink', () => ({
  applyWebManifestLink: vi.fn(() => vi.fn())
}))

const theme = {
  colors: { primary: '#0f766e', backgroundPage: '#ffffff' },
  images: { logos: {} },
  my_products: {
    components: {
      website_settings: {
        components: {
          values: {
            name: 'Wegoo',
            description: 'Servicios a domicilio'
          }
        }
      }
    }
  }
}

describe('WebManifest', () => {
  it('applies the tenant manifest when branding is ready', () => {
    render(
      <WebManifest
        ready
        theme={theme}
        site={{ name: 'Fallback' }}
        settings={{ app_name: 'OrderingPlus' }}
        languageCode='es'
        hostname='wegoo.es'
      />
    )

    expect(applyWebManifestLink).toHaveBeenCalledTimes(1)
    const [manifest] = applyWebManifestLink.mock.calls[0]
    expect(manifest.name).toBe('Wegoo')
    expect(manifest.description).toBe('Servicios a domicilio')
    expect(manifest.lang).toBe('es')
    expect(manifest.start_url).toBe(`${window.location.origin}/`)
    expect(manifest.scope).toBe(`${window.location.origin}/`)
  })

  it('reapplies the manifest when the app language changes', () => {
    const { rerender } = render(
      <WebManifest
        ready
        theme={theme}
        site={{ name: 'Wegoo' }}
        settings={{ app_name: 'OrderingPlus' }}
        languageCode='en'
        hostname='wegoo.es'
      />
    )

    applyWebManifestLink.mockClear()
    rerender(
      <WebManifest
        ready
        theme={theme}
        site={{ name: 'Wegoo' }}
        settings={{ app_name: 'OrderingPlus' }}
        languageCode='es'
        hostname='wegoo.es'
      />
    )

    expect(applyWebManifestLink).toHaveBeenCalledTimes(1)
    expect(applyWebManifestLink.mock.calls[0][0].lang).toBe('es')
  })

  it('does not apply a manifest while branding is still loading', () => {
    applyWebManifestLink.mockClear()
    render(
      <WebManifest
        ready={false}
        theme={theme}
        languageCode='es'
      />
    )

    expect(applyWebManifestLink).not.toHaveBeenCalled()
  })
})
