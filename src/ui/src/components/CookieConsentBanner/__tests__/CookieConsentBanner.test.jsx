import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CookieConsentBanner } from '../index'

const acceptConsent = vi.fn()
const optOutConsent = vi.fn()

vi.mock('../../../../../contexts/CookieConsentContext', () => ({
  useCookieConsent: () => ({
    consentStatus: 'unknown',
    acceptConsent,
    optOutConsent,
    isConsentEnabled: true
  })
}))

describe('CookieConsentBanner', () => {
  it('renders consent dialog and handles actions', () => {
    const { getByRole, getByText } = renderWithProviders(<CookieConsentBanner />)
    expect(getByRole('dialog', { name: 'Cookie consent' })).toBeInTheDocument()
    fireEvent.click(getByText('Got it'))
    expect(acceptConsent).toHaveBeenCalled()
    fireEvent.click(getByText('Opt Out'))
    expect(optOutConsent).toHaveBeenCalled()
  })
})
