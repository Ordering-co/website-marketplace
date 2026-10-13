import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import {
  OrderProgressContainer,
  OrderInfoWrapper,
  ProgressLogo,
  ProgressDescriptionWrapper,
  ProgressBarWrapper,
  ProgressContentWrapper,
  ProgressBar,
  ProgressTextWrapper,
  StatusWrapper,
  TimeWrapper,
  OrderProgressWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'
import { OrderList as OrderListController } from '~components/components/OrderList'

import { OrderEta } from '../OrderDetails/OrderEta'
import { ButtonLink } from '~ui/src/styles/Buttons'
import { generalUtilities } from '~ui/utils'

const OrderProgressUI = (props) => {
  const { orderList } = props

  const [, t] = useLanguage()
  const [{ optimizeImage, /* parseTime, */ parseDate, timeFormat }] = useUtils()
  const theme = useTheme()
  const [events] = useEvent()
  const { getStatusPrefix } = generalUtilities()
  const statusToShow = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26]
  const deliveryTypes = [1, 7]

  const lastOrder = orderList.orders?.length ? orderList.orders?.find(order => !!order.business_id) : null
  const isPickup = lastOrder?.delivery_type && lastOrder?.delivery_type === 2

  const handleGoToPage = (e, index) => {
    e.preventDefault()
    events.emit('go_to_page', { page: index })
  }

  return (
    <>
      {orderList?.loading && (
        <OrderProgressWrapper>
          <Skeleton height={150} />
        </OrderProgressWrapper>
      )}
      {!orderList?.loading && lastOrder && (
        <>
          <OrderProgressWrapper>
            <OrderProgressContainer>
              <OrderInfoWrapper>
                <ProgressLogo
                  bgimage={optimizeImage(lastOrder?.business?.logo || theme.images?.dummies?.businessLogo, 'h_91,c_limit')}
                />
                <ProgressDescriptionWrapper>
                  <p>{statusToShow.includes(lastOrder?.status) ? t('ORDER_IN_PROGRESS', 'Order in progress') : t('ORDER', 'Order')}</p>
                  <h2>{lastOrder?.business?.name ?? ''}</h2>
                </ProgressDescriptionWrapper>
              </OrderInfoWrapper>
              <ButtonLink
                color='lightGray'
                onClick={(e) => handleGoToPage(e, 'orders')}
                href='/profile/orders'
              >
                {t('GO_TO_MY_ORDERS', 'Go to my orders')}
              </ButtonLink>
            </OrderProgressContainer>
            <ProgressBarWrapper>
              <ProgressContentWrapper>
                <ProgressBar
                  style={{
                    width: getStatusPrefix({ status: lastOrder.status, isPickup })?.percentage
                      ? `${getStatusPrefix({ status: lastOrder.status, isPickup }).percentage}%`
                      : 0
                  }}
                />
              </ProgressContentWrapper>
              <ProgressTextWrapper>
                <StatusWrapper>{getStatusPrefix({ status: lastOrder?.status, isPickup })?.value}</StatusWrapper>
                <TimeWrapper>
                  <span>{deliveryTypes?.includes(lastOrder?.delivery_type) ? t('ESTIMATED_DELIVERY_TIME', 'Estimated delivery time') : t('ESTIMATED_TIME', 'Estimated time')}:&nbsp;</span>
                  <span className='time-wrapper'>
                    {/* {lastOrder?.delivery_datetime_utc
                      ? parseTime(lastOrder?.delivery_datetime_utc, { outputFormat: timeFormat || 'HH:mm' })
                      : parseTime(lastOrder?.delivery_datetime, { utc: false })}
                    &nbsp;-&nbsp; */}
                    {statusToShow.includes(lastOrder?.status)
                      ? <OrderEta order={lastOrder} outputFormat={timeFormat || 'HH:mm'} />
                      : parseDate(lastOrder?.reporting_data?.at[`status:${lastOrder.status}`], { outputFormat: timeFormat })}
                  </span>
                </TimeWrapper>
              </ProgressTextWrapper>
            </ProgressBarWrapper>
          </OrderProgressWrapper>
        </>
      )}
    </>

  )
}

export const OrderProgress = (props) => {
  const propsToFetchBusiness = ['name', 'logo', 'slug', 'id']
  const propsToFetch = ['cart', 'business', 'status', 'id', 'uuid', 'cart_group_id', 'business_id', 'delivery_datetime', 'delivery_datetime_utc', 'total', 'summary', 'eta_current_status_time', 'eta_previous_status_times', 'eta_time', 'delivered_in', 'prepared_in', 'eta_drive_time']
  const orderProgressProps = {
    ...props,
    UIComponent: OrderProgressUI,
    orderStatus: [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    noGiftCardOrders: true,
    propsToFetchBusiness,
    propsToFetch,
    paginationSettings: {
      initialPage: 1,
      pageSize: props.isCustomerMode ? 1 : 10,
      controlType: 'infinity'
    }
  }
  return <OrderListController {...orderProgressProps} />
}
