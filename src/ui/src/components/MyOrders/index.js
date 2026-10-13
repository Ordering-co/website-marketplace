import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useTheme } from 'styled-components'

import {
  Container,
  NoOrdersWrapper,
  MyOrdersMenuContainer,
  Divider,
  Title,
  CategoryListsContainer
} from './styles'

import { useConfig } from '~components/contexts/ConfigContext'
import { isWalletEnabled as isWalletConfigEnabled } from '~components/utils/configHelpers'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Tab, Tabs } from '~ui/src/styles/Tabs'
import { Button } from '~ui/src/styles/Buttons'
import { OrdersOption } from '~ui/src/components/OrdersOption'
import { GiftCardOrdersList } from '../GiftCard/GiftCardOrdersList'

export const MyOrders = (props) => {
  const {
    hideOrders,
    isFromBusinessListingSearch,
    businessesSearchList,
    onProductRedirect,
    onRedirectPage
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ configs }] = useConfig()
  const layout = theme?.orders?.components?.layout?.type || 'original'

  const [isEmptyActive, setIsEmptyActive] = useState({ loading: true, value: false })
  const [isEmptyPast, setIsEmptyPast] = useState({ loading: true, value: false })
  const [isEmptyPreorder, setIsEmptyPreorder] = useState({ loading: true, value: false })
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')
  const [isEmptyBusinesses, setIsEmptyBusinesses] = useState(false)
  const [businessOrderIds, setBusinessOrderIds] = useState([])

  const loading = isEmptyActive.loading || isEmptyPast.loading || isEmptyPreorder.loading
  const hidePreviousOrders = theme?.orders?.components?.past_orders?.hidden
  const hideProductsTab = theme?.orders?.components?.products_tab?.hidden
  const hideBusinessTab = theme?.orders?.components?.business_tab?.hidden
  const isWalletEnabled = configs?.cash_wallet?.value && isWalletConfigEnabled(configs)
  const isGiftCardDisabled = configs?.platform_store_giftcard_enabled?.value === '0' || configs?.platform_store_giftcard_enabled?.value === false

  const MyOrdersMenu = [
    { key: 'orders', value: t('ORDERS_MENU_PAGE', 'Orders'), disabled: false },
    { key: 'business', value: t('BUSINESS_MENU_PAGE', 'Business'), disabled: hideBusinessTab },
    { key: 'products', value: t('PRODUCTS_MENU_PAGE', 'Products'), disabled: hideProductsTab },
    { key: 'giftCards', value: t('GIFT_CARD_MENU_PAGE', 'Gift card'), disabled: !isWalletEnabled || isGiftCardDisabled }
  ]

  const notOrderOptions = ['business', 'products', 'professionals']
  const allEmpty = (isEmptyActive.value && isEmptyPast.value && isEmptyPreorder.value) || ((isEmptyBusinesses || businessOrderIds?.length === 0) && hideOrders)

  return (
    <>
      {hideOrders && !allEmpty && (
        <h2>{t('PREVIOUSLY_ORDERED', 'Previously ordered')}</h2>
      )}
      <Container hideOrders={hideOrders} initialHeight={isFromBusinessListingSearch}>
        <Title>{t('MY_ORDERS', 'My Orders')}</Title>

        {!hideOrders && layout === 'appointments' && (
          <h1>{t('MY_APPOINTMENTS', 'My appointments')}</h1>
        )}
        {!allEmpty && !loading && (
          <CategoryListsContainer>
            <MyOrdersMenuContainer className='category-lists'>
              <Tabs className='my-orders-tabs' variant='primaryContrast'>
                {MyOrdersMenu.filter(option => (!hideOrders || option.key !== 'orders') && !option.disabled).map(option => (
                  <Tab
                    className='my-orders-tab'
                    variant='primaryContrast'
                    boldText
                    padding='13px 30px'
                    key={option.key}
                    onClick={() => setSelectedOption(option.key)}
                    active={selectedOption === option.key}
                  >
                    {option?.value}
                  </Tab>
                ))}
                {layout === 'appointments' && (
                  <Tab
                    variant='primaryContrast'
                    boldText
                    padding='13px 30px'
                    onClick={() => setSelectedOption('professionals')}
                    active={selectedOption === 'professionals'}
                  >
                    {t('PROFESSIONALS', 'Professionals')}
                  </Tab>
                )}
              </Tabs>
            </MyOrdersMenuContainer>
          </CategoryListsContainer>
        )}
        {loading && (
          <MyOrdersMenuContainer className='category-lists'>
            <Tabs className='my-orders-tabs' variant='primaryContrast'>
              <Skeleton count={2} />
            </Tabs>
          </MyOrdersMenuContainer>
        )}
        {selectedOption === 'orders' && (
          <>
            {(isEmptyActive.value && isEmptyPast.value && isEmptyPreorder.value)
              ? (
                  <NoOrdersWrapper allEmpty>
                    <p>{t('YOU_DONT_HAVE_ORDERS', 'You don\'t have any orders')}</p>
                    <Button
                      color='primary'
                      onClick={() => onRedirectPage && onRedirectPage({ page: 'search' })}
                    >
                      {t('ORDER_NOW', 'Order now')}
                    </Button>
                  </NoOrdersWrapper>
                )
              : (
              <>
                <OrdersOption
                  {...props}
                  preOrders
                  setIsEmptyPreorder={setIsEmptyPreorder}
                />
                <OrdersOption
                  {...props}
                  activeOrders
                  setIsEmptyActive={setIsEmptyActive}
                />
                {!isEmptyPast.value && (!isEmptyActive.value || !isEmptyPreorder.value) && (
                  <Divider />
                )}
                <OrdersOption
                  {...props}
                  pastOrders
                  setIsEmptyPast={setIsEmptyPast}
                  handleRedirectToCheckout={uuid => {
                    onRedirectPage && onRedirectPage({ page: 'checkout', params: { cartUuid: uuid } })
                  }}
                />
              </>
                )}
          </>
        )}
        {notOrderOptions.includes(selectedOption) && !hidePreviousOrders
          ? (<OrdersOption
              {...props}
              titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
              hideOrders
              isBusiness={selectedOption === 'business'}
              isProducts={selectedOption === 'products'}
              isProfessionals={selectedOption === 'professionals'}
              activeOrders
              pastOrders
              preOrders
              businessesSearchList={businessesSearchList}
              setIsEmptyBusinesses={setIsEmptyBusinesses}
              businessOrderIds={businessOrderIds}
              setBusinessOrderIds={setBusinessOrderIds}
              onProductRedirect={onProductRedirect}
            />)
          : selectedOption !== 'giftCards' && selectedOption !== 'orders' && (
            <NoOrdersWrapper>
              <p>{t('NOTHING_TO_SHOW', 'Nothing to show')}</p>
            </NoOrdersWrapper>
          )}
        {selectedOption === 'giftCards' && (
          <GiftCardOrdersList />
        )}
      </Container>
    </>
  )
}
