import React from 'react'
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
  NotFoundText,
  Title
} from './styles'

import { WalletList } from '~components/components/WalletList'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { WalletTransactionItem } from '~ui/src/components/WalletTransactionItem'

const CashWalletUI = (props) => {
  const {
    walletList,
    transactionsList
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const currentWalletSelected = (walletList.wallets?.length > 0 && walletList.wallets?.find(w => w.type === 'cash')) ?? null

  return (
    <Container>
      <Title>
        {t('CASH_WALLET', 'Cash Wallet')}
      </Title>
      {!walletList.loading && !walletList.error && walletList.wallets?.length > 0 && (
        <>
          <WrapContent>
            <Transactions>
              <SectionWrapper>
                <BalanceElement>
                  <h1>
                    {t('AVAILABLE', 'Available')}
                  </h1>
                  <div className='balance_element'>
                    <h1>
                      {currentWalletSelected?.balance}
                    </h1>
                    <span>
                      {t('WALLET_CREDITS', 'Wallet credits')}
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
                          withFormatPrice={false}
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

      {walletList?.loading && (
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
              {!transactionsList?.error && (<span className='bold'> {t('FOUND', 'found')}</span>)}
            </NotFoundText>
          </>
      )}

      {!walletList?.loading && (walletList?.error || !walletList?.wallets?.length) && (
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

export const CashWallet = (props) => {
  const [{ configs }] = useConfig()
  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'

  const walletsProps = {
    ...props,
    UIComponent: CashWalletUI,
    isWalletCashEnabled
  }
  return (
    <WalletList {...walletsProps} />
  )
}
