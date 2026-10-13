import React, { useState } from 'react'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useTheme } from 'styled-components'
import {
  BusinessInformationContainer,
  BusinessContent,
  SectionTitle,
  Map,
  ScheduleSection,
  ScheduleContainer,
  DeliveryInfo,
  BusinessMediaContent,
  ModalIcon,
  Description,
  ImageContainer,
  BusinessTitle,
  BusinessAddress,
  Divider
} from './styles'

import { BusinessInformation as BusinessInformationController } from '~components/components/BusinessInformation'
import { GoogleMaps as GoogleMapsMap } from '~components/components/GoogleMaps'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { getDateTimeFormats } from '~components/utils/configHelpers'

import { AutoScroll } from '~ui/src/components/AutoScroll'
import { formatUrlVideo, generalUtilities } from '~ui/utils'
import { Modal } from '~ui/src/components/Modal'
import { ScheduleAccordion } from '~ui/src/components/ScheduleAccordion'

import { Icon } from '~ui-icon'

dayjs.extend(timezone)

export const BusinessInformationUI = (props) => {
  const {
    business,
    businessLocation,
    businessSchedule,
    businessPhotos,
    businessVideos,
    onClose
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [modalImage, setModalImage] = useState(false)
  const [image, setImage] = useState('')
  const theme = useTheme()

  const { convertHoursToMinutes } = generalUtilities()

  const hideCloseButton = true
  const hideLocation = theme?.business_view?.components?.information?.components?.location?.hidden
  const hideSchedule = theme?.business_view?.components?.information?.components?.schedule?.hidden
  const hideDescription = theme?.business_view?.components?.information?.components?.description?.hidden
  const hideAbout = theme?.business_view?.components?.information?.components?.about?.hidden
  const hideVideos = theme?.business_view?.components?.information?.components?.videos?.hidden
  const hideDeliveryTime = theme?.business_view?.components?.information?.components?.delivery_time?.hidden
  const hidePickupTime = theme?.business_view?.components?.information?.components?.pickup_time?.hidden
  const hideImages = theme?.business_view?.components?.information?.components?.images?.hidden
  const hideAddress = theme?.business_view?.components?.information?.components?.address?.hidden
  const formatTime = getDateTimeFormats(configs?.dates_general_format?.value).timeFormat
  const useAlternativeMap = configs?.use_alternative_to_google_maps?.value === '1'

  const fillStyle = {
    fillColor: theme.colors.primary,
    strokeColor: theme.colors.darkPrimaryColor,
    fillOpacity: 0.08,
    strokeWeight: 3,
    strokeOpacity: 1,
    editable: false
  }

  const checkTime = (val) => (val < 10 ? `0${val}` : val)
  const timeFormated = (time) => {
    const now = dayjs().format('YYYY-MM-DD')
    const storeTime = dayjs
      .tz(`${now}T${checkTime(time.hour)}:${checkTime(time.minute)}`, business?.timezone || dayjs.tz.guess())
    const localTime = storeTime.tz(dayjs.tz.guess())
    return localTime.format(formatTime)
  }

  const handleModalImage = (src) => {
    setImage(src)
    setModalImage(true)
  }

  return (
    <BusinessInformationContainer>
      {!hideCloseButton && (
        <ModalIcon>
          <Icon name="closeMd" onClick={() => onClose(false)} />
        </ModalIcon>
      )}
      <BusinessContent>
        <BusinessTitle>{business?.name}</BusinessTitle>
        {!hideAbout && business.about && (
          <>
            <Description>{business.about}</Description>
          </>
        )}
        {!hideDescription && business.description && (
          <>
            <Description>{business.description}</Description>
          </>
        )}
        {
          !hideLocation && !useAlternativeMap && (
            <>
              {businessLocation.location && (
                <>
                  {
                    !hideAddress && business?.address && (
                    <BusinessAddress>
                      <Icon name="mapMarker" />
                      {business?.address}
                    </BusinessAddress>
                    )
                  }
                  {businessLocation.location && (
                    <div className='business-location-container'>
                      <Map>
                        <GoogleMapsMap
                          apiKey={configs?.google_maps_api_key?.value}
                          location={businessLocation.location}
                          mapControls={businessLocation.googleMapsControls || business.googleMapsControls}
                          businessZones={business?.zones}
                          fillStyle={fillStyle}
                        />
                      </Map>
                    </div>
                  )}
                </>
              )}
              <Divider />
            </>
          )
        }
        {businessSchedule?.length > 0 && (
          <>
            {!hideSchedule && (
              <>
                <SectionTitle>{t('SCHEDULE', 'Schedule')}</SectionTitle>
                <ScheduleSection>
                  <ScheduleContainer>
                    {businessSchedule.map((schedule, i) => (
                      <ScheduleAccordion
                        isDisableAccordion
                        key={i}
                        weekIndex={i}
                        timeFormated={timeFormated}
                        schedule={schedule}
                      />
                    ))}
                  </ScheduleContainer>
                </ScheduleSection>
                <Divider />
              </>
            )}
            <DeliveryInfo>
              <div>
                {!hideDeliveryTime && (
                  <div>
                    <h5>{t('DELIVERY_TIME', 'Delivery Time')}</h5>
                    <div><Icon name="clock" /> {convertHoursToMinutes(business?.delivery_time)}</div>
                  </div>
                )}
                {!hidePickupTime && (
                  <div>
                    <h5>{t('PICKUP_TIME', 'Pickup Time')}</h5>
                    <div><Icon name="clock" /> {convertHoursToMinutes(business?.pickup_time)}</div>
                  </div>
                )}
              </div>
            </DeliveryInfo>
          </>
        )}
        {!hideImages && businessPhotos?.length > 0 && (
          <>
            <Divider />
            <SectionTitle>{t('PHOTOS', 'Photos')}</SectionTitle>
            <BusinessMediaContent>
              <div>
                <AutoScroll scrollId='business-photos'>
                    {
                      businessPhotos.map((photo, i) => (
                        <img key={i} src={photo.file} alt={`photo-${i}`} onClick={() => handleModalImage(photo.file)} loading='lazy' />
                      ))
                    }
                </AutoScroll>
              </div>
            </BusinessMediaContent>
          </>
        )}
        {!hideVideos && businessVideos?.length > 0 && (
          <>
            <Divider />
            <SectionTitle>{t('VIDEOS', 'Videos')}</SectionTitle>
            <BusinessMediaContent>
              <div>
                <AutoScroll scrollId='business-videos'>
                  {businessVideos.map((video, i) => (
                    <iframe
                      key={i}
                      src={formatUrlVideo(video.video)}
                      width='191'
                      height='128'
                      style={{ border: 'none' }}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;'
                      allowFullScreen
                      loading='lazy'
                      referrerPolicy='strict-origin-when-cross-origin'
                    />
                  ))}
                </AutoScroll>
              </div>
            </BusinessMediaContent>
          </>
        )}
      </BusinessContent>
      {modalImage && (
        <Modal
          onClose={() => setModalImage(false)}
          open={modalImage}
          padding='0'
          closeIconRight
          closeIconColor='#fff'
          height='auto'
          fullModalScreen
        >
          <ImageContainer>
            <img src={image} width='320px' height='180px' loading='lazy' />
          </ImageContainer>
        </Modal>
      )}
    </BusinessInformationContainer>
  )
}

export const BusinessInformation = (props) => {
  const googleMapsControls = {
    defaultZoom: 12,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite']
    }
  }

  const BusinessInformationProps = {
    ...props,
    UIComponent: BusinessInformationUI,
    googleMapsControls
  }
  return <BusinessInformationController {...BusinessInformationProps} />
}
