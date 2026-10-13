import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PaymentOptionCard } from '../index'

vi.mock('~ui/src/components/PaymentOptionStripe', () => ({
  PaymentOptionStripeUI: () => <div data-testid='stripe-ui'>Stripe UI</div>
}))
vi.mock('~ui/src/components/CardFormCustom', () => ({
  CardFormCustom: () => <div data-testid='card-form-custom' />
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))

vi.mock('~components/components/PaymentOptionStripe', () => ({
  PaymentOptionStripe: ({ UIComponent, ...rest }) => (
    <UIComponent
      cardsList={{ loading: false, cards: [] }}
      gateway='credomatic'
      handleNewCard={vi.fn()}
      paymethodSelected={{ paymethod: { gateway: 'credomatic' } }}
      token='test-token'
      {...rest}
    />
  )
}))

describe('PaymentOptionCard', () => {
  it('renders card payment shell', () => {
    const { getByTestId } = renderWithProviders(<PaymentOptionCard />)
    expect(getByTestId('stripe-ui')).toBeInTheDocument()
  })
})
