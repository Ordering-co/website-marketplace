import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CartStoresListing } from '../index'

const businessFixture = vi.hoisted(() => ({
  id: 1,
  name: 'Demo Store',
  slug: 'demo-store',
  logo: 'logo.png',
  enabled: true
}))

vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business }) => <div data-testid='store-card'>{business?.name}</div>
}))
vi.mock('~ui/src/components/SearchBar', () => ({
  SearchBar: ({ placeholder }) => <input data-testid='search' placeholder={placeholder} />
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: () => <div data-testid='not-found' />
}))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [
    {
      options: { type: 1 },
      carts: { 'businessId:1': { uuid: 'cart-1', business_id: 1 } }
    },
    { refreshOrderOptions: vi.fn() }
  ]
}))

vi.mock('~components/components/CartStoresListing', () => ({
  CartStoresListing: ({ UIComponent, ...rest }) => (
    <UIComponent
      storesState={{ loading: false, result: [businessFixture], error: null }}
      searchValue=''
      businessIdSelect={null}
      changeStoreState={{ loading: false, result: { business_id: 1 } }}
      handleChangeSearch={vi.fn()}
      handleCartStoreChange={vi.fn()}
      cartuuid='cart-1'
      {...rest}
    />
  )
}))

describe('CartStoresListing', () => {
  it('renders store list and search', () => {
    const { getByTestId, getByText } = renderWithProviders(<CartStoresListing />)
    expect(getByTestId('search')).toBeInTheDocument()
    expect(getByText('Demo Store')).toBeInTheDocument()
  })
})
