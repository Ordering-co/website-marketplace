import React, { useEffect } from 'react'
import {
  Container,
  ModalDialog,
  ModalActions,
  ModalTitle,
  ModalIcon,
  ModalHeader,
  /* ModalBackHeader, */
  ModalIconWrapper
} from './styles'

import { Popup } from '~components/components/Popup'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

const ModalUI = (props) => {
  const {
    title,
    children,
    onAccept,
    onCancel,
    onClose,
    acceptText,
    cancelText,
    isTransparent,
    hideCloseDefault,
    isProductForm,
    authModal,
    onRemove,
    isSlideBar,
    slideBarPosition,
    disableOverflowX,
    titleStyle,
    avoidFixed,
    hideScrollbar
  } = props
  const [, t] = useLanguage()

  const handleKeyDown = (e) => {
    if (e.keyCode === 27 && props.open) {
      onClose && onClose()
    }
  }

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.body.clientWidth
    const bodyPaddingRight = window.document.body.style.paddingRight
    document.body.style.paddingRight = props.open ? `${bodyPaddingRight + scrollbarWidth}px` : `${bodyPaddingRight}px`
    document.body.style.overflow = props.open ? 'hidden' : 'auto'

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.paddingRight = ''
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Container
      className='modal-container'
      width={props.width}
      maxWidth={props.maxWidth}
      isProductForm={isProductForm}
      isSlideBar={isSlideBar}
      slideBarPosition={slideBarPosition}
      avoidFixed={avoidFixed}
      open={props.open}
      fullModalScreen={props?.fullModalScreen}
    >
      <ModalDialog
        className='popup-dialog'
        height={props.height}
        minHeight={props.minHeight}
        padding={props.padding}
        isTransparent={isTransparent}
        isSlideBar={isSlideBar}
        slideBarPosition={slideBarPosition}
        open={props.open}
        disableOverflowX={disableOverflowX}
        style={props.customStyle}
        avoidFixed={avoidFixed}
        hideScrollbar={hideScrollbar || isProductForm}
      >
        {!hideCloseDefault && (
          <ModalIconWrapper>
            <ModalIcon isProductForm={isProductForm}>
              {
                (authModal && onRemove) ? <Icon name="closeMd" onClick={() => onRemove()} /> : <Icon name="closeMd" onClick={() => onClose()} />
              }
            </ModalIcon>
          </ModalIconWrapper>
        )}
        <ModalHeader>
          {title && (
            <ModalTitle style={{ ...titleStyle }}>
              {title}
            </ModalTitle>
          )}
        </ModalHeader>
        {children}
        {(onCancel || onAccept) && (
          <ModalActions>
            {onCancel && <Button outline onClick={() => onCancel()}>{cancelText || t('CANCEL', 'Cancel')}</Button>}
            {onAccept && <Button color='primary' onClick={() => onAccept()}>{acceptText || t('ACCEPT', 'Accept')}</Button>}
          </ModalActions>)}
      </ModalDialog>
    </Container>
  )
}

export const Modal = (props) => {
  const ModalProps = {
    ...props,
    UIComponent: ModalUI
  }

  return (
    <Popup {...ModalProps} />
  )
}

export default Modal
