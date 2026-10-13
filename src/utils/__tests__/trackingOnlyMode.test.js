import { describe, expect, it } from 'vitest'
import { isTrackingOnlyEnabled, resolveTrackingOnly, isCourierTrackingProject } from '../trackingOnlyMode'

describe('isTrackingOnlyEnabled', () => {
  it('treats true, 1, "1" and "true" as enabled', () => {
    expect(isTrackingOnlyEnabled(true)).toBe(true)
    expect(isTrackingOnlyEnabled(1)).toBe(true)
    expect(isTrackingOnlyEnabled('1')).toBe(true)
    expect(isTrackingOnlyEnabled('true')).toBe(true)
  })

  it('treats missing, false, 0, "0" and "false" as disabled', () => {
    expect(isTrackingOnlyEnabled(undefined)).toBe(false)
    expect(isTrackingOnlyEnabled(null)).toBe(false)
    expect(isTrackingOnlyEnabled(false)).toBe(false)
    expect(isTrackingOnlyEnabled(0)).toBe(false)
    expect(isTrackingOnlyEnabled('0')).toBe(false)
    expect(isTrackingOnlyEnabled('false')).toBe(false)
    expect(isTrackingOnlyEnabled('')).toBe(false)
  })
})

describe('resolveTrackingOnly', () => {
  it('reads the site theme advanced setting', () => {
    expect(resolveTrackingOnly({ tracking_settings: { tracking_only: true } })).toBe(true)
    expect(resolveTrackingOnly({ tracking_settings: { tracking_only: false } })).toBe(false)
  })

  it('is disabled when the theme has no setting', () => {
    expect(resolveTrackingOnly({})).toBe(false)
    expect(resolveTrackingOnly(null)).toBe(false)
    expect(resolveTrackingOnly()).toBe(false)
  })
})

describe('isCourierTrackingProject', () => {
  it('matches the listed courier projects', () => {
    expect(isCourierTrackingProject('quickiedelivery')).toBe(true)
    expect(isCourierTrackingProject('quickiedeliverystaging')).toBe(true)
  })

  it('ignores other projects and missing values', () => {
    expect(isCourierTrackingProject('luisv4plus')).toBe(false)
    expect(isCourierTrackingProject('')).toBe(false)
    expect(isCourierTrackingProject(null)).toBe(false)
    expect(isCourierTrackingProject()).toBe(false)
  })
})
