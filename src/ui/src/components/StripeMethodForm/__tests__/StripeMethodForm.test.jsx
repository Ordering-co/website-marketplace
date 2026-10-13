import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { StripeMethodForm } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({
    paymentRequest: () => ({
      canMakePayment: () => Promise.resolve(null),
      on: vi.fn()
    })
  }),
  PaymentRequestButtonElement: () => <div data-testid='payment-request-button' />
}))

vi.mock('~components/components/StripeElementsForm/CardForm', () => ({
  CardForm: ({ UIComponent, ...rest }) => <UIComponent cart={{ total: 10, business: { name: 'Demo Store' } }} paymethod='google_pay' {...rest} />
}))

describe('StripeMethodForm', () => {
  it('shows unavailable message when payment request is missing', async () => {
    const { findByText } = renderWithProviders(<StripeMethodForm />)
    expect(await findByText('Google pay unavailable')).toBeInTheDocument()
  })
})
