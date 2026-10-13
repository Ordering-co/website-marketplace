import React, { useEffect } from 'react'
import { FacebookLoginButton as FacebookLoginController } from '~components/components/FacebookLoginButton'
import { useLanguage } from '~components/contexts/LanguageContext'

import { ButtonSpinner, SocialIconSlot, SocialButtonLabel } from '../../styles/Buttons'
import { FacebookButton } from './styles'

import { Icon } from '~ui-icon'

const FacebookLoginButtonUI = (props) => {
  const [, t] = useLanguage()
  const { handleFacebookLogin, formState, onLoadingChange, disabled } = props
  const isLoading = formState?.loading

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading])

  return (
    <FacebookButton
      color='secondary'
      disabled={disabled || isLoading}
      onClick={() => handleFacebookLogin()}
    >
      <SocialIconSlot>
        {isLoading ? <ButtonSpinner aria-hidden='true' /> : <Icon name="facebook" />}
      </SocialIconSlot>
      <SocialButtonLabel>{t('FACEBOOK', 'Facebook')}</SocialButtonLabel>
    </FacebookButton>
  )
}

export const FacebookLoginButton = (props) => {
  const facebookLoginProps = {
    ...props,
    UIComponent: FacebookLoginButtonUI
  }
  return <FacebookLoginController {...facebookLoginProps} />
}
