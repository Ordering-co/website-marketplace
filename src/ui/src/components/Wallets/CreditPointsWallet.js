import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import {
  Container,
  SectionWrapper,
  BalanceElement,
  TransactionsWrapper,
  WrapContent,
  Transactions,
  LoyaltyContent,
  LoyaltyWrapp,
  NotFoundText,
  Title
} from './styles'

import { WalletList } from '~components/components/WalletList'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { WalletTransactionItem } from '~ui/src/components/WalletTransactionItem'

import { Icon } from '~ui-icon'

const CreditPointsWalletUI = (props) => {
  const {
    walletList,
    userLoyaltyLevel,
    transactionsList
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [loyaltyImageError, setLoyaltyImageError] = useState(false)

  const currentWalletSelected = (walletList.wallets?.length > 0 && walletList.wallets?.find(w => w.type === 'credit_point')) ?? null
  const loyaltyLevel = Object.keys(userLoyaltyLevel.loyaltyLevel ?? {}).length > 0 && userLoyaltyLevel.loyaltyLevel

  // Reset the broken-image flag when the level (image) changes, so a new valid
  // image isn't kept hidden by a previous level's load failure.
  useEffect(() => {
    setLoyaltyImageError(false)
  }, [loyaltyLevel?.image])

  return (
    <Container>
      <Title>
        {t('LOYALTY_POINTS', 'Loyalty Points')}
      </Title>
      {!walletList.loading && !userLoyaltyLevel.loading && !walletList.error && walletList.wallets?.length > 0 && (
        <>
          <WrapContent>
            <Transactions isLoyaltyLevel={!!loyaltyLevel}>
              <SectionWrapper>
                <BalanceElement loyaltyLevel={loyaltyLevel}>
                  {!!loyaltyLevel && (
                    <LoyaltyContent>
                      <LoyaltyWrapp>
                        {!!(loyaltyLevel.image ?? theme.images?.dummies?.loyaltyLevel) && !loyaltyImageError
                          ? (
                            <img
                              src={loyaltyLevel.image ?? theme.images?.dummies?.loyaltyLevel}
                              alt={loyaltyLevel.name}
                              onError={() => setLoyaltyImageError(true)}
                            />
                            )
                          : (
                            <span className='loyalty_placeholder' aria-hidden='true'>
                              <Icon name="trophy" />
                            </span>
                            )}
                      </LoyaltyWrapp>
                      <span className='loyalty_name'>
                        {loyaltyLevel.name}
                      </span>
                    </LoyaltyContent>
                  )}
                  <div className='balance_element-points'>
                    <h1>
                      {currentWalletSelected?.balance}
                    </h1>
                    <span>
                      {t('AVAILABLE_CREDIT_POINTS', 'Available Credit Points')}
                    </span>
                  </div>
                </BalanceElement>
              </SectionWrapper>
              <div className='transactions_list'>
                {!transactionsList?.loading && transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length > 0 && (
                  <>
                    <h2 style={{ fontSize: 20 }}>{t('TRANSACTIONS_LIST', 'Transactions List')}</h2>
                    <TransactionsWrapper>
                      {transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.map((transaction, i) => (
                        <WalletTransactionItem
                          key={i}
                          item={transaction}
                          withFormatPrice={currentWalletSelected?.type === 'cash'}
                        />
                      ))}
                    </TransactionsWrapper>
                  </>
                )}

                {transactionsList?.loading && (
                  <>
                    {[...Array(8).keys()].map(i => (
                      <SectionWrapper key={i} isLoading>
                        <Skeleton height={40} />
                      </SectionWrapper>
                    ))}
                  </>
                )}
              </div>
            </Transactions>
          </WrapContent>
        </>
      )}

      {(walletList?.loading || userLoyaltyLevel.loading) && (
        <div style={{ width: '85%', margin: '0 auto' }}>
          {[...Array(8).keys()].map(i => (
            <SectionWrapper key={i} isLoading>
              <Skeleton height={40} />
            </SectionWrapper>
          ))}
        </div>
      )}

      {!transactionsList?.loading &&
        (transactionsList?.error || !transactionsList.list?.[`wallet:${currentWalletSelected?.id}`]?.length) &&
        !walletList.loading &&
        !userLoyaltyLevel.loading &&
        !walletList.error &&
        walletList.wallets?.length > 0 && (
          <>
            <img src={theme?.images?.general?.noTransactionsIcon} alt='No transactions' />
            <NotFoundText>
              {
                transactionsList?.error
                  ? t('ERROR_NOT_FOUND_TRANSACTIONS', 'Sorry, an error has occurred')
                  : t('NO_TRANSACTIONS', 'No transactions')
              }
              {!transactionsList?.error && (<span className='bold'>{t('FOUND', 'found')}</span>)}
            </NotFoundText>
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

export const CreditPointsWallet = (props) => {
  const [{ configs }] = useConfig()
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: CreditPointsWalletUI,
    isWalletPointsEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
