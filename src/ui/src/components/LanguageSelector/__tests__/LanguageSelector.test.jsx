import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { LanguageSelector } from '../index'

vi.mock('~ui/src/styles/Select', () => ({
  Select: ({ options }) => <div data-testid='language-select'>{options?.length} languages</div>
}))

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

describe('LanguageSelector', () => {
  it('renders language select when multiple languages are available', () => {
    const { getByTestId } = renderWithProviders(<LanguageSelector />)
    expect(getByTestId('language-select')).toHaveTextContent('2 languages')
  })
})
