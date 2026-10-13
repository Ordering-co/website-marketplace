import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { BusinessProductsList } from '../index'

const emit = vi.fn()

vi.mock('../../../config', () => ({
  default: {
    businessSlug: null,
    franchiseSlug: null,
    use_marketplace: false,
    use_kiosk: false
  }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page, helmetMetaTags }) => (
    <div
      data-testid='helmet-tags'
      data-page={page}
      data-title={helmetMetaTags?.title || ''}
    />
  )
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
vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{ project: 'demo' }]
}))
vi.mock('~ui/src/components/BusinessProductsListing', () => ({
  BusinessProductsListing: (props) => (
    <div data-testid='business-products-listing-ui' data-slug={props.slug}>
      <button type='button' onClick={props.handleSearchRedirect}>search</button>
      <button type='button' onClick={() => props.onCheckoutRedirect('cart-1')}>checkout</button>
      <button
        type='button'
        onClick={() => props.onProductRedirect({ slug: 'demo-store', category: 'burgers', product: 'cheese' })}
      >
        product
      </button>
      <button
        type='button'
        onClick={() => props.onChangeMetaTag('Title', 'Description', 'keywords')}
      >
        meta
      </button>
    </div>
  )
}))

describe('BusinessProductsList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  it('renders business helmet tags and passes slug from route params', async () => {
    const { getByTestId } = renderWithProviders(<BusinessProductsList />, {
      initialEntries: ['/store/demo-store'],
      routePath: '/store/:business_slug'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'business')
    expect(getByTestId('business-products-listing-ui')).toHaveAttribute('data-slug', 'demo-store')
    await waitFor(() => {
      expect(getByTestId('helmet-tags')).toHaveAttribute('data-title', 'Demo-store')
    })
  })

  it('persists table number in local storage when present in query', () => {
    renderWithProviders(<BusinessProductsList />, {
      initialEntries: ['/store/demo-store?table_number=12'],
      routePath: '/store/:business_slug'
    })

    expect(JSON.parse(window.localStorage.getItem('table_number'))).toEqual({
      tableNumber: '12',
      slug: 'demo-store'
    })
  })

  it('emits navigation events from listing callbacks', () => {
    const { getByText } = renderWithProviders(<BusinessProductsList />, {
      initialEntries: ['/store/demo-store'],
      routePath: '/store/:business_slug'
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })

    getByText('checkout').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'checkout',
      params: { cartUuid: 'cart-1' }
    })

    getByText('product').click()
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
