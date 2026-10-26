import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { defaultTheme, renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { businessFixture, cartFixture, productFixture } from '../../__tests__/helpers/cartTestMocks'
import { useConfig } from '~components/contexts/ConfigContext'
import { useEvent } from '~components/contexts/EventContext'
import { useOrder } from '~components/contexts/OrderContext'
import { Cart } from '../index'

vi.mock('~components/contexts/ValidationsFieldsContext', () => ({
  useValidationFields: () => [{ fields: { checkout: { coupon: { enabled: true }, comments: { enabled: true } } } }]
}))

vi.mock('~ui/src/components/BusinessItemAccordion', () => ({
  BusinessItemAccordion: ({ children, handleClickCheckout, uuid, checkoutButtonDisabled }) => (
    <div data-testid='business-accordion'>
      <button type='button' data-testid='accordion-handoff' disabled={checkoutButtonDisabled} onClick={() => handleClickCheckout(uuid)} />
      {children}
    </div>
  )
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

  describe('pending cart', () => {
    const [{ configs }] = useConfig()
    const [events] = useEvent()
    const [orderState] = useOrder()
    const pendingCart = { ...cart, uuid: 'cart-1', valid: true, status: 2 }

    const setup = (carts, pending = pendingCart) => {
      configs.checkout_multi_business_enabled = { value: '1' }
      orderState.carts = carts
      events.emit.mockClear()
      return renderWithProviders(<Cart cart={pending} isCartPending showUpsellingInBusinessInfo />)
    }

    afterEach(() => {
      delete configs.checkout_multi_business_enabled
      orderState.carts = {}
    })

    it('sends a pending cart to its own checkout when multi checkout is enabled', () => {
      setup({ 'businessId:1': pendingCart })
      fireEvent.click(screen.getByTestId('accordion-handoff'))
      expect(events.emit).toHaveBeenCalledWith('go_to_page', { page: 'checkout', params: { cartUuid: 'cart-1' } })
      expect(events.emit).not.toHaveBeenCalledWith('go_to_page', expect.objectContaining({ page: 'multi_checkout' }))
    })

    it('sends pending carts placed together to their multi checkout', () => {
      const grouped = { ...pendingCart, group: { uuid: 'group-1' } }
      setup({
        'businessId:1': grouped,
        'businessId:2': { ...grouped, uuid: 'cart-2', business_id: 2 }
      }, grouped)
      fireEvent.click(screen.getByTestId('accordion-handoff'))
      expect(events.emit).toHaveBeenCalledWith('go_to_page', { page: 'multi_checkout', params: { cartUuid: 'group-1' } })
    })

    it('does not offer to clear a pending cart', () => {
      setup({ 'businessId:1': pendingCart })
      expect(screen.queryByText('Clear cart')).not.toBeInTheDocument()
    })
  })

  it('offers to clear an active cart from the upselling layout', () => {
    const theme = { ...defaultTheme, colors: { ...defaultTheme.colors, danger500: '#E63757' } }
    renderWithProviders(<Cart cart={cart} showUpsellingInBusinessInfo />, { theme })
    expect(screen.getByText('Clear cart')).toBeInTheDocument()
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

  describe('invalid cart', () => {
    const momentMessage = 'Selected schedule time is invalid, please select a schedule into the business schedule interval.'
    const closedMessage = 'The business is closed at the moment'
    const addressMessage = 'Selected address is invalid, please select a closer address.'
    const invalidPreorderCart = { ...cart, valid: false, valid_preorder: false, products: [{ code: 'FISH-1', name: 'Fish Over Rice Platter' }] }

    it('keeps the products visible, explains the reason and blocks checkout', () => {
      renderWithProviders(<Cart cart={invalidPreorderCart} />)
      expect(screen.getByText('Fish Over Rice Platter')).toBeInTheDocument()
      expect(screen.getByText(momentMessage)).toBeInTheDocument()
      expect(screen.getByTestId('accordion-handoff')).toBeDisabled()
    })

    it('reports a closed business instead of the schedule time it implies', () => {
      renderWithProviders(<Cart cart={{ ...invalidPreorderCart, valid_schedule: false }} />)
      expect(screen.getByText(closedMessage)).toBeInTheDocument()
      expect(screen.queryByText(momentMessage)).not.toBeInTheDocument()
    })

    it('reports an address out of coverage', () => {
      renderWithProviders(<Cart cart={{ ...cart, valid: false, valid_address: false }} />)
      expect(screen.getByText(addressMessage)).toBeInTheDocument()
    })

    it('leaves a valid cart without reasons and with checkout available', () => {
      renderWithProviders(<Cart cart={{ ...cart, valid: true }} />)
      expect(screen.queryByText(momentMessage)).not.toBeInTheDocument()
      expect(screen.queryByText(closedMessage)).not.toBeInTheDocument()
      expect(screen.getByTestId('accordion-handoff')).not.toBeDisabled()
    })

    it('does not block a pending cart', () => {
      renderWithProviders(<Cart cart={{ ...invalidPreorderCart, status: 2 }} isCartPending />)
      expect(screen.queryByText(momentMessage)).not.toBeInTheDocument()
      expect(screen.getByTestId('accordion-handoff')).not.toBeDisabled()
    })

    it('leaves the reasons to the checkout page warnings', () => {
      renderWithProviders(<Cart cart={invalidPreorderCart} isCheckout />)
      expect(screen.queryByText(momentMessage)).not.toBeInTheDocument()
    })
  })
})
