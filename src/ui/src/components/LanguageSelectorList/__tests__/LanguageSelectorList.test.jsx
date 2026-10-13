import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { LanguageSelectorList } from '../index'

vi.mock('~components/components/LanguageSelector', () => ({
  LanguageSelector: ({ UIComponent, ...rest }) => (
    <UIComponent
      languagesState={{
        loading: false,
        languages: [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' }
        ]
      }}
      currentLanguage='en'
      handleChangeLanguage={vi.fn()}
      {...rest}
    />
  )
}))

describe('LanguageSelectorList', () => {
  it('lists available languages', () => {
    const { getByText } = renderWithProviders(<LanguageSelectorList />)
    expect(getByText('English')).toBeInTheDocument()
    expect(getByText('Spanish')).toBeInTheDocument()
  })
})
