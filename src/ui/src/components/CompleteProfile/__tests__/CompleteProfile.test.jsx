import { describe, it, expect, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'

import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { CompleteProfile } from '../index'

const sessionMocks = vi.hoisted(() => {
  const refreshUserInfo = vi.fn()
  // Stable tuple: a fresh `user` object each render would loop the [user]-keyed effect.
  return {
    refreshUserInfo,
    tuple: [{ auth: true, user: { id: 1 } }, { refreshUserInfo, login: vi.fn(), logout: vi.fn() }]
  }
})

vi.mock('~components/contexts/SessionContext', () => ({
  useSession: () => sessionMocks.tuple
}))

vi.mock('~ui/src/components/UserDetails', () => ({
  UserDetails: (props) => (
    <div
      data-testid='user-details'
      data-required={JSON.stringify(props.requiredFields)}
      data-checkoutplace={String(props.isCheckoutPlace)}
    />
  )
}))

vi.mock('~ui/src/components/LogoutButton', () => ({
  LogoutButton: () => <div data-testid='logout-button' />
}))

const baseProps = {
  missingFields: ['name'],
  checkoutFields: [{ order_type_id: 1, enabled: true, required: true, validation_field: { code: 'name' } }],
  canSkip: false,
  onSkip: vi.fn()
}

describe('CompleteProfile UI (smoke)', () => {
  it('refresca el user del servidor al montar (evita bloquear con datos obsoletos)', () => {
    sessionMocks.refreshUserInfo.mockClear()
    renderWithProviders(<CompleteProfile {...baseProps} />)
    expect(sessionMocks.refreshUserInfo).toHaveBeenCalledTimes(1)
  })

  it('renderiza el logout y reenvía requiredFields a UserDetails', () => {
    const { getByTestId } = renderWithProviders(<CompleteProfile {...baseProps} />)
    expect(getByTestId('logout-button')).toBeInTheDocument()
    const ud = getByTestId('user-details')
    expect(ud).toHaveAttribute('data-required', JSON.stringify(['name']))
    expect(ud).toHaveAttribute('data-checkoutplace', 'true')
  })

  it('no muestra el botón Skip cuando canSkip es false', () => {
    const { container } = renderWithProviders(<CompleteProfile {...baseProps} canSkip={false} />)
    expect(container.querySelector('button')).toBeNull()
  })

  it('muestra el botón Skip y llama onSkip cuando canSkip es true', () => {
    const onSkip = vi.fn()
    const { container } = renderWithProviders(<CompleteProfile {...baseProps} canSkip onSkip={onSkip} />)
    const skip = container.querySelector('button')
    expect(skip).not.toBeNull()
    fireEvent.click(skip)
    expect(onSkip).toHaveBeenCalled()
  })
})
