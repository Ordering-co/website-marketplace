import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

const changeUser = vi.fn()
const setConsentFromServer = vi.fn()
let sessionState = { user: null, token: null, loading: true }
let consentState = {
  consentStatus: 'unknown',
  consentTimestamp: null,
  setConsentFromServer,
  isFromServer: { current: false }
}

const mockSaveFn = vi.fn(() => Promise.resolve({ content: { error: null, result: { settings: { cookie_consent: { status: 'accepted' } } } } }))
const mockGet = vi.fn(() => Promise.resolve({
  content: {
    error: null,
    result: {
      settings: {
        cookie_consent: { status: 'unknown', timestamp: '2020-01-01T00:00:00.000Z' }
      }
    }
  }
}))
const mockUsers = vi.fn(() => ({
  save: mockSaveFn,
  select: vi.fn(() => ({ get: mockGet }))
}))
const mockSetAccessToken = vi.fn(() => ({ users: mockUsers }))
let orderingApi = { setAccessToken: mockSetAccessToken, project: 'orderingv1' }

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [sessionState, { changeUser }]
}))
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [orderingApi]
}))
vi.mock('../../../contexts/CookieConsentContext', () => ({
  useCookieConsent: () => consentState,
  CURRENT_CONSENT_VERSION: 1
}))

// eslint-disable-next-line import/first
import ConsentUserSync from '../index'

describe('ConsentUserSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    orderingApi = { setAccessToken: mockSetAccessToken, project: 'orderingv1' }
    sessionState = { user: null, token: null, loading: true }
    consentState = {
      consentStatus: 'unknown',
      consentTimestamp: null,
      setConsentFromServer,
      isFromServer: { current: false }
    }
  })

  it('renders nothing while session is loading', () => {
    const { container } = render(<ConsentUserSync />)
    expect(container).toBeEmptyDOMElement()
  })

  it('syncs local consent to server when user is authenticated', async () => {
    sessionState = { user: { id: 9, settings: {} }, token: 'tok', loading: false }
    consentState = {
      consentStatus: 'accepted',
      consentTimestamp: '2026-01-01T00:00:00.000Z',
      setConsentFromServer,
      isFromServer: { current: false }
    }

    render(<ConsentUserSync />)

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith('tok')
      expect(mockUsers).toHaveBeenCalledWith(9)
    })
  })

  it('does not fetch user settings while the SDK project is null', async () => {
    orderingApi = { setAccessToken: mockSetAccessToken, project: null }
    sessionState = { user: { id: 18811, settings: {} }, token: 'tok', loading: false }

    render(<ConsentUserSync />)

    await new Promise(resolve => setTimeout(resolve, 30))
    expect(mockSetAccessToken).not.toHaveBeenCalled()
  })
})
