import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders, defaultTheme } from '../../../../../__tests__/helpers/testUtils'
import { orderWithAddressFixture, sessionUserFixture } from '../../__tests__/helpers/shellTestMocks'
import { Header } from '../index'

const windowSize = vi.hoisted(() => ({ width: 1024, height: 768 }))
const mockGetDistance = vi.hoisted(() => vi.fn(() => 0))

vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => windowSize
}))
vi.mock('~ui/utils', () => ({
  getTraduction: (_key, fallback) => fallback,
  formatSeconds: (seconds) => `${seconds}s`,
  sortInputFields: ({ values } = {}) => Array.isArray(values) ? values : [],
  checkSiteUrl: (url, fallback) => url || fallback,
  capitalize: (str) => str,
  verifyDecimals: (rate) => `${rate}`,
  getIconCard: () => null,
  getHourMin: () => '0h 0m',
  getOrderStatusPrefix: () => '',
  getDistance: (...args) => mockGetDistance(...args),
  getCateringValues: () => ({}),
  lightenDarkenColor: (color) => color || '#000000',
  shape: {},
  generalUtilities: () => ({}),
  orderTypeList: [],
  scrollTo: vi.fn(),
  getTimes: () => [],
  reviewCommentList: () => ({ like: [], dislike: [] })
}))
vi.mock('../../../../config', () => ({
  default: { franchiseSlug: null, businessSlug: null }
}))
vi.mock('~/utils/publicAssetUrl', () => ({
  publicAssetUrl: (value) => value || '/logo.png'
}))
vi.mock('~ui/src/components/LanguageSelector', () => ({
  LanguageSelector: () => <div data-testid='language-selector' />
}))
vi.mock('~ui/src/components/HeaderOption', () => ({
  HeaderOption: ({ variant, onClick }) => (
    <button type='button' data-testid={`header-option-${variant}`} onClick={() => onClick?.(variant)}>
      {variant}
    </button>
  )
}))
vi.mock('~ui/src/components/AddressOrderType', () => ({
  AddressOrderType: () => <div data-testid='address-order-type' />
}))
vi.mock('~ui/src/components/OrderTypeSelectorContent', () => ({
  OrderTypeSelectorContent: () => <div data-testid='order-type-selector' />
}))
vi.mock('@loadable/component', () => ({
  default: () => () => <div data-testid='lazy-header-child' />
}))

const emit = vi.hoisted(() => vi.fn())
const eventHandlers = vi.hoisted(() => ({}))

vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{
    emit,
    on: vi.fn((event, handler) => { eventHandlers[event] = handler }),
    off: vi.fn()
  }]
}))

const sessionState = vi.hoisted(() => ({
  auth: false,
  user: null,
  token: null
}))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [sessionState, { login: vi.fn() }]
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [orderWithAddressFixture, { refreshOrderOptions: vi.fn() }]
}))

vi.mock('~components/contexts/CustomerContext', () => ({
  useCustomer: () => [{ user: null, loading: false }, { deleteUserCustomer: vi.fn() }]
}))

