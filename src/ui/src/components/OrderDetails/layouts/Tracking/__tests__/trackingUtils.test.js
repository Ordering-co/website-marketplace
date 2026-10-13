import { describe, expect, it } from 'vitest'
import {
  getTrackingStep,
  getTrackingPercentage,
  canShowLiveMap,
  getDriverPlate,
  getDriverVehicle,
  getOrderEtaRange,
  getTrackingMarkerIcons,
  getTrackingSurveyImage,
  isRejectedStatus,
  isCompletedStatus,
  isDeliveredStatus,
  toLangKey,
  formatRate
} from '../trackingUtils'

describe('getTrackingStep', () => {
  it('collapses the order statuses into the four tracking steps', () => {
    [0, 3, 4, 7, 8, 14, 18, 22, 24, 25].forEach((status) => expect(getTrackingStep(status)).toBe(0))
    ;[9, 19, 23].forEach((status) => expect(getTrackingStep(status)).toBe(1))
    expect(getTrackingStep(26)).toBe(2)
    ;[1, 11, 15].forEach((status) => expect(getTrackingStep(status)).toBe(3))
    expect(getTrackingStep('23')).toBe(1)
    expect(getTrackingStep(99)).toBe(0)
  })

  it('fills the bar by thirds', () => {
    expect(getTrackingPercentage(0)).toBe(0)
    expect(getTrackingPercentage(1)).toBeCloseTo(33.33, 1)
    expect(getTrackingPercentage(3)).toBe(100)
  })
})

describe('status helpers', () => {
  it('detects rejected, completed and delivered statuses', () => {
    expect(isRejectedStatus(2)).toBe(true)
    expect(isRejectedStatus('16')).toBe(true)
    expect(isRejectedStatus(23)).toBe(false)
    expect(isCompletedStatus(11)).toBe(true)
    expect(isCompletedStatus(17)).toBe(true)
    expect(isCompletedStatus(23)).toBe(false)
    expect(isDeliveredStatus(11)).toBe(true)
    expect(isDeliveredStatus(2)).toBe(false)
  })
})

describe('canShowLiveMap', () => {
  it('requires a driver location and a tracking status', () => {
    expect(canShowLiveMap({ status: 23 }, { lat: 1, lng: 2 })).toBe(true)
    expect(canShowLiveMap({ status: 0 }, { lat: 1, lng: 2 })).toBe(false)
    expect(canShowLiveMap({ status: 23 }, null)).toBe(false)
  })
})

describe('driver helpers', () => {
  it('reads the plate from the vehicle, the car, the driver or its metafields', () => {
    expect(getDriverPlate({ vehicle: { plate: 'VEH-1' }, plate: 'ABC-123' })).toBe('VEH-1')
    expect(getDriverPlate({ car: { plate: 'CAR-1' } })).toBe('CAR-1')
    expect(getDriverPlate({ plate: 'ABC-123' })).toBe('ABC-123')
    expect(getDriverPlate({ metafields: [{ key: 'plate', value: 'XYZ-9' }] })).toBe('XYZ-9')
    expect(getDriverPlate({ metafields: [] })).toBeNull()
    expect(getDriverPlate(null)).toBeNull()
  })

  it('reads the vehicle name', () => {
    expect(getDriverVehicle({ vehicle: { name: 'Moto' } })).toBe('Moto')
    expect(getDriverVehicle({ vehicle_type: 'bike' })).toBe('bike')
    expect(getDriverVehicle({})).toBeNull()
  })
})

describe('getOrderEtaRange', () => {
  it('adds the offered time to the order time and opens a ten minute window', () => {
    const range = getOrderEtaRange({ delivery_datetime_utc: '2026-09-09 15:00:00', eta_time: 25 })
    expect(range.startUtc.format('HH:mm')).toBe('15:25')
    expect(range.endUtc.format('HH:mm')).toBe('15:35')
  })

  it('accepts a custom range and returns null without a base date', () => {
    const range = getOrderEtaRange({ delivery_datetime: '2026-09-09 15:00:00' }, 20)
    expect(range.endUtc.format('HH:mm')).toBe('15:20')
    expect(getOrderEtaRange({})).toBeNull()
  })
})

describe('theme images', () => {
  const baseTheme = {
    images: {
      general: { driverPng: '/driver-default.png', mapPin: '/customer-default.png' },
      dummies: { businessLogo: '/store-default.png' }
    }
  }

  it('falls back to the site defaults and the business logo', () => {
    const icons = getTrackingMarkerIcons(baseTheme, { business: { logo: '/burger-logo.png' } })
    expect(icons).toEqual({ driver: '/driver-default.png', business: '/burger-logo.png', customer: '/customer-default.png' })
    expect(getTrackingMarkerIcons(baseTheme, { business: {} }).business).toBe('/store-default.png')
    expect(getTrackingSurveyImage(baseTheme, { business: { logo: '/burger-logo.png' } })).toBe('/burger-logo.png')
    expect(getTrackingSurveyImage(baseTheme, {})).toBeNull()
  })

  it('prefers images configured in the site theme', () => {
    const theme = {
      ...baseTheme,
      my_products: {
        components: {
          images: {
            components: {
              tracking_driver_icon: { components: { image: '/moto.png' } },
              tracking_store_icon: { components: { image: '/brand-store.png' } },
              tracking_customer_icon: { components: { image: ' ' } },
              tracking_survey_image: { components: { image: '/bag.png' } }
            }
          }
        }
      }
    }
    const icons = getTrackingMarkerIcons(theme, { business: { logo: '/burger-logo.png' } })
    expect(icons).toEqual({ driver: '/moto.png', business: '/brand-store.png', customer: '/customer-default.png' })
    expect(getTrackingSurveyImage(theme, { business: { logo: '/burger-logo.png' } })).toBe('/bag.png')
  })
})

describe('text helpers', () => {
  it('turns arbitrary names into language keys and formats rates', () => {
    expect(toLangKey('Pago Póst-venta')).toBe('PAGO_POST_VENTA')
    expect(toLangKey(undefined)).toBeUndefined()
    expect(formatRate(18)).toBe(18)
    expect(formatRate('7.5')).toBe('7.50')
    expect(formatRate(null)).toBe(0)
  })
})
