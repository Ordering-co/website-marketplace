import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { BusinessListingSearch } from '../index'

vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}))
vi.mock('~ui/utils', () => ({
  generalUtilities: () => ({
    getOrderStatus: () => 'pending',
    convertHoursToMinutes: (v) => v
  }),
  checkSiteUrl: (_u, f) => f,
  removeQueryToUrl: vi.fn(),
  capitalize: (s) => s,
  getCateringValues: () => ({})
}))
vi.mock('~ui/src/styles/Buttons', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))
vi.mock('~ui/src/components/SearchBar', () => ({
  SearchBar: ({ placeholder, search, onSearch, onSearchStart }) => (
    <input
      data-testid='search'
      placeholder={placeholder}
      value={search || ''}
      onChange={(e) => {
        onSearchStart?.(e.target.value)
        onSearch?.(e.target.value)
      }}
    />
  )
}))
vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business, handleCustomClick, isSkeleton }) => (
    (isSkeleton || !business?.id)
      ? <div data-testid='business-skeleton' />
      : (
        <button type='button' data-testid='business-card' onClick={() => handleCustomClick?.(business)}>
          {business?.name}
        </button>
        )
  )
}))
vi.mock('~ui/src/components/BusinessTypeFilter', () => ({
  BusinessTypeFilter: ({ handleChangeBusinessType }) => (
    <button type='button' data-testid='type-filter' onClick={() => handleChangeBusinessType?.(1)}>types</button>
  )
}))
vi.mock('~ui/src/components/MyOrders', () => ({ MyOrders: () => null }))
vi.mock('~ui/src/components/SingleProductCard', () => ({
  SingleProductCard: ({ product, onProductClick }) => (
    <button type='button' data-testid='product-card' onClick={() => onProductClick?.(product)}>
      {product?.name}
    </button>
  )
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: ({ content, children }) => (
    <div data-testid='empty'>{content}{children}</div>
  )
}))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children, onClose, title }) => (
    open
      ? (
        <div data-testid='modal' data-title={title}>
          <button type='button' data-testid='modal-close' onClick={onClose}>close</button>
          {children}
        </div>
        )
      : null
  )
}))
vi.mock('~ui/src/components/ProductForm', () => ({
  ProductForm: ({ onSave }) => (
    <button type='button' data-testid='product-form' onClick={() => onSave?.({}, 'OK')}>save</button>
  )
}))
vi.mock('~ui/src/components/PageBanner', () => ({ PageBanner: () => <div data-testid='page-banner' /> }))
vi.mock('~ui/src/components/OrderContextUI', () => ({ OrderContextUI: () => null }))
vi.mock('~ui/src/components/HighestRated', () => ({ HighestRated: () => <div data-testid='highest' /> }))
vi.mock('~ui/src/components/OrderProgress', () => ({ OrderProgress: () => null }))
vi.mock('~ui/src/components/Locations', () => ({ Locations: () => <div data-testid='locations' /> }))
vi.mock('~ui/src/components/AutoScroll', () => ({
  AutoScroll: ({ children }) => <div>{children}</div>
}))
vi.mock('../MaxSectionItem', () => ({
  MaxSectionItem: ({ title, handleChangeFilters, filter }) => (
    <button type='button' data-testid={`max-${filter}`} onClick={() => handleChangeFilters?.(filter, 5)}>
      {title}
    </button>
  )
}))
vi.mock('~components/contexts/UtilsContext', () => ({
  useUtils: () => [{
    parsePrice: (v) => `$${v}`,
    parseDistance: (v) => `${v}mi`,
    optimizeImage: (url) => url,
    parseDate: () => 'now'
  }]
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      filter_search_options: { value: 'price_range|brands|max_delivery_fee|max_delivery_time|max_distance|business_categories' },
      distance_unit: { value: 'mi' },
      format_number_currency: { value: '$' }
    }
  }]
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: true, user: { id: 1 } }, { login: vi.fn() }]
}))

const searchFixture = vi.hoisted(() => ({
  current: {
    businessesSearchList: {
      loading: false,
      error: null,
      businesses: [{
        id: 1,
        name: 'Search Cafe',
        products: [{ id: 11, name: 'Pizza' }],
        categories: [{ id: 1, products: [{ id: 11, name: 'Pizza' }] }],
        open: true,
        reviews: { total: 4 },
        location: { lat: 30, lng: -97 },
        logo: '',
        delivery_time: '20',
        delivery_price: 2,
        distance: 1.2,
        slug: 'search-cafe'
      }]
    },
    onBusinessClick: vi.fn(),
    handleChangeFilters: vi.fn(),
    filters: { business_types: [], orderBy: 'default', franchise_ids: [], price_level: null },
    handleChangeTermValue: vi.fn(),
    termValue: 'pizza',
    paginationProps: { currentPage: 1, totalPages: 2 },
    handleSearchbusinessAndProducts: vi.fn(),
    brandList: { loading: false, brands: [{ id: 7, name: 'Brand A', enabled: true }] },
    onRedirectPage: vi.fn(),
    onProductRedirect: vi.fn(),
    handleUpdateBusinessList: vi.fn(),
    handleUpdateProducts: vi.fn(),
    businessUrlTemplate: '/store/:business_slug',
    isShowMap: false
  }
}))

