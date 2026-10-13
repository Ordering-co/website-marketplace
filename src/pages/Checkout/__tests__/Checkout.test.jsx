import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { CheckoutPage } from '../index'

const emit = vi.fn()
const changeMoment = vi.fn()

vi.mock('../../../config', () => ({
  default: { businessSlug: null, use_kiosk: false }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{ options: {} }, { confirmCart: vi.fn(), changeMoment }]
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('@stripe/stripe-js/pure', () => ({
  loadStripe: vi.fn()
}))
vi.mock('~ui/src/components/Checkout', () => ({
  Checkout: (props) => (
    <div data-testid='checkout-ui' data-cart-uuid={props.cartUuid}>
      <button type='button' onClick={() => props.handleOrderRedirect('order-1')}>order</button>
      <button type='button' onClick={() => props.handleSearchRedirect()}>search</button>
      <button type='button' onClick={() => props.handleStoreRedirect('demo-store')}>store</button>
      <button type='button' onClick={() => props.onPlaceOrderClick(null, null, { order: { uuid: 'order-2' } })}>place</button>
    </div>
  )
}))

describe('CheckoutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checkout helmet tags and passes cart uuid from route', () => {
    const { getByTestId } = renderWithProviders(<CheckoutPage />, {
      initialEntries: ['/checkout/cart-123'],
      routePath: '/checkout/:cartUuid'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'checkout')
    expect(getByTestId('checkout-ui')).toHaveAttribute('data-cart-uuid', 'cart-123')
  })

  it('emits navigation events from checkout callbacks', () => {
    const { getByText } = renderWithProviders(<CheckoutPage />, {
      initialEntries: ['/checkout/cart-123'],
      routePath: '/checkout/:cartUuid'
    })

    getByText('order').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 'order-1' },
      replace: true
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })

    getByText('store').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })

    getByText('place').click()
    expect(changeMoment).not.toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'order_detail',
      params: { orderId: 'order-2' },
      replace: true
    })
  })
})
