import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { paymethodFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { PaymentOptions } from '../index'

const session = vi.hoisted(() => ({ user: {} }))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/PaymentOptionCash', () => ({
  PaymentOptionCash: () => <div data-testid='payment-cash'>Cash</div>
}))
vi.mock('~ui/src/components/PaymentOptionStripe', () => ({
  PaymentOptionStripe: ({ gateway, publicKey }) => (
    <div data-testid='payment-stripe' data-gateway={gateway} data-public-key={publicKey}>Stripe</div>
  )
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

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ token: 'token', user: session.user }]
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

const connectV2Paymethod = {
  id: 85,
  name: 'Stripe Connect v2',
  gateway: 'stripe_connect_v2',
  credentials: { publishable: 'pk_connect' }
}
const stripePaymethod = {
  id: 2,
  name: 'Card',
  gateway: 'stripe',
  credentials: { publishable: 'pk_stripe' }
}
const connectV2List = { loading: false, paymethods: [paymethodFixture, stripePaymethod, connectV2Paymethod] }

describe('PaymentOptions', () => {
  beforeEach(() => {
    session.user = {}
  })

  it('renders payment methods list', () => {
    const { getAllByText, getByText } = renderWithProviders(<PaymentOptions />)
    expect(getAllByText('Cash').length).toBeGreaterThan(0)
    expect(getByText('Card')).toBeInTheDocument()
  })

  it('does not show the saved cards list for a method without cards', () => {
    const { queryByTestId } = renderWithProviders(<PaymentOptions />)
    expect(queryByTestId('payment-stripe')).not.toBeInTheDocument()
  })

  it('opens stripe_connect_v2 as a method that asks for a card', () => {
    const handlePaymethodClick = vi.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptions
        cart={{ total: 20, balance: 20 }}
        paymethodsList={connectV2List}
        paymethodSelected={null}
        handlePaymethodClick={handlePaymethodClick}
      />
    )
    fireEvent.click(getByText('Stripe Connect v2'))
    expect(handlePaymethodClick).toHaveBeenCalledWith(connectV2Paymethod, true)
  })

  it('sends a guest to sign up instead of opening stripe_connect_v2', () => {
    session.user = { guest_id: 'guest-1' }
    const handlePaymethodClick = vi.fn()
    const handleOpenGuestSignup = vi.fn()
    const { getByText } = renderWithProviders(
      <PaymentOptions
        cart={{ total: 20, balance: 20 }}
        paymethodsList={connectV2List}
        paymethodSelected={null}
        handlePaymethodClick={handlePaymethodClick}
        handleOpenGuestSignup={handleOpenGuestSignup}
      />
    )
    fireEvent.click(getByText('Stripe Connect v2'))
    expect(handleOpenGuestSignup).toHaveBeenCalled()
    expect(handlePaymethodClick).not.toHaveBeenCalled()
  })

  it('lists the saved cards of stripe_connect_v2 inline with its own key', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentOptions
        paymethodsList={connectV2List}
        paymethodSelected={null}
        isOpenMethod={{ paymethod: connectV2Paymethod }}
      />
    )
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-gateway', 'stripe_connect_v2')
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-public-key', 'pk_connect')
  })

  it('keeps the key of the paymethod already selected in the cart', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentOptions
        paymethodsList={connectV2List}
        paymethodSelected={null}
        setPaymethodData={vi.fn()}
        paySelected={{
          id: 85,
          gateway: 'stripe_connect_v2',
          paymethod: connectV2Paymethod,
          data: { id: 'card_1', card: { brand: 'visa', last4: '4242' } }
        }}
      />
    )
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-gateway', 'stripe_connect_v2')
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-public-key', 'pk_connect')
  })

  it('shows the cards of the method just opened over the one selected before', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentOptions
        paymethodsList={connectV2List}
        paymethodSelected={null}
        setPaymethodData={vi.fn()}
        isOpenMethod={{ paymethod: stripePaymethod }}
        paySelected={{ id: 85, gateway: 'stripe_connect_v2', paymethod: connectV2Paymethod, data: { id: 'card_1' } }}
      />
    )
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-gateway', 'stripe')
    expect(getByTestId('payment-stripe')).toHaveAttribute('data-public-key', 'pk_stripe')
  })
})
