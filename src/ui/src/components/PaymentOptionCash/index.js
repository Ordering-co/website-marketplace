import React, { useEffect, useState, useRef } from 'react'

import {
  PaymentCashContainer,
  FormCash,
  WrapperInput,
  ErrorText
} from './styles'

import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Input } from '~ui/src/styles/Inputs'

export const PaymentOptionCash = (props) => {
  props = { ...defaultProps, ...props }
  const {
    defaultValue,
    orderTotal,
    onChangeData,
    setErrorCash
  } = props
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  const [value, setvalue] = useState(defaultValue)
  const el = useRef()
  let timeout = null
  const onChangeCash = (e) => {
    if (/^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/.test(e?.target?.value)) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        let cash = parseFloat(e?.target?.value)
        cash = isNaN(cash) ? null : cash
        setvalue(cash)
        if (cash >= orderTotal || !cash) {
          onChangeData && onChangeData({ cash })
        }
      }, 1000)
    }
  }

  // Keep the latest handler in a ref so the once-bound keyup listener always
  // validates against the current orderTotal instead of a stale closure.
  const onChangeCashRef = useRef(onChangeCash)
  onChangeCashRef.current = onChangeCash

  useEffect(() => {
    el.current.onkeyup = (e) => onChangeCashRef.current(e)
  }, [])

  useEffect(() => {
    el.current.value = value || ''
  }, [value])

  useEffect(() => {
    if (value && parseFloat(value) < orderTotal) {
      setErrorCash && setErrorCash(true)
    } else {
      setErrorCash && setErrorCash(false)
    }
  }, [value, orderTotal])

  return (
    <PaymentCashContainer>
      <FormCash>
        <WrapperInput>
          <label>{t('NOT_EXACT_CASH_AMOUNT', 'Don\'t have exact amount? Let us know with how much will you pay')}</label>
          <Input
            ref={el}
            name='cash'
            type='text'
            placeholder={t('EXACT_CASH_PLACEHOLDER', '$0.00')}
            onKeyPress={(e) => {
              if (!/^[0-9 .]$/.test(e.key)) {
                e.preventDefault()
              }
            }}
          />
        </WrapperInput>
        {value && parseFloat(value) < orderTotal && (
          <ErrorText>{t('VALUE_GREATER_THAN_TOTAL', 'This value must be greater than order total')}: {parsePrice(orderTotal)}</ErrorText>
        )}
      </FormCash>
    </PaymentCashContainer>
  )
}

const defaultProps = {
  defaultValue: null
}
