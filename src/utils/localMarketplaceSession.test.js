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
  test('anonymous session may pin while preserving its previous project and cache', () => {
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
