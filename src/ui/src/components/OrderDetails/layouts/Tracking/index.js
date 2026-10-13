import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'

import { useApi } from '~components/contexts/ApiContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { GoogleMaps as GoogleMapsMap } from '~components/components/GoogleMaps'
import { getGoogleMapImage, generalUtilities } from '~ui/utils'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { isCourierTrackingProject } from '~/utils/trackingOnlyMode'
import { Icon } from '~ui-icon'
import { useDriverLocationInterpolation } from '../../../../hooks/useDriverLocationInterpolation'
import { OrderEtaRange } from './OrderEtaRange'
import { DeliveryOrderTabs } from './DeliveryOrderTabs'
import { SatisfactionSurvey } from './SatisfactionSurvey'
import { TrackingProductItem } from './TrackingProductItem'
import {
  getTrackingStep,
  getTrackingPercentage,
  canShowLiveMap,
  getDriverPlate,
  isRejectedStatus,
  isCompletedStatus,
  isDeliveredStatus,
  isDeliveryOrder,
  getTrackingMarkerIcons,
  getTrackingSurveyImage,
  TRACKING_MAP_STATUSES
} from './trackingUtils'
import {
  Container,
  WrapperContainer,
  HeaderContent,
  StatusBarContainer,
  StageIcon,
  ReviewedText,
  MapWrapper,
  Map,
  MapTrackingWrapper,
  MapExpandToggle,
  InfoCard,
  SectionTitleContainer,
  PersonRow,
  PhotoBlock,
  SkeletonList,
  SkeletonCenter
} from './styles'

const STAGE_POSITIONS = [0, 33.33, 66.66, 100]

const parseLocation = (location) => {
  if (!location) return null
  if (typeof location.location === 'string') {
    const [lat, lng] = location.location.split(',').map((value) => parseFloat(value.replace(/[^-.0-9]/g, '')))
    return { ...location, lat, lng }
  }
  return location
}

