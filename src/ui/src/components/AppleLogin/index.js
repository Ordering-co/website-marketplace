import React, { useEffect } from 'react'
import { ButtonSpinner, SocialIconSlot, SocialButtonLabel } from '../../styles/Buttons'
import { AppleButton } from './styles'

import { AppleLogin as AppleLoginController } from '~components/components/AppleLogin'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Icon } from '~ui-icon'

const AppleLoginUI = (props) => {
  const {
    initLoginApple,
    formState,
    onLoadingChange,
    disabled
  } = props

  const [, t] = useLanguage()
  const isLoading = formState?.loading

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading])

  return (
    <AppleButton
      color='secondary'
      disabled={disabled || isLoading}
      onClick={() => initLoginApple()}
    >
      <SocialIconSlot>
        {isLoading ? <ButtonSpinner aria-hidden='true' /> : <Icon name="apple" />}
      </SocialIconSlot>
      <SocialButtonLabel>{t('APPLE', 'Apple')}</SocialButtonLabel>
    </AppleButton>
  )
}

export const AppleLogin = (props) => {
  const propss = {
    ...props,
    UIComponent: AppleLoginUI
  }
  return <AppleLoginController {...propss} />
}
