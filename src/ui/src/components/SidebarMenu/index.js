import React, { useEffect, useState, useRef } from 'react'
import { useTheme } from 'styled-components'
import {
  Container,
  IconContent,
  SidebarContent,
  MenuClose,
  MenuLink,
  WrappContent,
  MenuLinkIcon,
  MenuLinkText,
  TextInfo,
  MenuLinkSeparator,
  CustomerInfo
} from './styles'

import settings from '../../../../config'
import { useEvent } from '~components/contexts/EventContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSession } from '~components/contexts/SessionContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { isWalletEnabled as isWalletConfigEnabled } from '~components/utils/configHelpers'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { LogoutButton } from '~ui/src/components/LogoutButton'
import { Modal } from '~ui/src/components/Modal'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { LoginForm } from '~ui/src/components/LoginForm'
import { ForgotPasswordForm } from '~ui/src/components/ForgotPasswordForm'
import { useEnabledLanguages } from '../../hooks/useEnabledLanguages'
import { useSavedCardsGateway } from '../SavedCards/useSavedCardsGateway'

import { Icon } from '~ui-icon'

export const SidebarMenu = (props) => {
  const { auth, isHideSignup, userCustomer, isCustomerMode, notificationState, logoHomeTarget } = props
  const [{ user }, { login }] = useSession()
  const [events] = useEvent()
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const { hasMultiple: hasMultipleLanguages } = useEnabledLanguages()
  const { isAvailable: savedCardsAvailable } = useSavedCardsGateway()
  const theme = useTheme()
  const { width } = useWindowSize()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const containerRef = useRef(null)

  const isProfileView = (view) => {
    if (typeof window === 'undefined') return false
    if (window.location.pathname !== '/profile') return false
    const params = new URLSearchParams(window.location.search)
    return params.get('view') === view
  }

  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug
  const isSingleStore = websiteThemeType === 'single_store' && websiteThemeBusinessSlug
  const isFranchise = (websiteThemeType === 'franchise' && websiteThemeFranchiseSlug) || settings?.franchiseSlug
  const homePath = isSingleStore
    ? `/store/${websiteThemeBusinessSlug}`
    : logoHomeTarget?.page === 'search'
      ? '/search'
      : logoHomeTarget?.page === 'business'
        ? `/${logoHomeTarget.params.business_slug}`
        : '/home'

  const hideLoyaltyLevels = true
  const isProjectEnterpricePlan = configs?.plan_enterprise && configs?.plan_enterprise?.value
  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs)
  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false
  const isPromotionsEnabled = configs?.advanced_offers_module?.value === '1' || configs?.advanced_offers_module?.value === true
  const hideBrowse = true
  const hideOrders = theme?.bar_menu?.components?.orders?.hidden
  const hideProfile = theme?.bar_menu?.components?.profile?.hidden
  const hideWallet = theme?.bar_menu?.components?.wallet?.hidden
  const hideMessages = theme?.bar_menu?.components?.messages?.hidden
  const hideHelp = theme?.bar_menu?.components?.help?.hidden
  const hideFavorites = theme?.bar_menu?.components?.favortes?.hidden
  const hideSession = theme?.bar_menu?.components?.sessions?.hidden || !isProjectEnterpricePlan
  const hidePromotions = theme?.bar_menu?.components?.promotions?.hidden

  const closeModal = () => {
    setModalIsOpen(false)
    setModalPageToShow(null)
    actionSidebar(false)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeModal()
    }
  }

  const handleSuccessLogout = () => {
    events.emit('go_to_page', isSingleStore
      ? { page: 'business', params: { business_slug: websiteThemeBusinessSlug } }
      : { page: 'home' })
  }

  const handleOpenLoginSignUp = (index) => {
    setModalPageToShow(index)
    setModalIsOpen(true)
  }

  const handleGoToPage = (e, data) => {
    e.preventDefault()
    events.emit('go_to_page', data)
    actionSidebar(false)
    setIsMenuOpen(false)
  }

  const handleGoToHome = (e) => {
    if (isFranchise) {
      window.localStorage.setItem('change_store_redirect', 'true')
      window.localStorage.removeItem('single_business')
    }
    if (isSingleStore) {
      handleGoToPage(e, { page: 'business', params: { business_slug: websiteThemeBusinessSlug } })
      return
    }
    handleGoToPage(e, logoHomeTarget || { page: 'home' })
  }

  const actionSidebar = (value) => {
    setIsMenuOpen(value)
    document.getElementById('sidebar_menu').style.width = value
      ? width > 489 ? '340px' : '100vw'
      : '0'
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
    closeModal()
  }

  useEffect(() => {
    if (isMenuOpen) {
      if (width <= 489) {
        document.getElementById('sidebar_menu').style.width = '100vw'
      } else {
        document.getElementById('sidebar_menu').style.width = '340px'
      }
    }
  }, [width])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef?.current && !containerRef?.current?.contains(event.target) && isMenuOpen) {
        actionSidebar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const isWalletsPage = window.location.pathname === '/wallets'
  const walletSearchParam = new URLSearchParams(window.location.search).get('wallet')
  const currentWallet = isWalletsPage ? (walletSearchParam || 'cash') : null

  return (
    <Container $auth={auth} ref={containerRef}>
      <IconContent
        aria-label='menu'
        onClick={() => actionSidebar(true)}
      >
        <Icon name="menuAltRight" />
      </IconContent>
      <SidebarContent
        id='sidebar_menu'
      >
        {(userCustomer?.name || userCustomer?.lastname) && (
          <CustomerInfo>
            <p>{t('HI', 'Hi')} <span className='customer-name'>{`${userCustomer?.name ?? ''} ${userCustomer?.lastname ?? ''}`}</span></p>
          </CustomerInfo>
        )}
        <MenuClose
          aria-label='close'
          onClick={() => actionSidebar(false)}
        >
          <Icon name="menuAltRight" />
        </MenuClose>
        <MenuLink
          onClick={handleGoToHome}
          href={homePath}
        >
          <WrappContent>
            <MenuLinkIcon
              active={
                window.location.pathname === homePath
              }
            >
              <Icon name="homeOutline" />
            </MenuLinkIcon>
            <MenuLinkText>
              <TextInfo
                active={
                  window.location.pathname === homePath
                }
              >
                {t('HOME', 'Home')}
              </TextInfo>
            </MenuLinkText>
            <MenuLinkSeparator>
              <div>
                <hr />
              </div>
            </MenuLinkSeparator>
          </WrappContent>
        </MenuLink>
        {auth && (
          <>
            {!hideBrowse && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'business_search' })}
                href='/business_search'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/business_search'
                    }
                  >
                    <Icon name="searchOutline" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/business_search'
                      }
                    >
                      {t('BROWSE_SEARCH', 'Browse & Search')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {!hideFavorites && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'favorite' })}
                href='/favorite'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/favorite'
                    }
                  >
                    <Icon name="heartOutline" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/favorite'
                      }
                    >
                      {t('FAVORITES', 'Favorites')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {!isCustomerMode && !hideOrders && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'orders' })}
                href='/profile/orders'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/profile/orders'
                    }
                  >
                    <Icon name="shopping" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/profile/orders'
                      }
                    >
                      {t('ORDERS', 'Orders')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {!hideProfile && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'profile', search: '?view=account' })}
                href='/profile'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={isProfileView('account')}
                  >
                    <Icon name="userOutlineAi" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={isProfileView('account')}
                    >
                      {t('VIEW_ACCOUNT', 'View account')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            <h2>{t('REWARDS', 'Rewards')}</h2>
            {isWalletEnabled && !hideWallet && (
              <>
                <MenuLink
                  onClick={(e) => handleGoToPage(e, { page: 'wallets', search: '?wallet=cash' })}
                  href='/wallets'
                >
                  <WrappContent>
                    <MenuLinkIcon
                      active={currentWallet === 'cash'}
                    >
                      <Icon name="dollarCircle" />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo
                        active={currentWallet === 'cash'}
                      >
                        {t('CASH_WALLET', 'Cash wallet')}
                      </TextInfo>
                    </MenuLinkText>
                    <MenuLinkSeparator>
                      <div>
                        <hr />
                      </div>
                    </MenuLinkSeparator>
                  </WrappContent>
                </MenuLink>
                <MenuLink
                  onClick={(e) => handleGoToPage(e, { page: 'wallets', search: '?wallet=credit_point' })}
                  href='/wallets'
                >
                  <WrappContent>
                    <MenuLinkIcon
                      active={currentWallet === 'credit_point'}
                    >
                      <Icon name="book" />
                    </MenuLinkIcon>
                    <MenuLinkText>
                      <TextInfo
                        active={currentWallet === 'credit_point'}
                      >
                        {t('LOYALTY_POINTS', 'Loyalty points')}
                      </TextInfo>
                    </MenuLinkText>
                    <MenuLinkSeparator>
                      <div>
                        <hr />
                      </div>
                    </MenuLinkSeparator>
                  </WrappContent>
                </MenuLink>
                {!hideLoyaltyLevels && (
                  <MenuLink>
                    <WrappContent>
                      <MenuLinkIcon
                        active={
                          window.location.pathname === '/wallets'
                        }
                      >
                        <Icon name="starOutline" />
                      </MenuLinkIcon>
                      <MenuLinkText>
                        <TextInfo
                          active={
                            window.location.pathname === '/wallets'
                          }
                        >
                          {t('LOYALTY_LEVELS', 'Loyalty levels')}
                        </TextInfo>
                        <TextInfo bold>
                          {user?.loyalty_level?.name && (
                            user.loyalty_level.name
                          )}
                        </TextInfo>
                      </MenuLinkText>
                      <MenuLinkSeparator>
                        <div>
                          <hr />
                        </div>
                      </MenuLinkSeparator>
                    </WrappContent>
                  </MenuLink>
                )}
                {!isGiftCardDisabled && (
                  <MenuLink
                    onClick={(e) => handleGoToPage(e, { page: 'wallets', search: '?wallet=gift_card' })}
                    href='/wallets'
                  >
                    <WrappContent>
                      <MenuLinkIcon
                        active={currentWallet === 'gift_card'}
                      >
                        <Icon name="giftOutline" />
                      </MenuLinkIcon>
                      <MenuLinkText>
                        <TextInfo
                          active={currentWallet === 'gift_card'}
                        >
                          {t('GIFT_CARDS', 'Gift cards')}
                        </TextInfo>
                      </MenuLinkText>
                      <MenuLinkSeparator>
                        <div>
                          <hr />
                        </div>
                      </MenuLinkSeparator>
                    </WrappContent>
                  </MenuLink>
                )}
              </>
            )}
            {isPromotionsEnabled && !hidePromotions && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'promotions' })}
                href='/promotions'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/promotions'
                    }
                  >
                    <Icon name="tags" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/promotions'
                      }
                    >
                      {t('OFFERS', 'Offers')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            <h2>{t('MY_ACCOUNT', 'My account')}</h2>
            {configs?.school_module_enabled?.value === '1' && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'profile', search: '?view=students' })}
                href='/profile'
              >
                <WrappContent>
                  <MenuLinkIcon active={isProfileView('students')}>
                    <Icon name="read" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo active={isProfileView('students')}>
                      {t('SCHOOL_MY_STUDENTS', 'My students')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            <MenuLink
              onClick={(e) => handleGoToPage(e, { page: 'profile', search: '?view=savedPlaces' })}
              href='/profile'
            >
              <WrappContent>
                <MenuLinkIcon
                  active={isProfileView('savedPlaces')}
                >
                  <Icon name="environment" />
                </MenuLinkIcon>
                <MenuLinkText>
                  <TextInfo
                    active={isProfileView('savedPlaces')}
                  >
                    {t('MY_ADDRESSES', 'My addresses')}
                  </TextInfo>
                </MenuLinkText>
                <MenuLinkSeparator>
                  <div>
                    <hr />
                  </div>
                </MenuLinkSeparator>
              </WrappContent>
            </MenuLink>
            {savedCardsAvailable && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'cards' })}
                href='/profile/cards'
              >
                <WrappContent>
                  <MenuLinkIcon active={typeof window !== 'undefined' && window.location.pathname === '/profile/cards'}>
                    <Icon name="creditCard" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo active={typeof window !== 'undefined' && window.location.pathname === '/profile/cards'}>
                      {t('MY_CARDS', 'My cards')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {!hideMessages && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'messages' })}
                href='/messages'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/messages'
                    }
                  >
                    <Icon name="message" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/messages'
                      }
                    >
                      {t('MESSAGES', 'Messages')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {hasMultipleLanguages && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'profile', search: '?view=language' })}
                href='/profile'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={isProfileView('language')}
                  >
                    <Icon name="translation" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={isProfileView('language')}
                    >
                      {t('LANGUAGE', 'Language')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            <MenuLink
              onClick={(e) => handleGoToPage(e, { page: 'profile', search: '?view=notifications' })}
              href='/profile'
            >
              <WrappContent>
                <MenuLinkIcon
                  active={isProfileView('notifications')}
                >
                  <Icon name="bell" />
                </MenuLinkIcon>
                <MenuLinkText>
                  <TextInfo
                    active={isProfileView('notifications')}
                  >
                    {t('NOTIFICATIONS', 'Notifications')}
                  </TextInfo>
                </MenuLinkText>
                <MenuLinkSeparator>
                  <div>
                    <hr />
                  </div>
                </MenuLinkSeparator>
              </WrappContent>
            </MenuLink>
            <h2>{t('INFORMATION', 'Information')}</h2>
            {!hideHelp && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'help' })}
                href='/help'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/help'
                    }
                  >
                    <Icon name="infoCircleOutline" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/help'
                      }
                    >
                      {t('HELP', 'help')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            {!hideSession && (
              <MenuLink
                onClick={(e) => handleGoToPage(e, { page: 'sessions' })}
                href='/sessions'
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={
                      window.location.pathname === '/sessions'
                    }
                  >
                    <Icon name="safety" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={
                        window.location.pathname === '/sessions'
                      }
                    >
                      {t('SESSIONS', 'Sessions')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
            <LogoutButton styleWrappContent={{ columnGap: '0px' }} hideIcon handleSuccessLogout={handleSuccessLogout} onCustomClick={() => actionSidebar(false)} />
          </>
        )}
        {!auth && (
          <>
            <MenuLink
              onClick={() => {
                handleOpenLoginSignUp('login')
                actionSidebar(false)
              }}
            >
              <WrappContent>
                <MenuLinkIcon
                  active={modalPageToShow === 'login'}
                >
                  <Icon name="login" />
                </MenuLinkIcon>
                <MenuLinkText>
                  <TextInfo
                    active={modalPageToShow === 'login'}
                  >
                    {t('SIGN_IN', 'Sign in')}
                  </TextInfo>
                </MenuLinkText>
                <MenuLinkSeparator>
                  <div>
                    <hr />
                  </div>
                </MenuLinkSeparator>
              </WrappContent>
            </MenuLink>
            {!isHideSignup && (
              <MenuLink
                onClick={() => {
                  handleOpenLoginSignUp('signup')
                  actionSidebar(false)
                }}
              >
                <WrappContent>
                  <MenuLinkIcon
                    active={modalPageToShow === 'signup'}
                  >
                    <Icon name="userAdd" />
                  </MenuLinkIcon>
                  <MenuLinkText>
                    <TextInfo
                      active={modalPageToShow === 'signup'}
                    >
                      {t('SIGNUP', 'Sign up')}
                    </TextInfo>
                  </MenuLinkText>
                  <MenuLinkSeparator>
                    <div>
                      <hr />
                    </div>
                  </MenuLinkSeparator>
                </WrappContent>
              </MenuLink>
            )}
          </>
        )}
      </SidebarContent>
      {modalIsOpen && !auth && (
        <Modal
          open={modalIsOpen}
          onClose={() => closeModal()}
          width='50%'
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              notificationState={notificationState}
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
              notificationState={notificationState}
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
              closeModal={() => closeModal()}
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
    </Container>
  )
}
