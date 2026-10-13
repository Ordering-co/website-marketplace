import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture } from '../../__tests__/helpers/menuTestMocks'
import { BusinessItemAccordion } from '../index'

const validCart = {
  products: [{ id: 1 }],
  valid_address: true,
  valid_maximum: true,
  minimum: 0,
  subtotal: 12
}

describe('BusinessItemAccordion', () => {
  it('renders business name and checkout action', () => {
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        business={businessFixture}
        cart={validCart}
        uuid='cart-1'
        isProducts
        isForceOpenAccordion
        total={12}
        handleClickCheckout={vi.fn()}
      >
        <div>cart line</div>
      </BusinessItemAccordion>
    )
    expect(getByText('Demo Store')).toBeInTheDocument()
    expect(getByText('cart line')).toBeInTheDocument()
    expect(getByText(/Checkout/)).toBeInTheDocument()
  })

  it('calls checkout handler', () => {
    const handleClickCheckout = vi.fn()
    const { getByText } = renderWithProviders(
      <BusinessItemAccordion
        business={businessFixture}
        cart={validCart}
        isProducts
        isForceOpenAccordion
        total={12}
        handleClickCheckout={handleClickCheckout}
      />
    )
    fireEvent.click(getByText(/Checkout/))
    expect(handleClickCheckout).toHaveBeenCalled()
  })
})
