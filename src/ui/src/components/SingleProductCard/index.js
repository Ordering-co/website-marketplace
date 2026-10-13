import React, { useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import {
  CardContainer,
  CardInfo,
  WrapLogo,
  WrapTags,
  CardLogo,
  SoldOut,
  PriceWrapper,
  QuantityContainer,
  RibbonBox,
  TitleWrapper,
  LastOrder
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useSession } from '~components/contexts/SessionContext'
import { SingleProductCard as SingleProductCardController } from '~components/components/SingleProductCard'

import { Button } from '~ui/src/styles/Buttons'
import { Alert } from '~ui/src/components/Confirm'
import { shape } from '~ui/utils'
import { useIntersectionObserver } from '~ui/hooks/useIntersectionObserver'
import { Modal } from '~ui/src/components/Modal'
import { LoginForm } from '~ui/src/components/LoginForm'
import { SignUpForm } from '~ui/src/components/SignUpForm'
import { ForgotPasswordForm } from '~ui/src/components/ForgotPasswordForm'

import { Icon } from '~ui-icon'

const singleProductCardPropsAreEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.product) === JSON.stringify(nextProps.product) &&
    prevProps.isSkeleton === nextProps.isSkeleton &&
    prevProps.isSoldOut === nextProps.isSoldOut &&
    prevProps.isCartOnProductsList === nextProps.isCartOnProductsList &&
    prevProps.productAddedToCartLength === nextProps.productAddedToCartLength
}

