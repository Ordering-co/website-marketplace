import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import {
  ReviewOrderContainer,
  StarWrapper,
  PlacedDate,
  Send,
  BusinessLogo,
  BusinessName,
  WrapperBusinessLogo,
  ReviewsProgressWrapper,
  LogoAndReviewWrapper,
  ContinueContainer
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

export const ReviewTrigger = (props) => {
  const { order, handleOpenOrderReview, showPlacedDate = false } = props
  const [star, setStar] = useState(5)
  const [, t] = useLanguage()
  const [{ optimizeImage, parseDate }] = useUtils()
  const theme = useTheme()
  const placedOnDate = parseDate(order?.delivery_datetime, { outputFormat: 'dddd MMMM DD, YYYY' })

  return (
    <>
      <span>
        {t('REVIEW_ORDER_DESCRIPTION', 'Your feedback is very important to us. Help us improve by rating your last order—it only takes a few seconds!')}
      </span>
      <LogoAndReviewWrapper>
        <WrapperBusinessLogo>
          {(order?.business?.logo || theme.images?.dummies?.businessLogo) && (
            <BusinessLogo bgimage={optimizeImage(order?.business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
          )}
        </WrapperBusinessLogo>
        {order?.business?.name && <BusinessName>{order?.business?.name}</BusinessName>}
        <ReviewsProgressWrapper>
          <StarWrapper>
            {[...Array(5).keys()].map((index) => (
              index <= (star - 1))
              ? <Icon name="starFilled" size={40} key={`star-symbol-${index}`} onClick={() => setStar(index + 1)} color={theme?.colors?.primary} />
              : <Icon name="starOutline" size={40} key={`star-symbol-${index}`} onClick={() => setStar(index + 1)} />
            )}
          </StarWrapper>
        </ReviewsProgressWrapper>

        {showPlacedDate && <PlacedDate>{t('DONOT_FORGET_RATE_YOUR_ORDER', 'Do not forget to rate your order placed on ')} <strong>{placedOnDate}</strong></PlacedDate>}
      </LogoAndReviewWrapper>
      <ReviewOrderContainer>
        <Send>
          <Button
            color='lightGray'
            type='button'
            className='review-sent'
            onClick={() => handleOpenOrderReview(star)}
          >
            <ContinueContainer><p>{t('REVIEW_TRIGGER_BUTTON', 'Review')}</p></ContinueContainer>
          </Button>
        </Send>
      </ReviewOrderContainer>
    </>
  )
}

export default ReviewTrigger
