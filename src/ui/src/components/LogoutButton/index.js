import React from 'react'
import {
  MenuLink,
  WrappContent,
  MenuLinkIcon,
  MenuLinkText,
  TextInfo,
  MenuLinkSeparator
} from '../SidebarMenu/styles'

import { LogoutAction } from '~components/components/LogoutAction'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Icon } from '~ui-icon'

const LogoutButtonUI = (props) => {
  const { onCustomClick, hideText, hideIcon } = props
  const [, t] = useLanguage()

  const handleLogOutClick = () => {
    window.FB?.getLoginStatus((response) => {
      if (response.status === 'connected') {
        window.FB?.logout()
      }
    })

    const GoogleAuth = window?.gapi?.auth2?.getAuthInstance()
    if (GoogleAuth) {
      const signedIn = GoogleAuth.isSignedIn.get()
      if (signedIn) {
        GoogleAuth.signOut().then(() => {
          GoogleAuth.disconnect()
        })
      }
    }

    props?.handleLogoutClick()
    onCustomClick && onCustomClick()
  }

  return (
    <MenuLink id='logoutbtn' onClick={handleLogOutClick} style={props.styleContainer}>
      <WrappContent style={props.styleWrappContent}>
        {!hideIcon && (
          <MenuLinkIcon>
            <Icon name="signOut" />
          </MenuLinkIcon>
        )}
        {!hideText && (
          <MenuLinkText>
            <TextInfo hideIcon={hideIcon}>
              {t('LOGOUT', 'Logout')}
            </TextInfo>
          </MenuLinkText>
        )}
        <MenuLinkSeparator>
          <div>
            <hr />
          </div>
        </MenuLinkSeparator>
      </WrappContent>
    </MenuLink>
  )
}

export const LogoutButton = (props) => {
  const logoutButtonProps = {
    ...props,
    UIComponent: LogoutButtonUI
  }
  return (
    <LogoutAction {...logoutButtonProps} />
  )
}
