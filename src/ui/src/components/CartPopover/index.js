import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import { usePopper } from 'react-popper'
import {
  Wrapper,
  HeaderItem,
  PopoverBody,
  PopoverArrow,
  TitleContainer,
  Title
} from './styles'

import { useOrder } from '~components/contexts/OrderContext'
import { useEvent } from '~components/contexts/EventContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { CartContent } from '~ui/src/components/CartContent'
import { Modal } from '~ui/src/components/Modal'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

export const CartPopover = (props) => {
  const { open, auth, location, isCustomerMode, setPreorderBusiness } = props
  const [orderState] = useOrder()
  const theme = useTheme()
  const [events] = useEvent()
  const [, t] = useLanguage()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()

  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: theme?.rtl ? 'bottom' : 'bottom-end',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement.current } },
      {
        name: 'offset',
        options: {
          offset: [0, 12]
        }
      }
    ]
  })

  const { styles, attributes } = popper

  const isSlideBar = true
  const [activeCartUuid, setActiveCartUuid] = useState(null)

  useEffect(() => {
    const handleProductAdded = (product, cart) => {
      setActiveCartUuid(cart?.uuid)
      if (location?.pathname?.includes('/store/')) {
        props.onClick && props.onClick()
      }
    }
    const handleProductUpdated = (product, cart) => {
      setActiveCartUuid(cart?.uuid)
    }
    const handleCartPopoverClosed = () => {
      setActiveCartUuid(null)
    }
    events.on('cart_product_added', handleProductAdded)
    events.on('cart_product_updated', handleProductUpdated)
    events.on('cart_popover_closed', handleCartPopoverClosed)
    return () => {
      events.off('cart_product_added', handleProductAdded)
      events.off('cart_product_updated', handleProductUpdated)
      events.off('cart_popover_closed', handleCartPopoverClosed)
    }
  }, [location])

  const handleClose = () => {
    setActiveCartUuid(null)
    props.onClose && props.onClose()
  }

  useEffect(() => {
    const cartHeaderItem = document.getElementById('cart-header-item')
    const businessNameElement = document.getElementById('business_name')

    if (cartHeaderItem && businessNameElement?.classList?.contains('fixed-name') && !open) {
      if (!cartHeaderItem.classList.contains('cart-header-fixed')) {
        cartHeaderItem.classList.add('cart-header-fixed')
      }
    }
    if (cartHeaderItem && open) {
      cartHeaderItem.classList.remove('cart-header-fixed')
    }
  }, [open])

  useEffect(() => {
    const cartHeaderItem = document.getElementById('cart-header-item')
    if (cartHeaderItem) {
      cartHeaderItem.classList.remove('cart-header-fixed')
    }
  }, [location?.pathname])

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    const outsideModal = !window.document.getElementById('app-modals') || !window.document.getElementById('app-modals').contains(e.target)
    if (outsidePopover && outsidePopoverMenu && outsideModal) {
      events.emit('cart_popover_closed')
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [open])

  useEffect(() => {
    props.onClose()
  }, [auth])

  useEffect(() => {
    if (location && location.pathname.includes('/checkout/')) {
      props.onClose && props.onClose()
    }
  }, [location])

  const getScrollTop = () => {
    if (document.documentElement?.scrollTop > 80) {
      props.onClose && props.onClose()
    }
  }

  useEffect(() => {
    if (location && location.pathname.includes('/store/') && isCustomerMode) {
      window.addEventListener('scroll', getScrollTop)
    }
    return () => {
      window.removeEventListener('scroll', getScrollTop)
    }
  }, [])

  // the popover no longer owns the scroll. It is a bounded flex column
  // so the inner cart can keep its store-name header and Total + Checkout + Add
  // more footer pinned while only the product list scrolls.
  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', width: '450px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }

  return (
    <Wrapper open={open} isSlideBar={isSlideBar}>
      <HeaderItem ref={referenceElement} onClick={props.onClick} name='cart-popover' id='cart-header-item' open={open} isSlideBar={isSlideBar}>
        <span>
          <Icon name="basketFilled" />
          {props.carts?.length > 1 && <span>{props.carts?.length}</span>}
          {props.carts?.length === 1 && <span>{props.carts[0].products.length}</span>}
        </span>
      </HeaderItem>
      {isSlideBar
        ? (open
            ? <Modal
                open={open}
                onClose={handleClose}
                hideCloseDefault
                isSlideBar
                slideBarPosition={'right'}
              >
                <TitleContainer>
                  <Title>{t('MY_CART', 'My cart')}</Title>
                  <Button outline color='primary' onClick={handleClose}>
                    <Icon name="close" /> {t('CLOSE', 'Close')}
                  </Button>
                </TitleContainer>
                <CartContent
                  isCartPopover
                  carts={props.carts}
                  isOrderStateCarts={!!orderState.carts}
                  onClose={handleClose}
                  setPreorderBusiness={setPreorderBusiness}
                  isOpenCart={open}
                  onClick={props.onClick}
                  isSlideBar={isSlideBar}
                  isCustomerMode={isCustomerMode}
                  activeCartUuid={activeCartUuid}
                  onActiveCartChange={setActiveCartUuid}
                />
              </Modal>
            : null)
        : (
        <PopoverBody className='cart-popover' ref={popperElement} style={popStyle} {...attributes.popper}>
          <CartContent
            isCartPopover
            carts={props.carts}
            isOrderStateCarts={!!orderState.carts}
            onClose={handleClose}
            setPreorderBusiness={setPreorderBusiness}
            isOpenCart={open}
            onClick={props.onClick}
            isCustomerMode={isCustomerMode}
            activeCartUuid={activeCartUuid}
            onActiveCartChange={setActiveCartUuid}
          />
          <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
        </PopoverBody>
          )}
    </Wrapper>
  )
}
