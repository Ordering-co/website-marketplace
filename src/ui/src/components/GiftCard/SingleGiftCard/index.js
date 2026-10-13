import React from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  CardContainer,
  CardLogo,
  CardInfo
} from './styles'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'

import { Icon } from '~ui-icon'

export const SingleGiftCard = (props) => {
  const {
    card,
    isSkeleton
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [events] = useEvent()
  const { width } = useWindowSize()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

  const giftCardStatusMap = {
    pending: t('PENDING', 'Pending'),
    activated: t('REDEEMED', 'Redeemed'),
    sent: t('SENT', 'Sent')
  }

  const getGiftCardStatus = (status) => {
    return giftCardStatusMap[status] || status
  }

  const handleClickGiftCardOrder = (card) => {
    events.emit('go_to_page', { page: 'order_detail', params: { orderId: card.order_product?.order_id } })
  }

  return (
    <CardContainer
      className='product-card'
      onClick={() => handleClickGiftCardOrder(card)}
    >
      {isSkeleton
        ? <Skeleton height={86} width={86} />
        : <CardLogo
            bgimage={optimizeImage(card?.order_product?.images || theme?.images?.dummies?.giftCard, 'h_86,c_limit')}
          />}
      <CardInfo>
        <div>
          {isSkeleton
            ? <Skeleton height={16} width={100} />
            : <span className='name'>{card?.order_product?.name}</span>}
        </div>
        {isSkeleton
          ? <p className='date'><Skeleton width={150} height={14} /></p>
          : <p className='date'>
              {t('ORDER_NUM', 'Order No.')} {card?.order_product?.order_id} {width > 520 && <Icon name="dotSmall" />} {parseDate(card?.created_at)}
            </p>}
        {isSkeleton
          ? <p className='status'><Skeleton width={80} height={14} /></p>
          : (
            <div className='status-container'>
              <span>{parsePrice(card?.order_product?.price)}</span>
              <p className='status'>{getGiftCardStatus(card?.status)}</p>
            </div>
            )}
      </CardInfo>
    </CardContainer>
  )
}
