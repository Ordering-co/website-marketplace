import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { Profile } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/hooks/useWindowSize', () => ({
  useWindowSize: () => ({ width: 320, height: 640 })
}))
vi.mock('~ui/src/components/UserProfileForm', () => ({
  UserProfileForm: (props) => (
    <div
      data-testid='profile-ui'
      data-view={props.view}
      data-hide-options={String(props.hideOptions)}
    />
  )
}))

describe('Profile page', () => {
  it('renders profile helmet tags and passes view from query', () => {
    const { getByTestId } = renderWithProviders(<Profile />, {
      initialEntries: ['/profile?view=orders'],
      routePath: '/profile'
    })

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'profile')
    expect(getByTestId('profile-ui')).toHaveAttribute('data-view', 'orders')
    expect(getByTestId('profile-ui')).toHaveAttribute('data-hide-options', 'true')
  })
})
