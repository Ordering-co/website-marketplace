import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBusinessVerticals } from '../useBusinessVerticals'

const api = vi.hoisted(() => ({
  verticals: {},
  get: vi.fn()
}))

vi.mock('~components/contexts/ApiContext', () => ({
  useApi: () => [{
    businesses: (id) => ({
      select: () => ({
        get: () => {
          api.get(id)
          const vertical = api.verticals[id]
          return Promise.resolve({ content: { error: vertical === undefined, result: vertical === undefined ? ['NOT_FOUND'] : { id, vertical } } })
        }
      })
    })
  }]
}))

describe('useBusinessVerticals', () => {
  beforeEach(() => {
    api.get.mockReset()
    api.verticals = { 3169: 'school', 3103: 'school', 2: 'food' }
  })

  it('resolves the vertical of every requested business', async () => {
    const { result } = renderHook(() => useBusinessVerticals([3169, 2]))
    await waitFor(() => expect(result.current).toEqual({ 3169: 'school', 2: 'food' }))
  })

  it('does not request the same business twice', async () => {
    const { result, rerender } = renderHook(({ ids }) => useBusinessVerticals(ids), { initialProps: { ids: [3103] } })
    await waitFor(() => expect(result.current).toEqual({ 3103: 'school' }))
    rerender({ ids: [3103, 3169] })
    await waitFor(() => expect(result.current).toEqual({ 3103: 'school', 3169: 'school' }))
    expect(api.get.mock.calls.filter(([id]) => id === 3103)).toHaveLength(1)
  })

  it('omits businesses the API cannot resolve', async () => {
    const { result } = renderHook(() => useBusinessVerticals([999, 2]))
    await waitFor(() => expect(result.current).toEqual({ 2: 'food' }))
  })

  it('returns an empty map without ids', () => {
    const { result } = renderHook(() => useBusinessVerticals([]))
    expect(result.current).toEqual({})
    expect(api.get).not.toHaveBeenCalled()
  })
})
