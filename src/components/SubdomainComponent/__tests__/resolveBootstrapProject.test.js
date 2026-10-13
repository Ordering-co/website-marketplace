import { describe, expect, it } from 'vitest'
import {
  projectFromHostname,
  resolveBootstrapProject,
  resolveCurrentLookupProject
} from '../resolveBootstrapProject'

describe('projectFromHostname', () => {
  it('strips the v26- prefix used by orderingplus preview hosts', () => {
    expect(projectFromHostname('v26-orderingv1.orderingplus.com')).toBe('orderingv1')
  })

  it('uses the first label on a normal tenant subdomain', () => {
    expect(projectFromHostname('demo.orderingplus.com')).toBe('demo')
  })
})

describe('resolveBootstrapProject', () => {
  const productionFlags = {
    project: 'orderingplus',
    use_project_domain: true,
    use_project_subdomain: true
  }

  it('uses the hostname slug immediately when worker config is missing', () => {
    expect(resolveBootstrapProject({
      workerProject: null,
      hostname: 'v26-orderingv1.orderingplus.com',
      settings: productionFlags,
      storedProject: null
    })).toBe('orderingv1')
  })

  it('prefers the worker-injected project over the hostname', () => {
    expect(resolveBootstrapProject({
      workerProject: 'worker-project',
      hostname: 'v26-orderingv1.orderingplus.com',
      settings: productionFlags,
      storedProject: null
    })).toBe('worker-project')
  })

  it('does not bootstrap as the string null', () => {
    expect(resolveBootstrapProject({
      workerProject: null,
      hostname: 'localhost',
      settings: {
        project: 'null',
        use_project_domain: true,
        use_project_subdomain: false
      },
      storedProject: 'null'
    })).toBeNull()
  })

  it('falls back to settings.project on localhost when domain mode is on', () => {
    expect(resolveBootstrapProject({
      workerProject: null,
      hostname: 'localhost',
      settings: {
        project: 'testproject',
        use_project_domain: true,
        use_project_subdomain: false
      },
      storedProject: null
    })).toBe('testproject')
  })
})

describe('resolveCurrentLookupProject', () => {
  it('looks up /current with the hostname slug on orderingplus preview hosts', () => {
    expect(resolveCurrentLookupProject({
      hostname: 'v26-orderingv1.orderingplus.com',
      settings: {
        project: 'orderingplus',
        use_project_domain: true,
        use_project_subdomain: true
      },
      storedProject: null
    })).toBe('orderingv1')
  })
})
