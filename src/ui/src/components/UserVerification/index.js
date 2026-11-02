import React, { useState, useEffect } from 'react'
import OtpInput from 'react-otp-input'
import {
  Container,
  WrapperText,
  FormInput,
  InputWrapper,
  OtpWrapper,
  CountdownTimer,
  InputBeforeIcon,
  ButtonsWrapper,
  WarningText
} from './styles'

import { UserVerification as UserVerificationController } from '~components/components/UserVerification'
import { UserFormDetails as UserFormController } from '~components/components/UserFormDetails'
import { LogoutAction as LogoutActionController } from '~components/components/LogoutAction'
import { useSession } from '~components/contexts/SessionContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { Alert } from '~ui/src/components/Confirm'
import { Modal } from '~ui/src/components/Modal'
import { Input } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'
import { useCountdownTimer } from '~ui/hooks/useCountdownTimer'
import { formatSeconds } from '~ui/utils'
import { InputPhoneNumber } from '~ui/src/components/InputPhoneNumber'
import { UserFormDetailsUI } from '~ui/src/components/UserFormDetails'

import { Icon } from '~ui-icon'

const UserDetails = (props) => {
  const userDetailsProps = {
    ...props,
    isEdit: true,
    useValidationFields: true,
    useDefualtSessionManager: true,
    UIComponent: UserFormDetailsUI
  }

  return <UserFormController {...userDetailsProps} />
}

const VerificationEmailRecovery = ({ formState, handleLogoutClick, disabled, onExiting }) => {
  const [, t] = useLanguage()
  const handleExit = async () => {
    if (disabled || formState.loading) return
    onExiting(true)
    try {
      await handleLogoutClick()
    } finally {
      onExiting(false)
    }
  }
  return (
    <>
      <WarningText>{t('VERIFICATION_EMAIL_RECOVERY', 'If this email is already in use, enter another email or log out, then log in or sign up with this email.')}</WarningText>
      <Button type='button' color='secundary' disabled={disabled || formState.loading} onClick={handleExit}>
        {t('LOGOUT', 'Logout')}
      </Button>
      {formState.result?.error && <WarningText role='alert'>{t('ERROR', 'Error')}</WarningText>}
    </>
  )
}

const VerificationEmailForm = (props) => {
  const {
    formState,
    handleButtonUpdateClick,
    verifyEmailState,
    user,
    onCancel
  } = props

  const [, t] = useLanguage()
  const [email, setEmail] = useState(user?.email || user?.guest_email || '')
  const [validationError, setValidationError] = useState(null)
  const [exiting, setExiting] = useState(false)
  const loading = exiting || formState?.loading || verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode

  const handleSaveEmail = () => {
    if (loading) return
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      setValidationError(t('VALIDATION_ERROR_EMAIL_REQUIRED', 'The field Email is required').replace('_attribute_', t('EMAIL', 'Email')))
      return
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(normalizedEmail)) {
      setValidationError(t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email')))
      return
    }
    setValidationError(null)
    if (user?.email && normalizedEmail === user.email.trim().toLowerCase()) {
      onCancel?.()
      return
    }
    handleButtonUpdateClick({ email: normalizedEmail })
  }

  const saveError = formState?.result?.error
  const saveErrorText = (item) => {
    if (typeof item === 'string') return item
    if (!item || typeof item !== 'object') return null
    if (typeof item.message === 'string') return item.message
    const original = item.original
    if (typeof original === 'string') return original
    if (original && typeof original === 'object' && !Array.isArray(original)) {
      const entries = Object.entries(original)
      if (entries.length && entries.every(([key, value], index) => key === String(index) && typeof value === 'string')) {
        return entries.map(([, value]) => value).join('')
      }
    }
    return null
  }
  const saveErrorContent = (() => {
    const result = formState?.result?.result
    if (Array.isArray(result)) return result.map(saveErrorText).filter(Boolean).join(', ') || t('ERROR', 'Error')
    return saveErrorText(result) || t('ERROR', 'Error')
  })()

  return (
    <>
      <InputWrapper>
        <Input
          type='email'
          name='email'
          aria-label='email'
          aria-invalid={!!validationError}
          placeholder={t('EMAIL', 'Email')}
          autoComplete='email'
          required
          value={email}
          disabled={loading}
          onChange={event => {
            setEmail(event.target.value)
            setValidationError(null)
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSaveEmail()
            }
          }}
        />
        <InputBeforeIcon>
          <Icon name="envelope" />
        </InputBeforeIcon>
      </InputWrapper>
      <Button
        data-doc-control='verification-save-email'
        type='button'
        color='primary'
        disabled={loading}
        onClick={handleSaveEmail}
      >
        {t('SAVE', 'Save')}
      </Button>
      {user?.email && onCancel && (
        <Button
          data-doc-control='verification-cancel-email'
          type='button'
          color='secundary'
          disabled={loading}
          onClick={onCancel}
        >
          {t('CANCEL', 'Cancel')}
        </Button>
      )}
      {validationError && (
        <WarningText role='alert'>
          {validationError}
        </WarningText>
      )}
      {saveError && (
        <WarningText role='alert'>
          {saveErrorContent}
        </WarningText>
      )}
      {saveError && user?.guest_id && (
        <LogoutActionController
          useDefualtSessionManager
          UIComponent={VerificationEmailRecovery}
          disabled={loading}
          onExiting={setExiting}
        />
      )}
    </>
  )
}

