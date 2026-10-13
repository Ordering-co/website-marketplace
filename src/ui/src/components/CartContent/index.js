import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTheme } from 'styled-components'
import settings from '~/config'
import { useFreeDeliveryProgress } from '~components/hooks/useFreeDeliveryProgress'
import { CartGroupDivider, CartGroupHeader, CartGroupTitle, CartGroupTotal, Container, MultiCartPriceContainer, NotCarts, PendingBadge, Title, WrapperContainer } from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useEvent } from '~components/contexts/EventContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useApi } from '~components/contexts/ApiContext'
import { useSession } from '~components/contexts/SessionContext'
import { Cart } from '~ui/src/components/Cart'
import { Button } from '~ui/src/styles/Buttons'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'

const CartGroup = React.memo(({ group, index, renderCart, handleClickCheckout }) => {
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const validCarts = group.filter(cart => cart?.valid)
  const hasPending = validCarts.some(cart => cart?.status === 2)

  // Invalid carts cannot checkout — hide them entirely (/670).
  if (!validCarts.length) return null

  return (
    <React.Fragment>
      <CartGroupHeader>
        <CartGroupTitle>
          {t('CART', 'Cart')} #{index + 1}
          {hasPending && (
            <PendingBadge>{t('PENDING', 'Pending')}</PendingBadge>
          )}
        </CartGroupTitle>
        <Button onClick={() => handleClickCheckout(validCarts, validCarts.length === 1 ? validCarts[0]?.uuid : null)} color='primary'>{t('CHECKOUT', 'Checkout')}</Button>
      </CartGroupHeader>
      {validCarts.map(cart => renderCart(cart))}
      <CartGroupTotal>
        <h4>{t('TOTAL_FOR', 'Total for')} {t('CART', 'Cart')} #{index + 1}</h4>
        <h4>{parsePrice(validCarts.reduce((total, cart) => total + cart?.total, 0))}</h4>
      </CartGroupTotal>
    </React.Fragment>
  )
})

const CartItem = React.memo(({
  cart,
  isOpenCart,
  isCartPopover,
  isForceOpenCart,
  currentCartUuid,
  onClose,
  setPreorderBusiness,
  configs,
  isCustomerMode,
  productLoading,
  setProductLoading,
  checkoutMultiBusinessEnabled,
  loyaltyPlansState
}) => {
  const [orderState] = useOrder()
  const theme = useTheme()
  const websiteTheme = theme?.my_products?.components?.website_theme?.components
  const franchiseId = (websiteTheme?.type === 'franchise' && (websiteTheme?.franchise_slug || websiteTheme?.business_slug)) || settings?.franchiseSlug
  const isCheckout = window.location.pathname === `/checkout/${cart?.uuid}` && !isCartPopover
  const isCheckoutRoute = /^\/(?:checkout|multi-checkout)(?:\/|$)/.test(window.location.pathname)
  const freeDeliveryProgress = useFreeDeliveryProgress({
    business: { ...cart?.business, id: cart?.business?.id ?? cart?.business_id },
    cart,
    franchiseId,
    enabled: isOpenCart !== false && !isCheckoutRoute && Boolean(cart?.products?.length)
  })

  if (!(cart?.products?.length > 0 || (cart?.reservation && orderState?.options?.type === 9))) {
    return null
  }

  const creditPointPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'credit_point')
  const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find(b => b.business_id === cart?.business_id && b.accumulates)
  const loyaltyRewardRate = creditPointPlanOnBusiness?.accumulation_rate ?? (!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
  const cashPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'cashback' || loyal.type === 'cash')
  const cashPlanOnBusiness = cashPlan?.businesses?.find(b => b.business_id === cart?.business_id && b.accumulates)
  const cashRewardRate = cashPlanOnBusiness?.accumulation_rate ?? (!!cashPlanOnBusiness && cashPlan?.accumulation_rate) ?? 0

  return (
    <Cart
      forceHideCheckoutButton
      cart={cart}
      freeDeliveryProgress={freeDeliveryProgress}
      isCartPending={cart?.status === 2}
      isOpenCart={isOpenCart}
      isCartPopover={isCartPopover}
      loyaltyRewardRate={loyaltyRewardRate}
      cashRewardRate={cashRewardRate}
      isCheckout={isCheckout}
      isForceOpenCart={isForceOpenCart}
      currentCartUuid={currentCartUuid}
      isProducts={cart?.products?.length}
      onClickCheckout={onClose}
      setPreorderBusiness={setPreorderBusiness}
      businessConfigs={cart?.business?.configs}
      hideCouponInput={configs?.multi_business_checkout_coupon_input_style?.value === 'group'}
      hideDeliveryFee={checkoutMultiBusinessEnabled && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1'}
      hideDriverTip={checkoutMultiBusinessEnabled && configs?.multi_business_checkout_show_combined_driver_tip?.value === '1'}
      isCustomerMode={isCustomerMode}
      productLoading={productLoading}
      setProductLoading={setProductLoading}
      showUpsellingInBusinessInfo
      showDiscountInCart={isCartPopover}
    />
  )
})

