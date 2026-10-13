import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'

import { mockFetch, mockFetchError } from '../../../__tests__/helpers/testUtils'
import { CheckoutFieldsProvider, useProfileCompletion } from '../index'

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  useConfig: vi.fn(),
  useApi: vi.fn()
}))

vi.mock('~components/contexts/SessionContext', () => ({ useSession: mocks.useSession }))
vi.mock('~components/contexts/ConfigContext', () => ({ useConfig: mocks.useConfig }))
vi.mock('~components/contexts/ApiContext', () => ({ useApi: mocks.useApi }))

const field = (code, overrides = {}) => ({
  order_type_id: 1,
  enabled: true,
  required: true,
  validation_field: { code },
  ...overrides
})

const setSession = (session) => mocks.useSession.mockReturnValue([session, { login: vi.fn(), logout: vi.fn() }])
const setConfigs = (configs, loading = false) => mocks.useConfig.mockReturnValue([{ configs, loading }])

const wrapper = ({ children }) => <CheckoutFieldsProvider>{children}</CheckoutFieldsProvider>

describe('useProfileCompletion (web)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useApi.mockReturnValue([{ root: 'https://api.test' }])
    setConfigs({ default_order_type: { value: 'delivery' } })
    mockFetch({ error: false, result: [] })
  })

  it('nunca gatea a un invitado y no dispara el fetch', async () => {
    setSession({ auth: true, user: { id: 1, guest_id: 'g1' }, token: 'tok' })
    mockFetch({ error: false, result: [field('name')] })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRequired).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('no gatea a un usuario no autenticado', async () => {
    setSession({ auth: false, user: null, token: null })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRequired).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('gatea cuando faltan campos requeridos del default order type', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' })
    mockFetch({ error: false, result: [field('name'), field('lastname')] })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.isRequired).toBe(true))
    expect(result.current.missingFields).toEqual(['name', 'lastname'])
    const codes = result.current.checkoutFields.map((f) => f?.validation_field?.code)
    expect(codes).toEqual(['name', 'lastname'])
  })

  it('no gatea a un usuario con todos los campos completos', async () => {
    setSession({ auth: true, user: { id: 7, name: 'Carlos', lastname: 'Gomez' }, token: 'tok' })
    mockFetch({ error: false, result: [field('name'), field('lastname')] })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRequired).toBe(false)
    expect(result.current.missingFields).toEqual([])
  })

  it('fail-open: si el fetch falla, no gatea', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' })
    mockFetchError('network down')

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.isRequired).toBe(false)
  })

  it('fail-open: mientras carga, no gatea', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' })
    global.fetch = vi.fn(() => new Promise(() => {})) // nunca resuelve

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(true))
    expect(result.current.isRequired).toBe(false)
  })

  it('skip() desactiva el gate en la sesión actual', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' })
    mockFetch({ error: false, result: [field('name')] })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.isRequired).toBe(true))
    act(() => { result.current.skip() })
    await waitFor(() => expect(result.current.isRequired).toBe(false))
  })

  it('canSkip refleja el flag profile_completion_skip_enabled', async () => {
    setSession({ auth: true, user: { id: 7 }, token: 'tok' })
    setConfigs({ default_order_type: { value: 'delivery' }, profile_completion_skip_enabled: { value: '1' } })
    mockFetch({ error: false, result: [field('name')] })

    const { result } = renderHook(() => useProfileCompletion(), { wrapper })

    await waitFor(() => expect(result.current.canSkip).toBe(true))
  })
})
