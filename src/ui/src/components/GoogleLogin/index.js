import React, { useEffect } from 'react'
import { ButtonSpinner, SocialIconSlot, SocialButtonLabel } from '../../styles/Buttons'
import { GoogleButton } from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { FirebaseGoogleLoginButton as GoogleLoginController } from '~components/components/FirebaseGoogleLoginButton'

import { Icon } from '~ui-icon'

const GoogleLoginButtonUI = (props) => {
  const [, t] = useLanguage()
  const { signInWithGoogle, actionState, onLoadingChange, disabled } = props
  const isLoading = actionState?.loading

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading])

  return (
    <GoogleButton
      color='secondary'
      disabled={disabled || isLoading}
      onClick={signInWithGoogle}
    >
      <SocialIconSlot>
        {isLoading ? <ButtonSpinner aria-hidden='true' /> : <Icon name="google" />}
      </SocialIconSlot>
      <SocialButtonLabel>{t('GOOGLE', 'Google')}</SocialButtonLabel>
    </GoogleButton>
  )
}

export const GoogleLoginButton = (props) => {
  const googleLoginProps = {
    ...props,
    UIComponent: GoogleLoginButtonUI
  }
  return <GoogleLoginController {...googleLoginProps} />
}
