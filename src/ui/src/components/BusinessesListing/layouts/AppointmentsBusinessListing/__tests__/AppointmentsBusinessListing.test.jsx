import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../../../__tests__/helpers/testUtils'
import { AppointmentsBusinessListing } from '../index'

vi.mock('~ui/utils', () => ({
  priceList: [{ level: 1, content: '$' }, { level: 2, content: '$$' }],
  getCateringValues: () => ({}),
  checkSiteUrl: (_u, f) => f,
  capitalize: (s) => s
}))
vi.mock('~ui/src/styles/Buttons', () => ({
  Button: ({ children, onClick }) => <button type='button' onClick={onClick}>{children}</button>
}))
vi.mock('~ui/src/components/SearchBar', () => ({
  SearchBar: ({ placeholder, onSearch }) => (
    <input data-testid='search' placeholder={placeholder} onChange={(e) => onSearch?.(e.target.value)} />
  )
}))
vi.mock('~ui/src/components/BusinessTypeFilter', () => ({
  BusinessTypeFilter: ({ handleChangeBusinessType }) => (
    <button type='button' data-testid='type-filter' onClick={() => handleChangeBusinessType?.(3)}>types</button>
  )
}))
vi.mock('~ui/src/components/MomentControl', () => ({
  MomentControl: () => <div data-testid='moment' />
}))
vi.mock('~ui/src/components/OrderTypeSelectorHeader', () => ({
  OrderTypeSelectorHeader: () => <div data-testid='order-type' />
}))
vi.mock('~ui/src/components/HighestRated', () => ({
  HighestRated: () => <div data-testid='highest' />
}))
vi.mock('~ui/src/components/BusinessController', () => ({
  BusinessController: ({ business, isSkeleton, onPreorderBusiness }) => (
    (isSkeleton || !business?.id)
      ? <div data-testid='business-skeleton' />
      : (
        <button type='button' data-testid='business-card' onClick={() => onPreorderBusiness?.(business)}>
          {business?.name}
        </button>
        )
  )
}))
vi.mock('~ui/src/components/BusinessPreorder', () => ({
  BusinessPreorder: () => <div data-testid='preorder' />
}))
vi.mock('~ui/src/components/AddressList', () => ({ AddressList: () => <div data-testid='address-list' /> }))
vi.mock('~ui/src/components/AddressForm', () => ({ AddressForm: () => <div data-testid='address-form' /> }))
vi.mock('~ui/src/components/Modal', () => ({
  Modal: ({ open, children, onClose }) => (
    open ? <div data-testid='modal'><button type='button' data-testid='modal-close' onClick={onClose}>x</button>{children}</div> : null
  )
}))
vi.mock('~ui/src/components/NotFoundSource', () => ({
  NotFoundSource: ({ content, children }) => <div data-testid='empty'>{content}{children}</div>
}))
vi.mock('~ui-icon', () => ({
  Icon: ({ name, onClick }) => <button type='button' data-testid={`icon-${name}`} onClick={onClick}>{name}</button>
}))
vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ auth: true, user: {} }, { login: vi.fn() }]
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{ configs: { order_types_allowed: { value: '1|2' }, advanced_business_search_enabled: { value: '1' } }, loading: false }]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{
    options: { type: 1, address: { address: '1 Main' } },
    loading: false,
    carts: {}
  }, { refreshOrderOptions: vi.fn() }]
}))

const listingFixture = vi.hoisted(() => ({
  current: {
    businessesList: { loading: false, error: null, businesses: [] },
    paginationProps: { currentPage: 1, totalPages: 2 },
    searchValue: '',
    priceLevelSelected: null,
    businessTypeSelected: null,
    handleChangeBusinessType: vi.fn(),
    handleChangePriceLevel: vi.fn(),
    getBusinesses: vi.fn(),
    handleChangeSearch: vi.fn(),
    handleBusinessClick: vi.fn(),
    handleUpdateBusinessList: vi.fn(),
    onRedirectPage: vi.fn(),
    onBusinessClick: vi.fn()
  }
}))

vi.mock('~components/components/BusinessList', () => ({
  BusinessList: ({ UIComponent, ...rest }) => (
    <UIComponent {...listingFixture.current} {...rest} />
  )
}))

describe('AppointmentsBusinessListing', () => {
  beforeEach(() => {
    listingFixture.current.getBusinesses.mockClear()
    listingFixture.current.onRedirectPage.mockClear()
    listingFixture.current.businessesList = { loading: false, error: null, businesses: [] }
  })

  it('renders appointments listing chrome', () => {
    const { getByText, getByTestId } = renderWithProviders(<AppointmentsBusinessListing />)
    expect(getByText('Select a business')).toBeInTheDocument()
    expect(getByText('Popular services')).toBeInTheDocument()
    expect(getByText('All Businesses')).toBeInTheDocument()
    expect(getByTestId('search')).toHaveAttribute('placeholder', 'Search Businesses')
    expect(getByTestId('empty')).toBeInTheDocument()
  })

  it('renders business cards and opens preorder', () => {
    listingFixture.current.businessesList = {
      loading: false,
      error: null,
      businesses: [{ id: 1, name: 'Spa Spot', open: true }]
    }
    const { getByTestId } = renderWithProviders(<AppointmentsBusinessListing />)
    expect(getByTestId('business-card')).toHaveTextContent('Spa Spot')
    expect(getByTestId('highest')).toBeInTheDocument()
    fireEvent.click(getByTestId('business-card'))
    expect(getByTestId('preorder')).toBeInTheDocument()
    fireEvent.click(getByTestId('modal-close'))
  })

  it('handles search, price, type filters and address change', () => {
    const { getByTestId, getByText } = renderWithProviders(<AppointmentsBusinessListing />)
    fireEvent.change(getByTestId('search'), { target: { value: 'spa' } })
    expect(listingFixture.current.handleChangeSearch).toHaveBeenCalledWith('spa')
    fireEvent.click(getByText('$'))
    expect(listingFixture.current.handleChangePriceLevel).toHaveBeenCalledWith(1)
    fireEvent.click(getByTestId('type-filter'))
    expect(listingFixture.current.handleChangeBusinessType).toHaveBeenCalledWith(3)
    fireEvent.click(getByText('Change'))
    expect(getByTestId('modal')).toBeInTheDocument()
  })

  it('redirects to advanced search via filter icon', () => {
    const { getByTestId } = renderWithProviders(<AppointmentsBusinessListing />)
    fireEvent.click(getByTestId('icon-filter'))
    expect(listingFixture.current.onRedirectPage).toHaveBeenCalledWith({ page: 'business_search' })
  })

  it('loads more on scroll', () => {
    listingFixture.current.businessesList = {
      loading: false,
      error: null,
      businesses: [{ id: 1, name: 'Spa Spot', open: true }]
    }
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 9000, configurable: true })
    Object.defineProperty(document.documentElement, 'offsetHeight', { value: 100, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true })
    renderWithProviders(<AppointmentsBusinessListing />)
    fireEvent.scroll(window)
    expect(listingFixture.current.getBusinesses).toHaveBeenCalled()
  })
})
