import React from 'react'

import {
  Container,
  ItemListing,
  WrapperSearch
} from './styles'

import { CartStoresListing as StoresListingController } from '~components/components/CartStoresListing'
import { useOrder } from '~components/contexts/OrderContext'
import { useLanguage } from '~components/contexts/LanguageContext'

import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { BusinessController } from '~ui/src/components/BusinessController'
import { SearchBar } from '~ui/src/components/SearchBar'

const CartStoresListingUI = (props) => {
  const {
    searchValue,
    businessIdSelect,
    storesState,
    changeStoreState,
    handleChangeSearch,
    handleCartStoreChange
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const businessId = Object.values(orderState.carts).find(_cart => _cart?.uuid === props.cartuuid)?.business_id ?? {}

  return (
    <Container>
      {!storesState?.loading && !storesState?.error && storesState?.result && (
        <>
          {(!(storesState?.error || !storesState?.result?.length) || searchValue) && (
            <WrapperSearch>
              <SearchBar
                onSearch={handleChangeSearch}
                search={searchValue}
                placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
              />
            </WrapperSearch>
          )}
          <ItemListing>
            {storesState?.result.map(store => (
              <BusinessController
                key={store.id}
                isCartStore
                className='card'
                business={store}
                isSkeleton={changeStoreState.loading && businessIdSelect === store.id}
                orderType={orderState?.options?.type}
                disabledStoreBtn={(changeStoreState?.result?.business_id ?? businessId) === store.id}
                handleCartStoreClick={handleCartStoreChange}
              />
            ))}
          </ItemListing>
        </>
      )}

      {(storesState?.loading || (!storesState?.error && !storesState?.result)) && (
        <ItemListing>
          {[...Array(4).keys()].map(i => (
            <BusinessController
              key={i}
              className='card'
              business={{}}
              isSkeleton
              orderType={orderState?.options?.type}
            />
          ))}
        </ItemListing>
      )}

      {!storesState?.loading && (storesState?.error || storesState?.result?.length === 0) && (
        <NotFoundSource
          variant={storesState?.error ? 'notFound' : 'empty'}
          content={
            storesState?.error
              ? t('ERROR_NOT_FOUND_CART_STORES', 'Sorry, an error has occurred')
              : t('NO_CART_STORES_AVAILABLE', 'No stores available right now')
          }
          subtitle={storesState?.error ? null : t('NO_CART_STORES_AVAILABLE_DESC', 'Check back later or browse other businesses.')}
        />
      )}
    </Container>
  )
}

export const CartStoresListing = (props) => {
  const storeProps = {
    ...props,
    UIComponent: CartStoresListingUI
  }

  return (
    <StoresListingController {...storeProps} />
  )
}
