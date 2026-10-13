import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { StripeElementsForm } from '../index'

vi.mock('@stripe/stripe-js/pure', () => ({
  loadStripe: vi.fn(() => Promise.resolve({}))
}))
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div data-testid='stripe-elements'>{children}</div>
}))
vi.mock('~ui/src/components/CardForm', () => ({
  CardForm: () => <div data-testid='card-form' />
}))
vi.mock('~ui/src/components/StripeMethodForm', () => ({
  StripeMethodForm: () => <div data-testid='stripe-method-form' />
}))

vi.mock('~components/components/StripeElementsForm', () => ({
  StripeElementsForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      publicKey='pk_test_123'
      handleSource={vi.fn()}
      businessId={1}
      requirements={[]}
      onNewCard={vi.fn()}
      toSave
      onCancel={vi.fn()}
      paymethod='card'
      cart={{ total: 10 }}
      handlePlaceOrder={vi.fn()}
      methodsPay={[]}
      {...rest}
    />
  )
}))

describe('StripeElementsForm', () => {
  it('renders stripe elements wrapper with card form', () => {
    const { getByTestId } = renderWithProviders(<StripeElementsForm />)
    expect(getByTestId('stripe-elements')).toBeInTheDocument()
    expect(getByTestId('card-form')).toBeInTheDocument()
  })
})
