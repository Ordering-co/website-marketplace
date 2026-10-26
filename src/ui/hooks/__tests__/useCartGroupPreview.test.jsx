import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { clearCartGroupPreviewCache, useCartGroupPreview } from '../useCartGroupPreview'

const state = vi.hoisted(() => ({ carts: {}, token: 'user-token', refreshOrderOptions: null }))

vi.mock('~components/contexts/OrderContext', () => ({
  useOrder: () => [{ carts: state.carts }, { refreshOrderOptions: state.refreshOrderOptions }]
}))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ token: state.token, user: { id: 595 } }]
}))

vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{ root: 'https://api.test', appId: 'web', appInternalName: 'website' }]
}))

const buildCart = (uuid, overrides = {}) => ({
  uuid,
  business_id: uuid.length,
  valid: true,
  status: 0,
  products: [{ id: 1 }],
  total: 105,
  subtotal: 91.43,
  delivery_price_with_discount: 8.57,
  driver_tip: 0,
  group: null,
  ...overrides
})

const respond = (result, error = false) => Promise.resolve({ json: async () => ({ error, result }) })

const setupFetch = (routes) => {
  global.fetch = vi.fn((url, options = {}) => {
    const path = url.replace('https://api.test', '')
    const key = `${options.method || 'GET'} ${path}`
    const handler = routes[key]
    if (!handler) return respond(['NOT_FOUND'], true)
    return typeof handler === 'function' ? handler(options) : respond(handler)
  })
}

const calls = () => global.fetch.mock.calls.map(([url, options = {}]) => `${options.method || 'GET'} ${url.replace('https://api.test', '')}`)

const salad = buildCart('salad', { business_id: 100, total: 69 })
const inkognito = buildCart('inkognito', { business_id: 102 })
const groupResult = {
  uuid: 'group-1',
  total: 165,
  carts: [
    { ...salad },
    { ...inkognito, delivery_price_with_discount: 0, total: 96 }
  ]
}