export const CartContent = (props) => {
  const {
    carts,
    isOrderStateCarts,
    isCartPopover,
    isForceOpenCart,
    setPreorderBusiness,
    isOpenCart,
    isSlideBar,
    isCustomerMode,
    activeCartUuid,
    onActiveCartChange
  } = props

  const [, t] = useLanguage()
  const [events] = useEvent()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()
  const [ordering] = useApi()
  const [{ token }] = useSession()

  const [currentCartUuid, setCurrentCartUuid] = useState(null)
  const effectiveCartUuid = activeCartUuid ?? currentCartUuid
  const [productLoading, setProductLoading] = useState(false)
  const [loyaltyPlansState, setLoyaltyPlansState] = useState({ loading: true, result: [] })
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'
  const hasCartReservation = carts?.some(cart => cart?.reservation)
  const checkoutMultiBusinessEnabled = orderState?.options?.type !== 9 && !hasCartReservation && configs?.checkout_multi_business_enabled?.value === '1'
  const validCartsList = useMemo(() => carts?.filter((cart) => cart?.valid) || [], [carts])
  const hasDisplayableCarts = validCartsList.length > 0
  const totalCartsPrice = hasDisplayableCarts && validCartsList
    .reduce((total, cart) => { return total + cart?.total }, 0)
  const totalCartsFee = hasDisplayableCarts && validCartsList
    .filter((cart) => cart?.status !== 1)
    .reduce((total, cart) => { return total + (cart?.delivery_price_with_discount) }, 0)
  const totalDriverTip = validCartsList.reduce((sum, cart) => sum + (cart?.driver_tip || 0), 0)

  const hideTitle = true

  const cartsAvailable = useMemo(() => Object.values(orderState?.carts || {})?.filter?.(cart => cart?.valid), [orderState?.carts])

  const cartGroups = useMemo(() => {
    if (!carts?.length) return {}
    return carts.sort((a, b) => b?.status - a?.status).reduce((groups, cart) => {
      const groupId = cart?.status === 2 ? [`pending:${cart?.group?.uuid || cart?.uuid}`] : ['active']
      groups[groupId] = [...(groups[groupId] || []), cart]
      return groups
    }, {})
  }, [carts])

  const renderCart = useCallback((cart) => (
    <CartItem
      key={cart.uuid}
      cart={cart}
      isOpenCart={isOpenCart}
      isCartPopover={isCartPopover}
      isForceOpenCart={isForceOpenCart}
      currentCartUuid={effectiveCartUuid}
      onClose={props.onClose}
      setPreorderBusiness={setPreorderBusiness}
      configs={configs}
      isCustomerMode={isCustomerMode}
      productLoading={productLoading}
      setProductLoading={setProductLoading}
      checkoutMultiBusinessEnabled={checkoutMultiBusinessEnabled}
      loyaltyPlansState={loyaltyPlansState}
    />
  ), [effectiveCartUuid, isOpenCart, isCartPopover, isForceOpenCart, configs, isCustomerMode, productLoading, checkoutMultiBusinessEnabled, loyaltyPlansState])

  const handleActiveCartChange = (uuid) => {
    setCurrentCartUuid(uuid)
    onActiveCartChange?.(uuid)
  }

  const handleAddProduct = (product, cart) => {
    handleActiveCartChange(cart?.uuid)
  }

  const handleUpdateProduct = (product, cart) => {
    handleActiveCartChange(cart?.uuid)
  }

  const handleSetCurrentCartUuid = () => {
    handleActiveCartChange(null)
    props.onClose && props.onClose()
  }

  const handleClickCheckout = async (group, singleUuid) => {
    const isSingleCart = cartsAvailable.length === 1
    const hasNotGroup = group.some(cart => !cart?.group?.uuid)
    const cartGroupUuid = group[0]?.group?.uuid
    if (isSingleCart || singleUuid) {
      events.emit('go_to_page', { page: 'checkout', params: { cartUuid: singleUuid } })
    } else if (hasNotGroup) {
      events.emit('go_to_page', { page: 'multi_cart' })
    } else {
      events.emit('go_to_page', { page: 'multi_checkout', params: { cartUuid: cartGroupUuid } })
    }
    events.emit('cart_popover_closed')
    props.onClose && props.onClose()
  }

  useEffect(() => {
    events.on('cart_popover_closed', handleSetCurrentCartUuid)
    events.on('cart_product_added', handleAddProduct)
    events.on('cart_product_updated', handleUpdateProduct)
    return () => {
      events.off('cart_popover_closed', handleSetCurrentCartUuid)
      events.off('cart_product_added', handleAddProduct)
      events.off('cart_product_updated', handleUpdateProduct)
    }
  }, [])

  useEffect(() => {
    if (isDisabledRewards || !carts?.length) return
    let mounted = true
    const getLoyaltyPlans = async () => {
      try {
        const loyaltyParams = 'params=type,accumulation_rate,businesses'
        const req = await fetch(`${ordering.root}/loyalty_plans?${loyaltyParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-X': ordering.appId,
            'X-INTERNAL-PRODUCT-X': ordering.appInternalName
          }
        })
        const { error, result } = await req.json()
        if (mounted) setLoyaltyPlansState({ loading: false, result: error ? [] : result })
      } catch (err) {
        if (mounted) setLoyaltyPlansState({ loading: false, result: [] })
      }
    }
    getLoyaltyPlans()
    return () => {
      mounted = false
    }
  }, [token, isDisabledRewards, carts?.length])

  return (
    <>
      <Container>
        <WrapperContainer>
          {!isSlideBar && !hideTitle && (
            <Title>{t('YOUR_CART', 'Your cart')}</Title>
          )}
        </WrapperContainer>
        {isOrderStateCarts && hasDisplayableCarts && (
          <>
            {Object.keys(cartGroups)?.length > 0 && checkoutMultiBusinessEnabled
              ? (
                  Object.entries(cartGroups)
                    .filter(([, groupCarts]) => groupCarts.some(cart => cart?.valid))
                    .map(([group, _], i) => (
                  <React.Fragment key={group}>
                    <CartGroup
                      group={cartGroups[group]}
                      index={i}
                      renderCart={renderCart}
                      handleClickCheckout={handleClickCheckout}
                    />
                    <CartGroupDivider />
                  </React.Fragment>
                    ))
                )
              : (
                  validCartsList.map(renderCart)
                )}
            {checkoutMultiBusinessEnabled && hasDisplayableCarts && (
              <MultiCartPriceContainer>
                {!!totalCartsFee &&
                  configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1' &&
                  (
                    <span>
                      <p>{t('TOTAL_DELIVERY_FEE', 'Total delivery fee')}</p>
                      <p>{parsePrice(totalCartsFee)}</p>
                    </span>
                  )}
                {totalDriverTip > 0 &&
                  configs?.multi_business_checkout_show_combined_driver_tip?.value === '1' &&
                  (
                    <span>
                      <p>{t('DRIVER_TIP', 'Driver tip')}</p>
                      <p>{parsePrice(totalDriverTip)}</p>
                    </span>
                  )}
                <div>
                  <h4>{t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}</h4>
                  <h4>{parsePrice(totalCartsPrice)}</h4>
                </div>
                <span>
                  <p>{t('CART_GROUP_MESSAGE_ALERT', 'Discounts may be applied at the time of payment for this group.')}</p>
                </span>
              </MultiCartPriceContainer>
            )}
          </>
        )}
        {!hasDisplayableCarts && (
          <NotCarts isSlideBar={isSlideBar}>
            <NotFoundSource
              variant='empty'
              content={t('NO_PRODUCTS_TO_CART', 'You have no products added to the cart')}
            />
          </NotCarts>
        )}
      </Container>
    </>
  )
}
