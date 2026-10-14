import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from 'styled-components'
import momentjs from 'moment'
import {
  AccordionSection,
  Accordion,
  AccordionContent,
  ContentInfo,
  BusinessInfo,
  BusinessTotal,
  BusinessActions,
  PriceContainer,
  WrapperBusinessLogo,
  BusinessLogo,
  TimeContainer
} from './styles'

import { useOrder } from '~components/contexts/OrderContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useEvent } from '~components/contexts/EventContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { Button } from '~ui/src/styles/Buttons'
import { generalUtilities } from '~ui/utils'

import { Icon } from '~ui-icon'

export const BusinessItemAccordion = (props) => {
  const {
    cart,
    uuid,
    isCartPending,
    currentCartUuid,
    isCheckout,
    isClosed,
    moment,
    business,
    isProducts,
    isForceOpenAccordion,
    isCartOnProductsList,
    handleClearProducts,
    handleStoreRedirect,
    handleCartOpen,
    isStore,
    total,
    handleClickCheckout,
    checkoutButtonDisabled,
    setPreorderBusiness,
    handleChangeStore,
    isMultiCheckout,
    isGiftCart,
    forceHideBusiness,
    cartReservation,
    hasNoReservation,
    showUpsellingInBusinessInfo,
    isCartPopover,
    isStickyFooter
  } = props

  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const [events] = useEvent()
  const [{ parsePrice, parseDate, timeFormat }] = useUtils()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [setActive, setActiveState] = useState('')
  const [setHeight] = useState('0px')
  const [setRotate, setRotateState] = useState('accordion__icon')
  const [cartProductUpdated, setCartProductUpdated] = useState(null)
  const isBusinessChangeEnabled = configs?.cart_change_business_validation?.value === '1'
  const checkoutMultiBusinessEnabled = configs?.checkout_multi_business_enabled?.value === '1'
  const content = useRef(null)
  const accordionSectionRef = useRef(null)
  const businessStore = useRef(null)
  const businessDelete = useRef(null)
  const changeStore = useRef(null)

  const { convertHoursToMinutes } = generalUtilities()

  const viewString = isStore ? 'business_view' : 'header'
  const hideBusinessLogo = true || isGiftCart || theme?.[viewString]?.components?.cart?.components?.business?.components?.logo?.hidden
  const hideBusinessTime = true || theme?.[viewString]?.components?.cart?.components?.business?.components?.time?.hidden
  const isValidReservation = cartReservation && momentjs(cartReservation?.reserve_date).format('YYYY-MM-DD HH:mm:ss') > momentjs().format('YYYY-MM-DD HH:mm:ss')
  const toggleAccordion = (e) => {
    const isActionsClick = businessStore.current?.contains(e?.target) || businessDelete.current?.contains(e?.target) || changeStore.current?.contains(e?.target)
    if (isClosed || !isProducts || isActionsClick) return
    setActiveState(setActive === '' ? 'active' : '')
    setRotateState(
      setActive === 'active' ? 'accordion__icon' : 'accordion__icon rotate'
    )
  }
  const showButton = orderState?.options?.type !== 9
    ? setActive === 'active' && !!isProducts && !isMultiCheckout && !checkoutMultiBusinessEnabled
    : isValidReservation

  const activeAccordion = (value) => {
    setActiveState(value ? 'active' : '')
    setRotateState(value ? 'accordion__icon rotate' : 'accordion__icon')
  }

  const handleCloseCartPopover = () => {
    const cartsLength = Object.values(orderState?.carts).filter(cart => cart.products.length > 0).length ?? 0
    if (cartsLength > 1 && !isCheckout && !isForceOpenAccordion) {
      activeAccordion(false)
      setCartProductUpdated(null)
    }
  }

  const handleCartProductUpdated = (product, cart) => {
    setCartProductUpdated(cart?.uuid)
  }

  const handleOpenBusinessMenu = (business) => {
    setPreorderBusiness && setPreorderBusiness(business)
  }

  const showClosedClearCart = !!isProducts && !isCartPending

  const subtotalWithTaxes = cart?.taxes?.reduce((acc, item) => {
    if (item?.type === 1) {
      return acc = acc + item?.summary?.tax
    }
    return acc
  }, cart?.subtotal)
  const belowMinimum = cartReservation ? !cart?.valid_minimum : subtotalWithTaxes < cart?.minimum

  useEffect(() => {
    if (currentCartUuid) {
      if (currentCartUuid === uuid) {
        activeAccordion(true)
        if (isCartPopover) {
          requestAnimationFrame(() => {
            accordionSectionRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
          })
        }
      } else {
        activeAccordion(false)
      }
      return
    }

    if (cartProductUpdated === uuid) {
      activeAccordion(true)
    } else if (cartProductUpdated) {
      activeAccordion(false)
    }
  }, [cartProductUpdated, currentCartUuid, uuid, isCartPopover])

  useEffect(() => {
    const cartsLength = Object.values(orderState?.carts).filter(cart => cart.products.length > 0).length ?? 0
    if ((cartsLength === 1 || isCheckout) && !isClosed) {
      activeAccordion(true)
    }
  }, [orderState?.carts])

  useEffect(() => {
    if (isForceOpenAccordion) {
      activeAccordion(true)
    }
  }, [isForceOpenAccordion])

  useEffect(() => {
    events.on('cart_popover_closed', handleCloseCartPopover)
    events.on('cart_product_updated', handleCartProductUpdated)
    return () => {
      events.off('cart_popover_closed', handleCloseCartPopover)
      events.off('cart_product_updated', handleCartProductUpdated)
    }
  }, [])

  useEffect(() => {
    handleCartOpen && handleCartOpen(!!setActive)
  }, [setActive])

  return (
    <>
    {
      forceHideBusiness
        ? props.children
        : (
        <AccordionSection ref={accordionSectionRef} isClosed={isClosed} isCartOnProductsList={isCartOnProductsList} isStickyFooter={isStickyFooter}>
          {
            !isCheckout && (
              <Accordion
                isClosed={isClosed}
                isStickyFooter={isStickyFooter}
                className={`accordion ${setActive}`}
                onClick={(e) => toggleAccordion(e)}
              >
                <BusinessInfo isOtherInfo={(isClosed && !isStore) || (!isClosed && !isProducts && !isStore)}>
                  {!hideBusinessLogo && (
                    <WrapperBusinessLogo>
                      <BusinessLogo
                        bgimage={!isGiftCart ? (business?.logo || theme.images?.dummies?.businessLogo) : theme.images?.logos?.isotype}
                      />
                    </WrapperBusinessLogo>
                  )}
                  <ContentInfo className='info' isStore={isStore} isLogo={!hideBusinessLogo}>
                    {isGiftCart && (
                      <h2>{t('GIFT_CARD_CHECKOUT', 'Gift card checkout')}</h2>
                    )}
                    {!!business?.name && (
                      <h2>{business?.name}</h2>
                    )}
                    {!hideBusinessTime && (
                      <TimeContainer>
                        {orderState?.options?.type === 1
                          ? (
                            <span>
                              <Icon name="clock" />
                              {convertHoursToMinutes(business?.delivery_time)}
                            </span>
                            )
                          : (
                            <span>
                              <Icon name="clock" />
                              {convertHoursToMinutes(business?.pickup_time)}
                            </span>
                            )}
                      </TimeContainer>
                    )}
                    {cartReservation && orderState?.options?.type === 9 && (
                      <div>
                        <span
                          className={!isValidReservation ? 'danger' : ''}
                        >
                          {t('RESERVATION', 'Reservation')} • {parseDate(cartReservation?.reserve_date, { utc: false, outputFormat: `YYYY-MM-DD ${timeFormat}` })} • {cartReservation?.guests_reservation} {t('GUESTS', 'Guests')}
                        </span>
                      </div>
                    )
                    }
                    <div>
                      {!showUpsellingInBusinessInfo && handleStoreRedirect && !isCartOnProductsList && !isStore && !isGiftCart && (
                        <span
                          ref={businessStore}
                          onClick={() => isClosed ? handleOpenBusinessMenu(business) : handleStoreRedirect(business?.slug)}
                          className='go-store'
                        >
                          {t('GO_TO_STORE', 'Go to store')}
                        </span>
                      )}
                      {!showUpsellingInBusinessInfo && !isClosed && (!!isProducts || (cartReservation && orderState?.options?.type === 9)) && !isCartPending && (
                        <>
                          {!isStore && !isGiftCart && <span>•</span>}
                          <span
                            ref={businessDelete}
                            onClick={() => handleClearProducts()}
                            className='clear-cart'
                          >
                            {t('CLEAR_CART', 'Clear cart')}
                          </span>
                        </>
                      )}
                    </div>
                    {!showUpsellingInBusinessInfo && !cartReservation && isBusinessChangeEnabled && handleChangeStore && !isGiftCart && !isCartPending && (
                      <span
                      ref={changeStore}
                        onClick={handleChangeStore}
                        className='change-store'
                        >
                        {t('CHANGE_STORE', 'Change store')}
                      </span>
                    )}
                  </ContentInfo>
                </BusinessInfo>
                {isClosed && !isStore && (
                  <BusinessTotal className={`closed${showClosedClearCart ? ' has-clear' : ''}`}>
                    <p>{t('CLOSED', 'Closed')} {moment}</p>
                    {showClosedClearCart && (
                      <span
                        ref={businessDelete}
                        onClick={() => handleClearProducts()}
                        className='clear-cart'
                      >
                        {t('CLEAR_CART', 'Clear cart')}
                      </span>
                    )}
                  </BusinessTotal>
                )}

                {!isClosed && !isProducts && !isStore && (
                  <BusinessTotal>
                    <p>{cartReservation && orderState?.options?.type === 9 ? t('ONLY_TABLE', 'Only table') : t('NO_PRODUCTS', 'No products')}</p>
                  </BusinessTotal>
                )}

                <BusinessActions>
                  {!isClosed && !!isProducts && (
                    <span>
                      <Icon name="arrowSortedUp" className={`${setRotate}`} />
                    </span>
                  )}
                </BusinessActions>
              </Accordion>
            )
          }
          <AccordionContent
            ref={content}
            isStickyFooter={isStickyFooter}
            isOpen={!!setActive}
            style={{ minHeight: `${setHeight}`, maxHeight: !setActive && '0px' }}
            >
            {!showUpsellingInBusinessInfo && !cartReservation && isBusinessChangeEnabled && isCheckout && handleChangeStore && !isCartPending && (
              <BusinessInfo>
                <ContentInfo className='info'>
                  <span
                    ref={changeStore}
                    onClick={handleChangeStore}
                    className='change-store'
                    >
                    {t('CHANGE_STORE', 'Change store')}
                  </span>
                </ContentInfo>
              </BusinessInfo>
            )}
            {props.children}
          </AccordionContent>
          {!isClosed && !isCheckout && (isStickyFooter ? !!isProducts : showButton) && (
            <PriceContainer showUpsellingInBusinessInfo={showUpsellingInBusinessInfo} isStickyFooter={isStickyFooter}>
              {showUpsellingInBusinessInfo && !isGiftCart && !isCartPending && (
                <Button outline color='primary' onClick={() => handleStoreRedirect(business?.slug)}>
                  {t('ADD_MORE_PRODUCTS', 'Add more products')}
                </Button>
              )}
              {!showUpsellingInBusinessInfo && (
                <h4>{parsePrice(total)}</h4>
              )}
              <Button
                onClick={() => handleClickCheckout(uuid)}
                color='primary'
                disabled={checkoutButtonDisabled}
              >
                {!cart?.valid_address
                  ? (
                      t('OUT_OF_COVERAGE', 'Out of Coverage')
                    )
                  : !cart?.valid_maximum
                      ? (
                          <>
                            {t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: <span>{parsePrice(cart?.maximum)}</span>
                          </>
                        )
                      : belowMinimum
                        ? (
                            <>
                              {t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} <span>{parsePrice(cart?.minimum)}</span>
                            </>
                          )
                        : hasNoReservation
                          ? t('MISSING_RESERVATION', 'Missing reservation')
                          : showUpsellingInBusinessInfo
                            ? (
                                <>
                                  {t('CHECKOUT', 'Checkout')} {total >= 1 && <span>{parsePrice(total)}</span>}
                                </>
                              )
                            : t('CHECKOUT', 'Checkout')}
              </Button>
            </PriceContainer>
          )}
        </AccordionSection>
          )
    }
    </>
  )
}
