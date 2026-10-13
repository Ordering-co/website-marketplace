import { describe, expect, it } from 'vitest'

import { buildPwaPluginOptions } from '../pwaPluginOptions'

describe('buildPwaPluginOptions', () => {
  it('enables the service worker without a static plugin manifest', () => {
    const options = buildPwaPluginOptions()

    expect(options.disable).toBe(false)
    expect(options.manifest).toBe(false)
    expect(options.injectRegister).toBeNull()
  })

  it('does not let Workbox cache index.html or navigations', () => {
    const { workbox } = buildPwaPluginOptions()

    expect(workbox.globPatterns.join(',')).not.toMatch(/html/i)
    expect(workbox.globIgnores).toEqual(expect.arrayContaining(['**/index.html']))
    expect(workbox.navigateFallback).toBeNull()
    expect(workbox.navigateFallbackDenylist.some((rule) => rule.test('/'))).toBe(true)
    expect(workbox.navigateFallbackDenylist.some((rule) => rule.test('/store/pizza'))).toBe(true)
  })

  it('does not intercept third-party scripts and keeps the SW off in Vite dev', () => {
    const options = buildPwaPluginOptions()
    const thirdPartyUrls = [
      'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
      'https://connect.facebook.net/en_US/fbevents.js'
    ]
    const interceptsThirdParty = (options.workbox.runtimeCaching || []).some((rule) => (
      typeof rule.urlPattern?.test === 'function' &&
      thirdPartyUrls.some((url) => rule.urlPattern.test(url))
    ))

    expect(options.devOptions.enabled).toBe(false)
    expect(options.workbox.runtimeCaching || []).toEqual([])
    expect(interceptsThirdParty).toBe(false)
  })
})
