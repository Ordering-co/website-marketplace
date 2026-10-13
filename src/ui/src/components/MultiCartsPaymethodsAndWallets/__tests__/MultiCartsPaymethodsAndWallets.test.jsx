import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { checkoutCartFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { MultiCartsPaymethodsAndWallets } from '../index'

vi.mock('~components/components/MultiCartsPaymethodsAndWallets', () => ({
  MultiCartsPaymethodsAndWallets: ({ UIComponent, ...rest }) => (
    <UIComponent
      paymethodsAndWallets={{
        loading: false,
        paymethods: [{ id: 1, name: 'Cash', gateway: 'cash', enabled: true }]
      }}
      paymethodSelected={null}
      handleSelectPaymethod={vi.fn()}
      openCarts={[checkoutCartFixture]}
      cartGroup={{ carts: [checkoutCartFixture.uuid] }}
      walletsState={[]}
      {...rest}
    />
  )
}))

vi.mock('~ui/src/components/PaymentOptionStripe', () => ({
  PaymentOptionStripe: () => null
}))

vi.mock('~ui/src/components/StripeElementsForm', () => ({
  StripeElementsForm: () => null
}))

vi.mock('~ui/src/components/PaymentOptionEpayco', () => ({
  PaymentOptionEpayco: () => null
}))

describe('MultiCartsPaymethodsAndWallets', () => {
  it('renders available paymethods', () => {
    const { getByText } = renderWithProviders(<MultiCartsPaymethodsAndWallets />)
    expect(getByText('Cash')).toBeInTheDocument()
  })
})
