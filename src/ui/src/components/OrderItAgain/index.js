import React from 'react'

import {
  Container,
  ContentHeader,
  ProductListWrapper,
  ProductList
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { SingleProductCard } from '~ui/src/components/SingleProductCard'

export const OrderItAgain = (props) => {
  const {
    onProductClick,
    isGroceries,
    productList,
    businessId,
    isHideDescription
  } = props

  const [, t] = useLanguage()

  return (
    <Container isGroceries={isGroceries}>
      <ContentHeader isGroceries={isGroceries}>
        <h1>{t('ORDER_IT_AGAIN', 'Order it again')}</h1>
        {!isHideDescription && <p>{t('ORDER_IT_AGAIN_DESC', 'Quickly add items from your past orders.')}</p>}
      </ContentHeader>
      <ProductListWrapper>
        <ProductList>
          <AutoScroll scrollId='orderItAgain'>
            {productList.map((product, i) => (
              <SingleProductCard
                key={i}
                isSoldOut={product.inventoried && !product.quantity}
                businessId={businessId}
                product={product}
                onProductClick={onProductClick}
                isPreviously
              />
            ))}
          </AutoScroll>
        </ProductList>
      </ProductListWrapper>
    </Container>
  )
}
