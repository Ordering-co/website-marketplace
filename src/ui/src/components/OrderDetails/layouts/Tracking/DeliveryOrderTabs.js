import React, { useLayoutEffect, useRef, useState } from 'react'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { Icon } from '~ui-icon'
import { getDriverPlate, getDriverVehicle, toLangKey, formatRate } from './trackingUtils'
import {
  TabsContainer,
  Tabs,
  Tab,
  Panel,
  Field,
  DriverRow,
  SummaryTitle,
  SummaryRow,
  ProductsBlock,
  PaymentBlock,
  OrderNoteBlock
} from './styles'

const getIncludedTaxes = (order, isDeliveryFee) => {
  if (!order?.taxes || order.taxes.length === 0) {
    return order?.tax_type === 1 ? (order?.summary?.tax ?? 0) : 0
  }
  return order.taxes.reduce((acc, tax) => acc + (
    ((!isDeliveryFee && tax.type === 1 && tax.target === 'product') ||
     (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee'))
      ? (tax.summary?.tax || 0)
      : 0
  ), 0)
}

const getIncludedTaxesDiscounts = (order) => order?.taxes
  ?.filter(tax => tax?.type === 1 && tax?.target === 'product')
  ?.reduce((carry, tax) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0), 0) || 0

export const DeliveryOrderTabs = (props) => {
  const {
    order,
    productList,
    productsCount,
    hideCustomerAddress,
    hideCustomerPhone,
    hideDriverName,
    hideDriverPhone,
    isCourierTracking
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [activeTab, setActiveTab] = useState('delivery')
  const productsRef = useRef(null)
  const [productsMaxHeight, setProductsMaxHeight] = useState(null)

  const customerName = `${order?.customer?.name || ''} ${order?.customer?.lastname || ''}`.trim()
  const customerPhone = order?.customer?.cellphone || order?.customer?.phone
  const driverName = `${order?.driver?.name || ''} ${order?.driver?.lastname || ''}`.trim()
  const driverPhone = order?.driver?.cellphone || order?.driver?.phone
  const driverVehicle = getDriverVehicle(order?.driver)
  const driverPlate = getDriverPlate(order?.driver)
  const driverMeta = [driverVehicle, driverPlate && `${t('PLATE', 'Plate')} ${driverPlate}`].filter(Boolean).join(' · ')

  const summary = order?.summary || {}
  const isPickup = order?.delivery_type === 2
  const manyProducts = (productsCount ?? order?.products?.length ?? 0) > 3
  const subtotal = (summary?.subtotal ?? order?.subtotal ?? 0) + getIncludedTaxes(order)
  const total = summary?.total ?? order?.total ?? 0
  const driverTip = summary?.driver_tip ?? order?.driver_tip ?? 0
  const deliveryCost = (summary?.delivery_price ?? 0) + getIncludedTaxes(order, true)
  const hasOffers = order?.offers?.length > 0
  const orderOffers = hasOffers ? order.offers.filter(offer => offer?.target === 1) : []
  const productOffers = hasOffers ? order.offers.filter(offer => offer?.target === 3) : []
  const deliveryOffers = hasOffers ? order.offers.filter(offer => offer?.target === 2) : []
  const productTaxes = order?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'product') || []
  const deliveryTaxes = order?.taxes?.filter(tax => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee') || []
  const productFees = order?.fees?.filter(fee => !(fee?.fixed === 0 && fee?.percentage === 0)) || []
  const extraValueCheckprice = order?.extra_value_checkprice
  const extraValueAdjustment = order?.metafields?.find?.(meta => meta?.key === 'extra_value_adjustment_amount')
  const extraValueAdjustmentAmount = parseFloat(extraValueAdjustment?.value)
  const couponName = order?.metafields?.find?.(meta => meta?.key === 'pulse_coupon_name')
  const paymentLabel = order?.paymethod?.name || order?.paymethod_data?.name
  const cardBrand = order?.paymethod_data?.card?.brand || order?.paymethod_data?.brand
  const cardLast4 = order?.paymethod_data?.card?.last4 || order?.paymethod_data?.last4
  const paymentText = cardBrand
    ? cardBrand.toUpperCase()
    : (paymentLabel ? t(toLangKey(paymentLabel), paymentLabel) : t('CARD', 'Card'))
  const subtotalWithDiscount = order?.tax_type === 1
    ? (summary?.subtotal_with_discount + getIncludedTaxesDiscounts(order))
    : (summary?.subtotal_with_discount ?? 0)

  useLayoutEffect(() => {
    if (!manyProducts || activeTab !== 'order') return
    const measure = () => {
      const node = productsRef.current
      if (!node) return
      let height = 0
      for (let index = 0; index < Math.min(3, node.children.length); index++) {
        height += node.children[index].offsetHeight
      }
      setProductsMaxHeight(height || null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [manyProducts, activeTab, productsCount ?? order?.products?.length])

  const renderOffer = (offer) => (
    <SummaryRow key={offer.id}>
      <span>{t(toLangKey(offer.name), offer.name)}{offer.rate_type === 1 ? ` (${formatRate(offer?.rate)}%)` : ''}</span>
      <span>- {parsePrice(offer?.summary?.discount)}</span>
    </SummaryRow>
  )

  return (
    <TabsContainer data-doc-section='order-tracking-tabs'>
      <Tabs>
        <Tab type='button' active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} data-doc-control='order-tracking-tab-delivery'>
          {t('DELIVERY_TAB', 'Delivery')}
        </Tab>
        <Tab type='button' active={activeTab === 'order'} onClick={() => setActiveTab('order')} data-doc-control='order-tracking-tab-order'>
          {t('YOUR_ORDER_TAB', 'Your order')}
        </Tab>
      </Tabs>

      {activeTab === 'delivery' && (
        <Panel data-doc-section='order-tracking-delivery'>
          {!hideCustomerAddress && order?.customer?.address && (
            <Field>
              <span className='label'>{t('DELIVERY_ADDRESS', 'Delivery address')}</span>
              <span className='value'>{order.customer.address}</span>
            </Field>
          )}
          {customerName && (
            <Field>
              <span className='label'>{t('CUSTOMER_NAME', 'Customer name')}</span>
              <span className='value'>{customerName}</span>
            </Field>
          )}
          {!hideCustomerPhone && customerPhone && (
            <Field>
              <span className='label'>{t('CUSTOMER_CELLPHONE', 'Customer phone')}</span>
              <span className='value'>{customerPhone}</span>
            </Field>
          )}

          {order?.driver && (
            <DriverRow data-doc-section='order-tracking-driver'>
              <div className='info'>
                <div className={`avatar${order.driver.photo ? ' has-photo' : ''}`}>
                  {order.driver.photo ? <img src={order.driver.photo} alt='' /> : <Icon name='userFilled' />}
                </div>
                <div className='texts'>
                  {!hideDriverName && driverName && <h3>{driverName}</h3>}
                  {driverMeta && <p>{driverMeta}</p>}
                </div>
              </div>
              {!hideDriverPhone && driverPhone && (
                <a className='call' href={`tel:${driverPhone}`} aria-label={t('CALL_DRIVER', 'Call driver')} data-doc-control='order-tracking-call-driver'>
                  <Icon name='phone' />
                </a>
              )}
            </DriverRow>
          )}
        </Panel>
      )}

      {activeTab === 'order' && (
        <Panel data-doc-section='order-tracking-summary'>
          {isCourierTracking && (
            <OrderNoteBlock data-doc-section='order-tracking-order-number'>
              <SummaryTitle>{t('ORDER_NUMBER', 'Order number')}</SummaryTitle>
              <p>#{order?.id}</p>
            </OrderNoteBlock>
          )}

          {!isCourierTracking && (
            <>
              <SummaryTitle>{t('TOTAL_COST', 'Total cost')}</SummaryTitle>

              <SummaryRow>
                <span>{t('SUMMARY_PRODUCTS', 'Products')}</span>
                <span>{parsePrice(subtotal)}</span>
              </SummaryRow>

              {summary?.discount > 0 && !hasOffers && (
                <SummaryRow>
                  <span>
                    {t('DISCOUNT', 'Discount')}
                    {order?.offer_type === 1 ? ` (${formatRate(order?.offer_rate)}%)` : ''}
                  </span>
                  <span>- {parsePrice(summary?.discount ?? order?.discount)}</span>
                </SummaryRow>
              )}

              {orderOffers.map(renderOffer)}

              {summary?.subtotal_with_discount > 0 && summary?.discount > 0 && summary?.total >= 0 && (
                <SummaryRow>
                  <span>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</span>
                  <span>{parsePrice(subtotalWithDiscount)}</span>
                </SummaryRow>
              )}

              {(!order?.taxes || order.taxes.length === 0) && order?.tax_type === 2 && (
                <SummaryRow>
                  <span>{t('TAX', 'Tax')} ({formatRate(order?.tax)}%)</span>
                  <span>{parsePrice(summary?.tax ?? 0)}</span>
                </SummaryRow>
              )}

              {(!order?.fees || order.fees.length === 0) && summary?.service_fee > 0 && (
                <SummaryRow>
                  <span>{t('SERVICE_FEE', 'Service fee')} ({formatRate(order?.service_fee)}%)</span>
                  <span>{parsePrice(summary?.service_fee ?? 0)}</span>
                </SummaryRow>
              )}

              {productTaxes.map(tax => (
                <SummaryRow key={tax.id}>
                  <span>{t(toLangKey(tax?.name), tax?.name)} ({formatRate(tax?.rate)}%)</span>
                  <span>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</span>
                </SummaryRow>
              ))}

              {productFees.map(fee => (
                <SummaryRow key={fee.id}>
                  <span>
                    {t(toLangKey(fee?.name), fee?.name)}
                    {' ('}{fee?.fixed > 0 ? parsePrice(fee.fixed) : ''}{fee?.fixed > 0 && fee?.percentage > 0 ? ' + ' : ''}{fee?.percentage > 0 ? `${fee.percentage}%` : ''}{')'}
                  </span>
                  <span>{parsePrice((fee?.summary?.fixed || 0) + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage ?? 0))}</span>
                </SummaryRow>
              ))}

              {productOffers.map(renderOffer)}

              {deliveryCost > 0 && !isPickup && (
                <SummaryRow>
                  <span>{t('DELIVERY_FEE', 'Delivery fee')}</span>
                  <span>{parsePrice(deliveryCost)}</span>
                </SummaryRow>
              )}

              {extraValueCheckprice > 0 && (
                <SummaryRow>
                  <span>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</span>
                  <span>{parsePrice(extraValueCheckprice)}</span>
                </SummaryRow>
              )}

              {deliveryTaxes.map(tax => (
                <SummaryRow key={tax.id}>
                  <span>{t(toLangKey(tax?.name), tax?.name)} ({formatRate(tax?.rate)}%)</span>
                  <span>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</span>
                </SummaryRow>
              ))}

              {deliveryOffers.map(renderOffer)}

              {driverTip > 0 && (
                <SummaryRow>
                  <span>{t('DRIVER_TIP', 'Driver tip')}</span>
                  <span>{parsePrice(driverTip)}</span>
                </SummaryRow>
              )}

              {extraValueAdjustment && !!extraValueAdjustmentAmount && (
                <SummaryRow>
                  <span>{couponName ? couponName.value : t(toLangKey(extraValueAdjustment.key), extraValueAdjustment.key)}</span>
                  <span>
                    {extraValueAdjustmentAmount > 0
                      ? parsePrice(extraValueAdjustmentAmount)
                      : `- ${parsePrice(extraValueAdjustmentAmount * -1)}`}
                  </span>
                </SummaryRow>
              )}

              <SummaryRow className='total'>
                <span>{t('TOTAL', 'Total')}</span>
                <span>{parsePrice(total)}</span>
              </SummaryRow>
            </>
          )}

          <ProductsBlock
            ref={productsRef}
            scroll={manyProducts}
            style={manyProducts && productsMaxHeight ? { maxHeight: productsMaxHeight } : undefined}
            data-doc-section='order-tracking-products'
          >
            {productList}
          </ProductsBlock>

          {isCourierTracking && order?.comment && (
            <OrderNoteBlock data-doc-section='order-tracking-comment'>
              <SummaryTitle>{t('COMMENT', 'Comment')}</SummaryTitle>
              <p>{order.comment}</p>
            </OrderNoteBlock>
          )}

          {!isCourierTracking && (paymentLabel || cardLast4) && (
            <PaymentBlock data-doc-section='order-tracking-payment'>
              <SummaryTitle>{t('PAYMENT_METHOD', 'Payment method')}</SummaryTitle>
              <p>{paymentText}{cardLast4 ? ` ****${cardLast4}` : ''}</p>
            </PaymentBlock>
          )}
        </Panel>
      )}
    </TabsContainer>
  )
}
