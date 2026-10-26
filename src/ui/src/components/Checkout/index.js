import React, { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import parsePhoneNumber from 'libphonenumber-js'
import { CheckoutStudentDetails } from '../CheckoutStudentDetails'
import { doesSchoolCartNeedStudent, isSchoolCart as isSchoolCartCheck } from '../CheckoutStudentDetails/schoolCartStudent'
import { getUtils } from '../PaymentOptionWallet/utils'
import { RewardsBanner } from '../RewardsBanner'

import {
  Container,
  WrapperLeftContainer,
  UserDetailsContainer,
  BusinessDetailsContainer,
  PaymentMethodContainer,
  DriverTipContainer,
  CartContainer,
  WrapperPlaceOrderButton,
  WarningMessage,
  CartsList,
  WarningText,
  WrapperUserDetails,
  WrapperRightContainer,
  WrapperLeftContent,
  CheckOutDivider,
  DeliveryOptionsContainer,
  WalletPaymentOptionContainer,
  SelectSpotContainer,
  WrapperActionsInput,
  MobileWrapperPlaceOrderButton,
  MobilePlaceOrderHint,
  OrderContextUIWrapper,
  HeaderContent,
  AuthButtonList,
  Flag,
  SectionTitleContainer,
  SummaryAccordion,
  SummaryAccordionHeader,
  SummaryAccordionContent,
  CardItemContent,
  NoPaymentNeededMsg
} from './styles'

import { Checkout as CheckoutController } from '~components/components/Checkout'
import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'
import { useApi } from '~components/contexts/ApiContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { isWalletEnabled as isWalletConfigEnabled } from '~components/utils/configHelpers'
import { useConfig } from '~components/contexts/ConfigContext'
import { useCustomer } from '~components/contexts/CustomerContext'
import { useEvent } from '~components/contexts/EventContext'
import { useGuestCheckoutPermission } from '~ui/hooks/useGuestCheckoutPermission'

import { OrderDetail } from './OrderDetail'
import { PendingCartNotice } from './PendingCartNotice'

import { Modal } from '~ui/src/components/Modal'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { Button } from '~ui/src/styles/Buttons'
import { Input } from '~ui/src/styles/Inputs'
import { Alert, Confirm } from '~ui/src/components/Confirm'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { LoginForm } from '~ui/src/components/LoginForm'
import { UpsellingPage } from '~ui/src/components/UpsellingPage'
import { AddressDetails } from '~ui/src/components/AddressDetails'
import { UserDetails } from '~ui/src/components/UserDetails'
import { PaymentOptions } from '~ui/src/components/PaymentOptions'
import { PaymentOptionWallet } from '~ui/src/components/PaymentOptionWallet'
import { DriverTips } from '~ui/src/components/DriverTips'
import { Cart } from '~ui/src/components/Cart'
import { CartContent } from '~ui/src/components/CartContent'
import { PlaceSpot } from '~ui/src/components/PlaceSpot'
import { OrderContextUI } from '~ui/src/components/OrderContextUI'
import { BusinessReservation } from '~ui/src/components/BusinessReservation'
import { generalUtilities, capitalize } from '~ui/utils'

import { Icon } from '~ui-icon'

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
}

const deliveryTypes = [1, 7]
const pickupTypes = [2, 8]
const driverTipsTypes = [...deliveryTypes, ...pickupTypes]

const methodsWithRequiredCards = ['globalpay', 'braintree', 'cybersource']
const methodsWithIframeCards = ['globalpay', 'braintree', 'cybersource']

