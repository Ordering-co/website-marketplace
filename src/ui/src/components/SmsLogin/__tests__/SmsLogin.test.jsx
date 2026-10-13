import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { SmsLoginButton } from '../index'

const handleSmsLogin = vi.fn()

vi.mock('~components/components/LoginForm', () => ({
  LoginForm: ({ UIComponent, ...rest }) => (
    <UIComponent handleSmsLogin={handleSmsLogin} {...rest} />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('SmsLoginButton', () => {
  it('renders SMS login label and triggers handler', () => {
    const { getByText } = renderWithProviders(<SmsLoginButton />)
    fireEvent.click(getByText('Login with SMS'))
    expect(handleSmsLogin).toHaveBeenCalled()
  })
})
