import React from 'react'
import LibraryPWAPrompt from 'react-ios-pwa-prompt'

import { useLanguage } from '~components/contexts/LanguageContext'
import { buildPwaPromptCopy, shouldShowIosPwaPrompt } from '../../../../utils/pwaPromptCopy'

export const PWAPrompt = ({
  ready,
  userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
}) => {
  const [languageState, t] = useLanguage()

  if (!shouldShowIosPwaPrompt({
    ready,
    languageLoading: languageState.loading,
    userAgent
  })) {
    return null
  }

  return (
    <LibraryPWAPrompt
      promptOnVisit={1}
      timesToShow={100}
      permanentlyHideOnDismiss={false}
      {...buildPwaPromptCopy(t)}
    />
  )
}

export default PWAPrompt
