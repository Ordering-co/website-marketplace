import React, { useEffect, useState } from 'react'
import {
  Container,
  BackDropContainer,
  TopContainer,
  IconContent,
  SidebarContent,
  MenuClose,
  CartContentWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { CartContent } from '~ui/src/components/CartContent'

import { Icon } from '~ui-icon'

export const CartSidebar = (props) => {
  const {
    open,
    carts
  } = props

  const [, t] = useLanguage()
  const { width } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [orderState] = useOrder()

  // widen the drawer to 560px (was 500px) so the driver-tip row and the
  // Total + Checkout + Add more controls have room to breathe and don't wrap badly
  // on small screens. Below 560px viewports it still goes full-bleed (100%).
  const openWidth = '560px'

  const actionSidebar = (value) => {
    if (!value) {
      props.onClose()
    }
    setIsMenuOpen(value)
    document.getElementById('cartSidebar').style.width = value
      ? width > 560 ? openWidth : '100%'
      : '0'
  }

  useEffect(() => {
    if (isMenuOpen) {
      if (width <= 560) {
        document.getElementById('cartSidebar').style.width = '100%'
      } else {
        document.getElementById('cartSidebar').style.width = openWidth
      }
    }
  }, [width])

  useEffect(() => {
    if (!open) return
    actionSidebar(true)
  }, [open])

  return (
    <>
      <Container>
        <IconContent
          onClick={() => actionSidebar(true)}
        >
          <Icon name="cart" />
          {carts?.length > 0 && <span>{props.carts?.length}</span>}
        </IconContent>
        {isMenuOpen && (
          <BackDropContainer onClick={() => actionSidebar(false)} />
        )}
        <SidebarContent
          id='cartSidebar'
        >
          <TopContainer>
            <h2>{t('MY_CART', 'My cart')}</h2>
            <MenuClose
              aria-label='close'
              onClick={() => actionSidebar(false)}
            >
              <Icon name="closeMd" />
              {t('CLOSE', 'close')}
            </MenuClose>
          </TopContainer>
          <CartContentWrapper>
            <CartContent
              isOpenCart={isMenuOpen}
              isCartPopover
              isSidebar
              carts={props.carts}
              isOrderStateCarts={!!orderState.carts}
              onClose={() => actionSidebar(false)}
            />
          </CartContentWrapper>
        </SidebarContent>
      </Container>
    </>
  )
}
