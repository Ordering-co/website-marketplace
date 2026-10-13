import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PaymentOptionStripe } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/StripeElementsForm', () => ({
  StripeElementsForm: () => <div data-testid='stripe-elements-form' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Confirm: () => null
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: () => null
}))
vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [{ fields: { card: { zipcode: { enabled: false, required: false } } } }]
}))

vi.mock('~components/components/PaymentOptionStripe', () => ({
  PaymentOptionStripe: ({ UIComponent, ...rest }) => (
    <UIComponent
      cardsList={{ loading: false, cards: [{ id: 1, brand: 'visa', last4: '4242' }] }}
      gateway='stripe'
      handleCardClick={vi.fn()}
      handleNewCard={vi.fn()}
      deleteCard={vi.fn()}
      paymethodSelected={{ paymethod: { gateway: 'stripe' } }}
      {...rest}
    />
  )
}))

describe('PaymentOptionStripe', () => {
  it('renders saved card row', () => {
    const { getByText } = renderWithProviders(<PaymentOptionStripe />)
    expect(getByText(/4242/)).toBeInTheDocument()
  })
})
