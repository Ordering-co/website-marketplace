import React from 'react'
import { SMSButton } from './styles'

import { LoginForm as LoginFormController } from '~components/components/LoginForm'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Icon } from '~ui-icon'

const SmsLoginButtonUI = (props) => {
  const [, t] = useLanguage()
  const { handleSmsLogin, disabled } = props
  return (
    <SMSButton
      initialIcon
      color='secondary'
      disabled={disabled}
      onClick={() => handleSmsLogin()}
      style={props.style}
    >
      <Icon name="sms" style={props.iconStyle} />
      <div style={props.textStyle}>{t('LOGIN_WITH_SMS', 'Login with SMS')}</div>
    </SMSButton>
  )
}

export const SmsLoginButton = (props) => {
  const smsLoginProps = {
    ...props,
    UIComponent: SmsLoginButtonUI
  }
  return <LoginFormController {...smsLoginProps} />
}
