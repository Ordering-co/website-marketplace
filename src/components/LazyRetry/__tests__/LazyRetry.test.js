import { describe, expect, it, vi, beforeEach } from 'vitest'
import { waitFor } from '@testing-library/react'
import { lazyRetry } from '../index'

describe('lazyRetry', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('resolves when dynamic import succeeds', async () => {
    const module = { default: () => null }
    const componentImport = () => Promise.resolve(module)
    await expect(lazyRetry(componentImport)).resolves.toBe(module)
    expect(window.sessionStorage.getItem(`retry-lazy-refreshed:${componentImport.toString()}`)).toBe('false')
  })

  it('triggers reload on first import failure', async () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })
    const failingImport = () => Promise.reject(new Error('chunk failed'))

    lazyRetry(failingImport)
    await waitFor(() => {
      expect(window.sessionStorage.getItem(`retry-lazy-refreshed:${failingImport.toString()}`)).toBe('true')
    })
    expect(reload).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it('rejects when import fails after refresh flag is set', async () => {
    const failingImport = () => Promise.reject(new Error('chunk failed'))
    window.sessionStorage.setItem(`retry-lazy-refreshed:${failingImport.toString()}`, 'true')
    await expect(lazyRetry(failingImport)).rejects.toThrow('chunk failed')
  })

  it('does not share the refresh flag across different chunks', async () => {
    const reload = vi.fn()
    vi.stubGlobal('location', { reload })
    const chunkA = () => Promise.reject(new Error('chunk A failed'))
    const chunkB = () => Promise.resolve({ default: () => null })

    lazyRetry(chunkA)
    await waitFor(() => {
      expect(window.sessionStorage.getItem(`retry-lazy-refreshed:${chunkA.toString()}`)).toBe('true')
    })
    expect(reload).toHaveBeenCalledTimes(1)

    await expect(lazyRetry(chunkB)).resolves.toEqual({ default: expect.any(Function) })
    expect(window.sessionStorage.getItem(`retry-lazy-refreshed:${chunkA.toString()}`)).toBe('true')
    expect(window.sessionStorage.getItem(`retry-lazy-refreshed:${chunkB.toString()}`)).toBe('false')
    vi.unstubAllGlobals()
  })
})
