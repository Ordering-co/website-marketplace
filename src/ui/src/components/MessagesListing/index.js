import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  MessagesListingContainer,
  OrderListItems,
  ListHeader,
  OrdersOrderByOptionContainer,
  InnerTabsContainer,
  Title,
  OrderListContainer,
  OrdersListContainer,
  OrderCard,
  MessageContainer,
  OrderHeader,
  CardContent,
  BusinessInfo,
  WrapperImage,
  UnreadMessageCounter,
  Image,
  LoadMoreButtonWrap,
  DriverInfo,
  OptionContent,
  DriverNameContainer,
  DriverName,
  DriverText,
  NotFoundSourceWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'
import { OrderList as OrderListController } from '~components/components/OrderList'
import { OrderDetails as OrderDetailsController } from '~components/components/OrderDetails'
import { Button } from '~ui/src/styles/Buttons'
import { generalUtilities } from '~ui/utils'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { Messages } from '~ui/src/components/Messages'

import { Icon } from '~ui-icon'

const OrdersListingUI = (props) => {
  const {
    orderList,
    selectedOrderCard,
    handleOrderCardClick,
    handleUpdateDriverLocation,
    pagination,
    loadMoreOrders,
    small,
    setOrderListStatus
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [events] = useEvent()
  const [{ parseDate, optimizeImage }] = useUtils()
  const deliveryTypes = [1, 7]

  const hideCardContent = true
  const { getOrderStatus, getOrderType } = generalUtilities()

  const handleOrderClick = (e, order) => {
    const isInvalid = e.target.closest('.view-details') || e.target.closest('.driver-selector')
    if (isInvalid) return
    handleOrderCardClick(order)
  }

  const handleGoToPage = (data) => {
    events.emit('go_to_page', data)
  }

  useEffect(() => {
    if (orderList.loading || !selectedOrderCard) return
    const updatedOrder = orderList?.orders.find(order => order.id === selectedOrderCard?.id)
    if (updatedOrder) {
      handleUpdateDriverLocation && handleUpdateDriverLocation(updatedOrder)
    }
  }, [orderList?.orders])

  useEffect(() => {
    if (orderList.loading || selectedOrderCard) return
    if (orderList?.orders.length > 0) {
      handleOrderCardClick(orderList.orders[0])
    }
  }, [orderList, selectedOrderCard])

  useEffect(() => {
    setOrderListStatus(orderList)
  }, [orderList])

  return (
    <OrdersListContainer>
      {orderList.loading
        ? (
            [...Array(10).keys()].map(i => (
          <OrderCard key={i}>
            <div className='order-header-left'>
              <WrapperImage hideContent={hideCardContent}>
                <Skeleton width={45} height={45} circle />
              </WrapperImage>
            </div>
            <div className='order-header-right'>
              <OrderHeader>
                <h2><Skeleton width={150} /></h2>
                <p><Skeleton width={200} /></p>
              </OrderHeader>
              <div className='order-type-status'>
                <p><Skeleton width={120} /></p>
              </div>
              <CardContent>
                <BusinessInfo>
                  <WrapperImage>
                    <Skeleton width={45} height={45} circle />
                  </WrapperImage>
                  <div className='info'>
                    <p className='bold'><Skeleton width={120} /></p>
                    <p><Skeleton width={80} /></p>
                  </div>
                </BusinessInfo>
                <DriverInfo>
                  <WrapperImage>
                    <Skeleton width={45} height={45} circle />
                  </WrapperImage>
                  <OptionContent>
                    <DriverNameContainer>
                      <DriverName><Skeleton width={100} /></DriverName>
                      <DriverText><Skeleton width={60} /></DriverText>
                    </DriverNameContainer>
                  </OptionContent>
                </DriverInfo>
              </CardContent>
            </div>
          </OrderCard>
            ))
          )
        : (
        <>
          {orderList.orders?.map(order => (
            <OrderCard
              key={order.id}
              active={selectedOrderCard?.id === order.id}
              onClick={(e) => handleOrderClick(e, order)}
            >
              <div className='order-header-left'>
                <WrapperImage hideContent={hideCardContent}>
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
                {order?.unread_count > 0 && (
                  <UnreadMessageCounter>
                    {order?.unread_count}
                  </UnreadMessageCounter>
                )}
                <div className='order-type-status'>
                  <p><span className='green'>{getOrderStatus(order.status)?.value}</span> • <span className='order-type'>{getOrderType(order.delivery_type)}</span></p>
                </div>
                {!hideCardContent && (
                  <CardContent>
                    <BusinessInfo>
                      <WrapperImage>
                        <Image bgimage={optimizeImage(order.business?.logo || theme.images?.dummies?.businessLogo, 'h_50,c_limit')} />
                      </WrapperImage>
                      <div className='info'>
                        <p className='bold'>{order?.business?.name}</p>
                        <p>{order?.business?.city?.name}</p>
                      </div>
                    </BusinessInfo>
                    {deliveryTypes?.includes(order?.delivery_type) && (
                      <DriverInfo>
                        <WrapperImage>
                          {(order?.driver && order?.driver?.photo)
                            ? (
                            <Image bgimage={optimizeImage(order?.driver?.photo, 'h_50,c_limit')} />
                              )
                            : (
                            <Icon name="user" />
                              )}
                        </WrapperImage>
                        {order?.driver
                          ? (
                          <OptionContent>
                            <DriverNameContainer small={small}>
                              <DriverName small={small}>{order?.driver.name} {order?.driver.lastname}</DriverName>
                              <DriverText small={small}>{t('DRIVER', 'Driver')}</DriverText>
                            </DriverNameContainer>
                          </OptionContent>
                            )
                          : (
                          <OptionContent>
                            <DriverName small={small}>
                              {t('NO_DRIVER', 'No Driver')}
                            </DriverName>
                          </OptionContent>
                            )}
                      </DriverInfo>
                    )}
                  </CardContent>
                )}
              </div>
            </OrderCard>
          ))}
          {pagination?.totalPages && pagination?.currentPage < pagination?.totalPages && (
            <LoadMoreButtonWrap>
              <Button
                className='load-orders'
                outline
                color='primary'
                onClick={loadMoreOrders}
              >
                {t('LOAD_MORE_ORDERS', 'Load more orders')}
              </Button>
            </LoadMoreButtonWrap>
          )}
        </>
          )}
      {!orderList?.loading && orderList?.orders.length === 0 && (
        <NotFoundSourceWrapper>
          <NotFoundSource
            variant='empty'
            content={t('NO_ORDERS_YET', "You don't have any orders yet")}
            subtitle={t('NO_ORDERS_YET_DESC', 'Your order history will appear here.')}
            btnTitle={t('GO_HOME', 'Go to home')}
            onClickButton={() => handleGoToPage({ page: 'home' })}
          />
        </NotFoundSourceWrapper>
      )}
    </OrdersListContainer>
  )
}

export const IdOrderList = (props) => {
  const orderListProps = {
    ...props,
    UIComponent: OrdersListingUI,
    orderStatus: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    noGiftCardOrders: true,
    orderBy: 'id',
    orderDirection: 'desc'
  }

  return <OrderListController {...orderListProps} />
}

export const NewestOrderList = (props) => {
  const orderListProps = {
    ...props,
    UIComponent: OrdersListingUI,
    orderStatus: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    useDefualtSessionManager: true,
    profileMessages: true,
    noGiftCardOrders: true,
    orderBy: 'last_direct_message_at',
    orderDirection: 'asc'
  }

  return <OrderListController {...orderListProps} />
}

const OrderDetailsUI = (props) => {
  const {
    messages,
    setMessages,
    readMessages
  } = props
  const [openMessages, setOpenMessages] = useState({ business: false, driver: false })
  const { order } = props.order
  const handleOpenMessages = (data) => {
    setOpenMessages(data)
    readMessages()
  }
  const handleChangeOpenMessages = (data) => {
    handleOpenMessages(data)
  }

  useEffect(() => {
    handleOpenMessages({ driver: false, business: true })
  }, [])

  return (
    <Messages
      orderId={order?.id}
      order={order}
      business={openMessages.business}
      driver={openMessages.driver}
      messages={messages}
      setMessages={setMessages}
      readMessages={readMessages}
      onMessages={setOpenMessages}
      onClose={() => setOpenMessages({ driver: false, business: false })}
      profileMessages
      handleChangeOpenMessages={handleChangeOpenMessages}
    />
  )
}

export const MessageControler = (props) => {
  const userCustomer = JSON.parse(window.localStorage.getItem('user-customer'))
  const orderDetailsProps = {
    ...props,
    userCustomerId: userCustomer?.id,
    googleMapsControls: {
      defaultZoom: 15,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: 'roadmap', // 'roadmap', 'satellite', 'hybrid', 'terrain'
      mapTypeControl: true,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite']
      }
    },
    UIComponent: OrderDetailsUI
  }
  return <OrderDetailsController {...orderDetailsProps} />
}

