import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGuestCheckoutPermission } from '../useGuestCheckoutPermission'

const props = {
  configs: {
    guest_checkout_enabled: { value: '1' },
    allowed_order_types_guest_checkout: { value: 'delivery' }
  },
  orderType: 1,
  user: { id: 1, guest_id: 'guest-1' }
}

describe('useGuestCheckoutPermission', () => {
  it('revalidates retained callbacks after permission or order type changes', () => {
    const { result, rerender, unmount } = renderHook(useGuestCheckoutPermission, { initialProps: props })
    const { canPlaceOrder, canUseGuestCheckout } = result.current
    expect(canPlaceOrder()).toBe(true)
    rerender({ ...props, orderType: 2 })
    expect(canPlaceOrder()).toBe(false)
    expect(canUseGuestCheckout()).toBe(false)
    rerender({ ...props, configs: {} })
    expect(canPlaceOrder()).toBe(false)
    rerender(props)
    expect(canPlaceOrder()).toBe(true)
    unmount()
    expect(canPlaceOrder()).toBe(false)
  })

  it('preserves registered checkout and the account-required layout policy', () => {
    const { result, rerender } = renderHook(useGuestCheckoutPermission, { initialProps: props })
    rerender({ ...props, requiresAccount: true })
    expect(result.current.canPlaceOrder()).toBe(false)
    expect(result.current.canPlaceOrder(true)).toBe(false)
    rerender({ ...props, configs: {}, user: { id: 2 } })
    expect(result.current.canPlaceOrder()).toBe(true)
    expect(result.current.canPlaceOrder(true)).toBe(true)
    expect(result.current.canUseGuestCheckout()).toBe(false)
  })

  it('blocks retained guest-only callbacks when the guest permission is revoked', () => {
    const { result, rerender } = renderHook(useGuestCheckoutPermission, { initialProps: props })
    const retainedPlaceGuestOrder = result.current.canPlaceOrder
    rerender({ ...props, configs: {} })
    expect(retainedPlaceGuestOrder(true)).toBe(false)
    rerender({ ...props, user: { id: 2 }, configs: {} })
    expect(retainedPlaceGuestOrder(true)).toBe(true)
  })
})
