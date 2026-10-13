import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { LogoutButton } from '../index'

const handleLogoutClick = vi.fn()

vi.mock('~components/components/LogoutAction', () => ({
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={handleLogoutClick} {...rest} />
  )
}))

describe('LogoutButton', () => {
  it('renders logout label and triggers handler', () => {
    const { getByText } = renderWithProviders(<LogoutButton />)
    fireEvent.click(getByText('Logout'))
    expect(handleLogoutClick).toHaveBeenCalled()
  })
})
