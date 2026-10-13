import React, { useState } from 'react'
import { useTheme } from 'styled-components'

import {
  FavoritesContainer,
  Title,
  TabsContainer,
  ContentWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { FavoriteList } from '~ui/src/components/FavoriteList'
import { Tabs, Tab } from '~ui/src/styles/Tabs'

export const Favorite = (props) => {
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const theme = useTheme()
  const layout = theme?.favorite?.components?.layout?.type || 'original'

  const [tabSelected, setTabSelected] = useState('businesses')

  const tabList = [
    { key: 'businesses', name: t('BUSINESSES', 'Businesses') },
    { key: 'products', name: t('PRODUCTS', 'Products') },
    { key: 'orders', name: t('ORDERS', 'Orders') }
  ]

  return (
    <FavoritesContainer>
      <Title>{t('MY_FAVORITES', 'My Favorites')}</Title>
      <TabsContainer>
        <Tabs className='favorite-tabs' variant='primaryContrast'>
          {tabList.map((item, i) => (
            <Tab
              variant='primaryContrast'
              boldText
              padding='13px 30px'
              key={i}
              active={item.key === tabSelected}
              onClick={() => setTabSelected(item.key)}
            >
              {item?.name}
            </Tab>
          ))}
          {layout === 'appointments' && (
            <Tab
              variant='primaryContrast'
              boldText
              padding='13px 30px'
              active={tabSelected === 'professionals'}
              onClick={() => setTabSelected('professionals')}
            >
              {t('PROFESSIONALS', 'Professionals')}
            </Tab>
          )}
        </Tabs>
      </TabsContainer>
      <ContentWrapper>
        {tabSelected === 'businesses' && (
          <FavoriteList
            isBusiness
            favoriteURL='favorite_businesses'
            originalURL='business'
            location={`${orderState.options?.address?.location?.lat},${orderState.options?.address?.location?.lng}`}
            propsToFetch={['id', 'name', 'header', 'logo', 'location', 'address', 'ribbon', 'timezone', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug', 'description', 'today', 'enabled', 'disabled_reason', 'available_drivers_count', 'activated_orders']}
          />
        )}
        {tabSelected === 'products' && (
          <FavoriteList
            favoriteURL='favorite_products'
            originalURL='products'
            isProduct
          />
        )}
        {tabSelected === 'orders' && (
          <FavoriteList
            favoriteURL='favorite_orders'
            originalURL='orders'
            isOrder
          />
        )}
        {tabSelected === 'professionals' && (
          <FavoriteList
            favoriteURL='favorite_users'
            originalURL='users'
            isProfessional
          />
        )}
      </ContentWrapper>
    </FavoritesContainer>
  )
}
