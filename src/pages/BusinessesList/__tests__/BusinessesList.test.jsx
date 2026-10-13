import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { BusinessesList } from '../index'

const emit = vi.fn()

vi.mock('../../../config', () => ({
  default: { businessSlug: null, franchiseSlug: null }
}))
vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~components/contexts/SiteContext', () => ({
  useSite: () => [{ site: { business_url_template: '/store/:business_slug' } }]
}))
vi.mock('~ui/src/components/BusinessesListing', () => ({
  BusinessesListing: (props) => (
    <div data-testid='businesses-listing-ui'>
      <span data-testid='custom-location'>{props.customLocation ? 'has-location' : 'no-location'}</span>
      <button type='button' onClick={() => props.onBusinessClick({ slug: 'demo-store' })}>business</button>
      <button type='button' onClick={() => props.onRedirectPage({ page: 'search' })}>redirect</button>
    </div>
  )
}))

describe('BusinessesList page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search helmet tags and listing with query location', () => {
    const { getByTestId } = renderWithProviders(<BusinessesList />, {
      initialEntries: ['/search?lat=40.7&lng=-74.0'],
      routePath: '/search'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'search')
    expect(getByTestId('custom-location')).toHaveTextContent('has-location')
  })

  it('emits navigation events from listing callbacks', () => {
    const { getByText } = renderWithProviders(<BusinessesList />, {
      initialEntries: ['/search?lat=40.7&lng=-74.0'],
      routePath: '/search'
    })

    getByText('business').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'business',
      params: { business_slug: 'demo-store' }
    })

    getByText('redirect').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
  })
})
