import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { useEvent } from '~components/contexts/EventContext'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CartContent } from '../index'

const progress = vi.hoisted(() => vi.fn(() => ({ status: 'progress' })))
vi.mock('~components/hooks/useFreeDeliveryProgress', () => ({ useFreeDeliveryProgress: progress }))

vi.mock('~ui/src/components/Cart', () => ({
  Cart: ({ cart, freeDeliveryProgress, isCheckout }) => <div data-testid='cart-item' data-progress={freeDeliveryProgress?.status} data-checkout={String(isCheckout)}>{cart?.uuid}</div>
}))

const preview = vi.hoisted(() => ({ cartGroup: null, isPending: false, calls: [] }))
vi.mock('~ui/hooks/useCartGroupPreview', () => ({
  useCartGroupPreview: (options) => {
    preview.calls.push(options)
    return { cartGroup: preview.cartGroup, isPending: preview.isPending, loading: preview.isPending }
  }
}))

const configState = vi.hoisted(() => ({ configs: {} }))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{ configs: configState.configs }]
}))

const multiBusinessConfigs = {
  checkout_multi_business_enabled: { value: '1' },
  multi_business_checkout_show_combined_delivery_fee: { value: '1' },
  multi_business_checkout_show_combined_driver_tip: { value: '1' }
}

const salad = { uuid: 'salad', business_id: 100, valid: true, status: 0, products: [{ id: 1 }], total: 69, delivery_price_with_discount: 8.57, driver_tip: 0 }
const inkognito = { uuid: 'inkognito', business_id: 102, valid: true, status: 0, products: [{ id: 2 }], total: 105, delivery_price_with_discount: 8.57, driver_tip: 0 }

