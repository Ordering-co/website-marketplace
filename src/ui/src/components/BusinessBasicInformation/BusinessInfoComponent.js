import React, { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'

import {
  BusinessDetail,
  BusinessDeliveryDetail,
  BusinessInfo,
  BusinessInfoContainer,
  BusinessInfoContent,
  BusinessInfoItem,
  IconWrapper,
  RibbonBox,
  SearchContainer,
  SocialList,
  TitleWrapper,
  BusinessContent,
  WrapperBusinessLogo,
  BusinessLogo,
  FavoriteWrapper
} from './styles'

import { SocialNetWork } from './SocialNetWork'
import { SearchComponent } from './SearchComponent'

import { useConfig } from '~components/contexts/ConfigContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useSession } from '~components/contexts/SessionContext'
import { useApi } from '~components/contexts/ApiContext'
import { useToast, ToastType } from '~components/contexts/ToastContext'
import { nanoid } from 'nanoid'
import { BusinessReservation } from '~ui/src/components/BusinessReservation'
import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '~ui/src/components/Modal'
import { lightenDarkenColor, shape, generalUtilities } from '~ui/utils'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { LoginForm } from '~ui/src/components/LoginForm'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { ForgotPasswordForm } from '~ui/src/components/ForgotPasswordForm'

import { Icon } from '~ui-icon'

const safeParseReservationEnabledValue = (raw) => {
  const fallback = {}
  if (raw === undefined || raw === null) return fallback
  const str = typeof raw === 'string' ? raw.trim() : String(raw)
  if (str === '') return fallback
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

export const BusinessInfoComponent = (props) => {
  const {
    loading,
    business,
    isInfoShrunken,
    isCustomerMode,
    setIsPreOrder,
    setIsBusinessReviews,
    categoryState,
    searchValue,
    errorQuantityProducts,
    setOpenSearchProducts,
    handleChangeSortBy,
    sortByValue,
    sortByOptions,
    isCustomLayout,
    currentCart,
    setOpenBusinessInformation,
    handleFavoriteBusiness,
    hideHeaderBanner,
    showStoreSwitcher,
    handleSearchRedirect
  } = props

  const theme = useTheme()
  const [orderState] = useOrder()
  const [{ auth }, { login }] = useSession()
  const [ordering] = useApi()
  const [, { showToast }] = useToast()
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils()
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const windowSize = useWindowSize()
  const { convertHoursToMinutes, getTypes } = generalUtilities()
  const [openReservations, setOpenReservations] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, page: null })

  const hideTime = theme?.business_view?.components?.header?.components?.business?.components?.time?.hidden
  const hideReviews = theme?.business_view?.components?.header?.components?.business?.components?.reviews?.hidden
  const hideDistance = true
  const hideCity = theme?.business_view?.components?.header?.components?.business?.components?.city?.hidden
  const hideBusinessRibbon = true
  const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
  const singleBusinessRedirect = window.localStorage.getItem('single_business')
  const businessReservationEnabledConfig = business?.configs?.find(config => config?.key === 'reservation_enabled')
  const reservationEnabledValue = businessReservationEnabledConfig
    ? safeParseReservationEnabledValue(businessReservationEnabledConfig?.value ?? '{}')
    : safeParseReservationEnabledValue(configs?.reservation_enabled?.value ?? '{}')

  const showReservationCta = !loading &&
    orderState?.options?.type === 9 &&
    categoryState?.products?.length !== 0 &&
    reservationEnabledValue === 1

  const handleChangeStoreRedirect = () => {
    window.localStorage.setItem('change_store_redirect', 'true')
    window.localStorage.removeItem('single_business')
    handleSearchRedirect?.()
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteBusiness && handleFavoriteBusiness(!business?.favorite)
    } else {
      setModalState({ isOpen: true, page: 'login' })
    }
  }

  const handleClickReservation = async () => {
    if (!auth) {
      try {
        const guestToken = nanoid()
        const { content: { error, result } } = await ordering.users().save({ guest_token: guestToken })
        if (error) {
          showToast(ToastType.Error, Array.isArray(result) ? result[0] : result)
          return
        }
        login({ user: result, token: result?.session?.access_token })
      } catch (err) {
        showToast(ToastType.Error, err.message)
        return
      }
    }
    setOpenReservations(true)
  }

  const hasAutoOpenedReservation = useRef(false)

  useEffect(() => {
    if (hasAutoOpenedReservation.current || !showReservationCta) return
    hasAutoOpenedReservation.current = true
    setOpenReservations(true)
  }, [showReservationCta])

  const closeAuthModal = () => {
    setModalState({ isOpen: false, page: null })
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalState({ isOpen: true, page })
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  const searchComponentProps = {
    setOpenSearchProducts,
    handleChangeSortBy,
    sortByValue,
    sortByOptions
  }

  return (
    <BusinessInfoContainer isFlexEnd={windowSize.width >= 768} $hideHeaderBanner={hideHeaderBanner}>
      <BusinessInfoContent>
        <BusinessInfo className='info'>
          {windowSize.width >= 768 && business?.logo && (
            <BusinessContent>
              <WrapperBusinessLogo>
                {!loading && (
                  <BusinessLogo bgimage={optimizeImage(business?.logo, 'h_200,c_limit')} />
                )}
              </WrapperBusinessLogo>
            </BusinessContent>
          )}
          <BusinessInfoItem isInfoShrunken={isInfoShrunken}>
            {!loading
              ? (
                <TitleWrapper isCustomLayout={isCustomLayout} disableLeftSpace={singleBusinessRedirect}>
                  <div className='title-wrapper'>
                    <div className='title-wrapper-left'>
                      <h2 className='bold' id='business_name'>{business?.name}</h2>
                      <FavoriteWrapper onClick={() => handleChangeFavorite(!business?.favorite)}>
                        {!loading
                          ? (
                            <>
                              {(business?.favorite) ? <Icon name="heartFilled" /> : <Icon name="heartOutline" />}
                            </>
                            )
                          : (
                            <Skeleton width={16} height={16} />
                            )}
                      </FavoriteWrapper>
                    </div>
                    <div>
                      {!loading
                        ? (
                          <SocialList>
                            {business?.facebook_profile && (
                              <SocialNetWork
                                url={business?.facebook_profile}
                                icon={<Icon name="facebook" />}
                              />
                            )}
                            {business?.instagram_profile && (
                              <SocialNetWork
                                url={business?.instagram_profile}
                                icon={<Icon name="instagram" />}
                              />
                            )}
                            {business?.tiktok_profile && (
                              <SocialNetWork
                                url={business?.tiktok_profile}
                                icon={<Icon name="tiktok" />}
                              />
                            )}
                            {business?.pinterest_profile && (
                              <SocialNetWork
                                url={business?.pinterest_profile}
                                icon={<Icon name="pinterest" />}
                              />
                            )}
                            {business?.whatsapp_number && (
                              <SocialNetWork
                                url={business?.whatsapp_number}
                                icon={<Icon name="whatsapp" />}
                              />
                            )}
                            {business?.snapchat_profile && (
                              <SocialNetWork
                                url={business?.snapchat_profile}
                                icon={<Icon name="snapchat" />}
                              />
                            )}
                          </SocialList>
                          )
                        : (
                          <SocialList>
                            {[...Array(5).keys()].map(i => (
                              <IconWrapper isSkeleton key={i}>
                                <Skeleton width={27} height={27} />
                              </IconWrapper>
                            ))}
                          </SocialList>
                          )}
                          <SearchContainer>
                            {
                              windowSize.width >= 768 && !loading &&
                              (categoryState?.products?.length !== 0 || searchValue) &&
                              !errorQuantityProducts &&
                              !isInfoShrunken &&
                              !business?.professionals?.length && (
                                <SearchComponent {...searchComponentProps} />
                              )
                            }
                          </SearchContainer>

                    </div>
                  </div>
                  <span id='business_name_feedback' />
                  {!hideBusinessRibbon && business?.ribbon?.enabled && (
                    <RibbonBox
                      bgColor={business?.ribbon?.color}
                      colorText={lightenDarkenColor(business?.ribbon?.color)}
                      borderRibbon={lightenDarkenColor(business?.ribbon?.color)}
                      isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
                      isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
                    >
                      {business?.ribbon?.text}
                    </RibbonBox>
                  )}
                </TitleWrapper>
                )
              : (
                <Skeleton width={isCustomerMode ? 100 : 150} height={isCustomerMode ? 35 : 'auto'} />
                )}
            {typeof hideCity !== 'undefined' && !hideCity && business?.city?.name && (
              <>
                {!loading
                  ? (
                    <p className='type'>{business?.city?.name}</p>
                    )
                  : (
                    <Skeleton width={isCustomerMode ? 100 : 150} />
                    )}
              </>
            )}
            {
              !loading
                ? (
                  <div>
                    {business?.address && (
                      <span className='address'>{business?.address}</span>
                    )}
                  </div>
                  )
                : (
                  <Skeleton width={isCustomerMode ? 100 : 150} />
                  )
            }
            {
              !loading
                ? (
                  <div>
                    {(getTypes(business) || business?.description || business?.seo_description) && (
                      <span className='description'>{getTypes(business) || business?.description || business?.seo_description}</span>
                    )}
                  </div>
                  )
                : (
                  <Skeleton width={isCustomerMode ? 100 : 150} />
                  )
            }
          </BusinessInfoItem>
        </BusinessInfo>
        <BusinessDeliveryDetail $hideHeaderBanner={hideHeaderBanner}>
          {
            !loading
              ? (
                <div className='preorder-reviews-container'>
                  {!hideReviews && business?.reviews?.total > 0 && (
                    <>
                      {!loading
                        ? (
                          <Button color='darkGray' onClick={() => setIsBusinessReviews(true)}>
                            <Icon name="starFilled" className='start' />
                            <p>{business?.reviews?.total}</p>
                          </Button>
                          )
                        : (
                          <Skeleton width={isCustomerMode ? 100 : 50} />
                          )}
                    </>
                  )}
                  {showStoreSwitcher && (
                    <Button
                      color='darkGray'
                      aria-label={t('CHANGE_STORE', 'Change store')}
                      onClick={handleChangeStoreRedirect}
                    >
                      <Icon name="arrowLeftRight" />
                      {t('CHANGE_STORE', 'Change store')}
                    </Button>
                  )}
                  <Button color='darkGray' onClick={() => setOpenBusinessInformation(true)}>
                    <Icon name="infoCircle" />
                    {t('INFO', 'Info')}
                  </Button>
                  {isPreOrderSetting && (
                    <Button color='darkGray' onClick={() => setIsPreOrder(true)}>{isCustomerMode ? t('CHANGE_SCHEDULE', 'Change schedule') : t('PREORDER', 'Preorder')}</Button>
                  )}
                  {showReservationCta && (
                    <Button color='primary' onClick={() => handleClickReservation()}>
                      <Icon name="clock" />
                      {t('RESERVATIONS', 'Reservations')}
                    </Button>
                  )}
                </div>
                )
              : (
                <Skeleton width={isCustomerMode ? 100 : 150} />
                )
          }
          <BusinessDetail isSkeleton={loading}>
            {!loading
              ? (
                <>
                  {orderState?.options.type === 1
                    ? (
                      <div className='info-item'>
                        {business && parsePrice(business?.delivery_price || 0)}
                        <span>{t('DELIVERY_FEE', 'Delivery fee')}</span>
                      </div>
                      )
                    : (
                      <div className='info-item'>
                        {business && parsePrice(business?.service_fee || 0)}
                        <span>{t('SERVICE_FEE', 'Service fee')}</span>
                      </div>
                      )}
                </>
                )
              : (
                <Skeleton width={isCustomerMode ? 70 : 50} />
                )}
            {!hideTime && (
              <>
                {!loading
                  ? (
                    <>
                      {orderState?.options?.type === 1
                        ? (
                          <div className='info-item'>
                            {convertHoursToMinutes(business?.delivery_time)}
                            <span>{t('DELIVERY_TIME', 'Delivery time')}</span>
                          </div>
                          )
                        : (
                          <div className='info-item'>
                            {convertHoursToMinutes(business?.pickup_time)}
                            <span>{t('PICKUP_TIME', 'Pickup time')}</span>
                          </div>
                          )}
                    </>
                    )
                  : (
                    <Skeleton width={isCustomerMode ? 70 : 50} />
                    )}
              </>
            )}
            {!hideDistance && (
              <>
                {!loading
                  ? (
                    <>
                      <h5>
                        {parseDistance(business?.distance || 0)}
                      </h5>
                    </>
                    )
                  : (
                    <Skeleton width={isCustomerMode ? 70 : 50} />
                    )}
              </>
            )}
          </BusinessDetail>
        </BusinessDeliveryDetail>
        {
          windowSize.width < 768 && !loading &&
          (categoryState?.products?.length !== 0 || searchValue) &&
          !errorQuantityProducts &&
          !isInfoShrunken &&
          !business?.professionals?.length && (
            <SearchContainer mobile>
              <SearchComponent {...searchComponentProps} />
            </SearchContainer>
          )
        }
      </BusinessInfoContent>
      <Modal
        title={business?.name}
        open={openReservations}
        disableDefaultStyleOnRender
        onClose={() => setOpenReservations(false)}
      >
        <BusinessReservation
          cart={currentCart}
          business={business}
          isCustomerMode={isCustomerMode}
          scheduleList={business?.schedule}
          setOpenReservations={setOpenReservations}
        />
      </Modal>
      {modalState.isOpen && (
        <Modal
          open={modalState.isOpen}
          onRemove={() => closeAuthModal()}
          onClose={() => closeAuthModal()}
          width='50%'
          authModal
        >
          {modalState.page === 'login' && (
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
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset Password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {modalState.page === 'signup' && (
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
              closeModal={() => closeAuthModal()}
            />
          )}
          {modalState.page === 'forgotpassword' && (
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
    </BusinessInfoContainer>
  )
}
