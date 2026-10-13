import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import { useForm } from 'react-hook-form'
import parsePhoneNumber from 'libphonenumber-js'
import { formatPhoneNumber } from 'react-phone-number-input'

import {
  FormInput,
  ActionsForm,
  SkeletonForm,
  InputGroup,
  InputPhoneNumberWrapper,
  LanguageSelectorWrapper,
  SwitchWrapper,
  NotificationsGroupSwitchWrapper
} from './styles'

import { useSession } from '~components/contexts/SessionContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useCustomer } from '~components/contexts/CustomerContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { Input } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'
import { InputPhoneNumber } from '~ui/src/components/InputPhoneNumber'
import { LanguageSelectorList } from '~ui/src/components/LanguageSelectorList'
import { Alert } from '~ui/src/components/Confirm'
import { sortInputFields } from '~ui/utils'
import { Modal } from '~ui/src/components/Modal'
import { DatePickerUI } from '~ui/src/components/DatePicker'
import { Switch } from '~ui/src/styles/Switch'
import { useEnabledLanguages } from '../../hooks/useEnabledLanguages'

export const UserFormDetailsUI = (props) => {
  const {
    isEdit,
    formState,
    onCancel,
    showField,
    cleanFormState,
    toggleIsEdit,
    onCloseProfile,
    isRequiredField,
    validationFields,
    handleChangeInput,
    handleButtonUpdateClick,
    isCheckout,
    userData,
    isCustomerMode,
    setWillVerifyOtpState,
    isOldLayout,
    requiredFields,
    handleChangeNotifications,
    handlePlaceOrderAsGuest,
    isOrderTypeValidationField,
    checkoutFields,
    isCheckoutPlace,
    view
  } = props

  const formMethods = useForm()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [{ user: userSession }, { login }] = useSession()
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(null)
  const [userPhoneNumber, setUserPhoneNumber] = useState(null)
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [, { setUserCustomer }] = useCustomer()
  const pendingCustomerSync = useRef(false)
  const [isChanged, setIsChanged] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const user = userData || userSession
  const [birthdate, setBirthdate] = useState(user?.birthdate ? moment(user?.birthdate, 'YYYY-MM-DD').toDate() : null)
  const [openCalendar, setOpenCalendar] = useState(false)

  const hideTopPlaceHolders = true
  const [notificationList, setNotificationList] = useState({
    email: formState?.result?.result
      ? !!formState?.result?.result?.settings?.email?.newsletter
      : !!(formState?.changes?.settings?.email?.newsletter ?? (user && user?.settings?.email?.newsletter)),
    sms: formState?.result?.result
      ? !!formState?.result?.result?.settings?.sms?.newsletter
      : !!(formState?.changes?.settings?.sms?.newsletter ?? (user && user?.settings?.sms?.newsletter)),
    notification: formState?.result?.result
      ? !!formState?.result?.result?.settings?.notification?.newsletter
      : !!(formState?.changes?.settings?.notification?.newsletter ?? (user && user?.settings?.notification?.newsletter))
  })

  const { hasMultiple: hasMultipleLanguages } = useEnabledLanguages()
  const showCustomerPassword = !theme?.profile?.components?.password?.hidden
  // Only expose the language selector when there is more than one language to
  // switch between. The count is primed by the always-mounted header language
  // selector, so it's known immediately — no load-then-hide flash.
  const showLangauges = view === 'language' && hasMultipleLanguages
  const showNotifications = view === 'notifications'
  const showAccount = view === 'account' || (!showLangauges && !showNotifications)

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
    cleanFormState && cleanFormState({ result: { error: false } })
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
    handlePlaceOrderAsGuest && handlePlaceOrderAsGuest()
  }

  const showInputPhoneNumber = isOrderTypeValidationField ? checkoutFields?.find(field => field?.validation_field?.code === 'mobile_phone')?.enabled : (validationFields?.fields?.checkout?.cellphone?.enabled ?? false)
  const showInputBirthday = isOrderTypeValidationField ? checkoutFields?.find(field => field?.validation_field?.code === 'birthdate')?.enabled : (validationFields?.fields?.checkout?.birthdate?.enabled ?? false)

  const setUserCellPhone = (isEdit = false) => {
    if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
      setUserPhoneNumber(userPhoneNumber)
      return
    }
    const cellphone = user?.guest_id ? (user?.guest_cellphone ?? user?.cellphone) : user?.cellphone
    if (cellphone) {
      let phone = null
      if (formState.result.error && formState.changes?.cellphone && formState.changes?.country_phone_code) {
        phone = `+${formState.changes?.country_phone_code} ${formState.changes?.cellphone}`
        setUserPhoneNumber(phone)
        return
      }
      if (user?.country_phone_code) {
        phone = `+${user?.country_phone_code} ${cellphone}`
      } else {
        phone = cellphone
      }
      setUserPhoneNumber(phone)
      return
    }
    setUserPhoneNumber(cellphone || '')
  }

  const onSubmit = () => {
    const isPhoneNumberValid = userPhoneNumber && showInputPhoneNumber ? isValidPhoneNumber : true
    const isPhoneRequiredByOrderType = checkoutFields?.find(field => field?.validation_field?.code === 'mobile_phone')?.required
    const requiredPhone = (user?.guest_id && requiredFields?.includes?.('cellphone')) ||
    (!isOrderTypeValidationField && validationFields?.fields?.checkout?.cellphone?.enabled && validationFields?.fields?.checkout?.cellphone?.required && !user?.guest_id) ||
    (isOrderTypeValidationField && isPhoneRequiredByOrderType)

    const content = []
    if (requiredFields?.includes?.('birthdate') && !birthdate) {
      content.push(t('VALIDATION_ERROR_BIRTHDATE_REQUIRED', 'Birthdate is required'))
    }
    if (!userPhoneNumber &&
      (requiredPhone || (configs?.verification_phone_required?.value === '1'))
    ) {
      content.push(t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.'))
      setAlertState({
        open: true,
        content
      })
      return
    }
    if (!isPhoneNumberValid && userPhoneNumber) {
      if (user?.country_phone_code) {
        content.push(t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid'))
        setAlertState({
          open: true,
          content
        })
        return
      }
      content.push(t('INVALID_ERROR_COUNTRY_CODE_PHONE_NUMBER', 'The country code of the phone number is invalid'))
      setAlertState({
        open: true,
        content
      })
      return
    }
    if (Object.keys(formState.changes).length === 0) {
      if (content.length > 0) {
        setAlertState({
          open: true,
          content
        })
        return
      }
      if (requiredFields) {
        toggleIsEdit && toggleIsEdit()
        cleanFormState && cleanFormState({ changes: {} })
      }
      return
    }
    if (Object.keys(formState.changes).length > 0 && isPhoneNumberValid) {
      let changes = null
      if (user?.cellphone && !userPhoneNumber) {
        changes = {
          country_phone_code: '',
          cellphone: ''
        }
      }
      if (content?.length > 0) {
        setAlertState({
          open: true,
          content
        })
        return
      }
      // defer the CustomerContext sync until the update resolves. The
      // old code passed the pre-submit formState.result (undefined on the first
      // save), clearing the selected customer before the request even ran.
      if (isCustomerMode) {
        pendingCustomerSync.current = true
      }
      handleButtonUpdateClick(changes)
    }
  }

  const handleChangePhoneNumber = (number, isValid) => {
    setUserPhoneNumber(number)
    setIsChanged(true)

    let phoneNumberParser = null
    let phoneNumber = {
      country_phone_code: {
        name: 'country_phone_code',
        value: ''
      },
      cellphone: {
        name: 'cellphone',
        value: ''
      }
    }
    if (isValid) {
      phoneNumberParser = parsePhoneNumber(number)
      if (!parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10)) {
        if (phoneNumberParser?.nationalNumber) phoneNumberParser.nationalNumber = formatPhoneNumber(number)?.replace?.(/\s/g, '')
      }
    }
    if (phoneNumberParser) {
      phoneNumber = {
        country_phone_code: {
          name: 'country_phone_code',
          value: phoneNumberParser?.countryCallingCode
        },
        cellphone: {
          name: 'cellphone',
          value: phoneNumberParser?.nationalNumber
        }
      }
    }
    handleChangeInput(phoneNumber, true)
  }

  const handleChangeInputEmail = (e) => {
    handleChangeInput({ target: { name: 'email', value: e.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '') } })
    formMethods.setValue('email', e.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''))
  }

  const _handleChangeDate = (date) => {
    setBirthdate(date)
    const _birthdate = moment(date).format('YYYY-MM-DD')
    handleChangeInput({ target: { name: 'birthdate', value: _birthdate } })
    setOpenCalendar(false)
  }

  useEffect(() => {
    if (Object.keys(formMethods.errors).length > 0) {
      const content = Object.values(formMethods.errors).map(error => error.message)
      if (!isValidPhoneNumber && userPhoneNumber) {
        content.push(t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid.'))
      }
      setAlertState({
        open: true,
        content
      })
    }
  }, [formMethods.errors])

  useEffect(() => {
    if ((!formState?.loading && formState?.result?.error)) {
      setAlertState({
        open: true,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
  }, [formState?.loading])

  // once an isCustomerMode update finishes, refresh the selected
  // customer from the resolved response instead of the stale pre-submit state.
  useEffect(() => {
    if (formState?.loading || !pendingCustomerSync.current) return
    if (formState?.result?.result && !formState?.result?.error) {
      setUserCustomer(formState.result.result, true)
    }
    pendingCustomerSync.current = false
  }, [formState?.loading])

  useEffect(() => {
    if (!isEdit && onCloseProfile) {
      onCloseProfile()
    }
    if ((user || !isEdit) && !formState?.loading) {
      setUserCellPhone()
      if (!isEdit) {
        cleanFormState && cleanFormState({ changes: {} })
      }
    }
    if (!isEdit) onCancel && onCancel()
  }, [user, isEdit])

  useEffect(() => {
    if (!validationFields.loading && birthdate) {
      formMethods.setValue('birthdate', formState?.result?.result
        ? formState?.result?.result?.birthdate
        : formState?.changes?.birthdate ?? (user && user?.birthdate) ?? '')
    }
  }, [validationFields, birthdate])

  useEffect(() => {
    if (isChanged && userPhoneNumber && isValidPhoneNumber && formState?.changes?.country_phone_code && formState?.changes?.cellphone && configs?.verification_phone_required?.value === '1') {
      setWillVerifyOtpState && setWillVerifyOtpState(true)
    }
  }, [isValidPhoneNumber, userPhoneNumber, configs?.verification_phone_required?.value, isChanged])

  useEffect(() => {
    if (requiredFields && !requiredFields?.includes?.('cellphone')) setIsValidPhoneNumber(true)
  }, [requiredFields])

  const handleEditNotifications = (key, value) => {
    setNotificationList({
      ...notificationList,
      [key]: value
    })
  }

  useEffect(() => {
    isEdit && !isCheckout && handleChangeNotifications(notificationList, (changes) => handleButtonUpdateClick(changes))
  }, [notificationList, isCheckout])

  return (
    <>
      {showAccount && (
        <FormInput onSubmit={formMethods.handleSubmit(onSubmit)} isCheckout={isCheckout}>
          {!validationFields?.loading
            ? (
            <>
              {sortInputFields({ values: isOrderTypeValidationField ? checkoutFields : validationFields?.fields?.checkout }).map(item => {
                const field = item?.validation_field || item
                return (
                  <React.Fragment key={field.id}>
                    {field.code === 'email'
                      ? (
                          ((isOrderTypeValidationField ? item?.enabled : (showField && showField(field.code))) && ((requiredFields && requiredFields?.includes?.(field.code)) || !requiredFields || !isCheckoutPlace)) && (
                        <InputGroup>
                          {!hideTopPlaceHolders && <p>{t(field.code.toUpperCase(), field?.name)}</p>}
                          <Input
                            key={field.id}
                            type={field.type}
                            name={field.code}
                            className='form'
                            borderBottom
                            disabled={!isEdit}
                            placeholder={isCustomerMode ? t(field.code.toUpperCase() + '_OPTIONAL', field.name + ' (Optional)') : t(field.code.toUpperCase(), field?.name)}
                            defaultValue={formState?.changes[field.code] ?? (user && user?.guest_id ? user?.guest_email : user?.[field.code]) ?? ''}
                            onChange={handleChangeInputEmail}
                            ref={
                              formMethods.register({
                                required: !isCustomerMode ? t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')) : null,
                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                              })
                            }
                            autoComplete='off'
                          />
                        </InputGroup>
                          )
                        )
                      : (
                          ((isOrderTypeValidationField ? item?.enabled : (showField && showField(field.code))) && ((requiredFields && requiredFields?.includes?.(field.code)) || !requiredFields || !isCheckoutPlace)) && (
                        <InputGroup>
                          {!hideTopPlaceHolders && <p>{t(field.code.toUpperCase(), field?.name)}</p>}
                          <Input
                            key={field.id}
                            type={field.type}
                            borderBottom
                            name={field.code}
                            className='form'
                            disabled={!isEdit}
                            placeholder={t(field.code.toUpperCase(), field?.name)}
                            defaultValue={formState?.changes[field.code] ?? (user && user[field.code]) ?? ''}
                            onChange={handleChangeInput}
                            ref={formMethods.register({
                              required: isRequiredField(field.code)
                                ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field?.name} is required`).replace('_attribute_', t(field?.name, field.code))
                                : null
                            })}
                            autoComplete='off'
                          />
                        </InputGroup>
                          )
                        )}
                  </React.Fragment>
                )
              })}
              {!isCheckout && showCustomerPassword && !requiredFields && !isCustomerMode && (
                <InputGroup>
                  {!hideTopPlaceHolders && <p>{t('PASSWORD', 'Password')}</p>}
                  <Input
                    type='password'
                    name='password'
                    className='form'
                    disabled={!isEdit}
                    borderBottom
                    placeholder={t('FRONT_VISUALS_PASSWORD', 'Password')}
                    onChange={handleChangeInput}
                    ref={formMethods.register({
                      required: isRequiredField('password')
                        ? t('VALIDATION_ERROR_PASSWORD_REQUIRED', 'The field Password is required').replace('_attribute_', t('PASSWORD', 'Password'))
                        : null,
                      minLength: {
                        value: 8,
                        message: t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8)
                      }
                    })}
                  />
                </InputGroup>
              )}
              {((!user?.guest_id && !!showInputPhoneNumber) || (isOrderTypeValidationField || user?.guest_id)) &&
                showInputPhoneNumber &&
                ((requiredFields && requiredFields?.includes?.('cellphone')) || !requiredFields || !isCheckoutPlace) &&
                (
                  <InputPhoneNumberWrapper>
                    {!hideTopPlaceHolders && <p>{t('PHONE', 'Phone')}</p>}
                    <InputPhoneNumber
                      user={user}
                      value={userPhoneNumber}
                      setValue={handleChangePhoneNumber}
                      handleIsValid={setIsValidPhoneNumber}
                      disabled={!isEdit}
                    />
                  </InputPhoneNumberWrapper>
                )}
              {((!user?.guest_id && showInputBirthday) || (isOrderTypeValidationField || user?.guest_id)) &&
                showInputBirthday &&
                ((requiredFields && requiredFields?.includes?.('birthdate')) || !requiredFields || !isCheckoutPlace) &&
                (
                  <InputPhoneNumberWrapper>
                    {!hideTopPlaceHolders && <p>{t('BIRTHDATE', 'Birthdate')}</p>}
                    <Input
                      name='birthdate'
                      borderBottom
                      className='form'
                      defaultValue={birthdate ? moment(birthdate).format('YYYY/MM/DD') : ''}
                      autoComplete='off'
                      placeholder={t('BIRTHDATE', 'Birthdate')}
                      onFocus={() => setOpenCalendar(true)}
                      ref={formMethods.register({
                        required: isRequiredField('birthdate')
                          ? t('VALIDATION_ERROR_BIRTHDATE_REQUIRED', 'Birthdate is required')
                          : null
                      })}
                    />
                    {openCalendar && (
                      <DatePickerUI value={birthdate} onChange={_handleChangeDate} name={'birthdate'} />
                    )}
                  </InputPhoneNumberWrapper>
                )}
              <ActionsForm>
                {onCancel && isOldLayout && (
                  <Button
                    outline
                    type='button'
                    onClick={() => onCancel(false)}
                    disabled={formState.loading}
                  >
                    {t('CANCEL', 'Cancel')}
                  </Button>
                )}
                {!requiredFields && ((formState && Object.keys(formState?.changes).length > 0 && isEdit) || formState?.loading) && (
                  <Button
                    className='edit-btn'
                    id='form-btn'
                    color='green'
                    type='submit'
                    disabled={formState.loading}
                  >
                    {formState.loading ? t('UPDATING', 'Updating...') : t('SAVE', 'Save')}
                  </Button>
                )}
                {requiredFields && (
                  <Button
                    id='form-btn'
                    color='primary'
                    type='submit'
                    disabled={formState.loading}
                  >
                    {formState.loading ? t('UPDATING', 'Updating...') : t('CONTINUE', 'Continue')}
                  </Button>
                )}
              </ActionsForm>
            </>
              )
            : <SkeletonForm>
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </SkeletonForm>}
        </FormInput>
      )}
      {showNotifications && !requiredFields && !isCustomerMode && (
        <>
          <NotificationsGroupSwitchWrapper>
            {!hideTopPlaceHolders && <p>{t('MARKETING_NOTIFICATIONS', 'Marketing Notifications')}</p>}
            <SwitchWrapper>
              <p>{t('EMAILS', 'Emails')}</p>
              <Switch
                onChange={value => handleEditNotifications('email', value)}
                defaultChecked={notificationList?.email}
                disabled={formState.loading}
              />
            </SwitchWrapper>
            <SwitchWrapper>
              <p>{t('SMS', 'Sms')}</p>
              <Switch
                onChange={value => handleEditNotifications('sms', value)}
                defaultChecked={notificationList?.sms}
                disabled={formState.loading}
              />
            </SwitchWrapper>
            <SwitchWrapper>
              <p>{t('PUSH_NOTIFICATIONS', 'Push Notifications')}</p>
              <Switch
                onChange={value => handleEditNotifications('notification', value)}
                defaultChecked={notificationList?.notification}
                disabled={formState.loading}
              />
            </SwitchWrapper>
          </NotificationsGroupSwitchWrapper>
        </>
      )}
      {showLangauges && !requiredFields && !isCustomerMode && (
        <>
          <LanguageSelectorWrapper>
            {!hideTopPlaceHolders && <p>{t('LANGUAGES', 'Languages')}</p>}
            <LanguageSelectorList />
          </LanguageSelectorWrapper>
        </>
      )}
      <Alert
        title={t('PROFILE', 'Profile')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          width='760px'
        >
          <SignUpForm
            useLoginByCellphone
            useChekoutFileds
            handleSuccessSignup={handleSuccessSignup}
            isPopup
            isGuest
          />
        </Modal>
      )}
    </>
  )
}
