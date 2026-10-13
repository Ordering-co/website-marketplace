import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Container,
  HeaderContainer,
  CustomerInfoContainer,
  CustomerDetails,
  PaymentDetails,
  CustomerData,
  PhotoWrapper,
  OrderSummary,
  SingleOrderContainer,
  Divider,
  StatusBar,
  StatusBarContainer
} from './styles'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { MultiOrdersDetails as MultiOrdersDetailsController } from '~components/components/MultiOrdersDetails'
import { useConfig } from '~components/contexts/ConfigContext'

import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { generalUtilities } from '~ui/utils'
import { Image } from '~ui/src/components/Image'
import { Alert } from '~ui/src/components/Confirm'
import { SingleOrderCard } from '~ui/src/components/SingleOrderCard'

import { Icon } from '~ui-icon'

const MultiOrdersDetailsUI = (props) => {
  const {
    customer,
    paymentEvents,
    ordersSummary,
    handleOrderRedirect
  } = props

  const { loading, orders, error } = props.ordersList
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()
  const [alertState, setAlertState] = useState({ open: false, content: [] })

  const { getOrderStatus, walletName } = generalUtilities()

  const progressBarStyle = configs.multi_business_checkout_progress_bar_style?.value
  const showBarInOrder = ['group', 'both']
  const showBarInIndividual = ['individual', 'both']

  const isTaxIncludedOnPrice = orders.every(_order => _order.taxes?.length ? _order.taxes?.every(_tax => _tax.type === 1) : true)

  useEffect(() => {
    if (error) {
      setAlertState({
        open: true,
        content: error
      })
    }
  }, [error])

  return (
    <Container>
      {(orders?.length > 0 || loading) && (
        <>
          <HeaderContainer>
            {loading
              ? (
              <>
                <Skeleton height={36} width={250} style={{ marginBottom: '6px' }} />
                <Skeleton height={21} />
              </>
                )
              : (
              <>
                <h1>
                  <span>{t('HEY', 'Hey')}</span>
                  <span className='name'>{customer?.name} {customer?.lastname}</span>
                </h1>
                <p>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</p>
              </>
                )}
          </HeaderContainer>

          {loading
            ? (
            <Skeleton height={220} style={{ margin: '50px 0' }} />
              )
            : (
            <CustomerInfoContainer>
              <CustomerDetails>
                <h3>{t('CUSTOMER_DETAILS', 'Customer details')}</h3>
                <div>
                  <PhotoWrapper>
                    <Image
                      src={customer?.photo}
                      fallback={<Icon name="user" />}
                    />
                  </PhotoWrapper>
                  <CustomerData>
                    <p>{customer?.name} {customer?.lastname}</p>
                    <p>{customer?.email}</p>
                    <p>{customer?.cellphone || customer?.phone}</p>
                  </CustomerData>
                </div>
              </CustomerDetails>
              <PaymentDetails>
                <h3>{t('PAYMETHOD', 'Payment method')}</h3>
                {paymentEvents.map(event => (
                  <p key={event.id}>
                    {event?.wallet_event
                      ? walletName[event?.wallet_event?.wallet?.type]?.name
                      : event?.paymethod?.name}
                  </p>
                ))}
                <h3 className='address'>{t('DELIVERYA_V21', 'Delivery address')}</h3>
                <p>{customer?.address}</p>
              </PaymentDetails>
            </CustomerInfoContainer>
              )}

          {loading
            ? (
            <Skeleton height={250} style={{ marginBottom: '50px' }} />
              )
            : (
            <OrderSummary>
              <h3>{t('ORDER_SUMMARY', 'Order summary')}</h3>
              {(showBarInOrder.includes(progressBarStyle)) && (
                <StatusBarContainer>
                  <StatusBar percentage={getOrderStatus(orders[0]?.status)?.percentage} />
                  <p className='order-status'>{getOrderStatus(orders[0]?.status)?.value}</p>
                </StatusBarContainer>
              )}
              <table>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{t('ORDER', 'Order')} #{order.id}</td>
                      <td>{parsePrice(order?.summary?.total ?? order?.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!isTaxIncludedOnPrice && (
                <>
                  <Divider />
                  <table>
                    <tbody>
                      <tr>
                        <td>{t('TOTAL_BEFORE_TAX', 'Total before tax')}:</td>
                        <td>{parsePrice(ordersSummary?.subtotal)}</td>
                      </tr>
                      <tr>
                        <td>{t('ESTIMATED_TAX_TO_BE_COLLECTED', 'Estimated tax to be collected')}:</td>
                        <td>{parsePrice(ordersSummary?.tax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}
              <Divider />
              <table>
                <tbody>
                  <tr>
                    <td>{t('PAYMENT_TOTAL', 'Payment total')}:</td>
                    <td>{parsePrice(ordersSummary?.total)}</td>
                  </tr>
                </tbody>
              </table>
              {orders?.some(order => order?.payment_events?.length > 0) && (
                <div style={{ margin: '10px 0 0 2px', fontSize: 14 }}>
                  <span>{t('PAYMENTS', 'Payments')}</span>
                  <div
                    style={{
                      width: '100%',
                      marginTop: 10
                    }}
                  >
                    {orders?.map(order => (
                      order?.payment_events?.map(event => {
                        if (!(event?.amount > 0)) return null
                        const isRefund = event?.event === 'refund'
                        const methodName = event?.wallet_event
                          ? walletName[event?.wallet_event?.wallet?.type]?.name
                          : t(event?.paymethod?.name.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)
                        const eventLabel = isRefund
                          ? `${t('REFUND', 'Refund')} (${methodName})`
                          : methodName
                        return (
                        <div
                          key={`${order.id}_${event.id}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 10
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <span>
                              {eventLabel}
                              {` (#${(order?.id)})`}
                            </span>
                          </div>
                          <span>
                            {isRefund ? '+' : '-'}{parsePrice(event?.amount, { isTruncable: true })}
                          </span>
                        </div>
                        )
                      })
                    ))}
                  </div>
                </div>
              )}
            </OrderSummary>
              )}
        </>
      )}

      {loading
        ? (
            [...Array(3).keys()].map(i => (
          <SingleOrderContainer key={i}>
            <Skeleton height={330} />
          </SingleOrderContainer>
            ))
          )
        : (
        <>
          {orders.map(order => (
            <SingleOrderCard
              key={order.id}
              isMultiOrders
              getOrderStatus={getOrderStatus}
              order={order}
              showProgressBar={showBarInIndividual.includes(progressBarStyle)}
            />
          ))}
        </>
          )}
      {!loading && (error || orders?.length === 0) && (
        error?.includes('ERROR_ACCESS_EXPIRED')
          ? (
          <NotFoundSource
            content={t(error[0], 'Sorry, the order has expired.')}
          />
            )
          : (
          <NotFoundSource
            content={t('NOT_FOUND_ORDER', theme?.defaultLanguages?.NOT_FOUND_ORDER || 'Sorry, we couldn\'t find the requested order.')}
            btnTitle={t('ORDERS_REDIRECT', theme?.defaultLanguages?.ORDERS_REDIRECT || 'Go to Orders')}
            onClickButton={handleOrderRedirect}
          />
            )
      )}
      <Alert
        title={t('WEB_APPNAME', 'Ordering')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => setAlertState({ open: false, content: [] })}
        onAccept={() => setAlertState({ open: false, content: [] })}
        closeOnBackdrop={false}
      />
    </Container>
  )
}

export const MultiOrdersDetails = (props) => {
  const MultiOrdersDetails = {
    ...props,
    UIComponent: MultiOrdersDetailsUI
  }
  return <MultiOrdersDetailsController {...MultiOrdersDetails} />
}
