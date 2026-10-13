import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'

import {
  LastOrdersContainer,
  OrderCard,
  WrapperImage,
  Image,
  OrderHeader
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'
import { OrderList as OrderListController } from '~components/components/OrderList'

import { generalUtilities } from '~ui/utils'

export const LastOrdersUI = (props) => {
  const {
    orderList
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [events] = useEvent()
  const [{ optimizeImage, parseDate, parsePrice }] = useUtils()
  const { getOrderStatus, getOrderType } = generalUtilities()

  const handleClickOrder = (uuid) => {
    events.emit('go_to_page', { page: 'order_detail', params: { orderId: uuid } })
  }

  return (
    <>
      {!orderList?.loading && orderList?.orders?.length > 0 && (
        <>
          <h2>{t('LAST_ORDER', 'Last order')}</h2>
          <LastOrdersContainer>
            {orderList?.loading && <Skeleton height={150} />}
            {!orderList?.loading && orderList?.orders?.length > 0 && orderList?.orders.map((order) => (
              <OrderCard
                key={order.id}
                onClick={() => handleClickOrder(order.uuid)}
              >
                <div className='order-container'>
                  <div className='order-header-left'>
                    <WrapperImage hideContent>
                      <Image bgimage={optimizeImage(order.business?.logo || theme.images?.dummies?.businessLogo, 'h_50,c_limit')} />
                    </WrapperImage>
                  </div>
                  <div className='order-header-right'>
                    <OrderHeader>
                      <h2>{order?.business?.name}</h2>
                      <p>{t('INVOICE_NO', 'No.')} {order?.id}{' • '}{order?.delivery_datetime_utc
                        ? parseDate(order?.delivery_datetime_utc)
                        : parseDate(order?.delivery_datetime, { utc: false })}</p>
                    </OrderHeader>
                    <div className='order-type-status'>
                      <p><span className='green'>{getOrderStatus(order.status)?.value}</span> • <span className='order-type'>{getOrderType(order.delivery_type)}</span></p>
                    </div>
                  </div>
                </div>
                <div className='order-price'>
                  <p>{parsePrice(order?.summary?.total)}</p>
                </div>
              </OrderCard>
            ))}
          </LastOrdersContainer>
        </>
      )}
    </>
  )
}

export const LastOrders = (props) => {
  const lastOrdersProps = {
    ...props,
    UIComponent: LastOrdersUI,
    orderStatus: [1, 11, 15],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 1,
      controlType: 'infinity'
    },
    noGiftCardOrders: true
  }
  return <OrderListController {...lastOrdersProps} />
}
