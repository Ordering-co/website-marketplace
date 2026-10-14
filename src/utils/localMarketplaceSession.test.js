import { describe, beforeEach, test, expect } from 'vitest'
import { verifyLocalMarketplaceSession } from './localMarketplaceSession'
describe('local consumer session isolation', () => {
  beforeEach(() => window.localStorage.clear())
  test('foreign and unknown consumer sessions are rejected and preserved', () => {
    window.localStorage.setItem('token', 'consumer-fixture')
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).toThrow(/fresh browser profile/)
    window.localStorage.setItem('project', 'foreign')
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).toThrow()
    expect(window.localStorage.getItem('token')).toBe('consumer-fixture')
  })
  test('empty consumer session may pin a project; same-project session may continue', () => {
    verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)
    window.localStorage.setItem('token', 'consumer-fixture')
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).not.toThrow()
  })
})

describe('conflicting consumer project markers', () => {
  beforeEach(() => window.localStorage.clear())
  test.each([['selected', 'foreign'], ['foreign', 'selected']])(
    'rejects marker %s with stored project %s and preserves all session data',
    (marker, project) => {
      window.localStorage.setItem('marketplace-local-project', marker)
      window.localStorage.setItem('project', project)
      window.localStorage.setItem('token', 'consumer-fixture')
      window.localStorage.setItem('cart', 'cached-cart-fixture')
      const before = { ...window.localStorage }
      expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).toThrow(/fresh browser profile/)
      expect({ ...window.localStorage }).toEqual(before)
    }
  )
  test('matching markers allow the consumer session without modifying caches', () => {
    window.localStorage.setItem('marketplace-local-project', 'selected')
    window.localStorage.setItem('project', 'selected')
    window.localStorage.setItem('token', 'consumer-fixture')
    window.localStorage.setItem('cart', 'cached-cart-fixture')
    const before = { ...window.localStorage }
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).not.toThrow()
    expect({ ...window.localStorage }).toEqual(before)
  })
  test('anonymous session without SDK tenant cache may pin and preserve unrelated entries', () => {
    window.localStorage.setItem('marketplace-local-project', 'foreign')
    window.localStorage.setItem('project', 'foreign')
    window.localStorage.setItem('cart', 'cached-cart-fixture')
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).not.toThrow()
    expect(window.localStorage.getItem('marketplace-local-project')).toBe('selected')
    expect(window.localStorage.getItem('project')).toBe('foreign')
    expect(window.localStorage.getItem('cart')).toBe('cached-cart-fixture')
    expect(window.localStorage.getItem('token')).toBeNull()
  })
})

describe('cached consumer state without a token', () => {
  beforeEach(() => window.localStorage.clear())
  const tenantCaches = [
    ['user-customer', JSON.stringify({ id: 91 })],
    ['options', JSON.stringify({ address: { id: 92, address: 'fixture address' }, type: 1 })],
    ['user', JSON.stringify({ id: 93 })],
    ['device_code', 'fixture-device'],
    ['school_selected_students', JSON.stringify({ 94: '95' })]
  ]
  test.each(tenantCaches.flatMap(([key, value]) => ['foreign', null].map(project => [key, value, project])))(
    'rejects tokenless %s when its tenant is %s and preserves every entry',
    (key, value, project) => {
      if (project) {
        window.localStorage.setItem('project', project)
        window.localStorage.setItem('marketplace-local-project', project)
      }
      window.localStorage.setItem(key, value)
      window.localStorage.setItem('language', 'global-language-fixture')
      window.localStorage.setItem('cart', 'unrelated-cart-fixture')
      const before = { ...window.localStorage }
      expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).toThrow(/fresh browser profile/)
      expect({ ...window.localStorage }).toEqual(before)
      expect(window.localStorage.getItem('token')).toBeNull()
    }
  )
  test.each(tenantCaches)('allows %s cached for the selected tenant', (key, value) => {
    window.localStorage.setItem('project', 'selected')
    window.localStorage.setItem('marketplace-local-project', 'selected')
    window.localStorage.setItem(key, value)
    const before = { ...window.localStorage }
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).not.toThrow()
    expect({ ...window.localStorage }).toEqual(before)
  })
  test('global preferences alone do not block a clean anonymous preview', () => {
    window.localStorage.setItem('language', 'global-language-fixture')
    window.localStorage.setItem('currency', 'global-currency-fixture')
    window.localStorage.setItem('country-code', 'global-country-fixture')
    expect(() => verifyLocalMarketplaceSession({ _local_project_pin: true, project: 'selected' }, window.localStorage)).not.toThrow()
    expect(window.localStorage.getItem('language')).toBe('global-language-fixture')
    expect(window.localStorage.getItem('currency')).toBe('global-currency-fixture')
    expect(window.localStorage.getItem('country-code')).toBe('global-country-fixture')
  })
})
