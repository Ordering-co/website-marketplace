import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'

import {
  Container,
  SectionLeft,
  SectionWrapper,
  SectionLeftText
} from './styles'

import { PaymentOptionWallet as PaymentOptionWalletController } from '~components/components/PaymentOptionWallet'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { Alert } from '~ui/src/components/Confirm'
import { Checkbox } from '~ui/src/styles/Checkbox'
import { getUtils } from './utils'
const PaymentOptionWalletUI = (props) => {
  const {
    cart,
    errorState,
    setErrorState,
    selectWallet,
    walletsState,
    businessConfigs = [],
    deletetWalletSelected
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice }] = useUtils()
  const { getIcon } = getUtils()

  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [checkedState, setCheckedState] = useState(
    new Array(walletsState.result?.length).fill(false)
  )

  const hidePointsEquivalence = true
  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const isBusinessWalletCashEnabled = businessConfigs.find(config => config.key === 'wallet_cash_enabled')?.value === '1'
  const isBusinessWalletPointsEnabled = businessConfigs.find(config => config.key === 'wallet_credit_point_enabled')?.value === '1'

  const walletName = {
    cash: {
      name: t('PAY_WITH_WALLET_CREDITS', 'Pay with Wallet credits'),
      isActive: isWalletCashEnabled && isBusinessWalletCashEnabled
    },
    credit_point: {
      name: t('PAY_WITH_LOYALTY_POINTS', 'Pay with Loyalty points'),
      isActive: isWalletPointsEnabled && isBusinessWalletPointsEnabled
    }
  }

  const closeAlert = () => {
    setAlertState({ open: false, content: [] })
    setErrorState(null)
  }

  const handleOnChange = (position, wallet) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    )

    if (!checkedState[position]) {
      selectWallet(wallet)
    } else {
      deletetWalletSelected(wallet)
    }

    setCheckedState(updatedCheckedState)
  }

  const syncCheckedFromCart = () => {
    setCheckedState(
      walletsState?.result?.map(wallet => !!cart?.wallets?.find(w => w.id === wallet.id)) ?? []
    )
  }

  useEffect(() => {
    if (!walletsState.loading) {
      syncCheckedFromCart()
    }
  }, [walletsState.result?.length])

  useEffect(() => {
    if (errorState) {
      setAlertState({ open: true, content: errorState })
      // selectWallet/deletetWalletSelected failed — revert the optimistic
      // checkbox toggle back to the cart's actual wallet selection.
      syncCheckedFromCart()
    }
  }, [errorState])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
      {!walletsState.loading &&
        !walletsState.error &&
        walletsState.result?.length > 0 &&
        (
          <>
            {walletsState.result?.map((wallet, idx) => wallet.valid && wallet.balance >= 0 && walletName[wallet.type]?.isActive && (
              <Container
                key={wallet.id}
                isBottomBorder={idx === walletsState.result?.length - 1}
              >
                <SectionLeft>
                  <SectionLeftText
                    htmlFor={`custom-checkbox-${idx}`}
                    style={{
                      color: (cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0
                        ? theme.colors.darkGray
                        : 'black'
                    }}
                  >
                    {getIcon(wallet.type)}
                    <div className='wallet-name'>
                      {walletName[wallet.type]?.name}
                    </div>
                    {wallet.type === 'cash' && (
                      <span className='bold'>{`${wallet?.balance} ${t('WALLET_CREDITS', 'Wallet credits')}`}</span>
                    )}
                    {wallet.type === 'credit_point' && (
                      <span className='bold'>
                        <span style={{ color: theme.colors.primary }}>{`${wallet?.balance} ${t('POINTS', 'Points')}`}</span> {wallet?.balance > 0 && !hidePointsEquivalence && `= ${parsePrice(wallet?.balance / wallet?.redemption_rate)}`}
                      </span>
                    )}
                  </SectionLeftText>
                </SectionLeft>
                <div>
                  {cart?.status !== 2 && (
                    <Checkbox
                      id={`custom-checkbox-${idx}`}
                      className='checkbox-wallet'
                      disabled={(cart?.balance === 0 && !checkedState[idx]) || wallet.balance === 0}
                      checked={checkedState[idx] ?? false}
                      onChange={() => handleOnChange(idx, wallet)}
                    />
                  )}
                </div>
              </Container>
            ))}
          </>
        )}

      {walletsState?.loading && (
        <>
          {[...Array(2).keys()].map(i => (
            <SectionWrapper key={i}>
              <Skeleton height={40} />
            </SectionWrapper>
          ))}
        </>
      )}

      <Alert
        title={t('WALLET_ERROR_MESSAGES', 'Wallet')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </div>
  )
}

export const PaymentOptionWallet = (props) => {
  const paymentWalletProps = {
    ...props,
    UIComponent: PaymentOptionWalletUI
  }

  return (
    <PaymentOptionWalletController {...paymentWalletProps} />
  )
}
