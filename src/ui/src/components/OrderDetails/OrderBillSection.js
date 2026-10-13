import React, { useId } from 'react'
import { useTheme } from 'styled-components'
import { DeliveryTooltipAnchor, DeliveryFeeStrikethrough, DeliveryFeeFreeLabel } from '../Cart/styles'

import {
  OrderBill,
  Exclamation,
  PaymentWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { verifyDecimals, capitalize, generalUtilities } from '~ui/utils'
import { TaxBillRows } from '~ui/src/components/TaxBillRows'
import { FeeBillRows } from '~ui/src/components/FeeBillRows'

import { Icon } from '~ui-icon'

export const OrderBillSection = (props) => {
  const {
    order,
    setOpenTaxModal,
    showOnlyTotals,
    isHideTotal,
    orderCompleted
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ parsePrice, parseNumber }] = useUtils()
  const [{ configs }] = useConfig()
  const { walletName } = generalUtilities()
  const isPickup = order?.delivery_type === 2
  const deliveryPartnerTooltipId = useId()

  const extraValueMetafields = order?.metafields?.filter?.(meta => meta?.key?.startsWith('extra_value_')) || []
  const declaredValueMeta = order?.metafields?.find?.(meta => meta?.key === 'declared_value')
  const declaredValue = declaredValueMeta ? parseFloat(declaredValueMeta.value) : (order?.declared_value != null ? parseFloat(order.declared_value) : null)
  const isCustomOrder = declaredValue != null && declaredValue > 0

  const getIncludedTaxes = (isDeliveryFee) => {
    if (!order?.taxes?.length) {
      return order?.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded, tax) => {
        return taxIncluded + (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') || (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? (tax.summary?.tax ?? 0) : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter(tax => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry, tax) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const clearAmount = (value) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))
  const deliveryPriceWithDiscount = order?.summary?.delivery_price_with_discount ?? order?.summary?.delivery_price ?? 0
  const deliveryFeeTotalWithIncludedTax = clearAmount(deliveryPriceWithDiscount + getIncludedTaxes(true))
  const deliveryFeeOffers = order?.offers?.filter(offer => offer?.target === 2) || []
  const hasDeliveryFeeOffer = deliveryFeeOffers.length > 0
  const freeDeliveryExtraMetafield = order?.metafields?.find?.((meta) => meta?.key === 'extra_value_free_delivery')
  const freeDeliveryExtraParsed = parseFloat(freeDeliveryExtraMetafield?.value)
  const isDeliveryFreeByExtraMetafield =
    Boolean(freeDeliveryExtraMetafield) &&
    Number.isFinite(freeDeliveryExtraParsed) &&
    freeDeliveryExtraParsed < 0 &&
    clearAmount(-freeDeliveryExtraParsed) === deliveryFeeTotalWithIncludedTax

  const freeDeliveryPartnerNameMeta = order?.metafields?.find?.((meta) => meta?.key === 'free_delivery_partner_name')
  const freeDeliveryPartnerName = String(freeDeliveryPartnerNameMeta?.value ?? '').trim()
  const freeDeliveryPartnerTooltip = freeDeliveryPartnerName
    ? t(
      'FREE_DELIVERY_FOR',
      'Free delivery for'
    ) + ' ' + freeDeliveryPartnerName + ' ' + t('CARDHOLDERS', 'cardholders')
    : t('FREE_DELIVERY_APPLIED_TOOLTIP', 'Free delivery applied')

  const visibleExtraValueMetafields = extraValueMetafields.filter((meta) => {
    if (!parseFloat(meta?.value)) return false
    if (isDeliveryFreeByExtraMetafield && meta?.key === 'extra_value_free_delivery') return false
    return true
  })

  return (
    <OrderBill orderCompleted={orderCompleted}>
      <table>
        <tbody>
          {!isCustomOrder && (
            <tr className='subtotal'>
              <td>{t('SUBTOTAL', theme?.defaultLanguages?.SUBTOTAL || 'Subtotal')}</td>
              <td>
                {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()))}
              </td>
            </tr>
          )}
          {!showOnlyTotals && (
            <>
              {((order?.summary?.discount ?? order?.discount) > 0) && order?.offers?.length === 0 && (
                <tr>
                  {order?.offer_type === 1
                    ? (
                      <td>
                        {t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}{' '}
                        <span>{`(${verifyDecimals(order?.offer_rate, parseNumber)}%)`}</span>
                      </td>
                      )
                    : (
                      <td>{t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}</td>
                      )}
                  <td>- {parsePrice(order?.summary?.discount ?? order?.discount)}</td>
                </tr>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter(offer => offer?.target === 1)?.map(offer => (
                  <tr key={offer.id}>
                    <td>
                      {t(offer.name?.toUpperCase()?.replace(/ /g, '_'), offer.name)}
                      {offer.rate_type === 1 && (
                        <span>{`(${verifyDecimals(offer?.rate, parseNumber)}%)`}</span>
                      )}
                      {setOpenTaxModal && (
                        <Exclamation onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                          <Icon name="infoCircle" size='20' color={theme.colors.primary} />
                        </Exclamation>
                      )}
                    </td>
                    <td>
                      - {parsePrice(offer?.summary?.discount)}
                    </td>
                  </tr>
                ))
              }
              {order?.offers?.filter(offer => offer?.target === 1)?.length > 0 &&
                order?.summary?.subtotal_with_discount > 0 &&
                order?.summary?.discount > 0 &&
                order?.summary?.total >= 0 && (
                  <tr>
                    <td>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</td>
                    {order?.tax_type === 1
                      ? (
                        <td>{parsePrice((order?.summary?.subtotal_with_discount ?? 0) + (getIncludedTaxesDiscounts() ?? 0))}</td>
                        )
                      : (
                        <td>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</td>
                        )}
                  </tr>
              )}
              {
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <tr>
                    <td>
                      {t('TAX', 'Tax')}
                      <span>{`(${verifyDecimals(order?.tax, parseNumber)}%)`}</span>
                    </td>
                    <td>{parsePrice(order?.summary?.tax ?? 0)}</td>
                  </tr>
                )
              }
              {
                order?.fees?.length === 0 && (
                  <tr>
                    <td>
                      {t('SERVICE_FEE', 'Service fee')}
                      <span>{`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}</span>
                    </td>
                    <td>{parsePrice(order?.summary?.service_fee ?? 0)}</td>
                  </tr>
                )
              }
              <TaxBillRows
                taxes={order?.taxes}
                target='product'
                setOpenTaxModal={setOpenTaxModal}
                parsePrice={parsePrice}
                parseNumber={parseNumber}
                t={t}
                iconVariant='exclamation'
                ExclamationWrapper={Exclamation}
              />
              <FeeBillRows
                fees={order?.fees}
                setOpenTaxModal={setOpenTaxModal}
                parsePrice={parsePrice}
                t={t}
                iconVariant='exclamation'
                ExclamationWrapper={Exclamation}
              />
              {
                order?.offers?.length > 0 && order?.offers?.filter(offer => offer?.target === 3)?.map(offer => (
                  <tr key={offer.id}>
                    <td>
                      {t(offer?.name?.toUpperCase()?.replace(/ /g, '_'), offer?.name)}
                      {offer.rate_type === 1 && (
                        <span>{`(${verifyDecimals(offer?.rate, parseNumber)}%)`}</span>
                      )}
                      {setOpenTaxModal && (
                        <Exclamation onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                          <Icon name="infoCircle" size='20' color={theme.colors.primary} />
                        </Exclamation>
                      )}
                    </td>
                    <td>
                      - {parsePrice(offer?.summary?.discount)}
                    </td>
                  </tr>
                ))
              }
              <TaxBillRows
                taxes={order?.taxes}
                target='order'
                setOpenTaxModal={setOpenTaxModal}
                parsePrice={parsePrice}
                parseNumber={parseNumber}
                t={t}
                iconVariant='exclamation'
                ExclamationWrapper={Exclamation}
              />
              {typeof order?.summary?.delivery_price === 'number' && !isPickup && !hasDeliveryFeeOffer && (deliveryFeeTotalWithIncludedTax !== 0 || isDeliveryFreeByExtraMetafield) && (
                <tr>
                  <td className={isDeliveryFreeByExtraMetafield ? 'icon' : undefined}>
                    {t('DELIVERY_FEE', theme?.defaultLanguages?.DELIVERY_FEE || 'Delivery Fee')}
                    {isDeliveryFreeByExtraMetafield && (
                      <DeliveryTooltipAnchor tabIndex={0} aria-describedby={deliveryPartnerTooltipId}>
                        <Icon name="infoCircle" size='20' color={theme.colors.primary} aria-hidden />
                        <span id={deliveryPartnerTooltipId} className='delivery-tooltip-bubble' role='tooltip'>
                          {freeDeliveryPartnerTooltip}
                        </span>
                      </DeliveryTooltipAnchor>
                    )}
                  </td>
                  <td>
                    {isDeliveryFreeByExtraMetafield && (
                      <DeliveryFeeStrikethrough>
                        {parsePrice(order?.summary?.delivery_price + getIncludedTaxes(true))}
                      </DeliveryFeeStrikethrough>
                    )}
                    {isDeliveryFreeByExtraMetafield && (
                      <DeliveryFeeFreeLabel>{t('FREE', 'FREE')}</DeliveryFeeFreeLabel>
                    )}
                    {!isDeliveryFreeByExtraMetafield &&
                      parsePrice(deliveryPriceWithDiscount + getIncludedTaxes(true))}
                  </td>
                </tr>
              )}
              {isCustomOrder && declaredValue > 0 && (
                <tr>
                  <td>{t('DECLARED_VALUE', 'Declared value')}</td>
                  <td>{parsePrice(declaredValue)}</td>
                </tr>
              )}
              {order?.extra_value_checkprice && order?.extra_value_checkprice > 0 && (
                <tr>
                  <td>{t('EXTRA_VALUE_CHECKPRICE', 'Extra value checkprice')}</td>
                  <td>{parsePrice(order?.extra_value_checkprice)}</td>
                </tr>
              )}
              <TaxBillRows
                taxes={order?.taxes}
                target='delivery_fee'
                setOpenTaxModal={setOpenTaxModal}
                parsePrice={parsePrice}
                parseNumber={parseNumber}
                t={t}
                iconVariant='exclamation'
                ExclamationWrapper={Exclamation}
              />
              {
                order?.offers?.length > 0 && order?.offers?.filter(offer => offer?.target === 2)?.map(offer => (
                  <tr key={offer.id}>
                    <td>
                      {t(offer.name?.toUpperCase()?.replace(/ /g, '_'), offer.name)}
                      {offer.rate_type === 1 && (
                        <span>{`(${verifyDecimals(offer?.rate, parseNumber)}%)`}</span>
                      )}
                      {setOpenTaxModal && (
                        <Exclamation onClick={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                          <Icon name="infoCircle" size='20' color={theme.colors.primary} />
                        </Exclamation>
                      )}
                    </td>
                    <td>
                      {parsePrice(deliveryPriceWithDiscount + getIncludedTaxes(true))}
                    </td>
                  </tr>
                ))
              }
              {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) && (
                <tr>
                  <td>
                    {t('DRIVER_TIP', theme?.defaultLanguages?.DRIVER_TIP || 'Driver tip')}{' '}
                    {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        <span>{`(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}</span>
                      )}
                  </td>
                  <td>{parsePrice(order?.summary?.driver_tip ?? order?.driver_tip ?? 0)}</td>
                </tr>
              )}
              {visibleExtraValueMetafields.map(meta => {
                const strippedKey = meta?.key?.replace('extra_value_', '')
                const langKey = meta?.key?.toUpperCase()
                const fallback = strippedKey?.replace(/_/g, ' ')?.split(' ')?.map(word => capitalize(word))?.join(' ')
                return (
                  <tr key={meta?.key}>
                    <td>
                      {t(langKey, fallback)}{' '}
                    </td>
                    <td>{parseFloat(meta?.value) > 0 ? parsePrice(parseFloat(meta?.value)) : `- ${parsePrice(parseFloat(meta?.value) * -1)}`}</td>
                  </tr>
                )
              })}
            </>
          )}
        </tbody>
      </table>
      {!isHideTotal && (
        <table className='total'>
          <tbody>
            <tr>
              <td>
                {isCustomOrder
                  ? t('ESTIMATED_TOTAL', 'Estimated Total')
                  : t('TOTAL', theme?.defaultLanguages?.TOTAL || 'Total')
                }
              </td>
              <td>{parsePrice(order?.summary?.total ?? order?.total)}</td>
            </tr>
            {isCustomOrder && (
              <tr>
                <td>{t('DECLARED_VALUE', 'Declared value')}</td>
                <td>{parsePrice(declaredValue)}</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {order?.payment_events?.length > 0 && !showOnlyTotals && (
        <>
          <PaymentWrapper>
            <div className='payments-list'>
              {order?.payment_events?.map(event => {
                if (!(event.amount > 0)) return null
                const isRefund = event?.event === 'refund'
                const gatewayName = event?.wallet_event
                  ? walletName[event?.wallet_event?.wallet?.type]?.description
                  : t(event?.paymethod?.gateway?.toUpperCase() ?? 'PAYMENT', capitalize(event?.paymethod?.gateway?.replace(/_/g, ' ')?.toLowerCase() || 'Payment'))
                const eventLabel = isRefund
                  ? `${t('REFUND', 'Refund')} (${gatewayName})`
                  : gatewayName
                return (
                <div
                  className='payment-item'
                  key={event.id}
                >
                  <div className='paymethod'>
                    <div className='paymethod-row'>
                      <span>
                        {eventLabel}
                      </span>
                      {!isCustomOrder && (
                        <span>
                          {isRefund ? '+' : '-'}{parsePrice(event.amount, { isTruncable: true })}
                        </span>
                      )}
                    </div>
                    {event?.data?.charge_id && (
                      <span>
                        {`${t('CODE', 'Code')}: ${event?.data?.charge_id}`}
                      </span>
                    )}
                  </div>
                </div>
                )
              })}
            </div>
          </PaymentWrapper>
        </>
      )}
    </OrderBill>
  )
}
