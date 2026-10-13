import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Container,
  GiftCardsListContainer,
  GiftCardsWrapper,
  GiftCardItem,
  IconControl,
  ActionButtonContainer,
  CardChip
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { PurchaseGiftCard as PurchaseGiftCardController } from '~components/components/GiftCard/PurchaseGiftCard'
import { Button } from '~ui/src/styles/Buttons'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'

import { Icon } from '~ui-icon'

const PurchaseGiftCardUI = (props) => {
  const {
    productsListState,
    selectedProduct,
    setSelectedProduct,
    handleAccept,
    isPage
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  const handleProductSelection = (product) => {
    setSelectedProduct(product)
    if (isPage) {
      handleAccept(product)
    }
  }

  return (
    <Container>
      <GiftCardsListContainer>
        <p>{t('SELECT_GIFT_CARD', 'Select your gift card')}</p>
        <GiftCardsWrapper isPage={isPage}>
          {productsListState.loading && (
            [...Array(4).keys()].map(i => (
              <GiftCardItem key={i} isPage={isPage}>
                <div className='left-content'>
                  <CardChip as='div'><Skeleton width={56} height={20} /></CardChip>
                  <Skeleton width={120} height={16} />
                </div>
                <Skeleton width={90} height={36} />
              </GiftCardItem>
            ))
          )}
          {productsListState.products.map(product => (
            <GiftCardItem
              key={product.id}
              onClick={() => handleProductSelection(product)}
              isPage={isPage}
            >
              <div className='left-content'>
                {!isPage && (
                  <IconControl>
                  {selectedProduct?.id === product.id
                    ? (
                    <Icon name="radioChecked" />
                      )
                    : (
                    <Icon name="radioUnchecked" disabled />
                      )}
                  </IconControl>
                )}
                <CardChip>
                  <Icon name="gift" className='chip-icon' />
                  <span className='chip-value'>{parsePrice(product?.price)}</span>
                </CardChip>
                <p className='name'>{product?.name}</p>
              </div>
              <Button color='primary'>
                {t('PURCHASE', 'Purchase')}
              </Button>
            </GiftCardItem>
          ))}
          {!productsListState.loading && productsListState.products.length === 0 && (
            <NotFoundSource
              variant='empty'
              content={t('NO_GIFT_CARDS_AVAILABLE', 'No gift cards available right now')}
              subtitle={t('NO_GIFT_CARDS_AVAILABLE_DESC', 'Check back later for new options.')}
            />
          )}
        </GiftCardsWrapper>
      </GiftCardsListContainer>
      {!isPage && (
        <ActionButtonContainer>
          <Button
            type='button'
            color='primary'
            disabled={!selectedProduct}
            onClick={() => handleAccept()}
          >
            {t('ACCEPT', 'Accept')}
          </Button>
        </ActionButtonContainer>
      )}
    </Container>
  )
}

export const PurchaseGiftCard = (props) => {
  const purchaseGiftCardProps = {
    ...props,
    UIComponent: PurchaseGiftCardUI
  }
  return <PurchaseGiftCardController {...purchaseGiftCardProps} />
}
