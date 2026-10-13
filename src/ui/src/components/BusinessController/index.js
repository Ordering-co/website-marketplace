import React, { useState, useRef, useMemo } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'

import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  ContainerCard,
  WrapperBusinessCard,
  BusinessHero,
  BusinessHeader,
  WrapperBusinessLogo,
  BusinessTags,
  BusinessContent,
  BusinessLogo,
  BusinessInfo,
  BusinessInfoItem,
  BusinessName,
  Medadata,
  CallCenterInformation,
  CallCenterInformationBullet,
  BusinessLogoWrapper,
  BusinessStarInfo,
  RibbonBox,
  FavoriteWrapper,
  BusinessHeaderClosedContainer,
  OpenAtContainer
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useSession } from '~components/contexts/SessionContext'
import { useApi } from '~components/contexts/ApiContext'
import { BusinessController as BusinessSingleCard } from '~components/components/BusinessController'
import { Alert } from '~ui/src/components/Confirm'
import { Modal } from '~ui/src/components/Modal'
import { LoginForm } from '~ui/src/components/LoginForm'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { ForgotPasswordForm } from '~ui/src/components/ForgotPasswordForm'
import { Button } from '~ui/src/styles/Buttons'
import { generalUtilities, lightenDarkenColor, shape } from '~ui/utils'
import { Icon } from '~ui-icon'

import { getUtils } from './utils'

const deliveryTypes = [1, 7]