export const OrderTrackingLayout = (props) => {
  const {
    driverLocation,
    googleMapsControls,
    handleOrderRedirect,
    hashKey
  } = props
  const { order, loading, error } = props.order

  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parseDate, timeFormat }] = useUtils()
  const { getStatusPrefix } = generalUtilities()
  const theme = useTheme()
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const driverMarkersRef = useRef(null)

  const status = parseInt(order?.status, 10)
  const isRejected = isRejectedStatus(status)
  const isCompleted = isCompletedStatus(status)
  const isDelivered = isDeliveredStatus(status)
  const isDelivery = isDeliveryOrder(order?.delivery_type)
  const isPickup = order?.delivery_type === 2
  const step = getTrackingStep(status)
  const googleMapsApiKey = configs?.google_maps_api_key?.value
  const hourFormat = timeFormat || 'hh:mm A'

  const hideProgress = theme?.confirmation?.components?.order?.components?.progress?.hidden
  const hideBusinessMap = theme?.confirmation?.components?.business?.components?.map?.hidden
  const hideDriverName = theme?.confirmation?.components?.driver?.components?.name?.hidden
  const hideDriverPhoto = theme?.confirmation?.components?.driver?.components?.photo?.hidden
  const hideDriverPhone = theme?.confirmation?.components?.driver?.components?.phone?.hidden
  const hideCustomerPhoto = theme?.confirmation?.components?.customer?.components?.photo?.hidden
  const hideCustomerEmail = theme?.confirmation?.components?.customer?.components?.email?.hidden
  const hideCustomerPhone = theme?.confirmation?.components?.customer?.components?.phone?.hidden
  const hideCustomerAddress = theme?.confirmation?.components?.customer?.components?.address?.hidden
  const hideReviews = theme?.orders?.components?.review_order_button?.hidden

  const externalDriver = order?.external_driver
    ? {
        name: order.external_driver.name,
        lastname: '',
        photo: order.external_driver.photo,
        phone: order.external_driver.phone,
        location: (order.external_driver.latitude != null && order.external_driver.longitude != null)
          ? { lat: Number(order.external_driver.latitude), lng: Number(order.external_driver.longitude) }
          : null
      }
    : null
  const driver = order?.external_driver_id ? externalDriver : order?.driver
  const driverPhone = driver?.cellphone || driver?.phone
  const driverPlate = getDriverPlate(driver)
  const effectiveDriverLocation = driverLocation || driver?.location
  const showLiveMap = !isRejected && !!googleMapsApiKey && canShowLiveMap(order, effectiveDriverLocation)
  const showStaticMap = !showLiveMap && !isRejected && !isCompleted && !!googleMapsApiKey && !hideBusinessMap &&
    !!order?.business?.location && !TRACKING_MAP_STATUSES.includes(status)
  const showDeliveryProgress = isDelivery && !isRejected
  const showSurvey = !isRejected && !hideReviews && isDelivered
  const showTabs = isDelivery && !isRejected && !isCompleted
  const surveyImage = getTrackingSurveyImage(theme, order)
  const isCourierTracking = isCourierTrackingProject(ordering?.project)

  const stageIcons = [
    theme?.images?.icons?.store,
    theme?.images?.icons?.driver,
    theme?.images?.icons?.home,
    theme?.images?.icons?.delivered
  ]
  const stageTexts = [
    t('TRACKING_STAGE_PREPARING', 'We are preparing your order'),
    t('TRACKING_STAGE_ON_THE_WAY', 'On the way to your address'),
    t('TRACKING_STAGE_ARRIVED', 'Your order has arrived'),
    t('TRACKING_STAGE_DELIVERED', 'We have delivered your order')
  ]
  const legacyStatus = getStatusPrefix({ status, isPickup })
  const percentage = showDeliveryProgress ? getTrackingPercentage(step) : (legacyStatus?.percentage ?? 0)
  const statusText = showDeliveryProgress ? stageTexts[step] : legacyStatus?.value
  const deliveredAt = order?.reporting_data?.at?.[`status:${order?.status}`]

  const markerIcons = getTrackingMarkerIcons(theme, order)
  const locations = [
    parseLocation({ ...effectiveDriverLocation, icon: markerIcons.driver }),
    parseLocation({ ...order?.business?.location, icon: markerIcons.business }),
    parseLocation({ ...order?.customer?.location, icon: markerIcons.customer })
  ]

  const pricedProducts = useMemo(
    () => isCourierTracking
      ? (order?.products || [])
      : (order?.products || []).filter(product => Number(product?.price) > 0),
    [order?.products, isCourierTracking]
  )
  const productList = useMemo(() => pricedProducts.map(product => (
    <TrackingProductItem
      key={product.id}
      product={product}
      toppingsRemoved={order?.toppings_removed?.[product?.code]}
      hidePrice={isCourierTracking}
    />
  )), [pricedProducts, order?.toppings_removed, isCourierTracking])

  const handleDriverMarkerUpdate = useCallback((position) => {
    if (driverMarkersRef.current && window.google?.maps) {
      const newPos = new window.google.maps.LatLng(position.lat, position.lng)
      if (driverMarkersRef.current.centerMarker) {
        driverMarkersRef.current.centerMarker.setPosition(newPos)
      }
      if (driverMarkersRef.current.driverMarker) {
        driverMarkersRef.current.driverMarker.setPosition(newPos)
      }
    }
  }, [])

  useDriverLocationInterpolation(
    showLiveMap ? driverLocation : null,
    { onPositionUpdate: showLiveMap ? handleDriverMarkerUpdate : null }
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isMapExpanded) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMapExpanded])

  const toggleMapExpanded = () => {
    setIsMapExpanded((expanded) => !expanded)
    setTimeout(() => window.dispatchEvent(new Event('resize')), 150)
  }

  if (loading && !error) {
    return (
      <Container data-doc-section='order-tracking-loading'>
        <WrapperContainer>
          <SkeletonList>
            <SkeletonCenter>
              <Skeleton height={30} width={260} />
            </SkeletonCenter>
            <Skeleton height={12} />
            <Skeleton height={20} width={220} />
            <Skeleton height={350} />
            <Skeleton height={120} />
          </SkeletonList>
        </WrapperContainer>
      </Container>
    )
  }

  if (!loading && error) {
    const isExpired = error.includes('ERROR_ACCESS_EXPIRED')
    return (
      <Container data-doc-section='order-tracking-error'>
        <WrapperContainer>
          {isExpired
            ? (
              <NotFoundSource
                content={t('ERROR_ACCESS_EXPIRED', 'Sorry, the order has expired.')}
              />
              )
            : (
              <NotFoundSource
                content={t('NOT_FOUND_ORDER', 'Sorry, we couldn\'t find the requested order.')}
                btnTitle={t('GO_TO_HOME', 'Go to home')}
                onClickButton={handleOrderRedirect}
              />
              )}
        </WrapperContainer>
      </Container>
    )
  }

  if (!order || Object.keys(order).length === 0) return null

  return (
    <Container data-doc-section='order-tracking'>
      <WrapperContainer>
        <HeaderContent>
          {isRejected && (
            <p className='order-status' data-doc-section='order-tracking-canceled'>{t('ORDER_CANCELED', 'Order canceled')}</p>
          )}
          {!isRejected && statusText && (
            <p className='order-status' data-doc-section='order-tracking-status'>{statusText}</p>
          )}

          {!isRejected && !hideProgress && (
            <StatusBarContainer percentage={percentage} data-doc-section='order-tracking-stages'>
              {STAGE_POSITIONS.map((position, index) => (
                <StageIcon
                  key={position}
                  position={position}
                  active={showDeliveryProgress ? step >= index : (index === 3 ? percentage === 100 : percentage >= position)}
                >
                  {stageIcons[index] && <img src={stageIcons[index]} alt='' />}
                </StageIcon>
              ))}
            </StatusBarContainer>
          )}

          {showDeliveryProgress && (
            <p className='eta-range' data-doc-section='order-tracking-eta'>
              {isCompleted
                ? (
                  <>
                    {t('DELIVERED_AT', 'Delivered at')}:{' '}
                    <b>{deliveredAt ? parseDate(deliveredAt, { outputFormat: hourFormat }) : ''}</b>
                  </>
                  )
                : (
                  <>
                    {t('ESTIMATED_DELIVERY', 'Estimated delivery')}:{' '}
                    <b><OrderEtaRange order={order} outputFormat={hourFormat} /></b>
                  </>
                  )}
            </p>
          )}

          {isRejected && (
            <ReviewedText>
              <p>{t('ORDER_HAS_BEEN_CANCELED', 'This order has been canceled')}</p>
            </ReviewedText>
          )}

          {showSurvey && (
            <SatisfactionSurvey order={order} hashKey={hashKey} image={surveyImage} />
          )}

          {showStaticMap && (
            <MapWrapper data-doc-section='order-tracking-static-map'>
              <Map>
                <img
                  src={getGoogleMapImage(order.business.location, googleMapsApiKey, { zoom: 15 })}
                  id='google-maps-image'
                  alt='google-maps-location'
                  loading='lazy'
                />
              </Map>
            </MapWrapper>
          )}
        </HeaderContent>

        {showLiveMap && (
          <MapTrackingWrapper expanded={isMapExpanded} data-doc-section='order-tracking-map'>
            <Map>
              <GoogleMapsMap
                location={parseLocation(effectiveDriverLocation)}
                locations={locations}
                mapControls={googleMapsControls}
                apiKey={googleMapsApiKey}
                manualZoom
                animateDriver
                onDriverMarkerReady={(markers) => { driverMarkersRef.current = markers }}
              />
            </Map>
            <MapExpandToggle
              type='button'
              expanded={isMapExpanded}
              onClick={toggleMapExpanded}
              data-doc-control='order-tracking-map-toggle'
            >
              <Icon name={isMapExpanded ? 'fullscreenExit' : 'fullscreen'} />
              <span>{isMapExpanded ? t('MINIMIZE_MAP', 'Minimize map') : t('MAXIMIZE_MAP', 'Maximize map')}</span>
            </MapExpandToggle>
          </MapTrackingWrapper>
        )}

        {showTabs && (
          <DeliveryOrderTabs
            order={order}
            productList={productList}
            productsCount={pricedProducts.length}
            hideCustomerAddress={hideCustomerAddress}
            hideCustomerPhone={hideCustomerPhone}
            hideDriverName={hideDriverName}
            hideDriverPhone={hideDriverPhone}
            isCourierTracking={isCourierTracking}
          />
        )}

        {!isDelivery && order.customer && (
          <InfoCard data-doc-section='order-tracking-customer'>
            <PersonRow>
              {!hideCustomerPhoto && order.customer.photo && (
                <PhotoBlock src={order.customer.photo} alt='' />
              )}
              <div>
                <p>{order.customer.name} {order.customer.lastname}</p>
                {!hideCustomerEmail && order.customer.email && <p>{order.customer.email}</p>}
                {!hideCustomerPhone && (order.customer.cellphone || order.customer.phone) && (
                  <p>{order.customer.cellphone || order.customer.phone}</p>
                )}
                {!hideCustomerAddress && order.customer.address && <p>{order.customer.address}</p>}
              </div>
            </PersonRow>
          </InfoCard>
        )}

        {!isDelivery && driver && !isRejected && (
          <InfoCard data-doc-section='order-tracking-driver'>
            <SectionTitleContainer>
              <h2>{t('DRIVER', 'Driver')}</h2>
            </SectionTitleContainer>
            <PersonRow>
              {!hideDriverPhoto && (
                <div className='photo'>
                  {driver.photo ? <PhotoBlock src={driver.photo} alt='' /> : <Icon name='userFilled' />}
                </div>
              )}
              <div>
                {!hideDriverName && <h2>{driver.name} {driver.lastname}</h2>}
                {!hideDriverPhone && driverPhone && <p>{driverPhone}</p>}
                {driverPlate && <p>{t('DRIVER_PLATE', 'Plate')}: {driverPlate}</p>}
              </div>
            </PersonRow>
          </InfoCard>
        )}
      </WrapperContainer>
    </Container>
  )
}
