import { useEffect, useMemo, useRef, useState } from 'react'
import { useApi } from '~components/contexts/ApiContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'

export const CART_GROUP_PREVIEW_DELAY_MS = 400
const PREVIEW_CACHE_LIMIT = 20

const inFlightPreviews = new Map()
const previewCache = new Map()

const cachePreview = (key, group) => {
  previewCache.delete(key)
  previewCache.set(key, group)
  if (previewCache.size > PREVIEW_CACHE_LIMIT) previewCache.delete(previewCache.keys().next().value)
}

export const clearCartGroupPreviewCache = () => previewCache.clear()

const getGroupableCarts = (carts) => Object.values(carts || {})
  .filter(cart => cart?.valid && cart?.status !== 2 && cart?.business_id && cart?.products?.length > 0)

const getCartSignature = (cart) => [
  cart?.uuid,
  cart?.products?.length,
  cart?.subtotal,
  cart?.total,
  cart?.delivery_price_with_discount,
  cart?.driver_tip,
  cart?.driver_tip_rate
].join(':')

const hasProducts = (cart) => cart?.products?.length > 0

const getGroupCartUuids = (group) => (group?.carts || []).filter(hasProducts).map(cart => cart?.uuid).sort()

const coversExactly = (group, cartUuids) => {
  const groupUuids = getGroupCartUuids(group)
  return groupUuids.length === cartUuids.length && groupUuids.every((uuid, index) => uuid === cartUuids[index])
}

const missesCarts = (group, cartUuids) => {
  const groupUuids = getGroupCartUuids(group)
  return cartUuids.some(uuid => !groupUuids.includes(uuid))
}

export const useCartGroupPreview = ({ enabled = true } = {}) => {
  const [ordering] = useApi()
  const [{ token, user }] = useSession()
  const [orderState, { refreshOrderOptions } = {}] = useOrder()
  const [result, setResult] = useState({ key: null, group: null })
  const registeredGroupRef = useRef({ cartsKey: null, uuid: null })
  const hasSettledRef = useRef(false)

  const groupableCarts = useMemo(() => getGroupableCarts(orderState?.carts), [orderState?.carts])
  const cartUuids = useMemo(() => groupableCarts.map(cart => cart.uuid).sort(), [groupableCarts])
  const cartsKey = cartUuids.join('|')
  const signature = useMemo(() => groupableCarts.map(getCartSignature).sort().join('|'), [groupableCarts])
  const isActive = enabled && !!token && cartUuids.length > 1
  const previewKey = isActive ? `${token}|${signature}` : null

  const latestRef = useRef({})
  latestRef.current = { groupableCarts, cartUuids, cartsKey }
  const refreshOrderOptionsRef = useRef(refreshOrderOptions)
  refreshOrderOptionsRef.current = refreshOrderOptions

  useEffect(() => {
    if (!previewKey || previewCache.has(previewKey)) return

    let cancelled = false
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'X-App-X': ordering?.appId,
      'X-INTERNAL-PRODUCT-X': ordering?.appInternalName
    }

    const request = async (path, options = {}) => {
      const response = await fetch(`${ordering.root}${path}`, { ...options, headers })
      const { error, result } = await response.json()
      if (error) throw new Error(Array.isArray(result) ? result.join(', ') : String(result))
      return result
    }

    const registerGroup = async (uuids) => {
      const group = await request('/cart_groups', { method: 'POST', body: JSON.stringify({ carts: uuids }) })
      return group?.uuid
    }

    const resolveGroupUuid = async ({ groupableCarts, cartUuids, cartsKey }) => {
      const sharedUuid = groupableCarts[0]?.group?.uuid
      if (sharedUuid && groupableCarts.every(cart => cart?.group?.uuid === sharedUuid)) return sharedUuid
      if (registeredGroupRef.current.cartsKey === cartsKey && registeredGroupRef.current.uuid) return registeredGroupRef.current.uuid
      return registerGroup(cartUuids)
    }

    const clearEmptyCarts = async (group) => {
      const emptyCarts = (group?.carts || []).filter(cart => !hasProducts(cart))
      if (!emptyCarts.length) return false
      await Promise.all(emptyCarts.map(cart => request('/carts/clear', {
        method: 'POST',
        body: JSON.stringify({ uuid: cart.uuid, user_id: user?.id })
      })))
      return true
    }

    const loadPreview = async (snapshot) => {
      let groupUuid = await resolveGroupUuid(snapshot)
      let group = groupUuid ? await request(`/cart_groups/${groupUuid}`).catch(() => null) : null
      if (!group || missesCarts(group, snapshot.cartUuids)) {
        groupUuid = await registerGroup(snapshot.cartUuids)
        group = await request(`/cart_groups/${groupUuid}`)
      }
      const clearedCarts = await clearEmptyCarts(group)
      if (clearedCarts) {
        group = await request(`/cart_groups/${groupUuid}`)
      }
      const priced = coversExactly(group, snapshot.cartUuids) ? group : null
      if (priced) cachePreview(previewKey, priced)
      const isContextOutdated = clearedCarts || snapshot.groupableCarts.some(cart => cart?.group?.uuid !== groupUuid)
      if (isContextOutdated && refreshOrderOptionsRef.current) {
        await refreshOrderOptionsRef.current()
      }
      return { groupUuid, group: priced }
    }

    const timer = setTimeout(async () => {
      const snapshot = latestRef.current
      try {
        if (!inFlightPreviews.has(previewKey)) {
          inFlightPreviews.set(previewKey, loadPreview(snapshot).finally(() => inFlightPreviews.delete(previewKey)))
        }
        const { groupUuid, group } = await inFlightPreviews.get(previewKey)
        if (cancelled) return
        registeredGroupRef.current = { cartsKey: snapshot.cartsKey, uuid: groupUuid }
        setResult({ key: previewKey, group })
      } catch (err) {
        if (cancelled) return
        registeredGroupRef.current = { cartsKey: null, uuid: null }
        setResult({ key: previewKey, group: null })
      } finally {
        if (!cancelled) hasSettledRef.current = true
      }
    }, hasSettledRef.current ? CART_GROUP_PREVIEW_DELAY_MS : 0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [previewKey, token, user?.id, ordering?.root, ordering?.appId, ordering?.appInternalName])

  const settledGroup = previewKey && previewCache.has(previewKey)
    ? previewCache.get(previewKey)
    : (result.key === previewKey ? result.group : undefined)

  const cartGroup = useMemo(
    () => (previewKey && settledGroup && coversExactly(settledGroup, cartUuids) ? settledGroup : null),
    [previewKey, settledGroup, cartUuids]
  )
  const isPending = !!previewKey && settledGroup === undefined

  return { cartGroup, isPending, loading: isPending }
}
