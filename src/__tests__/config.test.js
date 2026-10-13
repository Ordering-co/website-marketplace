import { afterEach, describe, expect, it, vi } from 'vitest'

describe('config merge', () => {
  afterEach(() => {
    delete window.__CONFIG__
  })

  it('exports merged api and socket settings from config.json', async () => {
    const { default: settings } = await import('~/config')
    expect(settings.api).toBeTruthy()
    expect(settings.socket).toBeTruthy()
    expect(settings.project).toBeTruthy()
  })

  it('converts slug sentinel values to null', async () => {
    window.__CONFIG__ = { franchiseSlug: '0', businessSlug: 'null' }
    vi.resetModules()
    const { default: settings } = await import('~/config')
    expect(settings.franchiseSlug).toBeNull()
    expect(settings.businessSlug).toBeNull()
  })
})