describe('CartContent', () => {
  beforeEach(() => {
    progress.mockClear()
    preview.cartGroup = null
    preview.isPending = false
    preview.calls = []
    configState.configs = {}
    window.history.replaceState(null, '', '/')
  })

  it('sums each cart delivery fee while the group pricing is unavailable', () => {
    configState.configs = multiBusinessConfigs
    const { getByText, getAllByText } = renderWithProviders(<CartContent carts={[salad, inkognito]} isOrderStateCarts />)
    expect(getByText('Total delivery fee').nextSibling).toHaveTextContent('$17.14')
    expect(getAllByText('$174')).toHaveLength(2)
    expect(preview.calls.at(-1)).toEqual({ enabled: true })
  })

  it('shows the group delivery fee and totals once the cart group is priced', () => {
    configState.configs = multiBusinessConfigs
    preview.cartGroup = {
      uuid: 'group-1',
      carts: [salad, { ...inkognito, delivery_price_with_discount: 0, total: 96 }]
    }
    const { getByText, getAllByText, queryByText } = renderWithProviders(<CartContent carts={[salad, inkognito]} isOrderStateCarts />)
    expect(getByText('Total delivery fee').nextSibling).toHaveTextContent('$8.57')
    expect(getAllByText('$165')).toHaveLength(2)
    expect(queryByText('$174')).toBeNull()
  })

  it('shows skeletons instead of the per cart sums while the group pricing loads', () => {
    configState.configs = multiBusinessConfigs
    preview.isPending = true
    const { getByText, queryByText, getAllByTestId } = renderWithProviders(<CartContent carts={[salad, inkognito]} isOrderStateCarts />)
    expect(getByText('Total delivery fee')).toBeInTheDocument()
    expect(queryByText('$17.14')).toBeNull()
    expect(queryByText('$174')).toBeNull()
    expect(getAllByTestId('skeleton')).toHaveLength(3)
  })

  it('checks out the priced cart group even when the carts still carry an older group', () => {
    configState.configs = multiBusinessConfigs
    preview.cartGroup = { uuid: 'group-1', carts: [salad, inkognito] }
    const stale = { group: { uuid: 'old-group' } }
    const { getByText } = renderWithProviders(<CartContent carts={[{ ...salad, ...stale }, { ...inkognito, ...stale }]} isOrderStateCarts />)
    const [events] = useEvent()
    events.emit.mockClear()
    fireEvent.click(getByText('Checkout'))
    expect(events.emit).toHaveBeenCalledWith('go_to_page', { page: 'multi_checkout', params: { cartUuid: 'group-1' } })
  })

  it('does not request the group pricing outside the multi business checkout', () => {
    renderWithProviders(<CartContent carts={[salad, inkognito]} isOrderStateCarts />)
    expect(preview.calls.at(-1)).toEqual({ enabled: false })
    configState.configs = multiBusinessConfigs
    renderWithProviders(<CartContent carts={[salad, inkognito]} isOrderStateCarts isCustomerMode />)
    expect(preview.calls.at(-1)).toEqual({ enabled: false })
  })
  it('does not request promotional eligibility in checkout', () => {
    window.history.replaceState(null, '', '/checkout/cart-1')
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'true')
    window.history.replaceState(null, '', '/')
  })
  it('does not request promotional eligibility for the checkout cart list', () => {
    window.history.replaceState(null, '', '/checkout')
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'false')
  })
  it.each(['/checkout', '/checkout/cart-1', '/multi-checkout', '/multi-checkout/group-1'])('does not request offers from the header cart on %s', (path) => {
    window.history.replaceState(null, '', path)
    const cart = { uuid: 'cart-1', business_id: 1, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts isCartPopover isOpenCart />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-checkout', 'false')
  })
  it('owns progress for the visible global cart and disables lookup while closed', () => {
    const cart = { uuid: 'cart-1', business_id: 1, business: { id: 1, slug: 'demo' }, valid: true, status: 0, products: [{ id: 1 }], total: 10 }
    const { getByTestId, rerender } = renderWithProviders(<CartContent carts={[cart]} isOrderStateCarts isOpenCart />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ business: cart.business, cart, enabled: true }))
    expect(getByTestId('cart-item')).toHaveAttribute('data-progress', 'progress')
    rerender(<CartContent carts={[cart]} isOrderStateCarts isOpenCart={false} />)
    expect(progress).toHaveBeenLastCalledWith(expect.objectContaining({ enabled: false }))
  })
  it('shows an invalid cart with products instead of the empty state', () => {
    const invalid = { ...salad, valid: false }
    const { getByTestId, queryByText } = renderWithProviders(<CartContent carts={[invalid]} isOrderStateCarts />)
    expect(getByTestId('cart-item')).toHaveTextContent('salad')
    expect(queryByText('You have no products added to the cart')).not.toBeInTheDocument()
  })

  it('shows an invalid cart outside the group checkout and its totals', () => {
    configState.configs = multiBusinessConfigs
    const invalid = { ...inkognito, valid: false }
    const { getAllByTestId, getAllByText, queryByText } = renderWithProviders(<CartContent carts={[salad, invalid]} isOrderStateCarts />)
    expect(getAllByTestId('cart-item').map(item => item.textContent)).toEqual(['salad', 'inkognito'])
    expect(getAllByText('$69')).toHaveLength(2)
    expect(queryByText('$174')).toBeNull()
  })

  it('offers no checkout when every cart is invalid', () => {
    configState.configs = multiBusinessConfigs
    const { getByTestId, queryByText } = renderWithProviders(<CartContent carts={[{ ...salad, valid: false }]} isOrderStateCarts />)
    expect(getByTestId('cart-item')).toHaveTextContent('salad')
    expect(queryByText('Checkout')).toBeNull()
    expect(queryByText('Total for all Carts')).toBeNull()
  })

  it('keeps the empty state for carts without products', () => {
    const { getByText, queryByTestId } = renderWithProviders(<CartContent carts={[{ ...salad, products: [] }]} isOrderStateCarts />)
    expect(getByText('You have no products added to the cart')).toBeInTheDocument()
    expect(queryByTestId('cart-item')).toBeNull()
  })

  it('shows empty state when no carts', () => {
    const { getByText } = renderWithProviders(<CartContent carts={[]} isOrderStateCarts />)
    expect(getByText('You have no products added to the cart')).toBeInTheDocument()
  })

  it('renders cart items when carts are provided', () => {
    const carts = [{
      uuid: 'cart-1',
      valid: true,
      status: 1,
      products: [{ id: 1, name: 'Burger', code: 'BRG-1' }],
      total: 9.5,
      business_id: 1
    }]
    const { getByTestId } = renderWithProviders(
      <CartContent carts={carts} isOrderStateCarts />
    )
    expect(getByTestId('cart-item')).toBeInTheDocument()
  })
})
