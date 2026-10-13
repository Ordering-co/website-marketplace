import React, { useState, useEffect, useMemo } from 'react'
import { useApi } from '~components/contexts/ApiContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useSession } from '~components/contexts/SessionContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { GoogleMaps as GoogleMapsMap } from '~components/components/GoogleMaps'
import { AutocompleteInput as GoogleAutocompleteInput } from '~components/components/GoogleAutocompleteInput'
import { useTheme } from 'styled-components'
import { haversineDistanceKm } from '../../utils/customOrder'
import {
  ModalBody,
  StepSubtitle,
  StepperContainer,
  StepperDot,
  StepperLine,
  AddressInputWrapper,
  MapWrapper,
  DistanceInfo,
  StepActions,
  ContinueButton,
  PickupNameInput
} from './styles'

import { Icon } from '~ui-icon'

export const Step1 = ({ pluginConfig, initialData, onContinue }) => {
  const [ordering] = useApi()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ user, token }] = useSession()
  const [{ optimizeImage }] = useUtils()
  const theme = useTheme()
  const googleMapsApiKey = configs?.google_maps_api_key?.value
  const maxDistance = pluginConfig?.max_distance || null

  const defaultAddress = orderState?.options?.address

  const toValidLocation = (loc) => {
    if (!loc) return null
    const lat = Number(loc.lat)
    const lng = Number(loc.lng)
    if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) return null
    return { lat, lng }
  }

  const [pickupAddress, setPickupAddress] = useState(initialData?.pickupAddress || '')
  const [pickupLocation, setPickupLocation] = useState(() => toValidLocation(initialData?.pickupLocation))
  const [pickupName, setPickupName] = useState(initialData?.pickupName || '')
  const [deliveryAddress, setDeliveryAddress] = useState(initialData?.deliveryAddress || defaultAddress?.address || '')
  const [deliveryLocation, setDeliveryLocation] = useState(() => toValidLocation(initialData?.deliveryLocation) || toValidLocation(defaultAddress?.location))
  const [distanceKm, setDistanceKm] = useState(null)

  const distanceExceeded = distanceKm !== null && maxDistance && distanceKm > maxDistance
  const canContinue = pickupAddress && pickupLocation && pickupName?.trim() && deliveryAddress && deliveryLocation && !distanceExceeded

  useEffect(() => {
    if (pickupLocation && deliveryLocation) {
      const d = haversineDistanceKm(
        pickupLocation.lat, pickupLocation.lng,
        deliveryLocation.lat, deliveryLocation.lng
      )
      setDistanceKm(Math.round(d * 1000) / 1000)
    } else {
      setDistanceKm(null)
    }
  }, [pickupLocation, deliveryLocation])

  const handleContinue = async () => {
    let addressId = defaultAddress?.id

    const isSameAddress = defaultAddress?.location?.lat === deliveryLocation?.lat &&
      defaultAddress?.location?.lng === deliveryLocation?.lng

    if (!isSameAddress && deliveryLocation) {
      const existingAddresses = user?.addresses || []
      const found = existingAddresses.find(a =>
        a?.location?.lat === deliveryLocation.lat &&
        a?.location?.lng === deliveryLocation.lng
      )

      if (found) {
        addressId = found.id
      } else {
        const { content: { error, result } } = await ordering
          .setAccessToken(token)
          .users(user?.id)
          .addresses()
          .save({ address: deliveryAddress, location: deliveryLocation })

        if (!error && result?.id) {
          addressId = result.id
        }
      }
    }

    onContinue({
      pickupAddress,
      pickupLocation,
      pickupName,
      deliveryAddress,
      deliveryLocation,
      addressId,
      distanceKm
    })
  }

  const pickupLoc = useMemo(() => toValidLocation(pickupLocation), [pickupLocation?.lat, pickupLocation?.lng])
  const deliveryLoc = useMemo(() => toValidLocation(deliveryLocation), [deliveryLocation?.lat, deliveryLocation?.lng])

  const businessIcon = optimizeImage(theme.images?.dummies?.businessLogo, 'r_max,h_50,c_limit')
  const userIcon = optimizeImage(user?.photo || theme.images?.dummies?.customerPhoto, 'r_max,h_50,c_limit')

  const showMap = pickupLoc && deliveryLoc
  const mapKey = showMap ? `${pickupLoc.lat},${pickupLoc.lng}|${deliveryLoc.lat},${deliveryLoc.lng}` : ''
  const mapLocations = useMemo(() => showMap
    ? [
        { lat: pickupLoc.lat, lng: pickupLoc.lng, icon: businessIcon },
        { lat: deliveryLoc.lat, lng: deliveryLoc.lng, icon: userIcon }
      ]
    : []
  , [mapKey])

  return (
    <ModalBody>
      <StepSubtitle>{t('CUSTOM_ORDER_STEP1_SUBTITLE', 'We will take it to you')}</StepSubtitle>

      <StepperContainer>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AddressInputWrapper hasValue={!!pickupAddress}>
            <Icon name="shoppingBag" className='location-icon' />
            <div className='address-content'>
              {pickupAddress && (
                <span className='floating-label'>
                  {t('CUSTOM_ORDER_PICKUP_PLACEHOLDER', 'Where do we pickup or buy the product?')}
                </span>
              )}
              <GoogleAutocompleteInput
                apiKey={googleMapsApiKey}
                placeholder={t('CUSTOM_ORDER_PICKUP_PLACEHOLDER', 'Where do we pickup or buy the product?')}
                defaultValue={pickupAddress}
                autoComplete='new-password'
                onChangeAddress={(addressData) => {
                  setPickupAddress(addressData.address)
                  setPickupLocation(toValidLocation(addressData.location))
                  if (addressData.place_name && addressData.place_types?.includes('establishment')) {
                    setPickupName(addressData.place_name)
                  }
                }}
              />
            </div>
          </AddressInputWrapper>

          {pickupAddress && (
            <PickupNameInput
              placeholder={t('CUSTOM_ORDER_PICKUP_NAME_PLACEHOLDER', 'Pickup details.')}
              value={pickupName}
              onChange={e => setPickupName(e.target.value)}
            />
          )}

          <AddressInputWrapper hasValue={!!deliveryAddress}>
            <Icon name="location" className='location-icon' />
            <div className='address-content'>
              {deliveryAddress && (
                <span className='floating-label'>
                  {t('CUSTOM_ORDER_DELIVERY_PLACEHOLDER', 'Where do we deliver?')}
                </span>
              )}
              <GoogleAutocompleteInput
                apiKey={googleMapsApiKey}
                placeholder={t('CUSTOM_ORDER_DELIVERY_PLACEHOLDER', 'Where do we deliver?')}
                defaultValue={deliveryAddress}
                autoComplete='new-password'
                onChangeAddress={(addressData) => {
                  setDeliveryAddress(addressData.address)
                  setDeliveryLocation(toValidLocation(addressData.location))
                }}
              />
            </div>
          </AddressInputWrapper>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: '0' }}>
          <StepperDot active={!!pickupLocation} />
          <StepperLine />
          <StepperDot active={!!deliveryLocation} filled={!!deliveryLocation} />
        </div>
      </StepperContainer>

      {showMap && (
        <>
          <MapWrapper>
            {googleMapsApiKey && (
              <GoogleMapsMap
                key={mapKey}
                apiKey={googleMapsApiKey}
                location={pickupLoc}
                locations={mapLocations}
                manualZoom
                mapControls={{ zoomControl: true, streetViewControl: false, fullscreenControl: false }}
              />
            )}
          </MapWrapper>
          {distanceKm !== null && (
            <DistanceInfo exceeded={distanceExceeded ? 1 : 0}>
              {distanceExceeded
                ? t('CUSTOM_ORDER_DISTANCE_EXCEEDED', 'Distance exceeded _MAX_km').replace('_MAX_', maxDistance)
                : t('CUSTOM_ORDER_DISTANCE', 'Distance: _KM_km').replace('_KM_', distanceKm)
              }
            </DistanceInfo>
          )}
        </>
      )}

      <StepActions>
        <ContinueButton
          onClick={handleContinue}
          disabled={!canContinue}
        >
          <span>{t('CONTINUE', 'Continue')}</span>
          <Icon name="arrowRight" />
        </ContinueButton>
      </StepActions>
    </ModalBody>
  )
}

export default Step1
