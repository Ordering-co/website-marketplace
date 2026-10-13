import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { FacebookLoginButton } from '../index'

const handleFacebookLogin = vi.fn()

vi.mock('~components/components/FacebookLoginButton', () => ({
  FacebookLoginButton: ({ UIComponent, ...rest }) => (
    <UIComponent handleFacebookLogin={handleFacebookLogin} formState={{ loading: false }} {...rest} />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('FacebookLoginButton', () => {
  it('renders Facebook label and triggers login', () => {
    const { getByText } = renderWithProviders(<FacebookLoginButton />)
    fireEvent.click(getByText('Facebook'))
    expect(handleFacebookLogin).toHaveBeenCalled()
  })
})
