import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { MultiCheckout } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{}, { confirmMultiCarts: vi.fn() }]
}))
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn()
}))
vi.mock('~ui/src/components/MultiCheckout', () => ({
  MultiCheckout: (props) => (
    <div data-testid='multi-checkout-ui' data-cart-uuid={props.cartUuid}>
      <button type='button' onClick={props.handleSearchRedirect}>search</button>
      <button type='button' onClick={() => props.onPlaceOrderClick({ id: 'order-9' })}>place</button>
    </div>
  )
}))

describe('MultiCheckout page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders multi checkout helmet tags and cart uuid', () => {
    const { getByTestId } = renderWithProviders(<MultiCheckout />, {
      initialEntries: ['/multi-checkout/cart-55'],
      routePath: '/multi-checkout/:cartUuid'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'multi_checkout')
    expect(getByTestId('multi-checkout-ui')).toHaveAttribute('data-cart-uuid', 'cart-55')
  })

  it('emits navigation events from multi checkout callbacks', () => {
    const { getByText } = renderWithProviders(<MultiCheckout />, {
      initialEntries: ['/multi-checkout/cart-55'],
      routePath: '/multi-checkout/:cartUuid'
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })

    getByText('place').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'multi_orders',
      params: { orderId: 'order-9' }
    })
  })
})
