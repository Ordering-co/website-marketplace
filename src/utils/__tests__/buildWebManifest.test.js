import { describe, expect, it } from 'vitest'

import { buildWebManifest } from '../buildWebManifest'

const tenantIcons = [
  { src: 'https://cdn.example.com/logo.png', sizes: '192x192', type: 'image/png' },
  { src: 'https://cdn.example.com/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
]

describe('buildWebManifest', () => {
  it('builds a tenant manifest with name, language, and icons', () => {
    const manifest = buildWebManifest({
      name: 'Wegoo',
      lang: 'es',
      icons: tenantIcons
    })

    expect(manifest.name).toBe('Wegoo')
    expect(manifest.short_name).toBe('Wegoo')
    expect(manifest.lang).toBe('es')
    expect(manifest.start_url).toBe('/')
    expect(manifest.scope).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.icons).toEqual(tenantIcons)
  })

  it('uses absolute start_url and scope so blob manifests stay valid', () => {
    const manifest = buildWebManifest({
      name: 'Wegoo',
      lang: 'es',
      origin: 'http://localhost:3000/',
      icons: tenantIcons
    })

    expect(manifest.start_url).toBe('http://localhost:3000/')
    expect(manifest.scope).toBe('http://localhost:3000/')
  })

  it('includes a description only when the tenant provided one', () => {
    const withDescription = buildWebManifest({
      name: 'Wegoo',
      description: 'Servicios a domicilio',
      lang: 'es',
      icons: tenantIcons
    })
    const withoutDescription = buildWebManifest({
      name: 'Wegoo',
      description: '   ',
      lang: 'es',
      icons: tenantIcons
    })

    expect(withDescription.description).toBe('Servicios a domicilio')
    expect(withoutDescription).not.toHaveProperty('description')
  })

  it('never injects the static English template description', () => {
    const manifest = buildWebManifest({
      name: 'Wegoo',
      lang: 'es',
      icons: tenantIcons
    })

    expect(JSON.stringify(manifest)).not.toMatch(/Food ordering app|Ordering template with PWA|Ordering PWA/i)
  })

  it('prefers an explicit short name and optional theme colors', () => {
    const manifest = buildWebManifest({
      name: 'Wegoo Home Services',
      shortName: 'Wegoo',
      lang: 'es',
      themeColor: '#0f766e',
      backgroundColor: '#ffffff',
      icons: tenantIcons
    })

    expect(manifest.short_name).toBe('Wegoo')
    expect(manifest.theme_color).toBe('#0f766e')
    expect(manifest.background_color).toBe('#ffffff')
  })

  it('returns null when the tenant name is missing', () => {
    expect(buildWebManifest({
      name: '  ',
      lang: 'es',
      icons: tenantIcons
    })).toBeNull()
  })

  it('drops icons that have no src', () => {
    const manifest = buildWebManifest({
      name: 'Wegoo',
      lang: 'es',
      icons: [
        { src: '', sizes: '192x192' },
        { src: 'https://cdn.example.com/logo.png', sizes: '512x512', type: 'image/png' }
      ]
    })

    expect(manifest.icons).toEqual([
      { src: 'https://cdn.example.com/logo.png', sizes: '512x512', type: 'image/png' }
    ])
  })
})