const SingleProductCardUI = React.memo((props) => {
  const {
    product,
    isSoldOut,
    isSkeleton,
    onProductClick,
    isCartOnProductsList,
    useCustomFunctionality,
    onCustomClick,
    customText,
    useKioskApp,
    productAddedToCartLength,
    handleFavoriteProduct,
    isFavorite,
    isPreviously,
    viewString,
    isFeatured,
    fromOrders
  } = props

  const [, t] = useLanguage()
  const [$element, isObserved] = useIntersectionObserver()
  const [stateConfig] = useConfig()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()
  const [orderState] = useOrder()
  const [{ auth }, { login }] = useSession()
  const theme = useTheme()
  const favoriteRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPageToShow, setModalPageToShow] = useState(null)
  const [alertState, setAlertState] = useState({ open: false, content: [] })

  const editMode = typeof product?.code !== 'undefined'
  const isObservedValidation = isObserved || useKioskApp

  const removeToBalance = editMode ? product?.quantity : 0

  const cartProducts = Object.values(orderState.carts).reduce((products, _cart) => [...products, ..._cart?.products], [])
  const productBalance = cartProducts.reduce((sum, _product) => sum + (_product.id === product?.id ? _product.quantity : 0), 0)

  const totalBalance = (productBalance || 0) - removeToBalance

  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance

  const hideAddButton = true
  const hideProductDescription = theme?.business_view?.components?.products?.components?.product?.components?.description?.hidden || isPreviously || fromOrders
  // Hide the placeholder product image by default. The ugly product
  // dummy should not render unless a theme explicitly opts back in by setting
  // `...dummy.hidden` to false.
  const fromWorker = typeof window !== 'undefined' && (window.__FIRST_LOAD__ || window.__CONFIG__)
  const hideProductDummyLogo = (theme?.business_view?.components?.products?.components?.product?.components?.dummy?.hidden ?? true) || fromWorker
  const hideProductLogo = viewString
    ? theme?.[viewString]?.components?.cart?.components?.products?.image?.hidden
    : theme?.business_view?.components?.products?.components?.product?.components?.image?.hidden
  const hideFavoriteIcon = theme?.business_view?.components?.products?.components?.product?.components?.favorite?.hidden

  // const productsRows = theme?.layouts?.business_view?.components?.products?.components?.layout?.rows

  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - totalBalance
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig

  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory)

  const handleClickProduct = (e) => {
    if (favoriteRef?.current?.contains(e.target)) return
    if (productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order) {
      setAlertState({
        open: true,
        content: [t('PRODUCT_ON_MAXIMUM_ORDER', 'The product is on maximum order')]
      })
      return
    }

    if (isFavorite) {
      onProductClick && onProductClick()
      return
    }
    (!isSkeleton && !useCustomFunctionality && onProductClick && onProductClick(product, product?.business?.slug)) ||
      (useCustomFunctionality && onCustomClick && onCustomClick())
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  const handleChangeFavorite = () => {
    if (auth) {
      handleFavoriteProduct && handleFavoriteProduct(!product?.favorite)
    } else {
      setModalPageToShow('login')
      setIsModalOpen(true)
    }
  }

  const closeAuthModal = () => {
    setIsModalOpen(false)
    setModalPageToShow(null)
  }

  const handleSuccessLogin = (user) => {
    if (user) {
      closeAuthModal()
    }
  }

  const handleCustomModalClick = (e, { page }) => {
    e.preventDefault()
    setModalPageToShow(page)
  }

  const handleSuccessSignup = (user) => {
    login({
      user,
      token: user?.session?.access_token
    })
  }

  return (
    <>
      <CardContainer
        ref={$element}
        soldOut={isSoldOut || maxProductQuantity <= 0}
        onClick={handleClickProduct}
        isCartOnProductsList={isCartOnProductsList}
        className='product-card'
        isShowAddButt={!useCustomFunctionality && !hideAddButton && !isSkeleton}
        useCustomFunctionality={useCustomFunctionality}
        isPreviously={isPreviously}
        isFeatured={isFeatured}
        isFavorite={isFavorite}
        fromOrders={fromOrders}
      >
        {isObservedValidation && (
          <div>
            {!useCustomFunctionality && (
              <>
                {!isSkeleton && productAddedToCartLength > 0 && (
                  <QuantityContainer isFeatured={isFeatured} isPreviously={isPreviously}>
                    <span>{productAddedToCartLength}</span>
                  </QuantityContainer>
                )}
                {(isPreviously || isFeatured) && (
                  <>
                    {!isSkeleton
                      ? (<WrapLogo
                          isFeatured={isFeatured}
                          isPreviously={isPreviously}
                          isBgimage={optimizeImage(!hideProductLogo ? product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product) : '', 'h_86,c_limit')}
                          hideImage={(!product?.images && hideProductDummyLogo) || hideProductLogo}
                        >
                          {product?.ribbon?.enabled && (
                            <RibbonBox
                              bgColor={product?.ribbon?.color}
                              isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
                              isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
                            >
                              {product?.ribbon?.text}
                            </RibbonBox>
                          )}
                          <CardLogo
                            height={isFeatured ? 240 : 227}
                            className='image'
                            soldOut={isSoldOut || maxProductQuantity <= 0}
                            bgimage={optimizeImage(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product), 'h_86,c_limit')}
                            isFeatured={isFeatured}
                            isPreviously={isPreviously}
                          />
                        </WrapLogo>)
                      : <Skeleton height={isFeatured ? 240 : 227} width={isFeatured ? 246 : 326} />}
                  </>
                )}
                <CardInfo
                  className='card-info'
                  soldOut={isSoldOut || maxProductQuantity <= 0}
                  isBgimage={optimizeImage(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product), 'h_86,c_limit')}
                  oneLine={isPreviously || isFavorite || fromOrders}
                  isPreviously={isPreviously}
                  isFeatured={isFeatured}
                  isFavorite={isFavorite}
                  fromOrders={fromOrders}
                  hideImage={(!product?.images && hideProductDummyLogo) || hideProductLogo}
                >
                  <TitleWrapper isPreviously={isPreviously} isFeatured={isFeatured} isFavorite={isFavorite} fromOrders={fromOrders}>
                    {!isSkeleton
                      ? <h1>{product?.name}</h1>
                      : <Skeleton width={100} />}
                  </TitleWrapper>
                  {isPreviously && (!isSkeleton ? (<LastOrder>{t('LAST_ORDERED_ON', 'Last ordered on')} {parseDate(product?.last_ordered_date, { outputFormat: 'MMM DD, YYYY' })}</LastOrder>) : (<Skeleton width={80} />))}
                  {!hideProductDescription && !isFeatured && !isPreviously && (
                    <>
                      {!isSkeleton ? (<p className='description'>{product?.description}</p>) : (<Skeleton width={100} />)}
                    </>
                  )}
                  {!isSkeleton
                    ? (
                      <div className='product-card-info'>
                        <PriceWrapper isOffPrice={product?.offer_price && product?.in_offer} isFavorite={isFavorite} fromOrders={fromOrders}>
                          <span className='current-price'>{product?.price ? parsePrice(product?.price) : ''}</span>
                          {!(isSoldOut || maxProductQuantity <= 0) && (
                            <span className='off-price'>{product?.offer_price && product?.in_offer ? parsePrice(product?.offer_price) : ''}</span>
                          )}
                          {!isFeatured && !isPreviously && !fromOrders && product?.tags && product?.tags.length > 0 && (
                            <WrapTags>
                              {product?.tags.map((tag, i) => (
                                <div key={i}>
                                  <img src={tag.image ?? ''}></img>
                                </div>
                              ))}
                            </WrapTags>
                          )}
                          {(isFavorite && !useKioskApp && !hideFavoriteIcon && !isPreviously && !isFeatured) && (
                            !isSkeleton
                              ? (
                              <span className='favorite-icon' onClick={() => handleChangeFavorite()} ref={favoriteRef}>
                                {product?.favorite ? <Icon name="heartFilled" /> : <Icon name="heartOutline" />}
                              </span>
                                )
                              : (<Skeleton width={16} height={16} />)
                          )}
                        </PriceWrapper>
                        {(!useKioskApp && !isPreviously && !isFeatured) && (
                          !isSkeleton
                            ? (
                              <>
                                {!isFavorite && !fromOrders
                                  ? (
                                    <>
                                      {!hideFavoriteIcon && (
                                        <span className='favorite-icon' onClick={() => handleChangeFavorite()} ref={favoriteRef}>
                                          {product?.favorite ? <Icon name="heartFilled" /> : <Icon name="heartOutline" />}
                                        </span>
                                      )}
                                    </>
                                    )
                                  : (
                                    <Button className='order-button' color='lightGray'>
                                      {t('ORDER', 'Order')}
                                    </Button>
                                    )}
                              </>
                              )
                            : (<Skeleton width={16} height={16} />)
                        )}
                      </div>
                      )
                    : <Skeleton width={100} />}
                </CardInfo>
                {(!isPreviously && !isFeatured) && (
                  <>
                    {!isSkeleton
                      ? (<WrapLogo
                          isBgimage={optimizeImage(!hideProductLogo ? product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product) : '', 'h_86,c_limit')}
                          isFavorite={isFavorite}
                          fromOrders={fromOrders}
                          hideImage={(!product?.images && hideProductDummyLogo) || hideProductLogo}
                        >
                          {product?.ribbon?.enabled && (
                            <RibbonBox
                              bgColor={product?.ribbon?.color}
                              isRoundRect={product?.ribbon?.shape === shape?.rectangleRound}
                              isCapsule={product?.ribbon?.shape === shape?.capsuleShape}
                            >
                              {product?.ribbon?.text}
                            </RibbonBox>
                          )}
                          <CardLogo
                            className='image'
                            soldOut={isSoldOut || maxProductQuantity <= 0}
                            bgimage={optimizeImage(product?.images || (!hideProductDummyLogo && theme?.images?.dummies?.product), 'h_86,c_limit')}
                          />
                        </WrapLogo>)
                      : <Skeleton height={75} width={75} />}
                  </>
                )}
                {(isSoldOut || maxProductQuantity <= 0) && (
                  <SoldOut isBottom={product?.ribbon?.enabled}>{t('SOLD_OUT', 'Sold out')}</SoldOut>
                )}
              </>
            )}
            {useCustomFunctionality && customText && (
              <span style={{ fontSize: 16, fontWeight: 500 }}>{customText}</span>
            )}
          </div>
        )}
        {!useCustomFunctionality && !hideAddButton && !isSkeleton && (
          <Button outline color='primary' disabled={productAddedToCartLength && product?.maximum_per_order && productAddedToCartLength >= product?.maximum_per_order}>
            {t('ADD', 'Add')}
          </Button>
        )}
      </CardContainer>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onRemove={() => closeAuthModal()}
          onClose={() => closeAuthModal()}
          width='50%'
          authModal
        >
          {modalPageToShow === 'login' && (
            <LoginForm
              handleSuccessLogin={handleSuccessLogin}
              elementLinkToSignup={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'signup' })
                  } href='#'
                >{t('CREATE_ACCOUNT', theme?.defaultLanguages?.CREATE_ACCOUNT || 'Create account')}
                </a>
              }
              elementLinkToForgotPassword={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'forgotpassword' })
                  } href='#'
                >{t('RESET_PASSWORD', theme?.defaultLanguages?.RESET_PASSWORD || 'Reset Password')}
                </a>
              }
              useLoginByCellphone
              isPopup
            />
          )}
          {modalPageToShow === 'signup' && (
            <SignUpForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              useLoginByCellphone
              useChekoutFileds
              handleSuccessSignup={handleSuccessSignup}
              isPopup
              closeModal={() => closeAuthModal()}
            />
          )}
          {modalPageToShow === 'forgotpassword' && (
            <ForgotPasswordForm
              elementLinkToLogin={
                <a
                  onClick={
                    (e) => handleCustomModalClick(e, { page: 'login' })
                  } href='#'
                >{t('LOGIN', theme?.defaultLanguages?.LOGIN || 'Login')}
                </a>
              }
              isPopup
            />
          )}
        </Modal>
      )}
      <Alert
        title={t('PRODUCT', 'Product')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </>
  )
}, singleProductCardPropsAreEqual)

export const SingleProductCard = (props) => {
  const singleProductCardProps = {
    ...props,
    UIComponent: SingleProductCardUI
  }
  return <SingleProductCardController {...singleProductCardProps} />
}
