import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
  Container,
  TabsContainer,
  Tab,
  NotFoundText
} from './styles'

import { WalletList } from '~components/components/WalletList'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { Tabs } from '~ui/src/styles/Tabs'
import { CashWallet } from './CashWallet'
import { CreditPointsWallet } from './CreditPointsWallet'

const WalletsUI = (props) => {
  const {
    walletList,
    userLoyaltyLevel,
    setWalletSelected,
    isWalletCashEnabled,
    isWalletPointsEnabled,
    walletType
  } = props

  const [, t] = useLanguage()
  const [tabSelected, setTabSelected] = useState(isWalletCashEnabled ? 'cash' : 'credit_point')

  useEffect(() => {
    if (walletType && (walletType === 'cash' || walletType === 'credit_point')) {
      setTabSelected(walletType)
      const wallet = walletList.wallets?.find(w => w.type === walletType)
      if (wallet) {
        setWalletSelected(wallet.id)
      }
    }
  }, [walletType, walletList.wallets])

  const walletName = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet'),
      value: 0,
      isActive: isWalletCashEnabled
    },
    credit_point: {
      name: t('CREDITS_POINTS_WALLET', 'Credit Points Wallet'),
      value: 1,
      isActive: isWalletPointsEnabled
    }
  }

  const walletComponents = {
    cash: CashWallet,
    credit_point: CreditPointsWallet
  }

  const handleChangeTab = (wallet) => {
    setTabSelected(wallet.type)
    setWalletSelected(wallet.id)
  }

  const WalletComponent = walletComponents[tabSelected] || null

  return (
    <Container noPadding={!!walletType}>
      {!walletList.loading &&
        !userLoyaltyLevel.loading &&
        !walletList.error &&
        walletList.wallets?.length > 0 && (
          <>
            <TabsContainer hidden>
              <Tabs variant='primary' className='tabs'>
                {Object.entries(walletName).map(([type, data]) => data.isActive && (
                  <Tab
                    key={type}
                    active={tabSelected === type}
                    onClick={() => handleChangeTab({ type, id: null })}
                    borderBottom
                    className='tab_title'
                  >
                    {data.name}
                  </Tab>
                ))}
              </Tabs>
            </TabsContainer>

            {WalletComponent && <WalletComponent {...props} />}
          </>
      )}

      {(walletList?.loading || userLoyaltyLevel.loading) && (
        <>
          <Tabs variant='primary'>
            <Skeleton width={200} height={40} style={{ marginRight: 10 }} />
            <Skeleton width={200} height={40} style={{ marginRight: 10 }} />
            <Skeleton width={200} height={40} style={{ marginBottom: 15 }} />
          </Tabs>
          <div style={{ width: '85%', margin: '0 auto' }}>
            {[...Array(8).keys()].map(i => (
              <Skeleton key={i} height={40} />
            ))}
          </div>
        </>
      )}

      {!walletList?.loading && !userLoyaltyLevel.loading && (walletList?.error || !walletList?.wallets?.length) && (
        <NotFoundText>
          {
            walletList?.error
              ? t('ERROR_NOT_FOUND_WALLETS', 'Sorry, an error has occurred')
              : t('NOT_FOUND_WALLETS', 'No wallets to show at this time.')
          }
        </NotFoundText>
      )}
    </Container>
  )
}

export const Wallets = (props) => {
  const [{ configs }] = useConfig()

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: WalletsUI,
    isWalletCashEnabled,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
