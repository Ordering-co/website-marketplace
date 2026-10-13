import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../__tests__/helpers/testUtils'
import { SignUpBusiness } from '../index'

vi.mock('../../../components/HelmetTags', () => ({
  HelmetTags: ({ page }) => <div data-testid='helmet-tags' data-page={page} />
}))
vi.mock('~ui/src/components/SignUpBusiness', () => ({
  SignUpBusiness: ({ isPopup }) => (
    <div data-testid='signup-business-ui' data-popup={String(!!isPopup)} />
  )
}))

describe('SignUpBusiness page', () => {
  it('renders helmet tags and signup business UI', () => {
    const { getByTestId } = renderWithProviders(<SignUpBusiness isPopup />)

    expect(getByTestId('helmet-tags')).toHaveAttribute('data-page', 'signup_business')
    expect(getByTestId('signup-business-ui')).toHaveAttribute('data-popup', 'true')
  })
})
