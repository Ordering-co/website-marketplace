import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { PaymentOptionPaypal } from '../index'

const PaypalButton = vi.hoisted(() => () => <div data-testid='paypal-button'>PayPal</div>)

vi.mock('~components/components/PaymentOptionPaypal', () => ({
  PaymentOptionPaypal: ({ UIComponent, ...rest }) => (
    <UIComponent
      isSdkReady
      PaypalButton={PaypalButton}
      paypalButtonProps={{}}
      {...rest}
    />
  )
}))

describe('PaymentOptionPaypal', () => {
  it('renders PayPal button when SDK is ready', () => {
    const { getByTestId } = renderWithProviders(<PaymentOptionPaypal />)
    expect(getByTestId('paypal-button')).toBeInTheDocument()
  })
})