const UserVerificationUI = (props) => {
  const {
    verifyEmailState,
    verifyPhoneState,
    sendVerifyEmailCode,
    sendVerifyPhoneCode,
    checkVerifyEmailCode,
    checkVerifyPhoneCode,
    cleanErrorsState,
    useWhatsappVerification
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ auth, user }] = useSession()
  const [otpState, setOtpState] = useState('')
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [verificationState, setVerificationState] = useState({ email: false, phone: false })

  const [phoneState, setPhoneState] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(2)
  const [editingEmail, setEditingEmail] = useState(false)

  const isEmailVerifyRequired = auth && configs?.verification_email_required?.value === '1' && !user?.email_verified
  const isPhoneVerifyRequired = auth && configs?.verification_phone_required?.value === '1' && !user?.phone_verified

  const phoneLength = phoneState?.cellphone && phoneState?.country_phone_code && phoneState?.cellphone?.split('')?.length
  const lastNumbers = phoneState?.cellphone && phoneState?.country_phone_code && phoneState?.cellphone?.split('').fill('*', 0, phoneLength - 2).join('')

  const [otpLeftTime, , resetOtpLeftTime] = useCountdownTimer(
    600,
    isEmailVerifyRequired
      ? verificationState.email
      : verificationState.phone
  )

  const numOtpInputs = isEmailVerifyRequired ? 6 : 4

  const handleSendOtp = (opt, channel) => {
    if (opt !== 'phone' && (!user?.email || editingEmail || verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode)) return
    resetOtpLeftTime()
    if (opt === 'phone') {
      const ch = channel || 2
      setSelectedChannel(ch)
      sendVerifyPhoneCode({
        cellphone: phoneState?.cellphone,
        country_phone_code: phoneState?.country_phone_code,
        channel: ch
      })
      return
    }
    sendVerifyEmailCode({ email: user?.email })
  }

  const closeAlert = () => {
    setAlertState({ open: false, content: [] })
    cleanErrorsState()
    cleanErrorsState('phone')
    setOtpState('')
  }

  const setupUserPhoneNumber = () => {
    if (!user || !user?.cellphone || !user?.country_phone_code) return
    setPhoneState({
      cellphone: user?.cellphone,
      country_phone_code: user?.country_phone_code,
      formatted: `+${user?.country_phone_code} ${user?.cellphone}`
    })
  }

  useEffect(() => {
    if (otpState?.length === numOtpInputs) {
      if (verificationState.email) {
        checkVerifyEmailCode({ code: otpState })
        return
      }
      if (verificationState.phone) {
        checkVerifyPhoneCode({
          cellphone: phoneState?.cellphone,
          country_phone_code: +(phoneState?.country_phone_code),
          code: otpState,
          channel: selectedChannel
        })
      }
    }
  }, [otpState])

  useEffect(() => {
    if (verifyEmailState?.errorSendCode || verifyEmailState?.errorCheckCode) {
      setAlertState({
        open: true,
        content: verifyEmailState?.errorSendCode?.[0] ??
          verifyEmailState?.errorCheckCode?.[0] ??
          t('ERROR', 'Error')
      })
    }

    if (verifyPhoneState?.errorSendCode || verifyPhoneState?.errorCheckCode) {
      setAlertState({
        open: true,
        content: verifyPhoneState?.errorSendCode?.[0] ??
          verifyPhoneState?.errorCheckCode?.[0] ??
          t('ERROR', 'Error')
      })
    }
  }, [verifyEmailState, verifyPhoneState])

  useEffect(() => {
    if (!verifyEmailState?.loadingSendCode && isEmailVerifyRequired) {
      setVerificationState({
        ...verificationState,
        phone: false,
        email: !!verifyEmailState?.resultSendCode
      })
    }
    if (!verifyPhoneState?.loadingSendCode && isPhoneVerifyRequired && !isEmailVerifyRequired) {
      setVerificationState({
        ...verificationState,
        email: false,
        phone: !!verifyPhoneState?.resultSendCode
      })
    }
  }, [verifyEmailState, verifyPhoneState])

  useEffect(() => {
    if (otpState) {
      setOtpState('')
    }
  }, [verificationState])

  useEffect(() => {
    setupUserPhoneNumber()
  }, [user])

  return (
    <Container>
      <FormInput onSubmit={event => event.preventDefault()}>
        <WrapperText>
          <span>
            {t('VERIFICATION_CODE', 'Verification Code')}
          </span>
          {isEmailVerifyRequired && (
            <span>
              {!verificationState.email
                ? (
                    t('VERIFICATION_EMAIL_CODE_MESSAGE', 'In order to continue using our platform please verify your email')
                  )
                : (
                    t('VERIFICATION_EMAIL_CODE_SENT_MESSAGE', 'Please type the verification code sent to your email')
                  )}
            </span>
          )}

          {isPhoneVerifyRequired && !isEmailVerifyRequired && (
            <span>
              {!verificationState.phone
                ? (
                `${t('VERIFICATION_PHONE_CODE_MESSAGE', 'In order to continue using our platform please verify your phone number')}`
                  )
                : (
                `${t('VERIFICATION_PHONE_CODE_SENT_MESSAGE', 'Please, enter the verification code we sent to your mobile ending with :number').replace(':number', lastNumbers)}`
                  )}
            </span>
          )}
        </WrapperText>

        {isEmailVerifyRequired && (
          !verificationState.email
            ? (
                user?.guest_id && (!user?.email || editingEmail)
                  ? (
                <UserFormController
                  key={user?.id}
                  user={user}
                  useDefualtSessionManager
                  UIComponent={VerificationEmailForm}
                  verifyEmailState={verifyEmailState}
                  handleSuccessUpdate={() => setEditingEmail(false)}
                  onCancel={() => setEditingEmail(false)}
                />
                    )
                  : (
            <>
              <InputWrapper>
                <Input
                  readOnly
                  type='email'
                  name='email'
                  aria-label='email'
                  placeholder={user?.email}
                  autoComplete='off'
                />
                <InputBeforeIcon>
                  <Icon name="envelope" />
                </InputBeforeIcon>
              </InputWrapper>
              {!user?.email && (
                <WarningText role='status'>
                  {t('VERIFICATION_EMAIL_MISSING', 'This account has no email address. An email address is required to send a verification code.')}
                </WarningText>
              )}
              <Button
                type='button'
                color='primary'
                disabled={!user?.email || verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode}
                onClick={handleSendOtp}
              >
                {t('SEND_CODE', 'Send code')}
              </Button>
              {user?.guest_id && (
              <Button
                data-doc-control='verification-edit-email'
                type='button'
                color='secundary'
                disabled={verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode}
                onClick={() => setEditingEmail(true)}
              >
                {t('CHANGE', 'Change')}
              </Button>
              )}
            </>
                    )
              )
            : (
            <>
              <CountdownTimer error={otpLeftTime === 0}>
                <span>{formatSeconds(otpLeftTime)}</span>
              </CountdownTimer>

              <OtpWrapper>
                <OtpInput
                  value={otpState}
                  onChange={otp => setOtpState(otp)}
                  numInputs={numOtpInputs}
                  containerStyle='otp-container'
                  inputStyle='otp-input'
                  placeholder={new Array(numOtpInputs).fill(0).join('')}
                  isInputNum
                  shouldAutoFocus
                />
              </OtpWrapper>

              <ButtonsWrapper>
                <div style={{ width: '48%' }}>
                  <Button
                    type='button'
                    color='secundary'
                    disabled={verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode}
                    onClick={() => {
                      setVerificationState({
                        ...verificationState,
                        email: false
                      })
                    }}
                  >
                    {t('CANCEL', 'Cancel')}
                  </Button>
                </div>
                <div style={{ width: '48%' }}>
                  <Button
                    type='button'
                    color='secundary'
                    disabled={verifyEmailState?.loadingSendCode || verifyEmailState?.loadingCheckCode}
                    onClick={handleSendOtp}
                  >
                    {t('RESEND_AGAIN', 'Resend again?')}
                  </Button>
                </div>
              </ButtonsWrapper>
            </>
              )
        )}

        {isPhoneVerifyRequired && !isEmailVerifyRequired && (
          !verificationState.phone
            ? (
                phoneState?.formatted
                  ? (
              <>
                <InputWrapper phone>
                  <InputPhoneNumber
                    showPhoneIcon
                    user={user}
                    value={phoneState?.formatted}
                    disabled={!!phoneState?.formatted}
                    setValue={() => {}}
                    handleIsValid={() => {}}
                  />
                </InputWrapper>
                {useWhatsappVerification
                  ? (
                    <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                      <Button
                        type='button'
                        color='primary'
                        disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                        onClick={() => handleSendOtp('phone', 2)}
                        style={{ flex: 1 }}
                      >
                        {t('SEND_BY_SMS', 'Send by SMS')}
                      </Button>
                      <Button
                        type='button'
                        color='primary'
                        disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                        onClick={() => handleSendOtp('phone', 4)}
                        style={{ flex: 1 }}
                      >
                        {t('SEND_BY_WHATSAPP', 'Send by WhatsApp')}
                      </Button>
                    </div>
                    )
                  : (
                    <Button
                      type='button'
                      color='primary'
                      disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                      onClick={() => handleSendOtp('phone')}
                    >
                      {t('SEND_CODE', 'Send code')}
                    </Button>
                    )}
              </>
                    )
                  : (
              <>
                <WarningText>
                  {t('WARNING_PHONE_CODE_VALIDATION', 'Please update your phone number to continue')}
                </WarningText>
                <Button
                  type='button'
                  color='primary'
                  onClick={() => setModalIsOpen(true)}
                >
                  {t('UPDATE_PROFILE', 'Update profile')}
                </Button>
              </>
                    )
              )
            : (
            <>
              <CountdownTimer error={otpLeftTime === 0}>
                <span>{formatSeconds(otpLeftTime)}</span>
              </CountdownTimer>

              <OtpWrapper>
                <OtpInput
                  value={otpState}
                  onChange={otp => setOtpState(otp)}
                  numInputs={numOtpInputs}
                  containerStyle='otp-container'
                  inputStyle='otp-input'
                  placeholder={new Array(numOtpInputs).fill(0).join('')}
                  isInputNum
                  shouldAutoFocus
                />
              </OtpWrapper>

              <ButtonsWrapper>
                <div style={{ width: '48%' }}>
                  <Button
                    type='button'
                    color='secundary'
                    disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                    onClick={() => {
                      setVerificationState({
                        ...verificationState,
                        phone: false
                      })
                    }}
                  >
                    {t('CANCEL', 'Cancel')}
                  </Button>
                </div>
                <div style={{ width: '48%' }}>
                  <Button
                    type='button'
                    color='secundary'
                    disabled={verifyPhoneState?.loadingSendCode || verifyPhoneState?.loadingCheckCode}
                    onClick={() => handleSendOtp('phone', selectedChannel)}
                  >
                    {t('RESEND_AGAIN', 'Resend again?')}
                  </Button>
                </div>
              </ButtonsWrapper>
            </>
              )
        )}
      </FormInput>

      {modalIsOpen && (
        <Modal
          title={t('UPDATE_PROFILE', 'Update Profile')}
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          width='700px'
        >
          <UserDetails
            user={user}
            handleSuccessUpdate={() => setModalIsOpen(false)}
          />
        </Modal>
      )}

      <Alert
        title={t('VERIFY_EMAIL', 'Verify email')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </Container>
  )
}

export const UserVerification = (props) => {
  const [{ user }] = useSession()
  const verifyProps = {
    ...props,
    UIComponent: UserVerificationUI
  }
  return (
    <UserVerificationController
      key={JSON.stringify([user?.id, user?.email])}
      {...verifyProps}
    />
  )
}
