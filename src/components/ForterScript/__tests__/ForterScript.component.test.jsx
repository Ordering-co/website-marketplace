import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [{ token: 'tok-1' }]
}))
vi.mock('~components/contexts/ConfigContext', () => ({
  useConfig: () => [{
    configs: {
      braintree_forter_enabled: { value: '1' },
      braintree_forter_site_id: { value: 'forter-site' },
      braintree_forter_environment: { value: 'sandbox' }
    }
  }]
}))

import { ForterScript } from '../index'

describe('ForterScript', () => {
  beforeEach(() => {
    document.getElementById('forter-tti')?.remove()
    document.getElementById('forter-snippet')?.remove()
  })

  it('injects forter scripts when enabled and token is present', () => {
    render(<ForterScript />)
    expect(document.getElementById('forter-tti')).toBeTruthy()
    expect(document.getElementById('forter-snippet')).toBeTruthy()
  })

  it('renders nothing', () => {
    const { container } = render(<ForterScript />)
    expect(container).toBeEmptyDOMElement()
  })
})
