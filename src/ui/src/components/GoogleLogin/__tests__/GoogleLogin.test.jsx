import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { GoogleLoginButton } from '../index'

const signInWithGoogle = vi.fn()

vi.mock('~components/components/FirebaseGoogleLoginButton', () => ({
  FirebaseGoogleLoginButton: ({ UIComponent, ...rest }) => (
    <UIComponent signInWithGoogle={signInWithGoogle} actionState={{ loading: false }} {...rest} />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))

describe('GoogleLoginButton', () => {
  it('renders Google label and triggers sign in', () => {
    const { getByText } = renderWithProviders(<GoogleLoginButton />)
    fireEvent.click(getByText('Google'))
    expect(signInWithGoogle).toHaveBeenCalled()
  })
})
