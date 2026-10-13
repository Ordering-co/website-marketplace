import React, { useState, useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { useTheme } from 'styled-components'
import { useConfig } from '~components/contexts/ConfigContext'
import { LocationsMap } from '~components/components/LocationsMap'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import {
  WrapperMap,
  ContainerCard,
  WrapperBusinessCard,
  BusinessHero,
  BusinessContent,
  BusinessInfo,
  BusinessName
} from './styles'

const hasValidCoordinates = (location) =>
  Number.isFinite(Number(location?.lat)) && Number.isFinite(Number(location?.lng))

export const Locations = (props) => {
  const {
    businessList,
    userLocation,
    onBusinessClick,
    selectedBusiness,
    forceCenter,
    listenLocations
  } = props

  const [infoWindow, setInfoWindow] = useState(null)
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [, t] = useLanguage()

  const fallbackIcon =
    optimizeImage(theme?.images?.dummies?.businessLogo, 'r_max') || theme?.images?.general?.mapPin

  const locations = businessList?.filter((business) => hasValidCoordinates(business?.location))?.map(business => ({
    ...business,
    lat: Number(business.location.lat),
    lng: Number(business.location.lng),
    icon: optimizeImage(business?.logo, 'r_max') || fallbackIcon,
    markerPopup: renderToString(
      <ContainerCard className='business-map-card'>
        <WrapperBusinessCard>
          <BusinessHero>
            <BusinessName className='business-name-map'>{business?.name}</BusinessName>
            <BusinessContent>
              {business?.phone && (
                <BusinessInfo className='business-tel-map'>
                  <div>
                    <span className='bold'>{t('PHONE_NUMBER', 'Phone number')}: </span>
                    <a href={`tel:${business?.phone}`}>
                      {business?.phone}
                    </a>
                  </div>

                </BusinessInfo>
              )}
              {business?.address && (
                <BusinessInfo>
                  <div><span className='bold'>{t('ADDRESS', 'Address')}: </span>{business?.address}</div>
                </BusinessInfo>
              )}
              {business?.delivery_price > 0 && (
                <BusinessInfo>
                  <div><span className='bold'>{t('DELIVERY_FEE', 'Delivery fee')}: </span>{parsePrice((business?.delivery_price))}</div>
                </BusinessInfo>
              )}
              {business?.service_fee > 0 && (
                <BusinessInfo>
                  <div><span className='bold'>{t('PICKUP_FEE', 'Pickup fee')}: </span>{parsePrice((business?.service_fee))}</div>
                </BusinessInfo>
              )}
            </BusinessContent>
          </BusinessHero>
        </WrapperBusinessCard>
      </ContainerCard>
    ),
    onBusinessCustomClick: () => onBusinessClick(business)
  }))

  useEffect(() => {
    if (selectedBusiness) {
      const selectedLocation = locations?.find(loc => loc.id === selectedBusiness.id)
      if (selectedLocation) {
        setInfoWindow({
          location: selectedLocation,
          content: selectedLocation.markerPopup
        })
      }
    } else {
      setInfoWindow(null)
    }
  }, [selectedBusiness])

  const googleMapsControls = {
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    scaleControl: false,
    cameraControl: false
  }

  return (
    <WrapperMap>
      <LocationsMap
        apiKey={configs?.google_maps_api_key?.value}
        location={userLocation}
        locations={locations}
        mapControls={googleMapsControls}
        activeInfoWindow={infoWindow}
        forceCenter={forceCenter}
        listenLocations={listenLocations}
        fallbackIcon={fallbackIcon}
      />
    </WrapperMap>
  )
}
