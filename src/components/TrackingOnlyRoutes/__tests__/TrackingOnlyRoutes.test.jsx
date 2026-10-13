import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { Route } from 'react-router-dom'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { TrackingOnlyRoutes } from '../index'

const sessionState = vi.hoisted(() => ({ auth: false, user: null, token: null }))

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => [sessionState, {}]
}))
vi.mock('@loadable/component', () => ({
  default: (loader) => {
    const name = String(loader).includes('TrackingHome') ? 'tracking-home' : 'order-details'
    return () => <div data-testid={name} />
  }
}))

const LocationProbe = () => (
  <Route path='*' render={({ location }) => <div data-testid='location'>{location.pathname}</div>} />
)

const renderAt = (entry) => renderWithProviders(
  <>
    <TrackingOnlyRoutes />
    <LocationProbe />
  </>,
  { initialEntries: [entry] }
)

describe('TrackingOnlyRoutes', () => {
  beforeEach(() => {
    sessionState.auth = false
  })

  it('renders the tracking home on /', () => {
    expect(renderAt('/').getByTestId('tracking-home')).toBeInTheDocument()
  })

  it('renders the tracking home on /home', () => {
    expect(renderAt('/home').getByTestId('tracking-home')).toBeInTheDocument()
  })

  it('renders order details when the link carries a hash', () => {
    const { getByTestId } = renderAt('/orders/123?hash=abc')
    expect(getByTestId('order-details')).toBeInTheDocument()
  })

  it('renders order details for an authenticated user without hash', () => {
    sessionState.auth = true
    const { getByTestId } = renderAt('/orders/123')
    expect(getByTestId('order-details')).toBeInTheDocument()
  })

  it('redirects an order link without hash to the home', () => {
    const { getByTestId, queryByTestId } = renderAt('/orders/123')
    expect(queryByTestId('order-details')).toBeNull()
    expect(getByTestId('location').textContent).toBe('/')
    expect(getByTestId('tracking-home')).toBeInTheDocument()
  })

  it('redirects any other route to the home', () => {
    const { getByTestId } = renderAt('/store/some-business')
    expect(getByTestId('location').textContent).toBe('/')
    expect(getByTestId('tracking-home')).toBeInTheDocument()
  })
})
