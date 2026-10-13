import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { UserPopover } from '../index'

vi.mock('~components/components/LogoutAction', () => ({
  LogoutAction: ({ UIComponent, ...rest }) => (
    <UIComponent handleLogoutClick={vi.fn()} {...rest} />
  )
}))

describe('UserPopover', () => {
  it('renders logout row when open with logout enabled', () => {
    const { getByText } = renderWithProviders(
      <UserPopover
        open
        withLogout
        user={{ name: 'Jane', lastname: 'Doe', photo: '' }}
        isHome={false}
      />,
      { initialEntries: ['/profile'], routePath: '/profile' }
    )
    expect(getByText('Logout')).toBeInTheDocument()
  })
})