vi.mock('~components/components/BusinessSearchList', () => ({
  BusinessSearchList: ({ UIComponent, ...rest }) => (
    <UIComponent {...searchFixture.current} {...rest} />
  )
}))

describe('BusinessListingSearch', () => {
  beforeEach(() => {
    Object.values(searchFixture.current).forEach((v) => {
      if (typeof v === 'function' && 'mockClear' in v) v.mockClear()
    })
    searchFixture.current.termValue = 'pizza'
    searchFixture.current.isShowMap = false
    searchFixture.current.filters = { business_types: [], orderBy: 'default', franchise_ids: [], price_level: null }
    searchFixture.current.businessesSearchList = {
      loading: false,
      error: null,
      businesses: [{
        id: 1,
        name: 'Search Cafe',
        products: [{ id: 11, name: 'Pizza' }],
        categories: [{ id: 1, products: [{ id: 11, name: 'Pizza' }] }],
        open: true,
        reviews: { total: 4 },
        location: { lat: 30, lng: -97 },
        logo: '',
        delivery_time: '20',
        delivery_price: 2,
        distance: 1.2,
        slug: 'search-cafe'
      }]
    }
  })

  it('renders search results for term', () => {
    const { getByTestId, getByDisplayValue } = renderWithProviders(<BusinessListingSearch />)
    expect(getByDisplayValue('pizza')).toBeInTheDocument()
    expect(getByTestId('business-card')).toHaveTextContent('Search Cafe')
  })

  it('shows empty state when no businesses match', () => {
    searchFixture.current.businessesSearchList = { loading: false, error: null, businesses: [] }
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />)
    expect(getByTestId('empty')).toBeInTheDocument()
  })

  it('shows loading skeletons for active search', () => {
    searchFixture.current.businessesSearchList = { loading: true, error: null, businesses: [] }
    const { getAllByTestId } = renderWithProviders(<BusinessListingSearch />)
    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('forwards search term changes including short resets', () => {
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />)
    fireEvent.change(getByTestId('search'), { target: { value: 'burger' } })
    expect(searchFixture.current.handleChangeTermValue).toHaveBeenCalledWith('burger')
    fireEvent.change(getByTestId('search'), { target: { value: 'ab' } })
    expect(searchFixture.current.handleChangeTermValue).toHaveBeenCalledWith('ab')
  })

  it('opens filter modals and applies price/brand/distance filters', () => {
    const { getByText, getByTestId, getAllByText, queryByTestId } = renderWithProviders(<BusinessListingSearch />)
    fireEvent.click(getByText('Price'))
    expect(getByTestId('modal')).toBeInTheDocument()
    fireEvent.click(getByTestId('modal-close'))
    expect(queryByTestId('modal')).not.toBeInTheDocument()

    fireEvent.click(getByText('Brands'))
    fireEvent.click(getByText('Brand A'))
    expect(searchFixture.current.handleChangeFilters).toHaveBeenCalledWith('franchise_ids', [7])

    fireEvent.click(getAllByText('Delivery fee')[0])
    fireEvent.click(getByTestId('max-max_delivery_price'))
    expect(searchFixture.current.handleChangeFilters).toHaveBeenCalledWith('max_delivery_price', 5)

    fireEvent.click(getByText('Max delivery time'))
    expect(getByTestId('max-max_eta')).toBeInTheDocument()
    fireEvent.click(getByTestId('modal-close'))

    fireEvent.click(getByText('Max distance'))
    expect(getByTestId('max-max_distance')).toBeInTheDocument()
    fireEvent.click(getByTestId('modal-close'))

    fireEvent.click(getByText('Categories'))
    fireEvent.click(getByTestId('type-filter'))
  })

  it('opens product form from listed product', () => {
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />)
    fireEvent.click(getByTestId('product-card'))
    expect(getByTestId('modal')).toBeInTheDocument()
    fireEvent.click(getByTestId('product-form'))
    expect(searchFixture.current.onBusinessClick).toHaveBeenCalled()
  })

  it('renders map mode locations wrapper and business click', () => {
    searchFixture.current.isShowMap = true
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />)
    expect(getByTestId('locations')).toBeInTheDocument()
    fireEvent.click(getByTestId('business-card'))
    expect(getByTestId('business-card')).toHaveTextContent('Search Cafe')
  })

  it('shows all business heading when no active filters', () => {
    searchFixture.current.termValue = ''
    searchFixture.current.filters = { business_types: [], orderBy: null, franchise_ids: [], price_level: null }
    searchFixture.current.businessesSearchList = {
      loading: false,
      error: null,
      businesses: [{ id: 1, name: 'Cafe', products: [], open: true, reviews: { total: 1 }, slug: 'c' }]
    }
    const { getByText } = renderWithProviders(<BusinessListingSearch />)
    expect(getByText('All Business')).toBeInTheDocument()
  })
})
