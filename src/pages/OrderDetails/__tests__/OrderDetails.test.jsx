import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders, defaultTheme } from '../../../__tests__/helpers/testUtils'
import { OrderDetailsPage } from '../index'

const emit = vi.fn()
const push = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page, helmetTitle }) => (
    <div data-testid='helmet-tags' data-page={page} data-title={helmetTitle} />
  )
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui/src/components/OrderDetails', () => ({
  OrderDetails: (props) => (
    <div data-testid='order-details-ui' data-order-id={props.orderId} data-hash={props.hashKey || ''} data-tracking-only={String(!!props.isTrackingOnly)}>
      <button type='button' onClick={props.handleOrderRedirect}>orders</button>
      <button type='button' onClick={() => props.handleBusinessRedirect('demo-store')}>business</button>
    </div>
  )
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useHistory: () => ({ push })
  }
})

describe('OrderDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order details helmet tags and route params', () => {
    const { getByTestId } = renderWithProviders(<OrderDetailsPage />, {
      initialEntries: ['/orders/order-42?hash=abc'],
      routePath: '/orders/:orderId'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'order_details')
    expect(getByTestId('helmet-tags')).toHaveAttribute('data-title', 'Order #order-42')
    expect(getByTestId('order-details-ui')).toHaveAttribute('data-order-id', 'order-42')
    expect(getByTestId('order-details-ui')).toHaveAttribute('data-hash', 'abc')
  })

  it('redirects to profile orders and business page from callbacks', () => {
    const { getByText } = renderWithProviders(<OrderDetailsPage />, {
      initialEntries: ['/orders/order-42'],
      routePath: '/orders/:orderId'
    })

    getByText('orders').click()
    expect(push).toHaveBeenCalledWith('/profile/orders')

    getByText('business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })
  })

  it('passes tracking-only mode down and sends the orders redirect to the home', () => {
    const theme = { ...defaultTheme, tracking_settings: { tracking_only: true } }
    const { getByTestId, getByText } = renderWithProviders(<OrderDetailsPage />, {
      initialEntries: ['/orders/order-42?hash=abc'],
      routePath: '/orders/:orderId',
      theme
    })

    expect(getByTestId('order-details-ui')).toHaveAttribute('data-tracking-only', 'true')
    getByText('orders').click()
    expect(push).toHaveBeenCalledWith('/')
  })

  it('keeps the classic layout when tracking-only is off', () => {
    const { getByTestId } = renderWithProviders(<OrderDetailsPage />, {
      initialEntries: ['/orders/order-42?hash=abc'],
      routePath: '/orders/:orderId'
    })
    expect(getByTestId('order-details-ui')).toHaveAttribute('data-tracking-only', 'false')
  })
})
