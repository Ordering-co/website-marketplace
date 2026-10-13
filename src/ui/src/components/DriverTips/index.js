import React, { useState } from 'react'

import {
  DriverTipContainer,
  TipCard,
  FormDriverTip,
  WrapperInput,
  DriverTipMessage,
  WrapperTips,
  TipChips
} from './styles'

import { DriverTips as DriverTipsController } from '~components/components/DriverTips'
import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { Input } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'

const DriverTipsUI = (props) => {
  const {
    isMulti,
    driverTip,
    driverTipsOptions,
    cart,
    carts,
    isDriverTipUseCustom,
    isCartPopover,
    handlerChangeOption
  } = props
  const [{ parsePrice }] = useUtils()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()

  const [customTip, setCustomTip] = useState((isDriverTipUseCustom && !driverTipsOptions.includes(driverTip)) ?? false)
  const [value, setvalue] = useState('')
  const isFixedPriceType = parseInt(configs?.driver_tip_type?.value, 10) === 1
  const currentTip = customTip ? parseFloat(driverTip || 0) > 0 : (!customTip && !driverTipsOptions.includes(driverTip) && parseFloat(driverTip || 0)) > 0

  const handleChangeDriverTip = (e) => {
    const inputValue = e?.target?.value
    if ((!isFixedPriceType && inputValue.length > 3) || (inputValue.length > 10)) return

    const tip = Number(inputValue)
    if ((isNaN(tip) || tip < 0)) return
    setvalue(inputValue)
  }

  const placeholderCurrency = !isFixedPriceType
    ? '0%'
    : (configs?.currency_position?.value || 'left') === 'left'
        ? `${configs?.format_number_currency?.value}0`
        : `0${configs?.format_number_currency?.value}`

  const multiCartTipsAmmout = carts?.reduce((total, cart) => {
    return total + parseFloat(cart?.driver_tip || 0)
  }, 0)

  return (
    <DriverTipContainer id='driver-tip-container'>
      <>
        <WrapperTips isDriverTipUseCustom={isDriverTipUseCustom}>
          <TipChips>
            {driverTipsOptions.map((option, i) => (
              <TipCard
                key={i}
                isCartPopover={isCartPopover}
                className={`${(option === driverTip && !customTip) ? 'active' : ''}`}
                onClick={() => {
                  handlerChangeOption(option)
                  setCustomTip(false)
                }}
              >
                {`${isFixedPriceType ? parsePrice(option) : `${option}%`}`}
              </TipCard>
            ))}
            {isDriverTipUseCustom && (
              <TipCard
                className={`${customTip ? 'active' : ''}`}
                onClick={() => setCustomTip(true)}
              >
                {t('CUSTOM_TIP', 'Custom')}
              </TipCard>
            )}
          </TipChips>
          {customTip &&
            <FormDriverTip>
                <WrapperInput>
                  <Input
                    name='drivertip'
                    type='number'
                    value={value}
                    placeholder={placeholderCurrency}
                    onChange={handleChangeDriverTip}
                  />
                  <Button
                    color='primary'
                    disabled={parseFloat(value || 0) < 0 || parseFloat(value || 0) === driverTip || value === ''}
                    onClick={() => {
                      handlerChangeOption(value)
                      setvalue('')
                    }}
                  >
                    {t('APPLY_TIP', 'Apply Tip')}
                  </Button>
                </WrapperInput>
            </FormDriverTip>
          }
          {currentTip && customTip && (
            <DriverTipMessage>
              {t('CURRENT_DRIVER_TIP_AMOUNT', 'Current driver tip amount')}{!isFixedPriceType &&
                ` (${driverTip}%)`}: {parsePrice(isMulti ? multiCartTipsAmmout : isFixedPriceType ? driverTip : cart?.driver_tip)}
            </DriverTipMessage>
          )}
        </WrapperTips>
      </>
    </DriverTipContainer>
  )
}

export const DriverTips = (props) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}
