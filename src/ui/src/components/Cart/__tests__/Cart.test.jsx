import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture, cartFixture, productFixture } from '../../__tests__/helpers/cartTestMocks'
import { Cart } from '../index'

vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [{ fields: { checkout: { coupon: { enabled: true }, comments: { enabled: true } } } }]
}))

vi.mock('~ui/src/components/BusinessItemAccordion', () => ({
  BusinessItemAccordion: ({ children }) => <div data-testid='business-accordion'>{children}</div>
}))
vi.mock('~ui/src/components/ProductItemAccordion', () => ({
  ProductItemAccordion: ({ product }) => <div>{product?.name}</div>
}))
vi.mock('~ui/src/components/CouponControl', () => ({ CouponControl: () => null }))
vi.mock('~ui/src/components/ProductForm', () => ({ ProductForm: () => null }))
vi.mock('~ui/src/components/UpsellingPage', () => ({ UpsellingPage: () => null }))
vi.mock('~ui/src/components/CartStoresListing', () => ({ CartStoresListing: () => null }))
vi.mock('~ui/src/components/DriverTips', () => ({ DriverTips: () => null }))
vi.mock('~ui/src/components/MomentContent', () => ({ MomentContent: () => null }))
vi.mock('~ui/src/components/ServiceForm', () => ({ ServiceForm: () => null }))
vi.mock('~ui/src/components/TaxInformation', () => ({ TaxInformation: () => null }))
vi.mock('~ui/src/components/TaxBillRows', () => ({ TaxBillRows: () => null }))
vi.mock('~ui/src/components/FeeBillRows', () => ({ FeeBillRows: () => null }))
vi.mock('~ui/src/components/RewardsBanner', () => ({ RewardsBanner: () => null }))
vi.mock('../CartStudentAlert', () => ({ CartStudentAlert: () => null }))

const cart = {
  ...cartFixture,
  business: businessFixture,
  valid_products: true,
  valid_schedule: true,
  valid_maximum: true,
  valid_minimum: true,
  valid_address: true,
  total: 9.5,
  products: [{ ...productFixture, code: 'BRG-1' }],
  taxes: []
}

vi.mock('~components/components/Cart', () => ({
  Cart: ({ UIComponent, ...rest }) => (
    <UIComponent
      cart={cart}
      currentCartUuid='cart-1'
      isProducts
      clearCart={vi.fn()}
      changeQuantity={vi.fn()}
      getProductMax={vi.fn()}
      offsetDisabled={false}
      removeProduct={vi.fn()}
      onClickCheckout={vi.fn()}
      isCheckout={false}
      isCartPending={false}
      showDiscountInCart
      {...rest}
    />
  )
}))

describe('Cart', () => {
  it('renders cart subtotal and product list', () => {
    const { getByText } = renderWithProviders(<Cart cart={cart} />)
    expect(getByText('Subtotal')).toBeInTheDocument()
    expect(getByText('Total')).toBeInTheDocument()
  })

  it('renders full free-delivery progress after products and before the order bill', () => {
    renderWithProviders(
      <Cart
        cart={cart}
        freeDeliveryProgress={{
          status: 'progress',
          minimum: 25,
          currentAmount: 10,
          remainingAmount: 15,
          progressPercent: 40
        }}
      />
    )

    const progress = screen.getByText('Add $15 for free delivery')
    const subtotal = screen.getByText('Subtotal')
    expect(progress.compareDocumentPosition(subtotal) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(progress.closest('[data-variant]')).toHaveAttribute('data-variant', 'full')
  })

  it('shows unlocked text and preserves the existing checkout action', () => {
    const onClickCheckout = vi.fn()
    renderWithProviders(
      <Cart
        cart={{ ...cart, valid: true }}
        freeDeliveryProgress={{ status: 'unlocked' }}
        onClickCheckout={onClickCheckout}
      />
    )

    expect(screen.getByRole('status')).toHaveTextContent('Free delivery unlocked')
    fireEvent.click(screen.getByRole('button', { name: 'Checkout' }))
    expect(onClickCheckout).toHaveBeenCalledTimes(1)
  })
})
