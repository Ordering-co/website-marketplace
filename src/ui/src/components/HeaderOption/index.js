import React from 'react'
import { Container, DeliveryType } from './styles'

import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'

import { Icon } from '~ui-icon'

export const HeaderOption = (props) => {
  const {
    variant,
    addressState,
    momentState,
    totalCarts,
    orderTypeList
  } = props

  const [{ parseDate, timeFormat, preorderDateFormat }] = useUtils()
  const [, t] = useLanguage()
  const [orderStatus] = useOrder()

  return (
    <Container
      variant={variant}
      onClick={() => props.onClick(variant)}
      $isHome={props.isHome}
      style={props.containerStyle}
    >
      {variant === 'cart' && (
        <span>
          <Icon name="basketFilled" id='icon' />
          {totalCarts > 0 && <span>{totalCarts}</span>}
        </span>
      )}
      {variant === 'address' && (
        <span>
          <Icon name="mapMarker" id='icon' />
          {addressState || t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
        </span>
      )}
      {variant === 'moment' && (
        <>
          {momentState
            ? parseDate(momentState, { outputFormat: `${preorderDateFormat} ${timeFormat}` })
            : t('ASAP_ABBREVIATION', 'ASAP')}
        </>
      )}
      {
        variant === 'delivery' && (
          <DeliveryType>
            {(orderTypeList && orderTypeList[orderStatus?.options.type - 1]) || t('DELIVERY', 'Delivery')}
          </DeliveryType>
        )
      }
    </Container>
  )
}
