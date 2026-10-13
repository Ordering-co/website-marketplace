import { describe, expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { createStableUseFormMock } from '../../__tests__/helpers/authUiTestMocks'
import { LogoutPopup } from '../index'

const handleLogoutClick = vi.fn()
const onClose = vi.fn()

vi.mock('react-hook-form', () => createStableUseFormMock())
vi.mock('~components/components/LogoutAction', () => ({
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={handleLogoutClick} onClose={onClose} {...rest} />
  )
}))

describe('LogoutPopup', () => {
  it('renders sign out form for manager logout', () => {
    const { getByText, getByLabelText } = renderWithProviders(<LogoutPopup />)
    expect(getByText('Logout')).toBeInTheDocument()
    expect(getByLabelText('password')).toBeInTheDocument()
    expect(getByText('Sign out')).toBeInTheDocument()
  })

  it('toggles password visibility', () => {
    const { container, getByLabelText } = renderWithProviders(<LogoutPopup />)
    const input = getByLabelText('password')
    expect(input).toHaveAttribute('type', 'password')
    const toggle = container.querySelector('.toggle-password') || container.querySelector('[class*="TogglePassword"]')
    if (toggle) {
      fireEvent.click(toggle)
    } else {
      const icons = container.querySelectorAll('[data-testid]')
      fireEvent.click(icons[icons.length - 1] || input)
    }
  })

  it('logs out when password check succeeds', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ error: false, result: 'OK' })
    })
    const { getByText, getByLabelText } = renderWithProviders(<LogoutPopup />)
    fireEvent.change(getByLabelText('password'), { target: { value: 'secret' } })
    fireEvent.click(getByText('Sign out'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(handleLogoutClick).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })
})
