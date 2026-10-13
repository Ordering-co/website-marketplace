import React, { useEffect } from 'react'
import { useTheme } from 'styled-components'
import {
  PopupDialog,
  PopupActions,
  PopupTitle,
  PopupContent,
  PopupIcon
} from './styles'

import { Popup } from '~components/components/Popup'
import { useLanguage } from '~components/contexts/LanguageContext'
import { getTraduction } from '~ui/utils'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

const ConfirmUI = (props) => {
  const {
    title,
    children,
    content,
    links,
    onAccept,
    onCancel,
    onClose,
    acceptText,
    cancelText
  } = props
  const [, t] = useLanguage()

  const handleKeyDown = (e) => {
    if (e.keyCode === 27 || e.keyCode === 13) {
      onClose && onClose()
    }
  }

  useEffect(() => {
    if (props.open) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [props.open])

  return (
    <PopupDialog className='popup-dialog'>
      <PopupIcon>
        <Icon name="closeMd" onClick={() => onClose()} />
      </PopupIcon>
      {title && <PopupTitle>{title}</PopupTitle>}
      <PopupContent>
        {content && typeof content === 'string' && content}
        {content && typeof content === 'object' && Array.isArray(content) && (
          <ul>
            {content.map((item, i) => (
              <li key={i}>{getTraduction(item)}</li>
            ))}
            {links?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
        {children}
      </PopupContent>
      {(onCancel || onAccept || onClose) && (
        <PopupActions>
          {onCancel && <Button outline onClick={() => onCancel()}>{cancelText || t('CANCEL', 'Cancel')}</Button>}
          {onAccept && <Button color='primary' onClick={() => onAccept()}>{acceptText || t('ACCEPT', 'Accept')}</Button>}
        </PopupActions>)}
    </PopupDialog>
  )
}

export const Confirm = (props) => {
  const popupProps = {
    ...props,
    UIComponent: ConfirmUI
  }

  const theme = useTheme()

  return (
    <>
      {
        theme && <Popup {...popupProps} />
      }
    </>
  )
}

export const Alert = Confirm

export default Confirm
