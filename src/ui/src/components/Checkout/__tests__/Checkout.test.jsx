import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { Checkout } from '../index'

const checkoutCart = vi.hoisted(() => ({
  uuid: 'cart-1',
  status: 0,
  business_id: 1,
  business: { id: 1, name: 'Demo Store', slug: 'demo-store' },
  products: [{ id: 10, name: 'Burger', code: 'BRG-1', price: 9.5 }],
  total: 9.5,
  subtotal: 9.5
}))

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('react-loading-skeleton', () => ({
  default: () => <div data-testid='skeleton' />
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: ({ content }) => <div data-testid='not-found'>{content}</div>
}))
vi.mock('~ui/src/components/CartContent', () => ({
  CartContent: () => <div data-testid='cart-content' />
}))
vi.mock('~ui/src/components/UpsellingPage', () => ({
  UpsellingPage: () => null
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Alert: () => null
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [
    {
      loading: false,
      carts: { 'businessId:1': checkoutCart }
    },
    { confirmCart: vi.fn() }
  ]
}))

vi.mock('~components/components/Checkout', () => ({
  Checkout: () => <div data-testid='checkout-controller'>checkout</div>
}))

describe('Checkout', () => {
  it('loads checkout controller when cart is available', async () => {
    window.localStorage.removeItem('user-customer')
    const { findByTestId } = renderWithProviders(
      <Checkout cartUuid='cart-1' handleOrderRedirect={vi.fn()} handleCheckoutRedirect={vi.fn()} />
    )
    expect(await findByTestId('checkout-controller')).toBeInTheDocument()
  })
})
