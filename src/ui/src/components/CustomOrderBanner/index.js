import React from 'react'
import { useLanguage } from '~components/contexts/LanguageContext'
import {
  BannerContainer,
  BannerImage,
  BannerContent,
  BannerTitle,
  BannerSubtitle,
  BannerButton
} from './styles'

const DELIVERY_IMAGE = 'https://cloud-assets.orderingplus.com/image/upload/projectcnew/iaex8mo4xlpuovii6asg/1774629480.jpg'

export const CustomOrderBanner = ({ onCustomOrderClick, maxHeight }) => {
  const [, t] = useLanguage()

  return (
    <BannerContainer maxHeight={maxHeight}>
      <BannerImage>
        <img src={DELIVERY_IMAGE} alt='' />
      </BannerImage>
      <BannerContent>
        <BannerTitle>{t('CUSTOM_ORDER_BANNER_TITLE', 'Do you need a special delivery?')}</BannerTitle>
        <BannerSubtitle>{t('CUSTOM_ORDER_BANNER_SUBTITLE', 'We help you.')}</BannerSubtitle>
        <BannerButton onClick={onCustomOrderClick}>
          {t('CUSTOM_ORDER_BUTTON', 'Custom order')}
        </BannerButton>
      </BannerContent>
    </BannerContainer>
  )
}

export default CustomOrderBanner
