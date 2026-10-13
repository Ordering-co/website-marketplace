import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders, defaultTheme } from '../../../../../../../__tests__/helpers/testUtils'
import { OrderTrackingLayout } from '../index'

const configState = vi.hoisted(() => ({ configs: { google_maps_api_key: { value: 'maps-key' }, dates_general_format: { value: 'YYYY-MM-DD HH:mm' } } }))
const interpolation = vi.hoisted(() => vi.fn())
const apiState = vi.hoisted(() => ({ project: 'luisv4plus' }))

vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [apiState]
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [configState]
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => [{ parseDate: (value) => `parsed:${value}`, parsePrice: (value) => `$${value}`, timeFormat: 'HH:mm' }]
}))
vi.mock('~components/components/GoogleMaps', () => ({
  GoogleMaps: (props) => (
    <div data-testid='google-map' data-locations={props.locations?.length} data-icons={props.locations?.map((location) => location.icon).join('|')} />
  )
}))
vi.mock('~ui/utils', () => ({
  getGoogleMapImage: (location, key) => `https://maps.test/static?key=${key}&lat=${location?.lat}`,
  generalUtilities: () => ({
    getStatusPrefix: ({ status }) => ({ value: `legacy-${status}`, percentage: status === 4 ? 50 : 10 })
  })
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: ({ content, btnTitle, onClickButton }) => (
    <div data-testid='not-found'>
      <span>{content}</span>
      {btnTitle && <button type='button' onClick={onClickButton}>{btnTitle}</button>}
    </div>
  )
}))
vi.mock('../TrackingProductItem', () => ({
  TrackingProductItem: ({ product, hidePrice }) => <div data-testid='product-item' data-hide-price={String(!!hidePrice)}>{product.name}</div>
}))
vi.mock('~ui-icon', () => ({
  Icon: ({ name }) => <span data-testid={`icon-${name}`} />
}))
vi.mock('../../../../../hooks/useDriverLocationInterpolation', () => ({
  useDriverLocationInterpolation: (...args) => interpolation(...args)
}))
vi.mock('../OrderEtaRange', () => ({
  OrderEtaRange: () => <span data-testid='eta-range'>10:00 – 10:10</span>
}))
vi.mock('../SatisfactionSurvey', () => ({
  SatisfactionSurvey: ({ hashKey, image }) => <div data-testid='survey' data-hash={hashKey} data-image={image} />
}))
vi.mock('../DeliveryOrderTabs', () => ({
  DeliveryOrderTabs: ({ productsCount, productList, isCourierTracking }) => (
    <div data-testid='tabs' data-products={productsCount} data-courier={String(!!isCourierTracking)}>{productList}</div>
  )
}))

const theme = {
  ...defaultTheme,
  images: {
    ...defaultTheme.images,
    icons: { store: '/store.png', driver: '/driver.png', home: '/home.png', delivered: '/delivered.png' },
    general: { driverPng: '/driver-pin.png', mapPin: '/customer-pin.png' },
    dummies: { businessLogo: '/store-dummy.png' }
  }
}

const baseOrder = {
  id: 501,
  status: 7,
  delivery_type: 1,
  business: { name: 'Demo Store', logo: '/logo.png', location: { lat: 10, lng: 20 } },
  customer: { name: 'Ana', lastname: 'Lopez', address: 'Calle 1 #23', location: { lat: 11, lng: 21 } },
  products: [{ id: 1, name: 'Burger', price: 10 }, { id: 2, name: 'Combo child', price: 0 }],
  summary: { total: 10 },
  reporting_data: { at: { 'status:11': '2026-09-09 12:00:00' } }
}

const renderLayout = (overrides = {}, extraProps = {}) => renderWithProviders(
  <OrderTrackingLayout
    order={{ order: { ...baseOrder, ...overrides }, loading: false, error: null }}
    googleMapsControls={{}}
    handleOrderRedirect={vi.fn()}
    {...extraProps}
  />,
  { theme }
)

