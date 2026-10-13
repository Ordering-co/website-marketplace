import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { activeOrder } from '../../__tests__/helpers/ordersTestMocks'
import { OrderDetails } from '../index'

const orderFixture = {
  ...activeOrder,
  products: [],
  taxes: [],
  subtotal: 15.5,
  business: {
    ...activeOrder.business,
    location: { lat: 40.71, lng: -74.0 }
  },
  customer: { location: { lat: 40.72, lng: -74.01 } }
}

vi.mock('~components/components/OrderDetails', () => ({
  OrderDetails: ({ UIComponent, ...rest }) => (
    <UIComponent
      order={{ loading: false, error: null, order: orderFixture, businessData: orderFixture.business }}
      messages={{ messages: [] }}
      reorderState={{ loading: false, error: null, result: null }}
      loyaltyPlansState={{ result: [] }}
      setMessages={vi.fn()}
      readMessages={vi.fn()}
      driverLocation={null}
      getOrder={vi.fn()}
      handleReorder={vi.fn()}
      handleBusinessRedirect={vi.fn()}
      handleOrderRedirect={vi.fn()}
      onGoBack={vi.fn()}
      orderTypes={[{ value: 1, text: 'Delivery' }]}
      googleMapsControls={{}}
      {...rest}
    />
  )
}))

vi.mock('~components/components/GoogleMaps', () => ({
  GoogleMaps: () => <div data-testid='google-maps-stub' />
}))

vi.mock('~ui/hooks/useDriverLocationInterpolation', () => ({
  useDriverLocationInterpolation: vi.fn()
}))

vi.mock('~ui/src/components/OrderDetails/OrderEta', () => ({
  OrderEta: () => <span>ETA</span>
}))

vi.mock('~ui/src/components/ProductItemAccordion', () => ({
  ProductItemAccordion: () => null
}))

vi.mock('~ui/src/components/TaxInformation', () => ({
  TaxInformation: () => null
}))

vi.mock('~ui/src/components/Messages', () => ({
  Messages: () => null
}))

vi.mock('~ui/src/components/ReviewOrder', () => ({
  ReviewOrder: () => null
}))

vi.mock('~ui/src/components/ReviewProduct', () => ({
  ReviewProduct: () => null
}))

vi.mock('~ui/src/components/ReviewDriver', () => ({
  ReviewDriver: () => null
}))

vi.mock('~ui/src/components/ReviewProfessional', () => ({
  ReviewProfessional: () => null
}))

vi.mock('~ui/src/components/GiftCard/SendGiftCard', () => ({
  SendGiftCard: () => null
}))

describe('OrderDetails', () => {
  it('renders in-progress order header', () => {
    const { getByText } = renderWithProviders(<OrderDetails orderId={activeOrder.uuid} />)
    expect(getByText(/Order:/)).toBeInTheDocument()
    expect(getByText('Your order is in progress')).toBeInTheDocument()
  })
})
