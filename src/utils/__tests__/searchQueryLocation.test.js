import { describe, expect, it } from 'vitest'
import {
  appendLocationToSearch,
  formatSearchQueryLocation,
  hasValidSearchLocation,
  parseSearchQueryLocation,
  resolveSearchQuery,
  stripLocationSearchParams
} from '../searchQueryLocation'

describe('searchQueryLocation', () => {
  it('parseSearchQueryLocation returns lat/lng from search string', () => {
    expect(parseSearchQueryLocation('?lat=40.7&lng=-74.0')).toEqual({ lat: 40.7, lng: -74 })
    expect(parseSearchQueryLocation('')).toBeNull()
    expect(parseSearchQueryLocation('?lat=bad&lng=1')).toBeNull()
    expect(parseSearchQueryLocation('?lat=0&lng=0')).toBeNull()
  })

  it('formatSearchQueryLocation normalizes location objects', () => {
    expect(formatSearchQueryLocation({ lat: '10.5', lng: '20.25' })).toEqual({ lat: 10.5, lng: 20.25 })
    expect(formatSearchQueryLocation(null)).toBeNull()
  })

  it('hasValidSearchLocation delegates to formatSearchQueryLocation', () => {
    expect(hasValidSearchLocation({ lat: 1, lng: 2 })).toBe(true)
    expect(hasValidSearchLocation({ lat: 0, lng: 0 })).toBe(false)
  })

  it('appendLocationToSearch merges lat/lng into query', () => {
    expect(appendLocationToSearch('?foo=bar', { lat: 1, lng: 2 })).toBe('?foo=bar&lat=1&lng=2')
    expect(appendLocationToSearch('', { lat: 0, lng: 0 })).toBe('')
  })

  it('resolveSearchQuery keeps existing search when order location is valid', () => {
    expect(resolveSearchQuery('?q=pizza', { lat: 1, lng: 2 }, null)).toBe('?q=pizza')
    expect(resolveSearchQuery('', { lat: 1, lng: 2 }, null)).toBe('')
  })

  it('resolveSearchQuery appends fallback when order location is invalid', () => {
    expect(resolveSearchQuery('?q=pizza', null, { lat: 3, lng: 4 })).toBe('?q=pizza&lat=3&lng=4')
  })

  it('stripLocationSearchParams removes geo and order_type params', () => {
    expect(stripLocationSearchParams('?lat=1&lng=2&order_type=1&keep=yes')).toBe('?keep=yes')
    expect(stripLocationSearchParams('')).toBe('')
  })
})