export const MessagesListing = (props) => {
  const { onRedirectPage } = props
  const [orderByOption, setOrderByOption] = useState('last_direct_message_at')
  const [, t] = useLanguage()
  const [selectedOrder, setSelectedOrder] = useState(null)

  const hideTabs = true
  const [orderListStatus, setOrderListStatus] = useState({
    error: null,
    loading: true,
    orders: []
  })

  const handleOpenOrderDetail = (order) => {
    onRedirectPage({ page: 'order_detail', params: { orderId: order?.uuid } })
  }

  const handleOrderCardClick = (order) => {
    setSelectedOrder({ ...order })
  }

  return (
    <>
      <MessagesListingContainer>
        <OrderListItems>
          <ListHeader>
            <Title>
              {t('MESSAGES', 'Messages')}
            </Title>
            {!hideTabs && (
              <OrdersOrderByOptionContainer>
                <InnerTabsContainer>
                  <Button
                    color={orderByOption === 'last_direct_message_at' ? 'primary' : 'secundaryDark'}
                  onClick={() => setOrderByOption('last_direct_message_at')}
                >
                  {t('NEWEST', 'Newest')}
                </Button>
                <Button
                  color={orderByOption === 'id' ? 'primary' : 'secundaryDark'}
                  onClick={() => setOrderByOption('id')}
                >
                  {t('ORDER_NUMBER', 'Order number')}
                </Button>
                </InnerTabsContainer>
              </OrdersOrderByOptionContainer>
            )}
          </ListHeader>
          <OrderListContainer>
            {orderByOption === 'id' && (
              <IdOrderList
                {...props}
                handleOrderCardClick={handleOrderCardClick}
                selectedOrderCard={selectedOrder}
                handleOpenOrderDetail={handleOpenOrderDetail}
                setOrderListStatus={setOrderListStatus}
              />
            )}
            {orderByOption === 'last_direct_message_at' && (
              <NewestOrderList
                {...props}
                handleOrderCardClick={handleOrderCardClick}
                selectedOrderCard={selectedOrder}
                handleOpenOrderDetail={handleOpenOrderDetail}
                setOrderListStatus={setOrderListStatus}
              />
            )}
          </OrderListContainer>
        </OrderListItems>
        <MessageContainer>
          {selectedOrder && (
            <MessageControler
              order={selectedOrder}
              orderListStatus={orderListStatus}
            />
          )}
        </MessageContainer>
      </MessagesListingContainer>
    </>
  )
}
