import React, { useEffect } from 'react'
import parsePhoneNumber from 'libphonenumber-js'
import { useTheme } from 'styled-components'
import PhoneInput from 'react-phone-number-input'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useSession } from '~components/contexts/SessionContext'
import { Container, ErrorMsg } from './styles'

export const InputPhoneNumber = (props) => {
  const {
    user,
    value,
    setValue,
    handleIsValid,
    disabled,
    isError,
    showPhoneIcon
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [{ configs }] = useConfig()

  const isValidPhoneNumber = (number) => {
    if (!number) return
    if (!parseInt(configs?.validation_phone_number_lib?.value ?? 1, 10)) {
      return true
    }
    const numberParser = parsePhoneNumber(number)
    return numberParser?.isValid()
  }

  useEffect(() => {
    if (value) {
      handleIsValid && handleIsValid(isValidPhoneNumber(value))
    }
  }, [value])

  return (
    <Container
      className='phone_number'
      disabled={disabled}
      isValid={value ? isValidPhoneNumber(value) : true}
      showPhoneIcon={showPhoneIcon}
      isError={isError}
    >
      <PhoneInput
        disabled={disabled}
        placeholder={t('PHONE_NUMBER', theme?.defaultLanguages?.PHONE_NUMBER || 'Phone number')}
        defaultCountry={configs?.default_country_code?.value}
        name='telefono'
        value={value}
        displayInitialValueAsLocalNumber
        onChange={(val) => setValue && setValue(val, isValidPhoneNumber(val))}
      />
      {value && !isValidPhoneNumber(value) && !disabled && (
        <>
          {((auth && user?.country_phone_code) || !auth || value.includes('+')) && (
            <ErrorMsg>{t('INVALID_ERROR_PHONE_NUMBER', 'The Phone Number field is invalid')}</ErrorMsg>
          )}

          {auth && !user?.country_phone_code && !value.includes('+') && (
            <ErrorMsg>{t('INVALID_ERROR_COUNTRY_CODE_PHONE_NUMBER', 'The country code of the phone number is invalid')}</ErrorMsg>
          )}
        </>
      )}
    </Container>
  )
}
