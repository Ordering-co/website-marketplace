import { describe, expect, it } from 'vitest'
import { isGuestCheckoutAllowed } from '../guestCheckout'

const configs = (enabled, types) => ({
  guest_checkout_enabled: { value: enabled },
  allowed_order_types_guest_checkout: { value: types }
})

describe('guest checkout permission', () => {
  it.each([undefined, '0', 0, false, 'false'])('denies disabled or missing flag %s', enabled => {
    expect(isGuestCheckoutAllowed(configs(enabled, 'delivery'), 1)).toBe(false)
  })

  it.each(['1', 1, true])('accepts enabled flag %s from effective configs', enabled => {
    expect(isGuestCheckoutAllowed(configs(enabled, 'delivery'), 1)).toBe(true)
  })

  it.each(['delivery|pickup', 'delivery, pickup', ['delivery', 'pickup']])('accepts supported type lists %s', types => {
    expect(isGuestCheckoutAllowed(configs('1', types), 2)).toBe(true)
  })

  it('matches complete tokens and includes catering types', () => {
    const settings = configs('1', 'seatdelivery|catering_delivery|catering_pickup')
    expect(isGuestCheckoutAllowed(settings, 1)).toBe(false)
    expect(isGuestCheckoutAllowed(settings, 6)).toBe(true)
    expect(isGuestCheckoutAllowed(settings, 7)).toBe(true)
    expect(isGuestCheckoutAllowed(settings, 8)).toBe(true)
  })

  it('does not implicitly authorize missing, malformed or unknown types', () => {
    expect(isGuestCheckoutAllowed(configs('1'), 1)).toBe(false)
    expect(isGuestCheckoutAllowed(configs('1', {}), 1)).toBe(false)
    expect(isGuestCheckoutAllowed(configs('1', 'delivery'), undefined)).toBe(false)
    expect(isGuestCheckoutAllowed(configs('1', 'delivery'), 9)).toBe(false)
  })
})
