import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SavedCards } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Confirm: () => null
}))
vi.mock('~ui/src/components/StripeElementsForm', () => ({
  StripeElementsForm: () => <div data-testid='stripe-elements-form' />
}))
vi.mock('../useSavedCardsGateway', () => ({
  useSavedCardsGateway: () => ({
    gateway: null,
    paymethodId: null,
    isAvailable: false,
    loading: false
  })
}))

describe('SavedCards', () => {
  it('renders unavailable saved cards state', () => {
    const { getByText } = renderWithProviders(<SavedCards />)
    expect(getByText('Saved cards are not available for this store.')).toBeInTheDocument()
  })
})
