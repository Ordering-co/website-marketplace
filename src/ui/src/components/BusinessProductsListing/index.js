import React, { useState, useEffect, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import { useLocation } from 'react-router-dom'
import settings from '../../../../config'
import { StudentOnboardingPopup } from '../StudentOnboardingPopup'

import {
  ProductsContainer,
  ProductLoading,
  SkeletonItem,
  MobileCartViewWrapper,
  MobileCartActions,
  MOBILE_NAV_BOTTOM_OFFSET,
  BusinessCartContent,
  EmptyCart,
  EmptyBtnWrapper,
  Title,
  HeaderContent,
  OrderContextUIWrapper
} from './styles'

import { BusinessAndProductList } from '~components/components/BusinessAndProductList'
import { useEvent } from '~components/contexts/EventContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useSession } from '~components/contexts/SessionContext'
import { useSite } from '~components/contexts/SiteContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useBusiness } from '~components/contexts/BusinessContext'
import { parseUnaddressedOrderTypes, shouldRequireOrderAddress } from '~components/utils/orderTypeAddress'
import { useFreeDeliveryProgress } from '~components/hooks/useFreeDeliveryProgress'

import { Modal } from '~ui/src/components/Modal'
import { Button } from '~ui/src/styles/Buttons'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { useIsMounted } from '~ui/hooks/useIsMounted'
import { Alert } from '~ui/src/components/Confirm'
import { OrderContextUI } from '~ui/src/components/OrderContextUI'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { PageNotFound } from '~ui/src/components/PageNotFound'
import { Cart } from '~ui/src/components/Cart'
import { ProductForm } from '~ui/src/components/ProductForm'
import { ServiceForm } from '~ui/src/components/ServiceForm'
import { FloatingButton } from '~ui/src/components/FloatingButton'
import { UpsellingPage } from '~ui/src/components/UpsellingPage'
import { RenderProductsLayout } from '~ui/src/components/RenderProductsLayout'
import { FreeDeliveryProgress } from '~ui/src/components/FreeDeliveryProgress'

import { Icon } from '~ui-icon'

const PIXELS_TO_SCROLL = 300

const BusinessProductsListingUI = (props) => {
  const {
    errors,
    openCategories,
    isInitialRender,
    businessState,
    categorySelected,
    searchValue,
    sortByValue,
    categoryState,
    categoryId,
    productId,
    productModal,
    getNextProducts,
    handleChangeCategory,
    handleUpdateInitialRender,
    updateProductModal,
    onProductRedirect,
    handleChangeSearch,
    handleSearchRedirect,
    featuredProducts,
    handleChangeSortBy,
    isCartOnProductsList,
    errorQuantityProducts,
    multiRemoveProducts,
    setAlertState,
    alertState,
    onCheckoutRedirect,
    handleUpdateProducts,
    professionalSelected,
    handleChangeProfessionalSelected,
    onChangeMetaTag,
    onBusinessClick,
    handleChangePriceFilterValues,
    priceFilterValues,
    handleUpdateProfessionals,
    isCustomerMode,
    isCustomLayout,
    notFound,
    setNotFound,
    loadedFirstTime,
    handleAddReservation,
    handleFavoriteBusiness
  } = props

  const { business, loading, error } = businessState
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ carts, options }, { addProduct, updateProduct }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [events] = useEvent()
  const location = useLocation()
  const windowSize = useWindowSize()
  const [{ auth }] = useSession()
  const [{ site }] = useSite()
  const [, { setBusiness }] = useBusiness()
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState(props.product)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCartModal, setisCartModal] = useState(false)
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([])
  const [productLoading, setProductLoading] = useState(false)
  const mobileCartFooterRef = React.useRef(null)
  const [mobileCartFooterHeight, setMobileCartFooterHeight] = useState(0)
  const isMounted = useIsMounted()

  const websiteThemeType = theme?.my_products?.components?.website_theme?.components?.type
  const websiteThemeBusinessSlug = theme?.my_products?.components?.website_theme?.components?.business_slug
  const updatedBusinessSlug = (websiteThemeType === 'single_store' && websiteThemeBusinessSlug) || settings?.businessSlug
  const websiteThemeFranchiseSlug = theme?.my_products?.components?.website_theme?.components?.franchise_slug || websiteThemeBusinessSlug
  const effectiveFranchiseId = props.franchiseId || ((websiteThemeType === 'franchise' && websiteThemeFranchiseSlug) || settings?.franchiseSlug)
  const hideGoToBusinesses = !!updatedBusinessSlug
  const showStoreSwitcher = !!props.franchiseId && !props.useKioskApp && !isCustomerMode && !!business?.id
  const isQuickAddProduct = configs?.add_product_with_one_click?.value === '1'
  const unaddressedTypes = parseUnaddressedOrderTypes(configs?.unaddressed_order_types_allowed?.value)
  const checkoutMultiBusinessEnabled = configs?.checkout_multi_business_enabled?.value === '1'
  const currentCart = Object.values(carts).find(cart => cart?.business?.slug === business?.slug) ?? {}
  const hasBusinessError = Array.isArray(error) ? error.length > 0 : Boolean(error)
  const freeDeliveryProgress = useFreeDeliveryProgress({
    business,
    cart: currentCart,
    franchiseId: effectiveFranchiseId,
    enabled: !props.useKioskApp && !loading && !hasBusinessError
  })
  const mobileCartVisible = currentCart?.products?.length > 0 && !isCartModal
  const isLazy = businessState?.business?.lazy_load_products_recommended
  const showViewOrderButton = false
  const singleBusinessRedirect = true || window.localStorage.getItem('single_business')
  const headerThemeType = theme?.business_view?.components?.header?.components?.layout?.type
  const searchThemeType = theme?.business_view?.components?.product_search?.components?.layout?.type
  const fullWidthArrowThemes = ['starbucks', 'old', 'red']
  const cateringTypes = [7, 8]
  const cateringPreorder = cateringTypes.includes(options?.type)
  const sortByOptions = [
    { value: null, content: t('SORT_BY', theme?.defaultLanguages?.SORT_BY || 'Sort By'), showOnSelected: t('SORT_BY', theme?.defaultLanguages?.SORT_BY || 'Sort By') },
    { value: 'rank', content: t('RANK', theme?.defaultLanguages?.RANK || 'Rank'), showOnSelected: t('RANK', theme?.defaultLanguages?.RANK || 'Rank') },
    { value: 'a-z', content: t('A_to_Z', theme?.defaultLanguages?.A_to_Z || 'A-Z'), showOnSelected: t('A_to_Z', theme?.defaultLanguages?.A_to_Z || 'A-Z') }
  ]

  const subtotalWithTaxes = currentCart?.taxes?.reduce((acc, item) => {
    if (item?.type === 1) {
      return acc = acc + item?.summary?.tax
    }
    return acc
  }, currentCart?.subtotal)

  const handler = () => {
    setOpenBusinessInformation(true)
  }

  const onProductClick = async (product) => {
    if (currentCart?.status === 2) {
      openAlertErrorStatus()
      return
    }
    if (product.extras.length === 0 && !product.inventoried && auth && isQuickAddProduct) {
      if (shouldRequireOrderAddress(options?.type, options, unaddressedTypes)) {
        events.emit('require_order_address', { orderType: options?.type })
        return
      }
      setProductLoading(true)
      const isProductAddedToCart = currentCart?.products?.find(Cproduct => Cproduct.id === product.id)
      const productQuantity = isProductAddedToCart?.quantity
      const minimumPerOrder = product?.minimum_per_order || 1
      const addCurrentProduct = {
        ...product,
        quantity: minimumPerOrder
      }
      const updateCurrentProduct = {
        id: product.id,
        code: isProductAddedToCart?.code,
        quantity: productQuantity + 1
      }
      const cartData = currentCart?.business_id ? currentCart : { business_id: business.id }
      if (isProductAddedToCart) {
        await updateProduct(updateCurrentProduct, cartData, isQuickAddProduct)
      } else {
        await addProduct(addCurrentProduct, cartData, isQuickAddProduct)
      }
      setProductLoading(false)
    } else {
      const productSlug = product?.slug || product?.id
      const categorySlug = product?.category?.slug || product?.category_id
      if (!((product?.type === 'service') && business?.professionals?.length > 0)) {
        if (site?.product_url_template) {
          onProductRedirect({
            slug: business?.slug,
            product: site.product_url_template.includes('product_slug') ? productSlug : product.id,
            category: site.product_url_template.includes('category_slug') ? categorySlug : product.category_id
          })
        } else {
          onProductRedirect({
            slug: business?.slug,
            product: product.id,
            category: product.category_id
          })
        }
      }
      setCurProduct(product)
      setModalIsOpen(true)
      events.emit('product_clicked', product)
    }
  }

  const handleCustomProductBannerClick = (product) => {
    if (currentCart?.status === 2) {
      openAlertErrorStatus()
      return
    }
    const productSlug = product?.slug || product?.id
    const categorySlug = product?.category?.slug || product?.category_id
    if (!((product?.type === 'service') && business?.professionals?.length > 0)) {
      if (site?.product_url_template) {
        onProductRedirect({
          slug: business?.slug,
          product: site.product_url_template.includes('product_slug') ? productSlug : product.id,
          category: site.product_url_template.includes('category_slug') ? categorySlug : product.category_id
        })
      } else {
        onProductRedirect({
          slug: business?.slug,
          product: product.id,
          category: product.category_id
        })
      }
    }
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product) => {
    if (currentCart?.status === 2) {
      openAlertErrorStatus()
      return
    }
    if (Object.keys(product).length) {
      setModalIsOpen(false)
      onProductRedirect({
        slug: business?.slug
      })
    }
  }

  const closeModalProductForm = () => {
    setModalIsOpen(false)
    handleUpdateInitialRender(false)
    updateProductModal(null)
    setCurProduct(null)
    setNotFound(false)
    onProductRedirect({
      slug: business?.slug
    })
  }

  const handleScroll = useCallback(() => {
    const innerHeightScrolltop = window.innerHeight + document.documentElement?.scrollTop + PIXELS_TO_SCROLL
    const badScrollPosition = innerHeightScrolltop < document.documentElement?.offsetHeight
    const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
    if (badScrollPosition || categoryState.loading || !hasMore) return
    getNextProducts({ isNextPage: true })
  }, [categoryState, windowSize.width])

  const handleChangePage = (data) => {
    if (Object.entries(data.query).length === 0 && openProduct) {
      setModalIsOpen(false)
    }
  }

  const handleUpsellingPage = () => {
    onCheckoutRedirect(currentCart?.uuid)
    setOpenUpselling(false)
    setCanOpenUpselling(false)
  }

  const handleGoToBusinessList = (e) => {
    e.preventDefault()
    events.emit('go_to_page', { page: 'search' })
  }

  const adjustBusiness = async (adjustBusinessId) => {
    const _carts = carts?.[adjustBusinessId]
    const products = carts?.[adjustBusinessId]?.products || []
    const unavailableProducts = products.filter(product => product.valid !== true)
    const alreadyRemoved = sessionStorage.getItem('already-removed')
    sessionStorage.removeItem('already-removed')

    if (unavailableProducts.length > 0) {
      multiRemoveProducts && await multiRemoveProducts(unavailableProducts, _carts)
      return
    }

    if (alreadyRemoved === 'removed') {
      setAlertState({ open: true, content: [t('NOT_AVAILABLE_PRODUCT', 'This product is not available.')] })
    }
  }

  const openAlertErrorStatus = () => {
    setAlertState({ open: true, content: [t('YOU_HAVE_CART_IN_PROGRESS', 'You have a cart in progress, please complete it')] })
  }

  useEffect(() => {
    if (categoryId && productId && isInitialRender) {
      if (productModal?.product?.id) {
        setCurProduct(productModal.product)
      }
      setModalIsOpen(true)
    }
  }, [productModal, categoryId, productId, isInitialRender])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (categoryId && productId) {
      handleUpdateInitialRender(true)
    }
    events.emit('get_current_view')
  }, [])

  useEffect(() => {
    const handleClickedBannerProduct = () => {
      handleUpdateInitialRender(true)
    }
    events.on('product_banner_clicked', handleClickedBannerProduct)
    return () => {
      events.off('product_banner_clicked', handleClickedBannerProduct)
    }
  }, [])

  useEffect(() => {
    if (!categoryId && !productId) {
      setModalIsOpen(false)
    }
  }, [categoryId, productId])

  useEffect(() => {
    if (loading) return
    if (openProduct) {
      onChangeMetaTag && onChangeMetaTag(curProduct?.seo_title, curProduct?.seo_description, curProduct?.seo_keywords)
    } else {
      onChangeMetaTag && onChangeMetaTag(business?.name, business?.description, business?.name)
      updateProductModal(null)
      setCurProduct(null)
    }
  }, [openProduct, loading, business, curProduct])

  useEffect(() => {
    events.on('change_view', handleChangePage)
    return () => {
      events.off('change_view', handleChangePage)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (business?.schedule?.length) {
      window.localStorage.setItem('business_schedule', JSON.stringify(business?.schedule))
    }

    return () => {
      if (business?.schedule?.length) {
        window.localStorage.removeItem('business_schedule')
      }
    }
  }, [business?.schedule])

  useEffect(() => {
    const adjustBusinessId = sessionStorage.getItem('adjust-cart-products')
    if (currentCart && adjustBusinessId) {
      sessionStorage.removeItem('adjust-cart-products')
      adjustBusiness(adjustBusinessId)
    }
  }, [currentCart])

  useEffect(() => {
    if (cateringPreorder) {
      setBusiness(business)
    }
    return () => {
      setBusiness({})
    }
  }, [cateringPreorder, business])

  useEffect(() => {
    const footer = mobileCartFooterRef.current
    if (!mobileCartVisible || !footer) {
      setMobileCartFooterHeight(0)
      return
    }

    const measureFooter = () => setMobileCartFooterHeight(footer.getBoundingClientRect().height)
    measureFooter()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureFooter) : null
    observer?.observe(footer)
    window.addEventListener('resize', measureFooter)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measureFooter)
    }
  }, [mobileCartVisible, freeDeliveryProgress.status, freeDeliveryProgress.remainingAmount, currentCart?.total])

  // Store redirect business id for Google conversion (merchant_changed): first business page with rwg_token
  useEffect(() => {
    if (!business?.id) return
    try {
      const hasToken = sessionStorage.getItem('google_rwg_token')
      if (!hasToken) return
      const existing = sessionStorage.getItem('google_rwg_redirect_business_id')
      if (existing != null && existing !== '') return
      sessionStorage.setItem('google_rwg_redirect_business_id', String(business.id))
    } catch (e) { }
  }, [business?.id])

  return (
    <>
      {business?.vertical === 'school' && (
        <StudentOnboardingPopup business={business} />
      )}
      <ProductsContainer
        singleBusinessRedirect={singleBusinessRedirect}
        style={mobileCartVisible ? { paddingBottom: mobileCartFooterHeight + (windowSize?.width < 576 ? MOBILE_NAV_BOTTOM_OFFSET : 0) + 16 } : undefined}
      >
        {!props.useKioskApp && (
          <HeaderContent
            useFullWidth={fullWidthArrowThemes.includes(searchThemeType) || fullWidthArrowThemes.includes(headerThemeType)}
            switchFlex={windowSize?.width < 576}
          >
            {!isCustomLayout && !location.pathname.includes('/marketplace') && !singleBusinessRedirect && (
              <a id='back-arrow' href='/search' role='link'>
                <Icon name="arrowLeft" className='back-arrow' onClick={(e) => handleGoToBusinessList(e)} />
              </a>
            )}
            {windowSize?.width < 576 && (
              <OrderContextUIWrapper>
                <OrderContextUI isCheckOut />
              </OrderContextUIWrapper>
            )}
          </HeaderContent>
        )}
        <RenderProductsLayout
          errors={errors}
          isError={error}
          isLoading={loading}
          isLazy={isLazy}
          business={business}
          categoryId={categoryId}
          searchValue={searchValue}
          sortByValue={sortByValue}
          currentCart={currentCart}
          freeDeliveryProgress={freeDeliveryProgress}
          businessState={businessState}
          sortByOptions={sortByOptions}
          categoryState={categoryState}
          isCustomLayout={isCustomLayout}
          categoriesState={props.categoriesState}
          useKioskApp={props.useKioskApp}
          categorySelected={categorySelected}
          openCategories={openCategories}
          openBusinessInformation={openBusinessInformation}
          forceShowNearBusiness={props.forceShowNearBusiness}
          isCartOnProductsList={isCartOnProductsList && currentCart?.products?.length > 0}
          handleChangeSortBy={handleChangeSortBy}
          errorQuantityProducts={errorQuantityProducts}
          onClickCategory={handleChangeCategory}
          featuredProducts={featuredProducts}
          subcategoriesSelected={subcategoriesSelected}
          handler={handler}
          onProductClick={onProductClick}
          handleSearchRedirect={handleSearchRedirect}
          handleChangeSearch={handleChangeSearch}
          setOpenBusinessInformation={setOpenBusinessInformation}
          handleCartOpen={(val) => setIsCartOpen(val)}
          setSubcategoriesSelected={setSubcategoriesSelected}
          handleUpdateProducts={handleUpdateProducts}
          professionalSelected={professionalSelected}
          handleChangeProfessionalSelected={handleChangeProfessionalSelected}
          onBusinessClick={onBusinessClick}
          priceFilterValues={priceFilterValues}
          handleChangePriceFilterValues={handleChangePriceFilterValues}
          productLoading={productLoading}
          setProductLoading={setProductLoading}
          handleUpdateProfessionals={handleUpdateProfessionals}
          isCustomerMode={isCustomerMode}
          handleCustomProductBannerClick={handleCustomProductBannerClick}
          handleAddReservation={handleAddReservation}
          openAlertErrorStatus={openAlertErrorStatus}
          handleFavoriteBusiness={handleFavoriteBusiness}
          showStoreSwitcher={showStoreSwitcher}
        />

        {
          isMounted && !loading && loadedFirstTime && business && !Object.keys(business).length && (
            <div data-resume-recover='products'>
              <NotFoundSource
                variant='empty'
                content={t('NO_PRODUCTS_IN_BUSINESS', 'This business has no products to show right now')}
                subtitle={t('NO_PRODUCTS_AVAILABLE_DESC', 'This business may update its menu later.')}
                btnTitle={hideGoToBusinesses ? null : t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
                onClickButton={hideGoToBusinesses ? null : () => handleSearchRedirect()}
              />
            </div>
          )
        }

        {
          !loading && !business && location.pathname.includes('/store/') && (
            <NotFoundSource
              content={t('ERROR_NOT_FOUND_STORE', theme?.defaultLanguages?.ERROR_NOT_FOUND_STORE || 'Sorry, an error has occurred with business selected.')}
              btnTitle={hideGoToBusinesses ? null : t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
              onClickButton={hideGoToBusinesses ? null : handleSearchRedirect}
            />
          )
        }

        {
          !loading && !business && !location.pathname.includes('/store/') && (
            <PageNotFound />
          )
        }

        {error && error.length > 0 && Object.keys(business).length && (
          <NotFoundSource
            content={error[0]?.message || error[0]}
            btnTitle={hideGoToBusinesses ? null : t('SEARCH_REDIRECT', theme?.defaultLanguages?.SEARCH_REDIRECT || 'Go to Businesses')}
            onClickButton={hideGoToBusinesses ? null : handleSearchRedirect}
          />
        )}
      </ProductsContainer>
      {currentCart?.products?.length > 0 && auth && !isCartOpen && showViewOrderButton && !checkoutMultiBusinessEnabled && (
        <FloatingButton
          btnText={
            !currentCart?.valid_maximum
              ? (
                `${t('MAXIMUM_SUBTOTAL_ORDER', theme?.defaultLanguages?.MAXIMUM_SUBTOTAL_ORDER || 'Maximum subtotal order')}: ${parsePrice(currentCart?.maximum)}`
                )
              : (subtotalWithTaxes < currentCart?.minimum)
                  ? (
                  `${t('MINIMUN_SUBTOTAL_ORDER', theme?.defaultLanguages?.MINIMUN_SUBTOTAL_ORDER || 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
                    )
                  : !openUpselling !== canOpenUpselling ? t('VIEW_ORDER', theme?.defaultLanguages?.VIEW_ORDER || 'View Order') : t('LOADING', theme?.defaultLanguages?.LOADING || 'Loading')
          }
          isSecondaryBtn={!currentCart?.valid_maximum || subtotalWithTaxes < currentCart?.minimum}
          btnValue={currentCart?.products?.length}
          handleClick={() => setOpenUpselling(true)}
          disabled={openUpselling || !currentCart?.valid_maximum || subtotalWithTaxes < currentCart?.minimum}
        />
      )}
      {mobileCartVisible && (
        <MobileCartViewWrapper ref={mobileCartFooterRef}>
          {['progress', 'unlocked', 'unconfirmed'].includes(freeDeliveryProgress.status) && (
            <FreeDeliveryProgress {...freeDeliveryProgress} variant='compact' />
          )}
          <MobileCartActions>
            <span>{parsePrice(currentCart?.total)}</span>
            <Button color='primary' onClick={() => setisCartModal(true)}>{t('VIEW_CART', 'View cart')}</Button>
          </MobileCartActions>
        </MobileCartViewWrapper>
      )}
      {isCartModal && (
        <Modal
          width='45%'
          open={isCartModal}
          onClose={() => setisCartModal(false)}
          padding='0'
        >
          <BusinessCartContent isModal>
            <Title style={{ textAlign: 'center', marginTop: '5px' }}>{t('YOUR_CART', 'Your cart')}</Title>
            {currentCart?.products?.length > 0
              ? (
                <>
                  <Cart
                    isStore
                    isCustomMode
                    isForceOpenCart
                    forceHideCheckoutButton
                    showUpsellingInBusinessInfo
                    showDiscountInCart
                    cart={currentCart}
                    freeDeliveryProgress={freeDeliveryProgress}
                    isCartPending={currentCart?.status === 2}
                    isProducts={currentCart.products.length}
                    isCartOnProductsList={isCartOnProductsList}
                    handleCartOpen={(val) => setIsCartOpen(val)}
                    onClickCheckout={() => setisCartModal(false)}
                    businessConfigs={business?.configs}
                    productLoading={productLoading}
                  />
                </>
                )
              : (
                <EmptyCart>
                  <div className='empty-content'>
                    <Icon name="cart3" />
                    <p>{t('ADD_PRODUCTS_IN_YOUR_CART', 'Add products in your cart')}</p>
                  </div>
                  <EmptyBtnWrapper>
                    <span>{parsePrice(0)}</span>
                    <Button outline color='red'>{t('EMPTY_CART', 'Empty cart')}</Button>
                  </EmptyBtnWrapper>
                </EmptyCart>
                )}
          </BusinessCartContent>
        </Modal>
      )}
      {openProduct && (
        <Modal
          width={props.useKioskApp ? '80%' : '830px'}
          maxWidth='830px'
          open={openProduct}
          closeOnBackdrop
          onClose={() => closeModalProductForm()}
          padding='0'
          isProductForm
          disableOverflowX
        >

          {productModal.loading && !productModal.error && !productModal.product && (
            <ProductLoading>
              <SkeletonItem>
                <Skeleton height={45} count={props.useKioskApp ? 12 : 8} />
              </SkeletonItem>
            </ProductLoading>
          )}

          {productModal.error && productModal.error.length > 0 && (
            <NotFoundSource
              content={productModal.error[0]?.message || productModal.error[0]}
            />
          )}
          {isInitialRender && !productModal.loading && !productModal.error && !productModal.product && notFound && (
            <NotFoundSource
              content={t('ERROR_GET_PRODUCT', theme?.defaultLanguages?.ERROR_GET_PRODUCT || 'Sorry, we couldn\'t find the requested product.')}
            />
          )}
          {(productModal.product || curProduct) && (
            <>
              {(((productModal?.product?.type === 'service') || (curProduct?.type === 'service')) && business?.professionals?.length > 0)
                ? (
                  <ServiceForm
                    businessSlug={business?.slug}
                    useKioskApp={props.useKioskApp}
                    product={productModal.product || curProduct}
                    businessId={business?.id}
                    onSave={handlerProductAction}
                    professionalList={business?.professionals}
                    professionalSelected={professionalSelected}
                    handleChangeProfessional={handleChangeProfessionalSelected}
                    handleUpdateProfessionals={handleUpdateProfessionals}
                    productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === (productModal.product || curProduct)?.id ? Cproduct?.quantity : 0) }, 0) || 0}
                    setProductLoading={setProductLoading}
                  />
                  )
                : (
                  <ProductForm
                    businessSlug={business?.slug}
                    useKioskApp={props.useKioskApp}
                    product={productModal.product || curProduct}
                    businessId={business?.id}
                    business={business}
                    categoryId={curProduct?.category_id}
                    productId={curProduct?.id}
                    handleUpdateProducts={handleUpdateProducts}
                    onSave={handlerProductAction}
                    isCustomerMode={isCustomerMode}
                    productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === (productModal.product || curProduct)?.id ? Cproduct?.quantity : 0) }, 0) || 0}
                    setProductLoading={setProductLoading}
                  />
                  )}
            </>
          )}
        </Modal>
      )}
      <Alert
        title={t('ERROR', 'Error')}
        open={alertState?.open}
        content={alertState?.content || t('NOT_AVAILABLE_PRODUCTS', 'These products are not available.')}
        onClose={() => setAlertState({ open: false, content: [] })}
        onAccept={() => setAlertState({ open: false, content: [] })}
      />
      {currentCart?.products && openUpselling && (
        <UpsellingPage
          businessId={currentCart?.business_id}
          business={currentCart?.business}
          cartProducts={currentCart?.products}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}
    </>
  )
}

export const BusinessProductsListing = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(false)

  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI,
    isInitialRender,
    handleUpdateInitialRender: (val) => setIsInitialRender(val),
    isFetchAllProducts: true
  }

  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
