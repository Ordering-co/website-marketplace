import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { paymethodFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { PaymentOptions } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/PaymentOptionCash', () => ({
  PaymentOptionCash: () => <div data-testid='payment-cash'>Cash</div>
}))
vi.mock('~ui/src/components/PaymentOptionStripe', () => ({
  PaymentOptionStripe: () => <div data-testid='payment-stripe'>Stripe</div>
}))
vi.mock('~ui/src/components/PaymentOptionCard', () => ({
  PaymentOptionCard: () => <div data-testid='payment-card'>Card</div>
}))
vi.mock('~ui/src/components/StripeElementsForm', () => ({
  StripeElementsForm: () => null
}))
vi.mock('~ui/src/components/StripeRedirectForm', () => ({
  StripeRedirectForm: () => null
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: () => null
}))
vi.mock('~ui/src/components/PaymentOptionPaypal', () => ({
  PaymentOptionPaypal: () => null
}))
vi.mock('~ui/src/components/PaymentOptionSquare', () => ({
  PaymentOptionSquare: () => null
}))
vi.mock('~ui/src/components/PaymentOptionEpayco', () => ({
  PaymentOptionEpayco: () => null
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children }) => (open ? <div>{children}</div> : null)
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Alert: () => null
}))

vi.mock('~components/components/PaymentOptions', () => ({
  PaymentOptions: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={{ total: 20 }}
      paymethodsList={{ loading: false, paymethods: [paymethodFixture, { id: 2, name: 'Card', gateway: 'stripe' }] }}
      paymethodSelected={paymethodFixture}
      paymethodData={{}}
      isOpenMethod={{}}
      handlePaymentMethodClick={vi.fn()}
      {...rest}
    />
  )
}))

describe('PaymentOptions', () => {
  it('renders payment methods list', () => {
    const { getAllByText, getByText } = renderWithProviders(<PaymentOptions />)
    expect(getAllByText('Cash').length).toBeGreaterThan(0)
    expect(getByText('Card')).toBeInTheDocument()
  })
})