describe('OrderTrackingLayout', () => {
  beforeEach(() => {
    apiState.project = 'luisv4plus'
    interpolation.mockClear()
    window.scrollTo = vi.fn()
  })

  it('shows a skeleton while loading', () => {
    const { container } = renderWithProviders(
      <OrderTrackingLayout order={{ order: null, loading: true, error: null }} />,
      { theme }
    )
    expect(container.querySelector('[data-doc-section="order-tracking-loading"]')).toBeTruthy()
  })

  it('shows the expired message and the not found action', () => {
    const expired = renderWithProviders(
      <OrderTrackingLayout order={{ order: null, loading: false, error: ['ERROR_ACCESS_EXPIRED'] }} />,
      { theme }
    )
    expect(expired.getByText('Sorry, the order has expired.')).toBeInTheDocument()
    expired.unmount()
    const handleOrderRedirect = vi.fn()
    const { getByText } = renderWithProviders(
      <OrderTrackingLayout order={{ order: null, loading: false, error: ['NOT_FOUND'] }} handleOrderRedirect={handleOrderRedirect} />,
      { theme }
    )
    fireEvent.click(getByText('Go to home'))
    expect(handleOrderRedirect).toHaveBeenCalled()
  })

  it('renders the preparing stage, the estimated window, the static map and the tabs for an active delivery', () => {
    const { getByText, getByTestId, container } = renderLayout()
    expect(getByText('We are preparing your order')).toBeInTheDocument()
    expect(getByText('Estimated delivery:')).toBeInTheDocument()
    expect(getByTestId('eta-range')).toBeInTheDocument()
    expect(container.querySelector('[data-doc-section="order-tracking-stages"]')).toBeTruthy()
    expect(container.querySelector('[data-doc-section="order-tracking-static-map"] img').getAttribute('src')).toContain('key=maps-key')
    expect(getByTestId('tabs').dataset.products).toBe('1')
    expect(getByTestId('tabs').dataset.courier).toBe('false')
    expect(getByText('Burger')).toBeInTheDocument()
    expect(getByTestId('product-item').dataset.hidePrice).toBe('false')
    expect(container.querySelector('[data-doc-section="order-tracking-customer"]')).toBeNull()
    expect(container.querySelector('[data-doc-section="order-tracking-survey"]')).toBeNull()
  })

  it('lists zero-price products without prices and flags the tabs for courier projects', () => {
    apiState.project = 'quickiedelivery'
    const { getByTestId, getAllByTestId, getByText } = renderLayout()
    expect(getByTestId('tabs').dataset.products).toBe('2')
    expect(getByTestId('tabs').dataset.courier).toBe('true')
    expect(getByText('Combo child')).toBeInTheDocument()
    expect(getAllByTestId('product-item').map(item => item.dataset.hidePrice)).toEqual(['true', 'true'])
  })

  it('shows the live map with the theme markers while the driver is on the way', () => {
    const driver = { name: 'Luis', lastname: 'Perez', location: { lat: 1, lng: 2 } }
    const { getByText, getByTestId, container } = renderLayout({ status: 23, driver }, { driverLocation: { lat: 1.5, lng: 2.5 } })
    expect(getByText('On the way to your address')).toBeInTheDocument()
    expect(getByTestId('google-map').dataset.locations).toBe('3')
    expect(getByTestId('google-map').dataset.icons).toBe('/driver-pin.png|/logo.png|/customer-pin.png')
    expect(container.querySelector('[data-doc-section="order-tracking-static-map"]')).toBeNull()
    expect(interpolation).toHaveBeenCalledWith({ lat: 1.5, lng: 2.5 }, expect.objectContaining({ onPositionUpdate: expect.any(Function) }))
  })

  it('expands and minimizes the live map', () => {
    const driver = { name: 'Luis', lastname: 'Perez', location: { lat: 1, lng: 2 } }
    const { getByText, queryByText } = renderLayout({ status: 23, driver }, { driverLocation: { lat: 1, lng: 2 } })
    fireEvent.click(getByText('Maximize map'))
    expect(getByText('Minimize map')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(getByText('Minimize map'))
    expect(queryByText('Minimize map')).toBeNull()
  })

  it('shows the arrived stage and hides tabs, showing the survey once delivered', () => {
    const arrived = renderLayout({ status: 26, driver: { name: 'Luis' } })
    expect(arrived.getByText('Your order has arrived')).toBeInTheDocument()
    expect(arrived.getByTestId('tabs')).toBeInTheDocument()
    arrived.unmount()
    const delivered = renderLayout({ status: 11, driver: { name: 'Luis' } }, { hashKey: 'abc' })
    expect(delivered.getByText('We have delivered your order')).toBeInTheDocument()
    expect(delivered.getByText('Delivered at:')).toBeInTheDocument()
    expect(delivered.getByText('parsed:2026-09-09 12:00:00')).toBeInTheDocument()
    expect(delivered.queryByTestId('tabs')).toBeNull()
    expect(delivered.getByTestId('survey').dataset.hash).toBe('abc')
    expect(delivered.getByTestId('survey').dataset.image).toBe('/logo.png')
  })

  it('shows the canceled state without stages, tabs or survey', () => {
    const { getByText, container, queryByTestId } = renderLayout({ status: 2, driver: { name: 'Luis' } })
    expect(getByText('Order canceled')).toBeInTheDocument()
    expect(getByText('This order has been canceled')).toBeInTheDocument()
    expect(container.querySelector('[data-doc-section="order-tracking-stages"]')).toBeNull()
    expect(queryByTestId('tabs')).toBeNull()
    expect(queryByTestId('survey')).toBeNull()
  })

  it('respects theme hidden flags for progress, map and reviews', () => {
    const hiddenTheme = {
      ...theme,
      confirmation: {
        components: {
          order: { components: { progress: { hidden: true } } },
          business: { components: { map: { hidden: true } } }
        }
      },
      orders: { components: { review_order_button: { hidden: true } } }
    }
    const { container, queryByTestId } = renderWithProviders(
      <OrderTrackingLayout order={{ order: { ...baseOrder, status: 11 }, loading: false, error: null }} googleMapsControls={{}} />,
      { theme: hiddenTheme }
    )
    expect(container.querySelector('[data-doc-section="order-tracking-stages"]')).toBeNull()
    expect(container.querySelector('[data-doc-section="order-tracking-static-map"]')).toBeNull()
    expect(queryByTestId('survey')).toBeNull()
  })

  it('falls back to the classic status and the customer and driver cards for pickup orders', () => {
    const { getByText, container, queryByTestId, queryByText } = renderLayout({
      status: 4,
      delivery_type: 2,
      driver: { name: 'Luis', lastname: 'Perez', cellphone: '+51999', plate: 'ABC-123' }
    })
    expect(getByText('legacy-4')).toBeInTheDocument()
    expect(queryByText('Estimated delivery:')).toBeNull()
    expect(queryByTestId('tabs')).toBeNull()
    expect(container.querySelector('[data-doc-section="order-tracking-customer"]')).toBeTruthy()
    expect(getByText('Ana Lopez')).toBeInTheDocument()
    expect(getByText('Luis Perez')).toBeInTheDocument()
    expect(getByText('Plate: ABC-123')).toBeInTheDocument()
  })
})
