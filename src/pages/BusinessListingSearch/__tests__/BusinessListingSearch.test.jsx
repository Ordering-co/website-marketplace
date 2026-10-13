import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { BusinessListingSearch } from '../index'

const emit = vi.fn()

let orderState = {
  loading: false,
  options: { address: { location: { lat: 40.7, lng: -74.0 } } }
}

vi.mock('../../../config', () => ({
  default: { franchiseSlug: null }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{
    site: {
      business_url_template: '/store/:business_slug',
      product_url_template: '/store/:business_slug/:category_slug/:product_slug'
    }
  }]
}))
vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [orderState]
}))
vi.mock('~ui/src/components/BusinessListingSearch', () => ({
  BusinessListingSearch: (props) => (
    <div data-testid='business-listing-search-ui'>
      <span data-testid='default-term'>{props.defaultTerm}</span>
      <span data-testid='show-map'>{String(props.isShowMap)}</span>
      <button type='button' onClick={() => props.onBusinessClick({ slug: 'demo-store' })}>business</button>
      <button
        type='button'
        onClick={() => props.onRedirectPage({ page: 'business', params: { store: 'redirect-store' } })}
      >
        redirect-business
      </button>
      <button
        type='button'
        onClick={() => props.onProductRedirect({ slug: 'demo-store', category: 'burgers', product: 'cheese' })}
      >
        redirect-product
      </button>
    </div>
  )
}))

describe('BusinessListingSearch page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    orderState = {
      loading: false,
      options: { address: { location: { lat: 40.7, lng: -74.0 } } }
    }
  })

  it('redirects home when there is no search location', () => {
    orderState = { loading: false, options: {} }
    const { queryByTestId } = renderWithProviders(<BusinessListingSearch />, {
      initialEntries: ['/search'],
      routePath: '/search'
    })
    expect(queryByTestId('business-listing-search-ui')).not.toBeInTheDocument()
  })

  it('renders listing search with term and map view from query', () => {
    const { getByTestId } = renderWithProviders(<BusinessListingSearch />, {
      initialEntries: ['/search?term=pizza&view=map'],
      routePath: '/search'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'business_search')
    expect(getByTestId('default-term')).toHaveTextContent('pizza')
    expect(getByTestId('show-map')).toHaveTextContent('true')
  })

  it('emits navigation events from listing callbacks', () => {
    const { getByText } = renderWithProviders(<BusinessListingSearch />, {
      initialEntries: ['/search?lat=40.7&lng=-74.0'],
      routePath: '/search'
    })

    getByText('business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })

    getByText('redirect-business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'redirect-store' }
    })

    getByText('redirect-product').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'product',
      params: {
        business_slug: 'demo-store',
        category_slug: 'burgers',
        product_slug: 'cheese'
      },
      replace: true
    })
  })
})