const BusinessControllerUI = (props) => {
  const {
    isSkeleton,
    business,
    getBusinessOffer,
    handleClick,
    orderType,
    isCustomLayout,
    isCustomerMode,
    isBusinessOpen,
    businessWillCloseSoonMinutes,
    onPreorderBusiness,
    firstCard,
    minWidthEnabled,
    typeButton,
    children,
    businessHeader,
    businessFeatured,
    businessOffers,
    businessLogo,
    businessReviews,
    businessDeliveryPrice,
    businessDeliveryTime,
    businessPickupTime,
    businessDistance,
    handleFavoriteBusiness,
    businessState,
    businessUrlTemplate,
    fromBusinessListing,
    fromBusinessListingSearch,
    isShowMap,
    fromFavoriteList,
    fromMyOrders,
    hideProductList
  } = props

  const [configState] = useConfig()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ auth }, { login }] = useSession()
  const [ordering] = useApi()
  const [{ parsePrice, parseDistance, optimizeImage, parseTime }] = useUtils()
  const [orderState] = useOrder()
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const { convertHoursToMinutes, getTypes } = generalUtilities()
  const { getDeliveryIcon } = getUtils(ordering, theme)

  const favoriteRef = useRef(null)
  const businessRows = theme?.business_listing_view?.components?.layout?.rows
  const hideBusinessLogo = !fromBusinessListing
  const hideBusinessFee = theme?.business_listing_view?.components?.business?.components?.fee?.hidden
  const hideBusinessTime = theme?.business_listing_view?.components?.business?.components?.time?.hidden
  const hideBusinessDistance = theme?.business_listing_view?.components?.business?.components?.distance?.hidden
  const hideBusinessReviews = theme?.business_listing_view?.components?.business?.components?.reviews?.hidden
  const hideBusinessFavorite = !isShowMap && !fromFavoriteList
  const hideBusinessOffer = theme?.business_listing_view?.components?.business?.components?.offer?.hidden
  const hideBusinessHeader = theme?.business_listing_view?.components?.business?.components?.header?.hidden
  const resolvedHeader = businessHeader || business?.header || theme.images?.dummies?.businessHeader || ''
  const hideBusinessFavoriteBadge = true

  const isBusinessPreorder = onPreorderBusiness && !isBusinessOpen
  const businessUrl = useMemo(() => {
    return businessUrlTemplate?.replace(/:business_slug/g, business?.slug)
  }, [business?.slug, businessUrlTemplate])

  // const handleShowAlert = () => {
  //   setAlertState({ open: true, content: [t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The Business is closed at the moment')] })
  // }

  const handleBusinessClick = (e) => {
    e.preventDefault()
    if (favoriteRef?.current?.contains(e.target)) return
    if (isBusinessPreorder) onPreorderBusiness(business)
    else handleClick(business)
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteBusiness && handleFavoriteBusiness(!businessState?.business?.favorite)
    } else {
      setModalPageToShow('login')
      setIsModalOpen(true)
    }
  }

  const closeAuthModal = () => {
    setIsModalOpen(false)
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
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
  }

  const hasInformationLength = !!business?.idle_drivers_count || !!business?.busy_drivers_count || !!business?.activated_orders

  const checkTime = (val) => val < 10 ? `0${val}` : val

  const findTodayLapse = () => {
    if (business?.today?.enabled) {
      const currentDate = dayjs().tz(business?.timezone)
      const lapse = business?.today?.lapses?.find((lapse) => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
      return lapse || business?.today?.lapses?.[0]
    }
  }

  if (typeButton) {
    return (
      <ContainerCard typeButton={typeButton}>
        {children}
      </ContainerCard>
    )
  }

  return (
    <>
      <ContainerCard
        isSkeleton={isSkeleton}
        isCustomerMode={isCustomerMode && hasInformationLength}
        fromFavoriteList={fromFavoriteList}
        fromMyOrders={fromMyOrders}
        firstCard={firstCard}
        minWidthEnabled={minWidthEnabled}
        hideProductList={hideProductList}
        fromBusinessListingSearch={fromBusinessListingSearch}
        businessRows={businessRows}
        isShowMap={isShowMap}
        disabled={business?.enabled === false}
        m={props.m}
      >
        <WrapperBusinessCard
          disabled={business?.enabled === false}
          isSkeleton={isSkeleton}
          onClick={(e) => !isSkeleton && handleClick && handleBusinessClick(e)}
          href={!isBusinessPreorder ? businessUrl : null}
        >
          {!fromFavoriteList && !fromMyOrders && business?.ribbon?.enabled && (
            <RibbonBox
              isShowMap={isShowMap}
              bgColor={business?.ribbon?.color}
              colorText={lightenDarkenColor(business?.ribbon?.color)}
              borderRibbon={lightenDarkenColor(business?.ribbon?.color)}
              isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
              isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
            >
              {business?.ribbon?.text}
            </RibbonBox>
          )}
          {!fromFavoriteList && !fromMyOrders && (
            <BusinessHero>
              {isSkeleton
                ? (
                <Skeleton height={isCustomerMode ? 100 : 140} />
                  )
                : (
                <BusinessHeader bgimage={!hideBusinessHeader && resolvedHeader ? optimizeImage(resolvedHeader, 'h_400,c_limit') : ''} logo={(businessLogo || business?.logo) ? optimizeImage((businessLogo || business?.logo), 'h_200,c_limit') : ''} name={business?.name} isClosed={!isBusinessOpen} fromBusinessListing={fromBusinessListing} isShowMap={isShowMap}>
                  <BusinessTags hasRibbon={!!business?.ribbon?.enabled}>
                    {(businessFeatured ?? business?.featured) && !hideBusinessFavoriteBadge &&
                      <span className='crown'>
                        <Icon name="crown" />
                      </span>}
                    {!hideBusinessOffer && !isCustomLayout && (configState?.configs?.preorder_status_enabled?.value === '1') && (
                      <div className={isShowMap ? 'map-business-tag' : 'business-tag'}>
                        {!!getBusinessOffer((businessOffers ?? business?.offers)) && <span>{t('DISCOUNT', 'Discount')}{' '}{getBusinessOffer((businessOffers ?? business?.offers))}</span>}
                        {!isBusinessOpen && <span>{t('PREORDER', 'Preorder')}</span>}
                      </div>
                    )}
                  </BusinessTags>
                  {!isShowMap && (
                    <BusinessHeaderClosedContainer>
                      <div>
                        {!!businessWillCloseSoonMinutes && orderState?.options?.moment === null && isBusinessOpen && business?.enabled !== false && (
                          <h1>{businessWillCloseSoonMinutes} {t('MINUTES_TO_CLOSE', 'minutes to close')}</h1>
                        )}
                        {!isBusinessOpen && <h1 className='closed'>{t('CLOSED', 'Closed')}{business?.enabled === false && `(${t('DISABLED', 'Disabled')})`}</h1>}
                      </div>
                      {business?.disabled_reason && business?.enabled === false && (
                        <h2 className='disabled'>{business?.disabled_reason}</h2>
                      )}
                    </BusinessHeaderClosedContainer>
                  )}
                </BusinessHeader>
                  )}
            </BusinessHero>
          )}
          <BusinessContent isCustomerMode={isCustomerMode} fromBusinessListing={fromBusinessListing} isShowMap={isShowMap}>
            <BusinessInfo className='info' isCustomerMode={isCustomerMode}>
              <BusinessLogoWrapper hideBusinessLogo={hideBusinessLogo}>
                {!hideBusinessLogo && (isSkeleton || businessLogo || business?.logo) && (
                  <WrapperBusinessLogo isSkeleton={isSkeleton} isCustomerMode={isCustomerMode}>
                    {!isSkeleton
                      ? (
                        <BusinessLogo bgimage={optimizeImage((businessLogo || business?.logo), 'h_200,c_limit')} />
                        )
                      : (
                        <Skeleton height={70} width={70} />
                        )}
                  </WrapperBusinessLogo>
                )}
              </BusinessLogoWrapper>
              <BusinessInfoItem fromMyOrders={fromMyOrders}>
                <div className='name-content'>
                  {business?.name
                    ? (
                        <>
                          <BusinessName fontSize={isShowMap || fromFavoriteList || fromMyOrders || fromBusinessListing ? '20px' : '16px'}>{business?.name}</BusinessName>
                          <BusinessStarInfo fromMyOrders={fromMyOrders}>
                            {!hideBusinessReviews && !isShowMap && !fromFavoriteList && !fromBusinessListing && (
                              <>
                                {!isSkeleton
                                  ? (
                                      (businessReviews ?? business?.reviews?.total) > 0 && (
                                        <div className='reviews'>
                                          <Icon name="star" />
                                          <span>{(businessReviews ?? business?.reviews?.total)}</span>
                                        </div>
                                      )
                                    )
                                  : (
                                    <Skeleton width={50} />
                                    )}
                              </>
                            )}
                            {(!hideBusinessFavorite || fromBusinessListing) && !isCustomerMode && (
                              <FavoriteWrapper ref={favoriteRef} onClick={handleChangeFavorite}>
                                {!isSkeleton
                                  ? (
                                    <>
                                      {(businessState?.business?.favorite) ? <Icon name="heartFilled" /> : <Icon name="heartOutline" />}
                                    </>
                                    )
                                  : (
                                    <Skeleton width={16} height={16} />
                                    )}
                              </FavoriteWrapper>
                            )}
                          </BusinessStarInfo>
                        </>
                      )
                    : (
                      <Skeleton width={100} />
                      )}
                </div>
                {(fromFavoriteList || fromMyOrders || fromBusinessListing) && (
                  <Medadata isSkeleton={isSkeleton} fromBusinessListing={fromBusinessListing} fromFavoriteList={fromFavoriteList} flexStart >
                    {!hideBusinessReviews && !fromMyOrders && (businessReviews ?? business?.reviews?.total) > 0 && (
                      <BusinessStarInfo fontSize='18px' fromFavoriteList={fromFavoriteList} fromMyOrders={fromMyOrders} fromBusinessListing={fromBusinessListing}>
                        {!isSkeleton
                          ? (
                              <div className='reviews'>
                                <Icon name="star" />
                                <span>{(businessReviews ?? business?.reviews?.total)}</span>
                              </div>
                            )
                          : (
                              <Skeleton width={50} />
                            )}
                      </BusinessStarInfo>
                    )}
                    {(getTypes(business) || business?.description) && (
                      <p className='bullet'>
                        <Icon name="dot" />
                        {getTypes(business) || business?.description}
                      </p>
                    )}
                  </Medadata>
                )}
                <Medadata
                  isCustomerMode={isCustomerMode}
                  isSkeleton={isSkeleton}
                  flexStart={isShowMap || fromFavoriteList || fromMyOrders}
                  gap='10px'
                  fontSize={fromFavoriteList || fromMyOrders || fromBusinessListing ? '14px' : '16px'}
                  fromBusinessListing={fromBusinessListing}
                  isShowMap={isShowMap}
                >
                  {!hideBusinessTime && (
                      <>
                        {Object.keys(business).length > 0
                          ? (
                            <p>
                              <Icon name="clock" />
                              {convertHoursToMinutes(deliveryTypes.includes(orderState?.options?.type) ? (businessDeliveryTime ?? business?.delivery_time) : (businessPickupTime ?? business?.pickup_time)) || <Skeleton width={100} />}
                            </p>
                            )
                          : (
                            <Skeleton width={65} />
                            )}
                      </>
                  )}
                  {!hideBusinessFee && deliveryTypes.includes(orderType) && (
                    <>
                      {(businessDeliveryPrice ?? business?.delivery_price) >= 0
                        ? (
                          <p className='business-info-item'>
                            {getDeliveryIcon()}
                            {business && parsePrice((businessDeliveryPrice ?? business?.delivery_price))}
                          </p>
                          )
                        : (
                          <Skeleton width={isCustomerMode ? 70 : 65} />
                          )}
                    </>
                  )}
                  {!hideBusinessDistance && (!deliveryTypes.includes(orderType) || isShowMap || fromBusinessListing) && (
                    <>
                      {(businessDistance ?? business?.distance) >= 0
                        ? (
                          <p className='business-info-item overflow-hidden'>
                            {!fromBusinessListing && (
                              <>
                                {isShowMap ? <Icon name="dot" /> : <Icon name="mapMarker" />}
                              </>
                            )}
                            {parseDistance((businessDistance ?? business?.distance))}
                          </p>
                          )
                        : (
                          <Skeleton width={65} />
                          )}
                    </>
                  )}
                  {isCustomerMode && hasInformationLength && (
                    <CallCenterInformation>
                      {business?.idle_drivers_count > 0 && (
                        <CallCenterInformationBullet bgcolor='#4CAF50'>
                          <Icon name="car" />
                          {business?.idle_drivers_count}
                        </CallCenterInformationBullet>
                      )}
                      {business?.busy_drivers_count > 0 && (
                        <CallCenterInformationBullet bgcolor='#E91E63'>
                          <Icon name="car" />
                          {business?.busy_drivers_count}
                        </CallCenterInformationBullet>
                      )}
                      {business?.activated_orders > 0 && (
                        <CallCenterInformationBullet bgcolor='#FF9800'>
                          <Icon name="basket" />
                          {business?.activated_orders}
                        </CallCenterInformationBullet>
                      )}
                    </CallCenterInformation>
                  )}
                </Medadata>
                {(fromFavoriteList || fromMyOrders) && !isSkeleton && (
                  <Medadata isSkeleton={isSkeleton} >
                    <OpenAtContainer isClosed={!(business?.open && business?.today?.enabled)}>
                      {!isSkeleton
                        ? (
                          <p>
                            {business?.open && business?.today?.enabled
                              ? `${t('OPEN_AT', 'OPEN AT')} ${parseTime && parseTime(moment(`${checkTime(findTodayLapse()?.open?.hour)}:${checkTime(findTodayLapse()?.open?.minute)}`, 'HH:mm'))} - ${parseTime && parseTime(moment(`${checkTime(findTodayLapse()?.close?.hour)}:${checkTime(findTodayLapse()?.close?.minute)}`, 'HH:mm'))}`
                              : t('STORE_CLOSED', 'Store closed')}
                          </p>
                          )
                        : (
                          <Skeleton width={65} />
                          )}
                    </OpenAtContainer>
                    {!fromMyOrders && (
                      <Button
                        color='lightGray'
                        className='order-now-button'
                      >
                        {t('ORDER_NOW', 'Order now')}
                      </Button>
                    )}
                  </Medadata>
                )}
              </BusinessInfoItem>
            </BusinessInfo>
          </BusinessContent>
        </WrapperBusinessCard>
      </ContainerCard>
      <Alert
        title={t('BUSINESS_CLOSED', 'Business Closed')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => setAlertState({ open: false, content: [] })}
        onAccept={() => setAlertState({ open: false, content: [] })}
        closeOnBackdrop={false}
      />
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onRemove={() => closeAuthModal()}
          onClose={() => closeAuthModal()}
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
              closeModal={() => closeAuthModal()}
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

export const BusinessController = (props) => {
  const businessControllerProps = {
    ...props,
    UIComponent: BusinessControllerUI
  }

  return (
    <BusinessSingleCard {...businessControllerProps} />
  )
}