const CheckoutUI = (props) => {
  const {
    cart,
    errors,
    placing,
    cartState,
    useKioskApp,
    loyaltyPlansState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    handleOrderRedirect,
    isCustomerMode,
    isResetPaymethod,
    setIsResetPaymethod,
    handleChangeDeliveryOption,
    instructionsOptions,
    deliveryOptionSelected,
    handleStoreRedirect,
    onPlaceOrderClick,
    setPlaceSpotNumber,
    placeSpotNumber,
    checkoutFieldsState,
    returnUrl,
    globalPayIFrameUrl,
    braintreeIFrameUrl,
    cybersourceIFrameUrl,
    createBusinessUserPaymethod,
    deleteBusinessUserPaymethod,
    isPendingCartReleasable,
    releasingPendingCart,
    handleReleasePendingCart
  } = props

  const theme = useTheme()
  const [{ options, loading }, { confirmCart }] = useOrder()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [{ user, loading: userLoading }, { login }] = useSession()
  const [{ configs }] = useConfig()
  const { guestCheckoutAllowed, guestOrderBlocked, canUseGuestCheckout, canPlaceOrder } = useGuestCheckoutPermission({
    configs,
    orderType: options?.type,
    user
  })
  const [assignedStudentId, setAssignedStudentId] = useState(null)
  const isSchoolCart = businessDetails?.business?.vertical === 'school' || isSchoolCartCheck(cart)
  const schoolNeedsStudent = doesSchoolCartNeedStudent({
    isSchool: isSchoolCart,
    studentId: cart?.student_id ?? cart?.student?.id ?? assignedStudentId
  })
  const [customerState] = useCustomer()
  const [events] = useEvent()
  const { getIconCard } = generalUtilities()
  const { getIcon } = getUtils()

  const windowSize = useWindowSize()

  const [errorCash, setErrorCash] = useState(false)
  const [userErrors, setUserErrors] = useState([])
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(null)
  const [behalfName, setBehalfName] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [requiredFields, setRequiredFields] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
  const [allowedGuest, setAllowedGuest] = useState(false)
  const [cardList, setCardList] = useState([])
  const [paymethodClicked, setPaymethodClicked] = useState(null)
  const [productLoading, setProductLoading] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(true)
  const [isPaymentOpen, setIsPaymentOpen] = useState(!cart?.paymethod_id)
  const [confirm, setConfirm] = useState({ open: false, content: null, handleOnAccept: null })
  const [isPaymentAttemptCancelled, setIsPaymentAttemptCancelled] = useState(false)

  useEffect(() => {
    if (!guestCheckoutAllowed) setAllowedGuest(false)
  }, [guestCheckoutAllowed])

  const cartPaymethod = businessDetails?.business?.paymethods?.find(({ paymethod }) => paymethod?.id === cart?.paymethod_id)?.paymethod
  const paymentSelectedName = cartPaymethod?.gateway
  const cardsMethods = ['stripe', 'stripe_connect_v2', 'credomatic']
  const stripeCardsMethods = ['stripe', 'stripe_connect_v2']
  const stripePaymethods = ['stripe', 'stripe_connect', 'stripe_connect_v2', 'stripe_redirect']
  const paymethodsWithoutAutoClose = ['hitpay', 'cash', 'braintree', 'cybersource']
  const businessConfigs = businessDetails?.business?.configs ?? []
  const isTableNumberEnabled = configs?.table_numer_enabled?.value
  const isWalletCashEnabled = businessConfigs.find(config => config.key === 'wallet_cash_enabled')?.value === '1'
  const isWalletCreditPointsEnabled = businessConfigs.find(config => config.key === 'wallet_credit_point_enabled')?.value === '1'
  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs) &&
    (isWalletCashEnabled || isWalletCreditPointsEnabled) && !useKioskApp && !isCustomerMode
  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
  const hexTest = /[0-9A-Fa-f]{6}/g
  const primaryColor = theme?.colors?.primary?.split?.('#')?.[1]
  const placeSpotTypes = [3, 4, 5]
  const placeSpotsEnabled = placeSpotTypes.includes(options?.type) && !useKioskApp
  const isGiftCardCart = !cart?.business_id
  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter(field => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const guestCheckoutDriveTip = useMemo(() => checkoutFields?.find(field => driverTipsTypes.includes(field.order_type_id) && field?.validation_field?.code === 'driver_tip'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutComment = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'comments'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutCoupon = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'coupon'), [JSON.stringify(checkoutFields), options])
  const guestCheckoutZipcode = useMemo(() => checkoutFields?.find(field => field.order_type_id === options?.type && field?.validation_field?.code === 'zipcode'), [JSON.stringify(checkoutFields), options])

  // const [hasBusinessPlaces, setHasBusinessPlaces] = useState(null)
  const allowDriverTipPickup = configs?.driver_tip_allowed_at_pickup?.value === '1' && pickupTypes.includes(options?.type)
  const validateCommentsCartField = (guestCheckoutComment?.enabled && (user?.guest_id ? guestCheckoutComment?.required_with_guest : guestCheckoutComment?.required)) && (cart?.comment === null || cart?.comment?.trim().length === 0)
  const validateDriverTipField = (deliveryTypes.includes(options.type) || allowDriverTipPickup) && (guestCheckoutDriveTip?.enabled && (user?.guest_id ? guestCheckoutDriveTip?.required_with_guest : guestCheckoutDriveTip?.required)) && (Number(cart?.driver_tip) <= 0)
  const validateCouponField = (guestCheckoutCoupon?.enabled && (user?.guest_id ? guestCheckoutCoupon?.required_with_guest : guestCheckoutCoupon?.required)) && !cart?.offers?.some(offer => offer?.type === 2)
  const validateZipcodeCard = (guestCheckoutZipcode?.enabled && (user?.guest_id ? guestCheckoutZipcode?.required_with_guest : guestCheckoutZipcode?.required)) && stripeCardsMethods.includes(paymethodSelected?.gateway) && paymethodSelected?.data?.card && !paymethodSelected?.data?.card?.zipcode
  const businessConfig = businessDetails?.business?.configs?.find(config => config?.key === 'reservation_setting')
  const reservationSetting = businessConfig ? JSON.parse(businessConfig?.value || '{}') : JSON.parse(configs?.reservation_setting?.value || '{}')

  const isFreeOrder = Number(cart?.balance) === 0

  const validateCardRequired = cardsMethods.includes(paymethodSelected?.gateway) && cardList?.cards?.length === 0
  const validateRequiredCardSelection = methodsWithRequiredCards.includes(paymethodSelected?.gateway) && (
    paymethodSelected?.gateway === 'cybersource'
      ? !(paymethodSelected?.data?.card_token || paymethodSelected?.data?.transient_token || cart?.paymethod_data?.card_token || cart?.paymethod_data?.transient_token)
      : !(paymethodSelected?.data?.card_token && cardList?.cards?.some(card => card?.id === paymethodSelected?.data?.id && card?.card_token === paymethodSelected?.data?.card_token))
  )

  const isDisablePlaceOrderButton = schoolNeedsStudent || guestOrderBlocked || !cart?.valid ||
    (!paymethodSelected && cart?.balance > 0) ||
    validateCardRequired ||
    placing ||
    errorCash ||
    loading ||
    (isTableNumberEnabled === '1' && !isGiftCardCart && (options?.type === 3 && !(cartState?.cart?.spot_number || cart?.spot_number || placeSpotNumber))) ||
    !cart?.valid_maximum ||
    (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100)) ||
    // (((placeSpotTypes.includes(options?.type) && !cart?.place) && hasBusinessPlaces)) ||
    validateCommentsCartField ||
    validateDriverTipField ||
    validateCouponField ||
    validateZipcodeCard ||
    (!cart?.reservation && options?.type === 9) ||
    (!!cart?.products?.length && !reservationSetting?.allow_preorder_reservation && options?.type === 9) ||
    validateRequiredCardSelection

  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []

  const deliveryOptions = instructionsOptions?.result && Array.isArray(instructionsOptions?.result) && instructionsOptions?.result?.filter(option => option?.enabled)?.map(option => {
    return {
      value: option?.id, content: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name), showOnSelected: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name)
    }
  })

  const hideBusinessAddress = theme?.checkout?.components?.business?.components?.address?.hidden
  const hideBusinessDetails = theme?.checkout?.components?.business?.hidden
  const hideBusinessMap = theme?.checkout?.components?.map?.hidden
  const hideCustomerDetails = theme?.checkout?.components?.customer?.hidden
  const driverTipsField = !cartState.loading && cart && cart?.business_id && (deliveryTypes.includes(options.type) || allowDriverTipPickup) && cart?.status !== 2 && (guestCheckoutDriveTip?.enabled) && driverTipsOptions.length > 0 && !useKioskApp

  const creditPointPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'credit_point')
  const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find(b => b.business_id === cart?.business_id && b.accumulates)

  const loyaltyRewardRate = creditPointPlanOnBusiness?.accumulation_rate ?? (!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
  const cashPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'cashback' || loyal.type === 'cash')
  const cashPlanOnBusiness = cashPlan?.businesses?.find(b => b.business_id === cart?.business_id && b.accumulates)
  const cashRewardRate = cashPlanOnBusiness?.accumulation_rate ?? (!!cashPlanOnBusiness && cashPlan?.accumulation_rate) ?? 0
  const getCheckoutIncludedTaxes = () => {
    if (cart?.taxes === null) {
      return cart?.business?.tax_type === 1 ? cart?.tax : 0
    }
    return cart?.taxes?.reduce((taxIncluded, tax) => {
      return taxIncluded + ((tax.type === 1 && tax.target === 'product') ? tax.summary?.tax : 0)
    }, 0) ?? 0
  }
  const clearLoyaltyAmount = (value) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs?.format_number_decimal_length?.value ?? 2))
  const loyaltyRewardValue = clearLoyaltyAmount((cart?.subtotal + getCheckoutIncludedTaxes()) * loyaltyRewardRate)
  const cashRewardValue = clearLoyaltyAmount((cart?.subtotal + getCheckoutIncludedTaxes()) * cashRewardRate)
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'
  const loyaltyRewardMessage = t('RECEIVE_LOYALTY_POINT', 'You could receive :amount: points for this purchase.')
  const [loyaltyRewardMessageStart, loyaltyRewardMessageEnd] = loyaltyRewardMessage.split(':amount:')
  const showLoyaltyReward = !isDisabledRewards && !!loyaltyRewardValue && isFinite(loyaltyRewardValue) && !cartState.loading && cart && cart?.status !== 2
  const cashRewardMessage = t('RECEIVE_CASHBACK', 'You could receive :amount: cashback for this purchase.')
  const [cashRewardMessageStart, cashRewardMessageEnd] = cashRewardMessage.split(':amount:')
  const showCashReward = !isDisabledRewards && !!cashRewardValue && isFinite(cashRewardValue) && !cartState.loading && cart && cart?.status !== 2
  const showCheckoutRewards = showLoyaltyReward || showCashReward

  const handlePlaceOrder = () => {
    if (!canPlaceOrder()) return
    if (placing) return
    if (schoolNeedsStudent) return
    if (!user && !canUseGuestCheckout()) {
      setOpenModal({ ...openModal, signup: true, isGuest: false })
      return
    }
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
      setOpenModal({ ...openModal, signup: true, isGuest: true })
      return
    }

    if ((!userErrors.length && !requiredFields?.length) || (requiredFields?.length === 1 && isCustomerMode && requiredFields?.includes('email'))) {
      const body = {}
      if (behalfName) {
        body.on_behalf_of = behalfName
      }
      handlerClickPlaceOrder && handlerClickPlaceOrder(null, body)
      return
    }
    if (requiredFields?.length) {
      setIsOpen(true)
      return
    }
    setAlertState({
      open: true,
      content: Object.values(userErrors).map(error => error)
    })
    setIsUserDetailsEdit(true)
  }

  const handleOpenGuestSignup = () => {
    setOpenModal({ ...openModal, signup: true, isGuest: canUseGuestCheckout() })
  }

  const handlePlaceOrderAsGuest = () => {
    if (!canPlaceOrder(true)) return
    if (schoolNeedsStudent) return
    setIsOpen(false)
    const body = {}
    if (behalfName) {
      body.on_behalf_of = behalfName
    }
    handlerClickPlaceOrder && handlerClickPlaceOrder(null, body)
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
    setIsUserDetailsEdit(false)
  }

  const handleDeleteSelectedCard = (e) => {
    e?.stopPropagation?.()
    const cardId = paymethodSelected?.data?.id ?? cart?.paymethod_data?.id
    if (!cardId) return
    setConfirm({
      open: true,
      content: t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?'),
      handleOnAccept: () => {
        deleteBusinessUserPaymethod(cardId, () => {
          handlePaymethodChange(null)
          setCardList({ cards: [], loading: false, error: null })
          setIsPaymentOpen(true)
        })
        setConfirm({ open: false, content: null, handleOnAccept: null })
      }
    })
  }

  const isBraintreeCardSelected = (paymethodSelected?.gateway === 'braintree' || paymentSelectedName === 'braintree') && cart?.paymethod_data?.card

  const checkGuestValidationFields = () => {
    const userSelected = isCustomerMode ? customerState.user : user
    const _requiredFields = checkoutFieldsState?.fields
      .filter((field) => (field?.order_type_id === options?.type) && field?.enabled && field?.required_with_guest &&
        !notFields.includes(field?.validation_field?.code) &&
        field?.validation_field?.code !== 'email' &&
        userSelected && !userSelected[field?.validation_field?.code])
    const requiredFieldsCode = _requiredFields.map((item) => item?.validation_field?.code)
    const guestCheckoutCellPhone = checkoutFieldsState?.fields?.find((field) => field.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    const guestCheckoutEmail = checkoutFieldsState?.fields?.find((field) => field.order_type_id === options?.type && field?.validation_field?.code === 'email')
    if (
      userSelected &&
      !(userSelected?.guest_cellphone ?? userSelected?.cellphone) &&
      ((guestCheckoutCellPhone?.enabled &&
        guestCheckoutCellPhone?.required_with_guest) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      requiredFieldsCode.push('cellphone')
    }
    if (
      userSelected &&
      !(userSelected?.guest_email ?? userSelected?.email) &&
      guestCheckoutEmail?.enabled &&
      guestCheckoutEmail?.required_with_guest
    ) {
      requiredFieldsCode.push('email')
    }
    setRequiredFields(requiredFieldsCode)
  }
  const checkValidationFields = () => {
    setUserErrors([])
    const errors = []
    const userSelected = isCustomerMode ? customerState.user : user
    const _requiredFields = []
    Object.values(checkoutFieldsState?.fields).map(field => {
      if (options?.type === field?.order_type_id &&
        field?.enabled &&
        field?.required &&
        !notFields.includes(field?.validation_field?.code)
      ) {
        if (userSelected && !userSelected[field?.validation_field?.code]) {
          _requiredFields.push(field?.validation_field?.code)
        }
      }
    })
    const mobilePhoneField = Object.values(checkoutFieldsState?.fields)?.find(field => field?.order_type_id === options?.type && field?.validation_field?.code === 'mobile_phone')
    if (
      userSelected &&
      !userSelected?.cellphone &&
      ((mobilePhoneField?.enabled &&
        mobilePhoneField?.required) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      _requiredFields.push('cellphone')
    }
    setRequiredFields(_requiredFields)
    if (userSelected && userSelected?.cellphone) {
      if (userSelected?.country_phone_code) {
        let phone = null
        phone = `+${userSelected?.country_phone_code}${userSelected?.cellphone.replace(`+${userSelected?.country_phone_code}`, '')}`
        const phoneNumber = parsePhoneNumber(phone)
        if (parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10) && !phoneNumber?.isValid()) {
          errors.push(t('VALIDATION_ERROR_MOBILE_PHONE_INVALID', 'The field Phone number is invalid.'))
        }
      } else {
        errors.push(t('INVALID_ERROR_COUNTRY_CODE_PHONE_NUMBER', 'The country code of the phone number is invalid'))
      }
    }

    setUserErrors(errors)
  }

  const handleSuccessSignup = async (user) => {
    await login({
      user,
      token: user?.session?.access_token
    })
    if (openModal?.isGuest && requiredFields?.length === 0) {
      handlePlaceOrderAsGuest()
    }
    setOpenModal({ ...openModal, signup: false, isGuest: false })
  }

  const handleSuccessLogin = (user) => {
    if (user) setOpenModal({ ...openModal, login: false })
  }

  const handleScrollTo = () => {
    if (!((!paymethodSelected && cart?.balance > 0) && cart?.status !== 2)) return
    const scrollElement = document.querySelector('.paymentsContainer')
    window.scrollTo(0, scrollElement.offsetTop - 20)
  }

  const handleCloseIframe = async () => {
    setOpenModal((prev) => ({ ...prev, loading: true, iframe: false }))
    if (!methodsWithIframeCards.includes(paymethodSelected?.gateway)) {
      await confirmCart(cart?.uuid, {})
    }
    setOpenModal((prev) => ({ ...prev, loading: false }))
  }

  useEffect(() => {
    if (cart?.status === 2) setIsPaymentAttemptCancelled(false)
  }, [cart?.status])

  useEffect(() => {
    if (openModal.iframe === false) {
      document.body.style.overflow = ''
    }
  }, [openModal.iframe])

  useEffect(() => {
    if (checkoutFieldsState?.loading || customerState.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, customerState, options?.type])

  useEffect(() => {
    if (errors) {
      setAlertState({
        open: true,
        content: errors
      })
    }
  }, [errors])

  useEffect(() => {
    if (isResetPaymethod) {
      handlePaymethodChange(null)
      setIsResetPaymethod(true)
      // changePaymethod(cart?.business_id, null, null)
    }
  }, [isResetPaymethod])

  useEffect(() => {
    if (cart?.products?.length || cart?.reservation || options?.type === 9 || userLoading) return
    if (cart?.business_id !== null) {
      if (cart?.business?.slug) {
        handleStoreRedirect(cart?.business?.slug)
      } else {
        events.emit('go_to_page', { page: 'search' })
      }
    } else {
      events.emit('go_to_page', { page: 'wallets', search: '?wallet=gift_card' })
    }
  }, [JSON.stringify(cart?.products)])

  useEffect(() => {
    const isCardSelected = paymethodSelected?.data?.card_token || paymethodSelected?.data?.transient_token
    const braintreeWithoutCard = paymentSelectedName === 'braintree' && !cart?.paymethod_data?.card
    if (braintreeWithoutCard) {
      setIsPaymentOpen(true)
      return
    }
    if (cart?.paymethod_id && (!paymethodsWithoutAutoClose.includes(paymethodSelected?.gateway) || isCardSelected)) {
      setIsPaymentOpen(false)
    } else if (!cart?.paymethod_id || (paymethodSelected?.gateway === 'cybersource' && !isCardSelected)) {
      setIsPaymentOpen(true)
    }
  }, [cart?.paymethod_id, cart?.paymethod_data?.card, paymentSelectedName, paymethodSelected?.gateway, paymethodSelected?.data?.card_token, paymethodSelected?.data?.transient_token])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Container>
      <WrapperLeftContainer>
        <WrapperLeftContent>
          <HeaderContent>
            {windowSize?.width < 576 && (
              <OrderContextUIWrapper>
                <OrderContextUI isCheckOut />
              </OrderContextUIWrapper>
            )}
          </HeaderContent>
          <PendingCartNotice
            isCartPending={!cartState.loading && cart?.status === 2}
            placing={placing}
            paymethodName={cartPaymethod?.gateway && t(cartPaymethod.gateway.toUpperCase(), cartPaymethod?.name)}
            isPendingCartReleasable={isPendingCartReleasable}
            releasingPendingCart={releasingPendingCart}
            handleReleasePendingCart={handleReleasePendingCart}
            handleOrderRedirect={handleOrderRedirect}
            onReleased={() => setIsPaymentAttemptCancelled(true)}
          />
          <h2 className='checkout-title'>{t('CHECKOUT', 'Checkout')}</h2>
          {cart?.business_id && !hideBusinessDetails && (
            <>
              <BusinessDetailsContainer>
                {(businessDetails?.loading || cartState.loading) && !businessDetails?.error && (
                  <div>
                    <div>
                      <Skeleton height={35} style={{ marginBottom: '10px' }} />
                      <Skeleton height={35} style={{ marginBottom: '10px' }} />
                    </div>
                  </div>
                )}
                {!cartState.loading && businessDetails?.business && Object.values(businessDetails?.business)?.length > 0 && (
                  <>
                    {businessDetails?.business?.logo && (
                      <div className='business-details-header'>
                        <div>
                          <div>
                            <img src={businessDetails?.business?.logo} alt={businessDetails?.business?.name} />
                          </div>
                          <h1>{businessDetails?.business?.name}</h1>
                        </div>
                      </div>
                    )}
                    <div className='business-details-container'>
                      {!hideBusinessAddress && (
                        <p>{businessDetails?.business?.address}</p>
                      )}
                      {/* business name already shown as the header title above; don't repeat it here */}
                      <p>{businessDetails?.business?.cellphone}</p>
                      {businessDetails?.business?.address_notes && <p>{businessDetails?.business?.address_notes}</p>}
                    </div>
                  </>
                )}
                {businessDetails?.error && businessDetails?.error?.length > 0 && (
                  <div>
                    <h1>{t('BUSINESS_DETAILS', 'Business Details')}</h1>
                    <NotFoundSource
                      content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
                    />
                  </div>
                )}
              </BusinessDetailsContainer>
              <CheckOutDivider />
            </>
          )}
          {!useKioskApp
            ? (
              <>
                {!hideCustomerDetails && (
                  <UserDetailsContainer guestForm={user?.guest_id}>
                    <WrapperUserDetails>
                      {cartState.loading || (isCustomerMode && !customerState?.user?.id)
                        ? (<div>
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                        </div>)
                        : ((user?.guest_id && (!allowedGuest || !guestCheckoutAllowed))
                            ? (
                            <AuthButtonList>
                              <h2>{t('CUSTOMER_DETAILS', 'Customer Details')}</h2>
                              <Button color='primary' onClick={() => setOpenModal({ ...openModal, signup: true })}>
                                {t('SIGN_UP', 'Sign up')}
                              </Button>
                              <Button color='primary' outline onClick={() => setOpenModal({ ...openModal, login: true })}>
                                {t('LOGIN', 'Login')}
                              </Button>
                              {guestCheckoutAllowed && (
                                <Button color='black' outline onClick={() => canUseGuestCheckout() && setAllowedGuest(true)}>
                                  {t('CONTINUE_AS_GUEST', 'Continue as guest')}
                                </Button>
                              )}
                            </AuthButtonList>
                              )
                            : (
                              <>
                                <UserDetails
                                  isUserDetailsEdit={isUserDetailsEdit}
                                  cartStatus={cart?.status}
                                  businessId={cart?.business_id}
                                  useDefualtSessionManager
                                  useSessionUser={!isCustomerMode}
                                  isCustomerMode={isCustomerMode}
                                  userData={isCustomerMode && customerState.user}
                                  userId={isCustomerMode && customerState?.user?.id}
                                  isOrderTypeValidationField
                                  requiredFields={requiredFields}
                                  checkoutFields={checkoutFields}
                                  isSuccess={isSuccess}
                                  isCheckout
                                />
                                {isSchoolCart && (
                                  <CheckoutStudentDetails cart={cart} onStudentAssigned={setAssignedStudentId} />
                                )}
                              </>
                              )
                          )}
                    </WrapperUserDetails>
                  </UserDetailsContainer>
                )}
                {cart?.business_id && !hideBusinessMap && (
                  <>
                    {(businessDetails?.loading || cartState.loading)
                      ? (
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                          <Skeleton height={35} style={{ marginBottom: '10px' }} />
                          <Skeleton height={150} />
                        </div>
                        )
                      : (
                        <AddressDetails
                          location={cart?.business?.location}
                          businessLogo={businessDetails?.business?.logo || theme.images?.dummies?.businessLogo}
                          isCartPending={cart?.status === 2}
                          businessId={cart?.business_id}
                          apiKey={configs?.google_maps_api_key?.value}
                          mapConfigs={mapConfigs}
                          isCustomerMode={isCustomerMode}
                          cart={cart}
                          primaryColor={hexTest.test(primaryColor || '') ? `0x${primaryColor}` : 'red'}
                        />
                        )}
                  </>
                )}
                {!useKioskApp && cart?.business_id && (
                  <>
                    {!cartState.loading && deliveryOptionSelected !== undefined && deliveryTypes.includes(options?.type) && !isSchoolCart && !(cart?.student_id ?? cart?.student?.id) && (
                      <DeliveryOptionsContainer>
                        <h2>{t('SPECIAL_INSTRUCTIONS', 'Special Instructions')}</h2>
                        <div className="delivery-options-list">
                          {deliveryOptions?.map((option) => (
                            <Button
                              key={option.value}
                              className={deliveryOptionSelected === option.value ? '' : 'inactive'}
                              color={deliveryOptionSelected === option.value ? 'green' : 'primary'}
                              outline
                              onClick={() => handleChangeDeliveryOption(option.value)}
                              disabled={cart?.status === 2}
                            >
                              {option.content}
                            </Button>
                          ))}
                        </div>
                      </DeliveryOptionsContainer>
                    )}
                    <CheckOutDivider />
                  </>
                )}
              </>
              )
            : (
              <WrapperActionsInput>
                <h1>
                  {t('WHATS_YOUR_NAME', "What's your name?")}
                </h1>
                <Input
                  placeholder={t('WRITE_YOUR_NAME', 'Write your name')}
                  autoComplete='off'
                  onChange={(e) => setBehalfName(e?.target?.value)}
                />
              </WrapperActionsInput>
              )}

          {cartState.loading && (
            <div>
              <div>
                <Skeleton height={35} style={{ marginBottom: '10px' }} />
                <Skeleton height={55} style={{ marginBottom: '10px' }} />
              </div>
            </div>
          )}
          {!cartState.loading && cart && (reservationSetting?.allow_preorder_reservation || !cart?.reservation) && (
            <>
              <SummaryAccordion>
                <SummaryAccordionHeader
                  active={isSummaryOpen}
                  onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                >
                  <div className='header'>
                    <span>{t('SUMMARY', 'Summary')}</span>
                    <Icon name="chevronDown" />
                  </div>
                </SummaryAccordionHeader>
                <SummaryAccordionContent active={isSummaryOpen}>
                  <CartContainer hideOrderBill>
                    <Cart
                      isCartPending={cart?.status === 2}
                      cart={cart}
                      useKioskApp={useKioskApp}
                      isCheckout
                      isProducts={cart?.products?.length || 0}
                      viewString='checkout'
                      businessConfigs={businessConfigs}
                      hideCommentsByValidationCheckout={!guestCheckoutComment?.enabled}
                      hideCouponByValidationCheckout={!guestCheckoutCoupon?.enabled}
                      productLoading={productLoading}
                      setProductLoading={setProductLoading}
                      forceHideCheckoutButton
                      hideOrderBill
                    />
                  </CartContainer>
                </SummaryAccordionContent>
              </SummaryAccordion>
            </>
          )}
        </WrapperLeftContent>
      </WrapperLeftContainer>
      <WrapperRightContainer>
        {!cartState.loading && cart && isFreeOrder && (
          <NoPaymentNeededMsg className='paymentsContainer'>
            <SectionTitleContainer>
              <h1>{t('PAYMENT_METHOD', 'Payment Method')}</h1>
            </SectionTitleContainer>
            <p>{t('NO_PAYMENT_METHOD_NEEDED', 'No payment needed for this order.')}</p>
          </NoPaymentNeededMsg>
        )}
        {!cartState.loading && cart && !isFreeOrder && (
          <SummaryAccordion className='paymentsContainer'>
            <SummaryAccordionHeader
              active={isPaymentOpen}
              onClick={() => setIsPaymentOpen(!isPaymentOpen)}
              isPayment
            >
              <div className='header'>
                <SectionTitleContainer>
                  <h1>{t('PAYMENT_METHOD', 'Payment Method')}</h1>
                </SectionTitleContainer>
                <div className='align-content'>
                  {(cart?.paymethod_id || paymethodSelected?.id)
                    ? (
                      <Button color='lightGray'>{t('CHANGE', 'Change')}</Button>
                      )
                    : (
                      <>
                        <Flag>{t('REQUIRED', 'Required')}</Flag>
                        <Icon name="chevronDown" />
                      </>
                      )}
                </div>
              </div>
              <div className='content'>
                <h3>
                  {(cart?.paymethod_id || paymethodSelected?.id)
                    ? cart?.paymethod_id && cart?.paymethod_data?.card
                      ? ''
                      : t(paymentSelectedName?.toUpperCase() ?? 'PAYMENT', capitalize(paymentSelectedName?.replace(/_/g, ' ')?.toLowerCase() || 'Payment'))
                    : t('SELECT_PAYMENT', 'Select payment')}
                </h3>
                {cart?.paymethod_id && cart?.paymethod_data?.card && (
                  <CardItemContent>
                    <span className='brand'>
                      <img src={getIconCard(cart?.paymethod_data?.card?.brand)} alt={cart?.paymethod_data?.card?.brand} />
                    </span>
                    <div className='payment-container'>
                      <div className='payment-wrapper'>
                        <span>
                          {t(`${cart?.paymethod_data?.card?.brand?.toUpperCase() || 'PAYMENT_CARD'}`, capitalize(cart?.paymethod_data?.card?.brand || '') || 'Payment card')}
                        </span>
                      </div>
                      <span className='card-number'>
                        <p>••••</p>{cart?.paymethod_data?.card?.last4}
                      </span>
                    </div>
                    {isBraintreeCardSelected && (
                      <span
                        className='card-delete-action'
                        onClick={handleDeleteSelectedCard}
                        role='button'
                        tabIndex={0}
                        aria-label={t('DELETE_CARD', 'Delete card')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleDeleteSelectedCard(e)
                          }
                        }}
                      >
                        <Icon name="trash" color={theme.colors.lightGray} size={20} />
                      </span>
                    )}
                  </CardItemContent>
                )}
                {!cartState.loading && cart?.status === 4 && (
                  <WarningMessage style={{ marginTop: 20 }}>
                    <Icon name="warning" />
                    <h1>
                      {isPaymentAttemptCancelled
                        ? t('PAYMENT_ATTEMPT_CANCELLED', 'The payment attempt was cancelled. Choose a payment method to try again.')
                        : t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')}
                    </h1>
                  </WarningMessage>
                )}
              </div>
            </SummaryAccordionHeader>
            <SummaryAccordionContent active={isPaymentOpen}>
              <PaymentMethodContainer>
                <PaymentOptions
                  cart={cart}
                  useKioskApp={useKioskApp}
                  isDisabled={cart?.status === 2}
                  businessId={!isGiftCardCart ? businessDetails?.business?.id : -1}
                  isLoading={!isGiftCardCart ? businessDetails.loading : false}
                  paymethods={businessDetails?.business?.paymethods}
                  onPaymentChange={handlePaymethodChange}
                  errorCash={errorCash}
                  setErrorCash={setErrorCash}
                  handleOrderRedirect={handleOrderRedirect}
                  isCustomerMode={isCustomerMode}
                  paySelected={paymethodSelected}
                  handlePlaceOrder={handlePlaceOrder}
                  onPlaceOrderClick={(...args) => canPlaceOrder() && onPlaceOrderClick?.(...args)}
                  setCardList={setCardList}
                  requiredFields={requiredFields}
                  openUserModal={setIsOpen}
                  paymethodClicked={paymethodClicked}
                  setPaymethodClicked={setPaymethodClicked}
                  handleOpenGuestSignup={handleOpenGuestSignup}
                  validateDriverTipField={validateDriverTipField}
                  returnUrl={returnUrl}
                  createBusinessUserPaymethod={createBusinessUserPaymethod}
                  setOpenModal={setOpenModal}
                />
              </PaymentMethodContainer>
            </SummaryAccordionContent>
          </SummaryAccordion>
        )}
        <CheckOutDivider />
        {isWalletEnabled && !businessDetails?.loading && (
          <WalletPaymentOptionContainer>
            <h1>{t('WALLET', 'Wallet')}</h1>
            <PaymentOptionWallet
              cart={cart}
              loyaltyPlansState={loyaltyPlansState}
              businessConfigs={businessDetails?.business?.configs}
            />
          </WalletPaymentOptionContainer>
        )}
        {
          !!driverTipsField &&
          <>
            <DriverTipContainer>
              <h1>{t('DRIVER_TIPS', 'Driver Tips')}</h1>
              <p>{t('100%_OF_THE_TIP_YOUR_DRIVER', '100% of the tip goes to your driver')}</p>
              <DriverTips
                businessId={cart?.business_id}
                driverTipsOptions={driverTipsOptions}
                isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                  ? cart?.driver_tip
                  : cart?.driver_tip_rate}
                cart={cart}
                useOrderContext
              />
            </DriverTipContainer>
          </>
        }
        {!cartState.loading && placeSpotsEnabled && cart?.business_id && (
          <SelectSpotContainer>
            <PlaceSpot
              isCheckout
              isInputMode
              isHomeStyle
              cart={cart}
              spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
              vehicleDefault={cart?.vehicle}
              setPlaceSpotNumber={setPlaceSpotNumber}
            />
          </SelectSpotContainer>
        )}
        {!cartState.loading && cart?.reservation && cart?.business_id && options?.type === 9 && (
          <div>
            <BusinessReservation
              isCheckout
              cart={cart}
              business={{
                ...cart?.business,
                id: cart?.business_id
              }}
              isCustomerMode={isCustomerMode}
              scheduleList={cart?.business?.schedule}
            />
          </div>
        )}
        {!cartState.loading && cart && (reservationSetting?.allow_preorder_reservation || !cart?.reservation || Number(cart?.total) > 0) && (
          <CartContainer hideProductList isGiftCardCart={isGiftCardCart}>
            <Cart
              isCartPending={cart?.status === 2}
              cart={cart}
              useKioskApp={useKioskApp}
              isCheckout
              isProducts={cart?.products?.length || 0}
              viewString='checkout'
              businessConfigs={businessConfigs}
              hideCommentsByValidationCheckout={!guestCheckoutComment?.enabled}
              hideCouponByValidationCheckout={!guestCheckoutCoupon?.enabled}
              productLoading={productLoading}
              setProductLoading={setProductLoading}
              forceHideCheckoutButton
              hideProductList
            />
          </CartContainer>
        )}

        {showCheckoutRewards && (
          <RewardsBanner
            showLoyaltyReward={showLoyaltyReward}
            showCashReward={showCashReward}
            loyaltyRewardMessageStart={loyaltyRewardMessageStart}
            loyaltyRewardValue={loyaltyRewardValue}
            loyaltyRewardMessageEnd={loyaltyRewardMessageEnd}
            cashRewardMessageStart={cashRewardMessageStart}
            cashRewardValue={cashRewardValue}
            cashRewardMessageEnd={cashRewardMessageEnd}
            getIcon={getIcon}
            t={t}
          />
        )}

        {windowSize.width >= 576 && !cartState.loading && cart && cart?.status !== 2 && (
          <WrapperPlaceOrderButton>
            {/* Order total now lives inside the order bill above; keep only a centered, full-width Confirm CTA here */}
            <div>
              <Button
                color={(!cart?.valid_maximum || (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))) ? 'secundary' : 'primary'}
                disabled={isDisablePlaceOrderButton}
                onClick={() => handlePlaceOrder()}
              >
                {!cart?.valid_maximum
                  ? (
                    `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
                    )
                  : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
                      ? (
                      `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                        )
                      : placing
                        ? t('PLACING_ORDER', 'Placing order')
                        : (cart?.paymethod_id && cart?.paymethod_data?.card)
                            ? t('PAY_WITH', 'Pay with') + ' ' + t(`${cart?.paymethod_data?.card?.brand?.toUpperCase() || 'PAYMENT_CARD'}`, capitalize(cart?.paymethod_data?.card?.brand || '') || 'Payment card') + ' ' + cart?.paymethod_data?.card?.last4
                            : t('PLACE_ORDER', 'Place Order')}
              </Button>
            </div>
          </WrapperPlaceOrderButton>
        )}

        {!cart?.valid_address && cart?.status !== 2 && (
          <WarningText>
            {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
          </WarningText>
        )}

        {windowSize.width >= 576 && (!paymethodSelected && cart?.balance > 0) && cart?.status !== 2 && (
          <WarningText>
            {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
          </WarningText>
        )}

        {schoolNeedsStudent && cart?.status !== 2 && (
          <WarningText>
            {t('SCHOOL_SELECT_STUDENT_TO_PLACE', 'Please select a student to place the order.')}
          </WarningText>
        )}

        {!cart?.valid_products && cart?.status !== 2 && (
          <WarningText>
            {t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
          </WarningText>
        )}

        {isTableNumberEnabled === '1' && !isGiftCardCart && (options?.type === 3 && !(cart?.spot_number || placeSpotNumber)) && (
          <WarningText>
            {t('WARNING_PLACE_SPOT', 'Please, select your spot to place order.')}
          </WarningText>
        )}

        {validateDriverTipField && !isGiftCardCart &&
          (
            <WarningText>
              {t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.')}
            </WarningText>
          )}
        {validateCouponField &&
          (
            <WarningText>
              {t('WARNING_INVALID_COUPON_FIELD', 'Coupon is required.')}
            </WarningText>
          )}
        {validateCommentsCartField && (
          <WarningText>
            {t('WARNING_INVALID_CART_COMMENTS', 'Cart comments is required.')}
          </WarningText>
        )}

        {validateZipcodeCard && (
          <WarningText>
            {t('WARNING_CARD_ZIPCODE_REQUIRED', 'Your card selected has not zipcode')}
          </WarningText>
        )}

        {validateCardRequired && cart?.status !== 2 && (
          <WarningText>
            {t('WARNING_CARD_REQUIRED', 'Please, add a card to place your order.')}
          </WarningText>
        )}

        {validateRequiredCardSelection && cart?.status !== 2 && (
          <WarningText>
            {t('WARNING_CARD_SELECTION_REQUIRED', 'Please, select a card to place your order.')}
          </WarningText>
        )}

        {cart?.valid_preorder !== undefined && !cart?.valid_preorder && (
          <WarningText>
            {t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
          </WarningText>
        )}

        {!cart?.reservation && options?.type === 9 && (
          <WarningText>
            {t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
          </WarningText>
        )}
        {guestOrderBlocked && (
          <WarningText role='alert'>
            {t('GUEST_CHECKOUT_DISABLED', 'Guest checkout is not available for this order type.')}
          </WarningText>
        )}
      </WrapperRightContainer>
      {windowSize.width < 576 && !cartState.loading && cart && cart?.status !== 2 && (
        <MobileWrapperPlaceOrderButton>
          {/* Order total now lives inside the order bill above; keep only a centered, full-width Confirm CTA here. Payment hint shown here so mobile users see it next to the button. */}
          {(!paymethodSelected && cart?.balance > 0) && cart?.status !== 2 && (
            <MobilePlaceOrderHint>
              {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
            </MobilePlaceOrderHint>
          )}
          <Button
            color={(!cart?.valid_maximum || (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))) ? 'secundary' : 'primary'}
            disabled={isDisablePlaceOrderButton}
            onClick={() => isDisablePlaceOrderButton
              ? handleScrollTo('.paymentsContainer')
              : handlePlaceOrder()}
          >
            {!cart?.valid_maximum
              ? (
                `${t('MAXIMUM_SUBTOTAL_ORDER', 'Maximum subtotal order')}: ${parsePrice(cart?.maximum)}`
                )
              : (!cart?.valid_minimum && !(cart?.discount_type === 1 && cart?.discount_rate === 100))
                  ? (
                  `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                    )
                  : placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')}
          </Button>
        </MobileWrapperPlaceOrderButton>
      )}
      <Alert
        title={t('CUSTOMER_DETAILS', 'Customer Details')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
      <Confirm
        title={t('CARD', 'Card')}
        content={confirm.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={confirm.open}
        onClose={() => setConfirm({ open: false, content: null, handleOnAccept: null })}
        onCancel={() => setConfirm({ open: false, content: null, handleOnAccept: null })}
        onAccept={confirm.handleOnAccept}
        closeOnBackdrop={false}
      />
      {isOpen && (
        <Modal
          open={isOpen}
          width='760px'
          padding='30px'
          onClose={() => setIsOpen(false)}
        >
          <UserDetails
            isUserDetailsEdit={isUserDetailsEdit}
            cartStatus={cart?.status}
            businessId={cart?.business_id}
            useDefualtSessionManager
            useSessionUser={!isCustomerMode}
            isCustomerMode={isCustomerMode}
            userData={isCustomerMode && customerState.user}
            userId={isCustomerMode && customerState?.user?.id}
            requiredFields={requiredFields}
            setIsSuccess={setIsSuccess}
            isCheckout
            isCheckoutPlace
            isEdit
            isModal
            handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
            isOrderTypeValidationField
            checkoutFields={checkoutFields}
            isAllowGuest={guestCheckoutAllowed && (paymethodSelected?.gateway === 'cash' || paymethodSelected?.gateway === 'card_delivery')}
            onClose={() => {
              if (!canPlaceOrder()) return
              setIsOpen(false)
              if (paymethodClicked) {
                setPaymethodClicked({
                  ...paymethodClicked,
                  confirmed: true
                })
              } else {
                handlePlaceOrder()
              }
            }}
          />
        </Modal>
      )}
      {openModal.signup && (
        <Modal
          open={openModal.signup}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, signup: false, isGuest: false })}
        >
          <SignUpForm
            useLoginByCellphone
            useChekoutFileds
            handleSuccessSignup={handleSuccessSignup}
            isPopup
            isGuest={openModal.isGuest}
          />
        </Modal>
      )}
      {openModal.login && (
        <Modal
          open={openModal.login}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, login: false })}
        >
          <LoginForm
            handleSuccessLogin={handleSuccessLogin}
            isPopup
            isGuest
          />
        </Modal>
      )}
      {openModal.orderDetail && (
        <Modal
          open={openModal.orderDetail}
          width='760px'
          padding='30px'
          onClose={() => setOpenModal({ ...openModal, orderDetail: false })}
        >
          <OrderDetail
            item={cart}
            placingOrder={placing}
            orderType={options?.type}
            customerAddress={options?.address?.address}
            onClick={handlePlaceOrder}
          />
        </Modal>
      )}
      <Modal
        open={openModal.iframe && (cart?.paymethod_data?.result?.action?.iframe_url || paymethodSelected?.gateway === 'globalpay' || paymethodSelected?.gateway === 'braintree' || paymethodSelected?.gateway === 'cybersource')}
        onClose={() => openModal.loading ? null : handleCloseIframe()}
        onRemove={() => openModal.loading ? null : handleCloseIframe()}
        closeIconRight
      >
        <div style={{ height: paymethodSelected?.gateway === 'globalpay' ? '45vh' : '70vh', marginTop: paymethodSelected?.gateway === 'globalpay' ? 60 : 30 }}>
          <iframe
            width='100%'
            height='100%'
            src={paymethodSelected?.gateway === 'globalpay' ? globalPayIFrameUrl : paymethodSelected?.gateway === 'braintree' ? braintreeIFrameUrl : paymethodSelected?.gateway === 'cybersource' ? cybersourceIFrameUrl : cart?.paymethod_data?.result?.action?.iframe_url}
            style={{ border: 'none' }}
          />
        </div>
      </Modal>
    </Container>
  )
}

export const Checkout = (props) => {
  const {
    errors,
    clearErrors,
    // query,
    cartUuid,
    handleOrderRedirect,
    handleCheckoutRedirect,
    handleSearchRedirect,
    handleCheckoutListRedirect,
    businessSlug
  } = props

  const [orderState, { confirmCart }] = useOrder()
  const [{ token }] = useSession()
  const [ordering] = useApi()
  const [, t] = useLanguage()

  const [cartState, setCartState] = useState({ loading: true, error: null, cart: null })

  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [currentCart, setCurrentCart] = useState(null)
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [isResetPaymethod, setIsResetPaymethod] = useState(false)

  const cartsWithProducts = orderState?.carts && (Object.values(orderState?.carts)?.filter(cart => cart?.products && cart?.products?.length) || null)
  const carts = businessSlug
    ? cartsWithProducts.filter((cart) => cart?.business?.slug === businessSlug || businessSlug === cart?.business_id)
    : cartsWithProducts
  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
    clearErrors && clearErrors()
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCurrentCart(null)
    setCanOpenUpselling(false)
    handleCheckoutRedirect(currentCart.uuid)
  }

  useEffect(() => {
    if (!orderState.loading && currentCart?.business_id) {
      setCurrentCart(...Object.values(orderState.carts)?.filter(cart => cart?.business_id === currentCart?.business_id))
    }
  }, [orderState.loading])

  useEffect(() => {
    if (currentCart?.products) {
      setOpenUpselling(true)
    }
  }, [currentCart])

  useEffect(() => {
    if (errors?.length) {
      setAlertState({
        open: true,
        content: errors
      })
    }
  }, [errors])

  const getOrder = async (cartId) => {
    try {
      let result = {}
      const cart = carts.find(cart => cart.uuid === cartId)
      const userCustomer = JSON.parse(window.localStorage.getItem('user-customer'))
      if (cart && !userCustomer) {
        result = { ...cart }
      } else {
        setCartState({ ...cartState, loading: true })
        const url = userCustomer
          ? `${ordering.root}/carts/${cartId}?user_id=${userCustomer?.id}`
          : `${ordering.root}/carts/${cartId}`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-App-X': ordering.appId
          }
        })
        const content = await response.json()
        result = content.result
      }

      if (result.status === 1 && result.order?.uuid) {
        handleOrderRedirect(result.order.uuid)
        setCartState({ ...cartState, loading: false })
      } else if (result.status === 2) {
        let paymentData = null
        if (['credomatic', 'computop', 'epayco'].includes(result?.paymethod_data?.gateway)) {
          const urlParams = new URLSearchParams(window.location.search)
          const paramsObj = Object.fromEntries(urlParams.entries())
          paymentData = {
            [result?.paymethod_data?.gateway]: {
              ...paramsObj
            }
          }
        }
        try {
          const confirmCartRes = await confirmCart(cartUuid, paymentData)
          if (confirmCartRes.error) {
            setAlertState({
              open: true,
              content: typeof confirmCartRes.result === 'string'
                ? [confirmCartRes.result]
                : confirmCartRes.result
            })
            setIsResetPaymethod(true)
          }
          if (confirmCartRes.result.order?.uuid) {
            handleOrderRedirect(confirmCartRes.result.order.uuid)
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error) {
          setAlertState({
            open: true,
            content: [error.message]
          })
        }
      } else {
        let cart = Array.isArray(result) ? null : result
        const spotNumberFromStorage = window.localStorage.getItem('table_number')
        if (spotNumberFromStorage) {
          const spotNumber = JSON.parse(spotNumberFromStorage)?.tableNumber
          const slug = JSON.parse(spotNumberFromStorage)?.slug
          if (cart?.business?.slug === slug) {
            cart = {
              ...cart,
              spot_number: parseInt(spotNumber, 10)
            }
          }
        }
        setCartState({
          ...cartState,
          loading: false,
          cart,
          error: cart ? null : result
        })
      }
    } catch (e) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

  useEffect(() => {
    if (token && cartUuid) {
      getOrder(cartUuid)
    } else {
      setCartState({ ...cartState, loading: false })
    }
  }, [token, cartUuid])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    uuid: cartUuid,
    isResetPaymethod,
    setIsResetPaymethod
  }

  return (
    <>
      {!cartUuid && orderState.carts && carts && carts?.length === 0 && (
        <NotFoundSource
          variant='empty'
          content={t('NO_CARTS_YET', "You don't have any carts yet")}
          subtitle={t('NO_CARTS_YET_DESC', 'Add items from a business to start an order.')}
          btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
          onClickButton={handleSearchRedirect}
        />
      )}
      {!cartUuid && orderState.carts && carts && carts?.length > 0 && (
        <CartsList>
          <CartContent
            carts={carts}
            isOrderStateCarts={!!orderState.carts}
            isForceOpenCart
          />
        </CartsList>
      )}

      {cartUuid && cartState.error && cartState.error?.length > 0 && (
        <NotFoundSource
          content={t('ERROR_CART_SELECTED', 'Sorry, the selected cart was not found.')}
          btnTitle={t('CHECKOUT_REDIRECT', 'Go to Checkout list')}
          onClickButton={handleCheckoutListRedirect}
        />
      )}

      {cartState.loading && !(window.location.pathname === '/checkout') && (
        <Container>
          <WrapperLeftContainer>
            <Skeleton height={30} />
            <Skeleton height={100} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '15px' }} />
            <Skeleton height={25} />
            <Skeleton height={25} />
          </WrapperLeftContainer>
          <WrapperRightContainer>
            <Skeleton height={25} />
            <Skeleton height={50} style={{ marginBottom: '20px' }} />
            <Skeleton height={25} />
            <Skeleton height={60} />
            <Skeleton height={80} style={{ marginBottom: '20px' }} />
            <Skeleton height={25} />
          </WrapperRightContainer>
        </Container>
      )}

      {cartUuid && cartState.cart && cartState.cart?.status !== 1 && <CheckoutController {...checkoutProps} />}

      {currentCart?.products && (
        <UpsellingPage
          businessId={currentCart?.business_id}
          cartProducts={currentCart?.products}
          business={currentCart?.business}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}

      <Alert
        title={t('CHECKOUT ', 'Checkout')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </>
  )
}
