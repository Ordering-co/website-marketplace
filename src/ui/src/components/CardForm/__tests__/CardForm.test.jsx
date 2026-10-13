import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CardForm } from '../index'

vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: () => <div data-testid='card-element' />,
  CardNumberElement: () => <div data-testid='card-number' />,
  CardExpiryElement: () => <div data-testid='card-expiry' />,
  CardCvcElement: () => <div data-testid='card-cvc' />
}))
vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [{ fields: { card: { zipcode: { enabled: false, required: false } } } }]
}))

vi.mock('~components/components/StripeElementsForm/CardForm', () => ({
  CardForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      error={null}
      errorExpiry={null}
      errorCvc={null}
      loading={false}
      handleSubmit={(e) => e?.preventDefault?.()}
      handleChange={vi.fn()}
      isSplitForm
      handleChangeExpiry={vi.fn()}
      handleChangeCvc={vi.fn()}
      errorZipcode={null}
      {...rest}
    />
  )
}))

describe('CardForm', () => {
  it('renders split card form fields', () => {
    const { getByText, getByTestId } = renderWithProviders(<CardForm />)
    expect(getByTestId('card-number')).toBeInTheDocument()
    expect(getByText('Add card')).toBeInTheDocument()
  })
})
