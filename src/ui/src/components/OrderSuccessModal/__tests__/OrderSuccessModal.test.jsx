import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { checkoutCartFixture } from '../../__tests__/helpers/checkoutTestMocks'
import { OrderSuccessModal } from '../index'

describe('OrderSuccessModal', () => {
  it('renders creating-order title in checkout mode', () => {
    window.localStorage.setItem('business-address', JSON.stringify('123 Main St'))
    const cart = {
      ...checkoutCartFixture,
      business: { ...checkoutCartFixture.business, delivery_time: '01:30:00' }
    }
    const { getByText } = renderWithProviders(
      <OrderSuccessModal
        isCheckOut
        cart={cart}
        businessData={{ name: 'Demo Store', logo: 'logo.png', address: '123 Main St' }}
      />
    )
    expect(getByText('We are creating your order!')).toBeInTheDocument()
    expect(getByText('123 Main St')).toBeInTheDocument()
  })
})
