import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { MultiCart } from '../index'

const emit = vi.fn()

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~components/contexts/EventContext', () => ({
  useEvent: () => [{ emit }]
}))
vi.mock('~ui/src/components/MultiCart', () => ({
  MultiCart: (props) => (
    <div
      data-testid='multi-cart-ui'
      data-cart-uuid={props.cartUuid}
      data-cart-group={props.cartGroup}
    >
      <button type='button' onClick={() => props.handleOnRedirectCheckout('cart-1')}>checkout</button>
      <button type='button' onClick={() => props.handleOnRedirectMultiCheckout('cart-2')}>multi-checkout</button>
      <button type='button' onClick={() => props.onRedirectPage({ page: 'search' })}>search</button>
    </div>
  )
}))

describe('MultiCart page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders multi cart helmet tags and route params', () => {
    const { getByTestId } = renderWithProviders(<MultiCart />, {
      initialEntries: ['/multi-cart/group-1/cart-9'],
      routePath: '/multi-cart/:cartGroup/:cartUuid'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'multi_cart')
    expect(getByTestId('multi-cart-ui')).toHaveAttribute('data-cart-uuid', 'cart-9')
    expect(getByTestId('multi-cart-ui')).toHaveAttribute('data-cart-group', 'group-1')
  })

  it('emits navigation events from multi cart callbacks', () => {
    const { getByText } = renderWithProviders(<MultiCart />, {
      initialEntries: ['/multi-cart/group-1/cart-9'],
      routePath: '/multi-cart/:cartGroup/:cartUuid'
    })

    getByText('checkout').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'checkout',
      params: { cartUuid: 'cart-1' },
      replace: true
    })

    getByText('multi-checkout').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', {
      page: 'multi_checkout',
      params: { cartUuid: 'cart-2' },
      replace: true
    })

    getByText('search').click()
    expect(emit).toHaveBeenCalledWith('go_to_page', { page: 'search' })
  })
})
