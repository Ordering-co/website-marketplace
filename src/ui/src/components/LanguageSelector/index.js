import React, { useEffect } from 'react'
import { LanguageSelector as LanguageSelectorController } from '~components/components/LanguageSelector'
import { Select } from '~ui/src/styles/Select'
import { primeEnabledLanguages } from '../../hooks/useEnabledLanguages'

const LanguageSelectorUI = (props) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
    notReload,
    defaultLanguages,
    defaultCurrentLanguage
  } = props

  // The header selector is always mounted and loads the languages early — seed
  // the shared cache so the profile language page/menu know the count instantly
  // (no extra fetch, no load-then-hide flash). See useEnabledLanguages.
  useEffect(() => {
    if (!languagesState?.loading && languagesState?.languages) {
      primeEnabledLanguages(languagesState.languages)
    }
  }, [languagesState?.loading, languagesState?.languages])

  const _languages = languagesState?.languages?.map(language => {
    return {
      value: language?.code, content: language?.name, showOnSelected: language.code?.toUpperCase()
    }
  })
  _languages && _languages.sort((a, b) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
  )
  return (
    _languages && _languages.length > 1
      ? (
      <Select
        zIndex={10002}
        options={languagesState?.loading ? defaultLanguages : _languages}
        defaultValue={languagesState?.loading ? defaultCurrentLanguage : currentLanguage}
        onChange={(languageId) => handleChangeLanguage(languageId)}
        notReload={notReload}
      />
        )
      : null
  )
}

export const LanguageSelector = (props) => {
  const DefaultChangeLanguage = () => {}
  const langProps = {
    ...props,
    UIComponent: LanguageSelectorUI,
    onChangeLanguage: props.onChangeLanguage || DefaultChangeLanguage,
    defaultLanguages: [{
      content: 'English',
      showOnSelected: 'EN',
      value: 'en'
    }],
    defaultCurrentLanguage: 'en'
  }
  return (
    <LanguageSelectorController {...langProps} />
  )
}
