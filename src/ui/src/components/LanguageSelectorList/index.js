import React from 'react'
import { LanguageSelector as LanguageSelectorController } from '~components/components/LanguageSelector'
import { LanguageSelectorListContainer } from './styles'

import { Icon } from '~ui-icon'

const LanguageSelectorListUI = (props) => {
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage,
    defaultLanguages
  } = props

  const _languages = languagesState?.languages?.map(language => {
    return {
      value: language?.code,
      content: language?.name,
      showOnSelected: language.code?.toUpperCase(),
      image: language?.image
    }
  })

  _languages && _languages.sort((a, b) =>
    (a.content > b.content) ? 1 : ((b.content > a.content) ? -1 : 0)
  )

  return (
    _languages && _languages.length > 1
      ? (
        <LanguageSelectorListContainer>
          {(languagesState?.loading ? defaultLanguages : _languages).map((language) => (
            <div
              key={language.value}
              className={'language-item'}
              onClick={() => handleChangeLanguage(language.value)}
            >
              <div className='language-info'>
                {language.image && (
                  <div className='flag'>
                    <img src={language.image} alt={language.content} />
                  </div>
                )}
                <span className='language-name'>{language.content}</span>
              </div>
              {currentLanguage === language.value
                ? <Icon name="radioChecked" className='radio-icon selected' />
                : <Icon name="radioUnchecked" className='radio-icon' />
              }
            </div>
          ))}
        </LanguageSelectorListContainer>
        )
      : null
  )
}

export const LanguageSelectorList = (props) => {
  const DefaultChangeLanguage = () => {}
  const langProps = {
    ...props,
    UIComponent: LanguageSelectorListUI,
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
