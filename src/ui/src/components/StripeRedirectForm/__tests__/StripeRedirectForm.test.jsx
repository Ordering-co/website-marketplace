import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { StripeRedirectForm } from '../index'

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => (e) => {
      e?.preventDefault?.()
      return fn({})
    },
    register: () => null,
    errors: {},
    formState: { isSubmitting: false }
  })
}))

vi.mock('~components/components/PaymentOptionStripeRedirect/StripeRedirectForm', () => ({
  StripeRedirectForm: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymethods={[{ name: 'Bancontact', value: 'bancontact' }]}
      handleSubmitPaymentMethod={vi.fn()}
      {...rest}
    />
  )
}))

describe('StripeRedirectForm', () => {
  it('renders redirect payment method form', () => {
    const { getByText, getByRole } = renderWithProviders(<StripeRedirectForm />)
    expect(getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })
})
