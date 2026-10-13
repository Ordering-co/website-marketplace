import { afterEach, describe, expect, it, vi } from 'vitest'

import { applyWebManifestLink } from '../applyWebManifestLink'

const manifest = {
  name: 'Wegoo',
  short_name: 'Wegoo',
  lang: 'es',
  description: 'Servicios a domicilio',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  icons: [{ src: 'https://cdn.example.com/wegoo-favicon.png', sizes: '192x192', type: 'image/png' }]
}

describe('applyWebManifestLink', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('points the manifest link at a blob of the tenant manifest and sets the iOS title', () => {
    const createObjectURL = vi.fn(() => 'blob:https://wegoo.es/manifest')
    document.head.innerHTML = '<link id="web-app-manifest" rel="manifest" href="/manifest.json" />'

    const cleanup = applyWebManifestLink(manifest, { createObjectURL })
    const link = document.getElementById('web-app-manifest')
    const title = document.querySelector('meta[name="apple-mobile-web-app-title"]')

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    const blob = createObjectURL.mock.calls[0][0]
    expect(blob).toBeInstanceOf(Blob)
    expect(link.getAttribute('href')).toBe('blob:https://wegoo.es/manifest')
    expect(title.getAttribute('content')).toBe('Wegoo')

    cleanup()
  })

  it('creates the manifest link only after tenant branding is ready', () => {
    const createObjectURL = vi.fn(() => 'blob:http://localhost:3000/manifest')

    applyWebManifestLink(manifest, { createObjectURL })
    const link = document.getElementById('web-app-manifest')

    expect(link.getAttribute('rel')).toBe('manifest')
    expect(link.getAttribute('href')).toBe('blob:http://localhost:3000/manifest')
    expect(link.getAttribute('href')).not.toBe('/manifest.json')
  })

  it('revokes the previous blob URL on cleanup', () => {
    const createObjectURL = vi.fn(() => 'blob:https://wegoo.es/manifest')
    const revokeObjectURL = vi.fn()

    const cleanup = applyWebManifestLink(manifest, { createObjectURL, revokeObjectURL })
    cleanup()

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:https://wegoo.es/manifest')
  })

  it('does nothing when there is no tenant manifest', () => {
    const createObjectURL = vi.fn()

    const cleanup = applyWebManifestLink(null, { createObjectURL })
    cleanup()

    expect(createObjectURL).not.toHaveBeenCalled()
    expect(document.getElementById('web-app-manifest')).toBeNull()
  })
})
