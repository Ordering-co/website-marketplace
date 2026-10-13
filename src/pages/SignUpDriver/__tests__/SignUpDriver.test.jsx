import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { SignUpDriver } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/SignUpDriver', () => ({
  SignUpDriver: ({ isDriverSignup, isPopup }) => (
    <div
      data-testid='signup-driver-ui'
      data-driver-signup={String(!!isDriverSignup)}
      data-popup={String(!!isPopup)}
    />
  )
}))

describe('SignUpDriver page', () => {
  it('renders helmet tags and passes driver signup flag to UI', () => {
    const { getByTestId } = renderWithProviders(<SignUpDriver isPopup />)

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'signup_driver')
    expect(getByTestId('signup-driver-ui')).toHaveAttribute('data-driver-signup', 'true')
    expect(getByTestId('signup-driver-ui')).toHaveAttribute('data-popup', 'true')
  })
})
