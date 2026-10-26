import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

const sentryInit = vi.fn()

vi.mock('../../../contexts/CookieConsentContext', () => ({
  useCookieConsent: () => ({ hasConsented: true })
}))
vi.mock('@sentry/react', () => ({
  init: sentryInit,
  browserTracingIntegration: vi.fn(() => ({ name: 'browserTracing' }))
}))

import { SentryInitializer } from '../index'

describe('SentryInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('location', { hostname: 'demo.orderingplus.com' })
    vi.stubEnv('VITE_SENTRY_RELEASE', 'abc123')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('renders nothing', () => {
    const { container } = render(<SentryInitializer />)
    expect(container).toBeEmptyDOMElement()
  })

  it('initializes sentry on allowed domain with consent', async () => {
    render(<SentryInitializer />)
    await waitFor(() => {
      expect(sentryInit).toHaveBeenCalledWith(expect.objectContaining({
        environment: 'production',
        release: 'website-marketplace-2@abc123',
        tracesSampleRate: 0.1
      }))
    })
  })

  it('does not initialize sentry when the build has no production release', async () => {
    vi.stubEnv('VITE_SENTRY_RELEASE', '')
    render(<SentryInitializer />)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(sentryInit).not.toHaveBeenCalled()
  })

  it('initializes sentry on Cloudflare store sites', async () => {
    vi.stubGlobal('location', { hostname: 'talented-wolf-0gn08z-stores.my-sites.app' })
    render(<SentryInitializer />)
    await waitFor(() => {
      expect(sentryInit).toHaveBeenCalledWith(expect.objectContaining({
        release: 'website-marketplace-2@abc123'
      }))
    })
  })

  it('does not initialize sentry outside the allowed domains', async () => {
    vi.stubGlobal('location', { hostname: 'customer-store.com' })
    render(<SentryInitializer />)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(sentryInit).not.toHaveBeenCalled()
  })

  it('does not initialize sentry on other my-sites.app hosts', async () => {
    vi.stubGlobal('location', { hostname: 'dash-assets.my-sites.app' })
    render(<SentryInitializer />)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(sentryInit).not.toHaveBeenCalled()
  })

  it('does not initialize sentry on localhost', async () => {
    vi.stubGlobal('location', { hostname: 'localhost' })
    render(<SentryInitializer />)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(sentryInit).not.toHaveBeenCalled()
  })
})
