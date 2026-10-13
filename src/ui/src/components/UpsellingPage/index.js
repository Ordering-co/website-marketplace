import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  Container,
  UpsellingContainer,
  Item,
  Image,
  Details,
  CloseUpselling,
  SkeletonContainer,
  HorizontalUpsellingContainer,
  HorizontalItem,
  HorizontalImage,
  HorizontalDetails,
  WrapAutoScroll,
  UpsellingPageTitleWrapper
} from './styles'

import { UpsellingPage as UpsellingPageController } from '~components/components/UpsellingPage'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'

import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '~ui/src/components/Modal'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { ProductForm } from '~ui/src/components/ProductForm'

import { Icon } from '~ui-icon'

const UpsellingPageUI = (props) => {
  const {
    upsellingProducts,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling,
    business,
    isCustomMode,
    fromCartPopover
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const theme = useTheme()

  const [actualProduct, setActualProduct] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [showUpselling, setShowUpSelling] = useState(true)

  const fromWorker = typeof window !== 'undefined' && (window.__FIRST_LOAD__ || window.__CONFIG__)
  const hideProductDummyLogo = theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden || fromWorker

  useEffect(() => {
    if (!isCustomMode) {
      if (upsellingProducts?.products?.length && !upsellingProducts.loading) {
        setCanOpenUpselling && setCanOpenUpselling(true)
      } else if (!upsellingProducts?.products?.length && !upsellingProducts.loading && !canOpenUpselling && openUpselling) {
        handleUpsellingPage()
      }
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  useEffect(() => {
    if (upsellingProducts?.products.length > 0) setShowUpSelling(true)
    else setShowUpSelling(false)
  }, [upsellingProducts?.products.length])

  const handleFormProduct = (product) => {
    setActualProduct(product)
    setModalIsOpen(true)
  }

  const handleSaveProduct = () => {
    setActualProduct(null)
    setModalIsOpen(false)
  }

  const UpsellingLayout = () => {
    return (
      <Container>
        <UpsellingContainer>
          {
            !upsellingProducts.loading
              ? (
              <>
                {
                  (!upsellingProducts.error && upsellingProducts.products?.length > 0)
                    ? upsellingProducts.products.map((product, i) => (
                    <Item key={product.id} name={product.name}>
                      <Image>
                        <img src={product.images} alt={`product-${i}`} width='150px' height='150px' loading='lazy' />
                      </Image>
                      <Details>
                        <div>
                          <h3 title={product.name}>{product.name}</h3>
                        </div>
                        <p>{parsePrice(product.price)}</p>
                        <Button color='primary' onClick={() => handleFormProduct(product)}>{t('ADD', 'Add')}</Button>
                      </Details>
                    </Item>
                    ))
                    : (
                    <div>
                      {upsellingProducts.message || t('NO_UPSELLING_PRODUCTS', 'There are no upselling products')}
                    </div>
                      )
                }
              </>
                )
              : [...Array(8)].map((item, i) => (
              <SkeletonContainer key={i}>
                <Skeleton width={150} height={250} />
              </SkeletonContainer>
                ))
          }
        </UpsellingContainer>
      </Container>
    )
  }

  return (
    <>
      {isCustomMode
        ? (
            showUpselling
              ? (
          <>
            <UpsellingPageTitleWrapper fromCartPopover={fromCartPopover}>
              {!fromCartPopover && <p>{t('UPSELLING_QUESTION', 'Do you want something else?')}</p>}
              {fromCartPopover
                ? (
                  <>
                    <p>{t('COMPLEMENT_YOUR_ORDER', 'Complement your order')}</p>
                    <span>
                      {t('COMPLEMENT_YOUR_ORDER_DESCRIPTION', 'Users often include these products in their orders.')}
                    </span>
                  </>
                  )
                : (
                <Icon name="closeMd" onClick={() => setShowUpSelling(false)} />
                  )}
            </UpsellingPageTitleWrapper>
            <WrapAutoScroll>
              <HorizontalUpsellingContainer>
                {
                  !upsellingProducts.loading
                    ? (
                    <AutoScroll scrollId='upSelling' isColumnMode={upsellingProducts.products.length === 1}>
                      {
                        (!upsellingProducts.error && upsellingProducts.products.length > 0)
                          ? upsellingProducts.products.map((product, i) => (
                          <HorizontalItem key={product.id} name={product.name} fromCartPopover={fromCartPopover}>
                            <HorizontalDetails fromCartPopover={fromCartPopover}>
                              <div>
                                <h3 title={product.name}>{product.name}</h3>
                              </div>
                              <div className='price-container'>
                                <span>{parsePrice(product.price)}</span>
                                {fromCartPopover && (
                                  <Icon name="plusSquareFill" onClick={() => handleFormProduct(product)} />
                                )}
                              </div>
                              {!fromCartPopover && <Button color='primary' onClick={() => handleFormProduct(product)}>{t('ADD', 'Add')}</Button>}
                            </HorizontalDetails>
                            {(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)) && (
                              <HorizontalImage fromCartPopover={fromCartPopover}>
                                <img src={product.images || (!hideProductDummyLogo && theme?.images?.dummies?.product)} alt={`product-${i}`} loading='lazy' />
                              </HorizontalImage>
                            )}
                          </HorizontalItem>
                          ))
                          : (
                          <div>
                            {upsellingProducts.message || t('NO_UPSELLING_PRODUCTS', 'There are no upselling products')}
                          </div>
                            )
                      }
                    </AutoScroll>
                      )
                    : [...Array(8)].map((item, i) => (
                    <SkeletonContainer key={i}>
                      <Skeleton width={250} height={100} />
                    </SkeletonContainer>
                      ))
                }
              </HorizontalUpsellingContainer>
            </WrapAutoScroll>
          </>
                )
              : null
          )
        : (
        <>
          {!(!canOpenUpselling || upsellingProducts?.products?.length === 0)
            ? openUpselling
              ? (
              <Modal
                title={t('UPSELLING_QUESTION', 'Do you want something else?')}
                open={openUpselling}
                onClose={() => handleUpsellingPage()}
                width='70%'
              >
                <UpsellingLayout />
                <CloseUpselling>
                  <Button
                    color='secondary'
                    outline
                    onClick={() => handleUpsellingPage(false)}
                  >
                    {t('NO_THANKS', 'No, Thanks')}
                  </Button>
                </CloseUpselling>
              </Modal>
                )
              : null
            : null}
        </>
          )}
      {modalIsOpen && (
        <Modal
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          maxWidth='830px'
          padding='0'
          closeOnBackdrop
          disableOverflowX
          isProductForm
        >
          {actualProduct && (
            <ProductForm
              useKioskApp={props.useKioskApp}
              product={actualProduct}
              businessId={business?.id}
              businessSlug={business.slug}
              onSave={() => handleSaveProduct()}
            />
          )}
        </Modal>
      )}
    </>
  )
}

export const UpsellingPage = (props) => {
  const UpsellingPageProps = {
    ...props,
    useSuggestiveUpselling: true,
    UIComponent: UpsellingPageUI
  }

  return <UpsellingPageController {...UpsellingPageProps} />
}
