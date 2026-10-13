import React, { useEffect, useMemo, useState } from 'react'
import { Block, EmptyBtnWrapper, EmptyCart, RadioButtonContainer, RevervationContainer, ToleranceText } from './styles'
import { Button } from '~ui/src/styles/Buttons'
import { Cart } from '~ui/src/components/Cart'
import { UserDetails } from '~ui/src/components/UserDetails'
import { useConfig } from '~components/contexts/ConfigContext'
import { useCustomer } from '~components/contexts/CustomerContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'
import { BusinessReservation as BusinessReservationController } from '~components/components/BusinessReservation'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'
import parsePhoneNumber from 'libphonenumber-js'
import Select from 'react-select'
import { PreorderDateTimeSteps } from '~ui/src/components/PreorderDateTimeSteps'
import {
  ClosedBusinessMsg,
  MonthYearLayer
} from '~ui/src/components/MomentControl/styles'
import { Icon } from '~ui-icon'

export const BusinessReservationUI = (props) => {
  const {
    cart,
    isCustomerMode,
    checkoutFieldsState,
    orderingMethod,
    setOrderingMethod,
    handleAddReservation,
    reservationSetting,
    reservationState,
    setReservationState,
    hoursList,
    reserveDate,
    setReserveDate,
    datesList,
    isEnabled,
    business,
    setOpenReservations,
    isCheckout
  } = props

  const [{ options }] = useOrder()
  const [, t] = useLanguage()
  const [{ user, loading: userLoading }] = useSession()
  const [{ configs }] = useConfig()
  const [{ parsePrice, is12Hours }] = useUtils()
  const [customerState] = useCustomer()
  const [events] = useEvent()
  const [requiredFields, setRequiredFields] = useState([])
  const [personsList, setPersonsList] = useState([])
  const is12hours = is12Hours
  const disablePlaceReservationButton =
    !((reservationState?.changes?.guests_reservation !== cart?.reservation?.guests_reservation) ||
      (reservationState?.changes?.reserve_date !== cart?.reservation?.reserve_date)) ||
      (!!cart?.products?.length && !reservationSetting?.allow_preorder_reservation)

  const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
  const checkoutFields = useMemo(() => checkoutFieldsState?.fields?.filter(field => field.order_type_id === options?.type), [checkoutFieldsState, options])
  const selectStyles = {
    control: (base) => ({ ...base, borderRadius: '8px' }),
    menu: (base) => ({ ...base, borderRadius: '8px', overflow: 'hidden' }),
    /* Portaled to body to escape the modal's overflow, so it must clear the
       overlay ladder: .popup-backdrop 20002 < this < SidebarMenu 20500. */
    menuPortal: (base) => ({ ...base, zIndex: 20003 })
  }
  const onPlaceReservation = async () => {
    const result = await handleAddReservation(cart?.products)
    setOpenReservations?.(false)
    if (!result?.uuid) return
    if (orderingMethod === 1) {
      events.emit('go_to_page', { page: 'checkout', params: { cartUuid: result.uuid } })
    }
  }
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
  }

  const formatTimeDisplay = (time) => {
    if (!time) return ''
    if (is12hours) {
      if (time.includes('PM') || time.includes('AM')) {
        const period = time.includes('PM') ? 'PM' : 'AM'
        const timeStr = time.replace(/PM|AM/g, '').trim()
        const [hours, minutes] = timeStr.split(':')
        return { hours, minutes, period }
      }
      const [timeStr, period] = time.split(' ')
      const [hours, minutes] = timeStr.split(':')
      return { hours, minutes, period }
    }
    const [hours, minutes] = time.split(':')
    return { hours, minutes, period: null }
  }

  const handleChangeDate = (date) => {
    setReserveDate({
      ...reserveDate,
      date,
      time: null
    })
  }

  const handleChangeTime = (time) => {
    setReserveDate({
      ...reserveDate,
      time
    })
    setReservationState({
      ...reservationState,
      changes: {
        ...reservationState?.changes,
        reserve_date: `${reserveDate.date} ${time}:00`
      }
    })
  }

  useEffect(() => {
    if (checkoutFieldsState?.loading || customerState.loading || userLoading) return
    if (user?.guest_id) {
      checkGuestValidationFields()
    } else {
      checkValidationFields()
    }
  }, [checkoutFieldsState, user, customerState, options?.type])

  useEffect(() => {
    const _menuList = []
    const minPersons = reservationSetting?.min_guests_reservation
    const maxPersons = reservationSetting?.max_guests_reservation
    for (let i = minPersons; i <= maxPersons; i++) {
      _menuList.push({
        value: i,
        label: `${i} ${t('GUESTS', 'Guests')}`
      })
    }
    setPersonsList(_menuList)
  }, [reservationSetting?.min_time_reserve_minutes, reservationSetting?.max_time_reserve_days])

  return (
    <RevervationContainer isCheckout={isCheckout}>
      {!isCheckout && (
        <Block>
          <UserDetails
            useDefualtSessionManager
            cartStatus={cart?.status}
            businessId={cart?.business_id}
            useSessionUser={!isCustomerMode}
            isCustomerMode={isCustomerMode}
            userData={isCustomerMode && customerState.user}
            userId={isCustomerMode && customerState?.user?.id}
            isOrderTypeValidationField
            requiredFields={requiredFields}
            checkoutFields={checkoutFields}
            isCheckout
            CustomerDetailsTitleComponent={() => <h2>{t('CONTACT', 'Contact')}</h2>}
          />
        </Block>
      )}
      {!isCheckout && (
        <Block>
          <h2>{t('ORDERING_METHOD', 'Ordering Method')}</h2>
          {!cart?.products?.length && (
            <RadioButtonContainer onClick={() => setOrderingMethod(1)}>
              {orderingMethod === 1 ? <Icon name="radioChecked" /> : <Icon name="radioUnchecked" disabled />} <p>{t('TABLE_RESERVATION', 'Table reservation')}</p>
            </RadioButtonContainer>
          )}
          {reservationSetting?.allow_preorder_reservation && (
            <RadioButtonContainer onClick={() => setOrderingMethod(2)}>
              {orderingMethod === 2 ? <Icon name="radioChecked" /> : <Icon name="radioUnchecked" disabled />} <p>{t('TABLE_RESERVATION_AND_PREORDER', 'Table reservation & Preorder')}</p>
            </RadioButtonContainer>
          )}
          {(!!cart?.products?.length && !reservationSetting?.allow_preorder_reservation) && (
            <p className='error'>{t('MISSING_ORDERING_METHODS_ERROR', 'No ordering methods available, please remove the products of the cart to continue')}</p>
          )}
        </Block>
      )}
      <Block>
        <h2>{t('TABLE_SIZE', 'Table Size')}</h2>
        <div>
          <Select
            value={{
              value: reservationState?.changes?.guests_reservation,
              label: reservationState?.changes?.guests_reservation ? `${reservationState?.changes?.guests_reservation} ${t('GUESTS', 'Guests')}` : t('GUESTS', 'Guests')
            }}
            options={personsList}
            placeholder={t('GUESTS', 'Guests')}
            style={{
              marginBottom: 10
            }}
            styles={selectStyles}
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
            className="react-select-container"
            onChange={(option) => setReservationState({
              ...reservationState,
              changes: {
                ...reservationState?.changes,
                guests_reservation: option?.value
              }
            })}
          />
        </div>
      </Block>
      <Block>
        <h2>{t('AVAILABLE_TIME_CHOICE', 'Available Time Choice')}</h2>
        <PreorderDateTimeSteps
          datesList={datesList}
          dateSelected={reserveDate?.date}
          timeSelected={reserveDate?.time}
          timeList={hoursList}
          isEnabled={isEnabled}
          handleChangeDate={handleChangeDate}
          handleChangeTime={handleChangeTime}
          configs={configs}
          maxDays={datesList?.length}
          formatTimeDisplay={formatTimeDisplay}
          is12Hours={is12hours}
          hasExistingMoment={!!reserveDate?.time}
          closedMessage={t('NOT_AVAILABLE_HOURS_DAY', 'Not available hours for this day')}
          ClosedBusinessMsg={ClosedBusinessMsg}
          MonthYearLayer={MonthYearLayer}
        />
      </Block>
      {!isCheckout && orderingMethod === 2 && (
        <Block>
          {cart?.products?.length > 0
            ? (
              <>
                <Cart
                  isStore
                  isCustomMode
                  isForceOpenCart
                  cart={cart}
                  isCartPending={cart?.status === 2}
                  isProducts={cart.products.length}
                  // handleCartOpen={handleCartOpen}
                  businessConfigs={business?.configs}
                  forceHideCheckoutButton
                  forceHideComments
                  forceHideCoupon
                  forceHideUpselling
                  forceHideBusiness
                  forcehideDriverTypes
                />
              </>
              )
            : (
              <EmptyCart>
                <div className='empty-content'>
                  <Icon name="cart3" />
                  <p>{t('ADD_PRODUCTS_IN_YOUR_CART', 'Add products in your cart')}</p>
                </div>
                <EmptyBtnWrapper>
                  <span>{parsePrice(0)}</span>
                </EmptyBtnWrapper>
              </EmptyCart>
              )}
        </Block>
      )}
      {isCheckout && (
        <ToleranceText>{t('YOU_HAVE', 'You have')} {reservationSetting?.late_arrival_hold_minutes} {t('MINUTES_TOLERANCE_RESERVATION_INFO', 'min of tolerance after the time of your reservation to avoid being canceled')}</ToleranceText>
      )}
      {(!isCheckout || !disablePlaceReservationButton) && (
        <Button
          disabled={!reservationState?.changes?.guests_reservation || !reserveDate?.time || reservationState?.loading || disablePlaceReservationButton}
          onClick={onPlaceReservation}
          color='primary'
        >
          {isCheckout ? t('UPDATE_RESERVATION', 'Update reservation') : t('PLACE_TABLE_RESERVATION_NOW', 'Place Table Reservation Now')}
        </Button>
      )}
    </RevervationContainer>
  )
}

export const BusinessReservation = (props) => {
  const BusinessReservationProps = {
    ...props,
    UIComponent: BusinessReservationUI
  }

  return <BusinessReservationController {...BusinessReservationProps} />
}
