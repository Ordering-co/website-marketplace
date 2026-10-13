import { describe, expect, it, vi } from 'vitest'

import { registerPwaServiceWorker } from '../registerPwaServiceWorker'

describe('registerPwaServiceWorker', () => {
  it('registers immediately when the Vite helper is available', () => {
    const unregister = vi.fn()
    const registerSW = vi.fn(() => unregister)

    expect(registerPwaServiceWorker(registerSW)).toBe(unregister)
    expect(registerSW).toHaveBeenCalledWith({ immediate: true })
  })

  it('skips registration when the service worker is disabled', () => {
    const registerSW = vi.fn()

    expect(registerPwaServiceWorker(registerSW, { enabled: false })).toBeUndefined()
    expect(registerSW).not.toHaveBeenCalled()
  })

  it('does not throw when the Vite helper is missing', () => {
    expect(registerPwaServiceWorker()).toBeUndefined()
    expect(registerPwaServiceWorker(() => {
      throw new Error('virtual module unavailable')
    })).toBeUndefined()
  })
})
