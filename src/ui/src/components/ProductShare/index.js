import React, { useEffect, useRef, useState } from 'react'
import {
  IconShare,
  ShareButtons,
  CopyButton
} from './styles'

import { ProductShare as ProductShareController } from '~components/components/ProductShare'
import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '~ui/src/components/Modal'
import { ProductCopyURL } from './ProductCopyURL'

import { Icon } from '~ui-icon'

const ProductShareUI = (props) => {
  const {
    updateShowValue,
    showShareButton,
    urlToShare,
    btnText,
    withBtn,
    product
  } = props

  const iconElement = useRef()
  const contentElement = useRef()
  const [openCopyUrlModal, setOpenCopyUrlModal] = useState(false)

  const handleClickOutside = (e) => {
    const outsideIcon = !iconElement.current?.contains(e.target)
    const outsideButtonsShare = !contentElement.current?.contains(e.target)
    if (outsideIcon && outsideButtonsShare) {
      updateShowValue && updateShowValue(false)
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [])

  const handleClickShare = () => {
    updateShowValue(!showShareButton)
  }

  return (
    <>
      <IconShare ref={iconElement} name='icon-share'>
        {withBtn
          ? (
          <Button
            outline
            color='primary'
            onClick={handleClickShare}
          >
            <Icon name="share" />
            {btnText}
          </Button>
            )
          : (
          <Icon name="share" onClick={handleClickShare} />
            )}
        <ShareButtons
          ref={contentElement}
          className='a2a_kit a2a_kit_size_32 a2a_vertical_style'
          data-a2a-url={urlToShare}
          showShareButton={showShareButton}
        >
          <CopyButton onClick={() => setOpenCopyUrlModal(true)}>
            <span>
              <Icon name="link" />
            </span>
          </CopyButton>
          <a className='a2a_button_facebook' />
          <a className='a2a_button_whatsapp' />
          <a className='a2a_button_twitter' />
          <a className='a2a_button_email' />
          <a className='a2a_dd' href='https://www.addtoany.com/share' />
        </ShareButtons>
      </IconShare>
      {openCopyUrlModal && (
        <Modal
          width='650px'
          open={openCopyUrlModal}
          onClose={() => setOpenCopyUrlModal(false)}
        >
          <ProductCopyURL
            urlToShare={urlToShare}
            product={product}
            onClose={() => setOpenCopyUrlModal(false)}
          />
        </Modal>
      )}
    </>
  )
}

export const ProductShare = (props) => {
  const productShareProps = {
    ...props,
    UIComponent: ProductShareUI
  }
  return (
    <ProductShareController {...productShareProps} />
  )
}
