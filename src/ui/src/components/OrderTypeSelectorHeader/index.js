import React, { useRef } from 'react'
import { useTheme } from 'styled-components'
import { OrderTypeControl } from '~components/components/OrderTypeControl'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useOrder } from '~components/contexts/OrderContext'
import { getMaxPreorderDays } from '~components/utils/configHelpers'
import { Select } from '~ui/src/styles/Select'

import { Option, OrderTypeWrapper, SelectedOption, ContentOption, HeaderItem } from './styles'

import { Icon } from '~ui-icon'

const OrderTypeSelectorHeaderUI = (props) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes,
    customView,
    isFullClick,
    orderTypeList,
    autoCloseWhenScroll
  } = props

  const [{ configs }] = useConfig()
  const [orderStatus] = useOrder()
  const [, t] = useLanguage()
  const maxPreorderDays = getMaxPreorderDays(configs, orderStatus?.options?.type)
  const isPreorderDisabled = maxPreorderDays === -1 || maxPreorderDays === 0
  const referenceElement = useRef()
  const defaultType = configTypes?.includes(typeSelected) ? null : configTypes?.[0]

  return (
    <>
      {customView
        ? <OrderTypeWrapper>
            <Select
              autoCloseWhenScroll={autoCloseWhenScroll}
              options={configTypes
                ? orderTypes.filter(type => configTypes?.includes(type.value))
                : orderTypes
              }
              defaultValue={defaultType || typeSelected || defaultValue}
              onChange={(orderType) => handleChangeOrderType(orderType)}
            />
          </OrderTypeWrapper>
        : <div
            className='order-type'
            style={{
              ...props.containerStyle,
              ...(isFullClick && { width: '100%', padding: 0 })
            }}
            onClick={isFullClick && props.onClick}
          >
            <HeaderItem
              ref={referenceElement}
              onClick={isPreorderDisabled || isFullClick
                ? null
                : props.onClick}
            >
              {(orderTypeList && orderTypeList[orderStatus?.options.type - 1]) || t('DELIVERY', 'Delivery')}
            </HeaderItem>
          </div>}
    </>
  )
}

export const OrderTypeSelectorHeader = (props) => {
  const [, t] = useLanguage()
  const theme = useTheme()

  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorHeaderUI,
    orderTypes: props.orderTypes || [
      {
        value: 1,
        content: <Option><Icon name="truckDelivery" /><ContentOption>{t('DELIVERY', 'Delivery')}</ContentOption></Option>,
        showOnSelected: <Option><Icon name="truckDelivery" /><SelectedOption>{t('DELIVERY', 'Delivery')}</SelectedOption></Option>
      },
      {
        value: 2,
        content: <Option><img src={theme?.images?.icons?.pickUpIcon} alt='Pickup' /><ContentOption>{t('PICKUP', 'Pickup')}</ContentOption></Option>,
        showOnSelected: <Option><img src={theme?.images?.icons?.pickUpIcon} alt='Pickup' /><SelectedOption>{t('PICKUP', 'Pickup')}</SelectedOption></Option>
      },
      {
        value: 3,
        content: <Option><Icon name="shopFilled" /><ContentOption>{t('EAT_IN', 'Eat in')}</ContentOption></Option>,
        showOnSelected: <Option><Icon name="shopFilled" /><SelectedOption>{t('EAT_IN', 'Eat in')}</SelectedOption></Option>
      },
      {
        value: 4,
        content: <Option><Icon name="foodTruck" /><ContentOption>{t('CURBSIDE', 'Curbside')}</ContentOption></Option>,
        showOnSelected: <Option><Icon name="foodTruck" /><SelectedOption>{t('CURBSIDE', 'Curbside')}</SelectedOption></Option>
      },
      {
        value: 5,
        content: <Option><Icon name="carSide" /><ContentOption>{t('DRIVE_THRU', 'Drive thru')}</ContentOption></Option>,
        showOnSelected: <Option><Icon name="carSide" /><SelectedOption>{t('DRIVE_THRU', 'Drive thru')}</SelectedOption></Option>
      },
      {
        value: 9,
        content: <Option><Icon name="shopFilled" /><ContentOption>{t('RESERVATION', 'Reservation')}</ContentOption></Option>,
        showOnSelected: <Option><Icon name="shopFilled" /><SelectedOption>{t('RESERVATION', 'Reservation')}</SelectedOption></Option>
      }
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
