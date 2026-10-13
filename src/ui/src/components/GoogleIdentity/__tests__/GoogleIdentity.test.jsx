import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { GoogleIdentityButton } from '../index'

vi.mock('~components/components/GoogleIdentity', () => ({
  GoogleIdentityButton: ({ UIComponent, ...rest }) => (
    <UIComponent
      initParams={{ client_id: 'google-client-id' }}
      handleSigninSuccess={vi.fn()}
      formState={{ error: false }}
      {...rest}
    />
  )
}))
vi.mock('~components/contexts/LanguageContext', () => ({
  useLanguage: () => [{}, (_key, fallback) => fallback]
}))
vi.mock('~ui/src/components/Confirm', () => ({
  Alert: () => null
}))

describe('GoogleIdentityButton', () => {
  beforeEach(() => {
    const button = document.createElement('button')
    button.id = 'g_id_onload'
    document.body.appendChild(button)
  })

  it('renders google identity button with client id', () => {
    const { container } = renderWithProviders(<GoogleIdentityButton />)
    expect(container.querySelector('#g_id_onload')).toHaveAttribute('data-client_id', 'google-client-id')
  })
})
