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
