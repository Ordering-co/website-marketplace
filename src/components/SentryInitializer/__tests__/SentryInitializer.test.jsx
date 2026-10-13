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
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders nothing', () => {
    const { container } = render(<SentryInitializer />)
    expect(container).toBeEmptyDOMElement()
  })

  it('initializes sentry on allowed domain with consent', async () => {
    render(<SentryInitializer />)
    await waitFor(() => {
      expect(sentryInit).toHaveBeenCalled()
    })
  })
})