describe('Header', () => {
  beforeEach(() => {
    emit.mockClear()
    mockGetDistance.mockReturnValue(0)
    windowSize.width = 1024
    windowSize.height = 768
    sessionState.auth = false
    sessionState.user = null
    sessionState.token = null
    window.localStorage.clear()
    Object.defineProperty(global.navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: vi.fn((success) => {
          success?.({ coords: { latitude: 40.71, longitude: -74.0 } })
        })
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders login action for guests on home', () => {
    const { getByText } = renderWithProviders(
      <Header isHome location={{ pathname: '/home' }} />,
      { initialEntries: ['/home'], routePath: '/home' }
    )
    expect(getByText('Login')).toBeInTheDocument()
  })

  it('renders address header option on search for guests', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    expect(getByText('Login')).toBeInTheDocument()
    expect(getByTestId('header-option-address')).toBeInTheDocument()
    expect(getByTestId('language-selector')).toBeInTheDocument()
  })

  it('opens login modal from Login link', () => {
    const { getByText, container } = renderWithProviders(
      <Header isHome location={{ pathname: '/home' }} />,
      { initialEntries: ['/home'], routePath: '/home' }
    )
    fireEvent.click(getByText('Login'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('opens address modal from header option', () => {
    const { getByTestId, container } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByTestId('header-option-address'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('opens signup modal from Sign up button', () => {
    const { getByText, container } = renderWithProviders(
      <Header isHome location={{ pathname: '/home' }} />,
      { initialEntries: ['/home'], routePath: '/home' }
    )
    fireEvent.click(getByText('Sign up'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('renders lazy shell children and address selector for authed search', () => {
    sessionState.auth = true
    sessionState.user = sessionUserFixture
    sessionState.token = 'token'
    const { getAllByTestId, getByTestId } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    expect(getAllByTestId('lazy-header-child').length).toBeGreaterThan(0)
    expect(getByTestId('address-order-type')).toBeInTheDocument()
  })

  it('emits navigation when logo is clicked', () => {
    const theme = {
      ...defaultTheme,
      images: {
        ...defaultTheme.images,
        logos: { logotype: '/logo.png', isotype: '/icon.png' }
      }
    }
    const { getByAltText } = renderWithProviders(
      <Header isHome location={{ pathname: '/home' }} />,
      { initialEntries: ['/home'], routePath: '/home', theme }
    )
    fireEvent.click(getByAltText('Logotype').parentElement)
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
  })

  it('opens address modal when require_order_address event fires', async () => {
    const { container } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    eventHandlers.require_order_address?.()
    await waitFor(() => {
      expect(container.querySelector('.modal-container')).toBeTruthy()
    })
  })

  it('shows customer name in customer mode', () => {
    window.localStorage.setItem('user-customer', JSON.stringify({ id: 2, name: 'Alex', lastname: 'Customer' }))
    const { getByText } = renderWithProviders(
      <Header isCustomerMode location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    expect(getByText('Alex Customer')).toBeInTheDocument()
  })

  it('shows saved address on search submenu', () => {
    const { getByText } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    expect(getByText('123 Main St')).toBeInTheDocument()
  })

  it('opens cart modal for authenticated users on mobile', () => {
    windowSize.width = 500
    sessionState.auth = true
    sessionState.user = sessionUserFixture
    const { getByTestId, container } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByTestId('header-option-cart'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('opens moment modal from header option on tablet submenu', () => {
    windowSize.width = 800
    const { getByTestId, container } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByTestId('header-option-moment'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('opens address map modal from pin map control', () => {
    const { getByTestId, container } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByTestId('icon-pinMapFill'))
    expect(container.querySelector('.modal-container')).toBeTruthy()
  })

  it('emits map explore navigation from address map modal', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByTestId('icon-pinMapFill'))
    fireEvent.click(getByText('Explore'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'business_search', search: '?view=map' })
  })

  it('redirects to home when login is clicked in customer mode', () => {
    const { getByText } = renderWithProviders(
      <Header isCustomerMode location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    fireEvent.click(getByText('Login'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
  })

  it('shows far away warning on search when geolocation is distant', async () => {
    mockGetDistance.mockReturnValue(25)
    const { findAllByText } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/search' }} />,
      { initialEntries: ['/search'], routePath: '/search' }
    )
    expect((await findAllByText(/Is this the right address/)).length).toBeGreaterThan(0)
  })

  it('renders only the logo in tracking-only mode and sends the logo home', () => {
    const { queryByText, queryByTestId, getByAltText } = renderWithProviders(
      <Header isHome={false} location={{ pathname: '/orders/1' }} isTrackingOnly />,
      { initialEntries: ['/orders/1'], routePath: '/orders/1' }
    )
    expect(queryByText('Login')).toBeNull()
    expect(queryByText('Sign up')).toBeNull()
    expect(queryByTestId('address-order-type')).toBeNull()
    expect(queryByTestId('language-selector')).toBeNull()
    expect(queryByTestId('lazy-header-child')).toBeNull()
    fireEvent.click(getByAltText('Logotype'))
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'home' })
  })

  it('navigates to single store when logo is clicked on single-store theme', () => {
    const theme = {
      ...defaultTheme,
      my_products: {
        components: {
          website_theme: {
            components: {
              type: 'single_store',
              business_slug: 'demo-burger'
            }
          }
        }
      },
      images: {
        ...defaultTheme.images,
        logos: { logotype: '/logo.png' }
      }
    }
    const { getByAltText } = renderWithProviders(
      <Header isHome location={{ pathname: '/home' }} />,
      { initialEntries: ['/home'], routePath: '/home', theme }
    )
    fireEvent.click(getByAltText('Logotype').parentElement)
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-burger' }
    })
  })
})
