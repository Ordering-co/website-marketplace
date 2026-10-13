import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { AppleLogin } from '../index'

const initLoginApple = vi.fn()

vi.mock('~components/components/AppleLogin', () => ({
  AppleLogin: ({ UIComponent, ...rest }) => (
    <UIComponent initLoginApple={initLoginApple} formState={{ loading: false }} {...rest} />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('AppleLogin', () => {
  it('renders Apple label and triggers login', () => {
    const { getByText } = renderWithProviders(<AppleLogin />)
    fireEvent.click(getByText('Apple'))
    expect(initLoginApple).toHaveBeenCalled()
  })
})
