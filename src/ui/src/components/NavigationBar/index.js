import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { useLocation } from 'react-router-dom'
import {
  NavigationBarContainer,
  NavigationLink
} from './styles'

import loadable from '@loadable/component'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useEvent } from '~components/contexts/EventContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'
import { Modal } from '~ui/src/components/Modal'

import { Icon } from '~ui-icon'

// Modal contents open on interaction — lazy so their vendor trees (swiper via
// CartContent, maps/phone metadata via AddressForm, firebase via LoginForm)
// stay out of the entry chunk (this bar is always mounted on mobile).
const CartContent = loadable(() => import('~ui/src/components/CartContent').then((m) => m.CartContent))
const AddressForm = loadable(() => import('~ui/src/components/AddressForm').then((m) => m.AddressForm))
const LoginForm = loadable(() => import('~ui/src/components/LoginForm').then((m) => m.LoginForm))
const SignUpForm = loadable(() => import('~ui/src/components/SignUpForm').then((m) => m.SignUpForm))
const ForgotPasswordForm = loadable(() => import('~ui/src/components/ForgotPasswordForm').then((m) => m.ForgotPasswordForm))

export const NavigationBar = () => {
  const theme = useTheme()
  const [, t] = useLanguage()
  const location = useLocation()
  const [events] = useEvent()
  const [orderState] = useOrder()
  const [{ auth }, { login }] = useSession()
  const [isCart, setIsCart] = useState(false)
  const [isAddress, setIsAddress] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)

  const cartsWithProducts = (orderState?.carts && Object.values(orderState?.carts).filter(cart => cart.products && cart.products?.length > 0)) || null

  const handleGoToPage = (data) => {
    auth
      ? events.emit('go_to_page', data)
      : handleOpenLoginSignUp('login')
  }

  const handleChangeExplore = () => {
    auth
      ? handleGoToPage({ page: 'search' })
      : setIsAddress(true)
  }

  const handleOpenLoginSignUp = (index) => {
    setModalPageToShow(index)
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const closeAuthModal = () => {
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  const itemlist = {
    home: {
      key: 'home',
      text: t('HOME', 'Home'),
      active: location.pathname === '/search' || isAddress,
      onClick: handleChangeExplore
    },
    browse: {
      key: 'browse',
      active: location.pathname === '/business_search',
      onClick: () => handleGoToPage({ page: 'business_search' }),
      text: t('EXPLORE', 'Explore')
    },
    cart: {
      key: 'cart',
      active: isCart,
      text: t('MY_CART', 'My cart'),
      onClick: () => setIsCart(true)
    },
    orders: {
      key: 'orders',
      active: location.pathname === '/profile/orders',
      text: t('ORDERS', 'Orders'),
      onClick: () => handleGoToPage({ page: 'orders' })
    },
    profile: {
      key: 'profile',
      active: location.pathname === '/profile',
      text: t('PROFILE', 'Profile'),
      onClick: () => handleGoToPage({ page: 'profile', search: '?view=account' })
    }
  }

  const getIcon = (icon) => {
    return icon === 'home'
      ? <Icon name="house" />
      : icon === 'browse'
        ? <Icon name="searchBs" />
        : icon === 'orders'
          ? <Icon name="cardChecklist" />
          : icon === 'cart'
            ? <Icon name="shoppingCart" />
            : <Icon name="userOutline" />
  }

  return (
    <>
      <NavigationBarContainer>
        {Object.values(itemlist).map(item => (
          <NavigationLink
            key={item.key}
            active={item.active}
            onClick={() => item.onClick()}
          >
            {getIcon(item.key)}
            <p>{item.text}</p>
          </NavigationLink>
        ))}
      </NavigationBarContainer>
      {isCart && (
        <Modal
          open={isCart}
          onClose={() => setIsCart(false)}
          width='50%'
        >
          <CartContent
            carts={cartsWithProducts}
            isOrderStateCarts={!!orderState.carts}
            onClose={() => setIsCart(false)}
          />
        </Modal>
      )}
      {isAddress && (
        <Modal
          open={isAddress}
          title={t('WHERE_DO_WE_DELIVERY', 'Where do we deliver?')}
          onClose={() => setIsAddress(false)}
          width='50%'
        >
          <AddressForm
            useValidationFileds
            address={orderState?.options?.address || {}}
            onCancel={() => setIsAddress(false)}
            onSaveAddress={() => setIsAddress(false)}
          />
        </Modal>
      )}
      {modalPageToShow && !auth && (
        <Modal
          open={modalPageToShow && !auth}
          onRemove={() => closeAuthModal()}
          width='50%'
          authModal
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'signup' })
                  } href='#'
                >{t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
                  } href='#'
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {modalPageToShow === 'signup' && (
            <SignUpForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              useLoginByCellphone
              useChekoutFileds
              handleSuccessSignup={handleSuccessSignup}
              isPopup
            />
          )}
          {modalPageToShow === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
    </>
  )
}

export default NavigationBar