describe('useCartGroupPreview', () => {
  beforeEach(() => {
    state.token = 'user-token'
    state.carts = { 'businessId:100': salad, 'businessId:102': inkognito }
    state.refreshOrderOptions = vi.fn(() => Promise.resolve())
    clearCartGroupPreviewCache()
  })

  it('registers the carts as a group and returns the group pricing', async () => {
    setupFetch({
      'POST /cart_groups': (options) => {
        expect(JSON.parse(options.body)).toEqual({ carts: ['inkognito', 'salad'] })
        return respond({ uuid: 'group-1' })
      },
      'GET /cart_groups/group-1': groupResult
    })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(result.current.cartGroup?.uuid).toBe('group-1'), { timeout: 2000 })
    expect(calls()).toEqual(['POST /cart_groups', 'GET /cart_groups/group-1'])
    expect(state.refreshOrderOptions).toHaveBeenCalledTimes(1)
  })

  it('loads the first preview right away and reports it as pending until then', async () => {
    setupFetch({ 'POST /cart_groups': { uuid: 'group-1' }, 'GET /cart_groups/group-1': groupResult })
    const { result } = renderHook(() => useCartGroupPreview())
    expect(result.current.isPending).toBe(true)
    expect(result.current.cartGroup).toBeNull()
    await waitFor(() => expect(result.current.cartGroup?.uuid).toBe('group-1'), { timeout: 200 })
    expect(result.current.isPending).toBe(false)
  })

  it('serves a remounted cart from the cached preview without requesting it again', async () => {
    setupFetch({ 'POST /cart_groups': { uuid: 'group-1' }, 'GET /cart_groups/group-1': groupResult })
    const first = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(first.result.current.cartGroup?.uuid).toBe('group-1'), { timeout: 2000 })
    first.unmount()
    global.fetch.mockClear()
    const second = renderHook(() => useCartGroupPreview())
    expect(second.result.current.isPending).toBe(false)
    expect(second.result.current.cartGroup?.uuid).toBe('group-1')
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('waits for the debounce after the carts change once a preview settled', async () => {
    setupFetch({ 'POST /cart_groups': { uuid: 'group-1' }, 'GET /cart_groups/group-1': groupResult })
    const { result, rerender } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(result.current.cartGroup?.uuid).toBe('group-1'), { timeout: 2000 })
    global.fetch.mockClear()
    state.carts = { 'businessId:100': { ...salad, group: { uuid: 'group-1' }, total: 80 }, 'businessId:102': { ...inkognito, group: { uuid: 'group-1' } } }
    rerender()
    expect(result.current.isPending).toBe(true)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(global.fetch).not.toHaveBeenCalled()
    await waitFor(() => expect(global.fetch).toHaveBeenCalled(), { timeout: 1000 })
  })

  it('reuses the group already shared by every cart', async () => {
    state.carts = {
      'businessId:100': { ...salad, group: { uuid: 'group-1' } },
      'businessId:102': { ...inkognito, group: { uuid: 'group-1' } }
    }
    setupFetch({ 'GET /cart_groups/group-1': groupResult })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(result.current.cartGroup?.total).toBe(165), { timeout: 2000 })
    expect(calls()).toEqual(['GET /cart_groups/group-1'])
    expect(state.refreshOrderOptions).not.toHaveBeenCalled()
  })

  it('stays idle with a single cart, when disabled or without session', async () => {
    state.carts = { 'businessId:100': salad }
    setupFetch({})
    const single = renderHook(() => useCartGroupPreview())
    state.carts = { 'businessId:100': salad, 'businessId:102': inkognito }
    const disabled = renderHook(() => useCartGroupPreview({ enabled: false }))
    await new Promise(resolve => setTimeout(resolve, 500))
    state.token = null
    const anonymous = renderHook(() => useCartGroupPreview())
    await new Promise(resolve => setTimeout(resolve, 500))
    expect(single.result.current.cartGroup).toBeNull()
    expect(disabled.result.current.cartGroup).toBeNull()
    expect(anonymous.result.current.cartGroup).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('clears empty carts left in the group before reading its pricing', async () => {
    let reads = 0
    setupFetch({
      'POST /cart_groups': { uuid: 'group-1' },
      'POST /carts/clear': (options) => {
        expect(JSON.parse(options.body)).toEqual({ uuid: 'empty', user_id: 595 })
        return respond({ uuid: 'empty' })
      },
      'GET /cart_groups/group-1': () => {
        reads += 1
        return respond(reads === 1
          ? { ...groupResult, carts: [{ uuid: 'empty', products: [], delivery_price_with_discount: 8.57 }, ...groupResult.carts] }
          : groupResult)
      }
    })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(result.current.cartGroup?.carts).toHaveLength(2), { timeout: 2000 })
    expect(calls()).toEqual(['POST /cart_groups', 'GET /cart_groups/group-1', 'POST /carts/clear', 'GET /cart_groups/group-1'])
    expect(state.refreshOrderOptions).toHaveBeenCalledTimes(1)
  })

  it('registers again when the shared group no longer holds every cart', async () => {
    state.carts = {
      'businessId:100': { ...salad, group: { uuid: 'stale' } },
      'businessId:102': { ...inkognito, group: { uuid: 'stale' } }
    }
    setupFetch({
      'GET /cart_groups/stale': { uuid: 'stale', carts: [salad] },
      'POST /cart_groups': { uuid: 'group-1' },
      'GET /cart_groups/group-1': groupResult
    })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(result.current.cartGroup?.uuid).toBe('group-1'), { timeout: 2000 })
    expect(calls()).toEqual(['GET /cart_groups/stale', 'POST /cart_groups', 'GET /cart_groups/group-1'])
  })

  it('ignores a group that holds carts with products outside the current list', async () => {
    setupFetch({
      'POST /cart_groups': { uuid: 'group-1' },
      'GET /cart_groups/group-1': { ...groupResult, carts: [...groupResult.carts, buildCart('closed', { valid: false })] }
    })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(result.current.cartGroup).toBeNull()
  })

  it('falls back to no group when the group cannot be created', async () => {
    setupFetch({ 'POST /cart_groups': () => respond(['ERROR_MULTIPLE_CART_GROUPS'], true) })
    const { result } = renderHook(() => useCartGroupPreview())
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1), { timeout: 2000 })
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.cartGroup).toBeNull()
    expect(calls()).toEqual(['POST /cart_groups'])
  })
})
