import { useCallback, useEffect, useRef } from 'react'
import { isGuestCheckoutAllowed } from '../../utils/guestCheckout'

export const useGuestCheckoutPermission = ({ configs, orderType, user, requiresAccount = false }) => {
  const guestCheckoutAllowed = !requiresAccount && isGuestCheckoutAllowed(configs, orderType)
  const guestOrderBlocked = !!user?.guest_id && !guestCheckoutAllowed
  const permission = useRef(null)
  const mounted = useRef(true)
  permission.current = { guestCheckoutAllowed, guestOrderBlocked, user }

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // Payment screens and pending profile saves can retain callbacks across renders.
  const canUseGuestCheckout = useCallback(() => mounted.current && permission.current.guestCheckoutAllowed, [])
  const canPlaceOrder = useCallback((asGuest = false) => {
    if (!mounted.current) return false
    const { guestCheckoutAllowed, guestOrderBlocked, user: currentUser } = permission.current
    if (guestOrderBlocked) return false
    if (asGuest && (currentUser?.guest_id || !currentUser)) return guestCheckoutAllowed
    return true
  }, [])

  return { guestCheckoutAllowed, guestOrderBlocked, canUseGuestCheckout, canPlaceOrder }
}
