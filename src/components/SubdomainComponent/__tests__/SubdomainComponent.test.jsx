import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SubdomainComponent } from '../index'

vi.mock('../../../config', () => ({
  default: {
    project: 'testproject',
    use_project_domain: true,
    use_project_subdomain: false,
    project_error_redirect_url: 'https://error.example.com',
    api: { url: 'https://api.example.com', language: 'en', version: 'v1' }
  }
}))

const Child = ({ settings }) => (
  <div data-testid='child-project'>{settings?.project}</div>
)

describe('SubdomainComponent', () => {
  beforeEach(() => {
    window.__CONFIG__ = undefined
    window.localStorage.clear()
    global.fetch = vi.fn(() => Promise.resolve({
      json: async () => ({ error: false, result: { code: 'resolved-project' } })
    }))
  })

  it('clones child with resolved project from settings when worker config is absent', async () => {
    render(
      <SubdomainComponent>
        <Child />
      </SubdomainComponent>
    )

    await waitFor(() => {
      expect(screen.getByTestId('child-project').textContent).toBe('resolved-project')
    })
  })

  it('prefers worker-resolved project from window.__CONFIG__', () => {
    window.__CONFIG__ = { project: 'worker-project' }

    render(
      <SubdomainComponent>
        <Child />
      </SubdomainComponent>
    )

    expect(screen.getByTestId('child-project').textContent).toBe('worker-project')
  })

  it('does not mount children with a null project while /current is in flight', async () => {
    render(
      <SubdomainComponent>
        <Child />
      </SubdomainComponent>
    )

    expect(screen.getByTestId('child-project').textContent).toBe('testproject')
    await waitFor(() => {
      expect(screen.getByTestId('child-project').textContent).toBe('resolved-project')
    })
  })
})
