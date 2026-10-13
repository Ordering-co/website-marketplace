import React, { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useTheme } from 'styled-components'
import {
  Title,
  WrappLayout,
  WrapContent,
  BusinessContent,
  BusinessCategoryProductWrapper,
  BusinessCategoriesContainer,
  BusinessCartContainer,
  BusinessCartContent,
  EmptyCart,
  EmptyBtnWrapper,
  ProfessionalFilterWrapper,
  WrapperSearchAbsolute,
  NearBusiness,
  PageBannerWrapper,
  BackButton,
  WrapAllCategories,
  ProductList,
  ProductListWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useOrder } from '~components/contexts/OrderContext'
import { SpinnerCart } from '../Cart/styles'
import { SearchIconWrapper } from '../BusinessBasicInformation/styles'
import { StudentSelector } from '../StudentSelector'

import { useWindowSize } from '~ui/hooks/useWindowSize'
import { scrollTo } from '~ui/utils'
import { SpinnerLoader } from '~ui/src/components/SpinnerLoader'
import { PageBanner } from '~ui/src/components/PageBanner'
import { Modal } from '~ui/src/components/Modal'
import { Button } from '~ui/src/styles/Buttons'
import { Cart } from '~ui/src/components/Cart'
import { BusinessesListing } from '~ui/src/components/BusinessesListing'
import { ProfessionalFilter } from '~ui/src/components/ProfessionalFilter'
import { OrderItAgain } from '~ui/src/components/OrderItAgain'
import { ProfessionalBusinessFilter } from '~ui/src/components/ProfessionalBusinessFilter'
import { BusinessBasicInformation } from '~ui/src/components/BusinessBasicInformation'
import { BusinessProductsCategories } from '~ui/src/components/BusinessProductsCategories'
import { BusinessProductsList } from '~ui/src/components/BusinessProductsList'
import { SearchProducts as SearchProductsOriginal } from '~ui/src/components/SearchProducts'
import { BusinessProductsCategories as CategoriesLayoutGroceries } from '~ui/src/components/BusinessProductsCategories/layouts/groceries'
import { BusinessProductsList as ProductListLayoutGroceries } from '~ui/src/components/BusinessProductsList/layouts/groceries'
import { SingleProductCard } from '~ui/src/components/SingleProductCard'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { BusinessReviews } from '~ui/src/components/BusinessReviews'
import { CategoriesPopover } from '~ui/src/components/CategoriesPopover'
import { FreeDeliveryProgress } from '~ui/src/components/FreeDeliveryProgress'

import { Icon } from '~ui-icon'

const layoutOne = 'groceries'

export const RenderProductsLayout = (props) => {
  const {
    errors,
    isError,
    isLoading,
    business,
    categoryId,
    searchValue,
    sortByValue,
    currentCart,
    freeDeliveryProgress,
    businessState,
    sortByOptions,
    categoryState,
    categorySelected,
    openCategories,
    openBusinessInformation,
    isCartOnProductsList,
    handleChangeSortBy,
    errorQuantityProducts,
    handler,
    onClickCategory,
    featuredProducts,
    onProductClick,
    handleSearchRedirect,
    handleChangeSearch,
    setOpenBusinessInformation,
    handleCartOpen,
    isCustomLayout,
    useKioskApp,
    setSubcategoriesSelected,
    subcategoriesSelected,
    isLazy,
    handleUpdateProducts,
    handleChangeProfessionalSelected,
    professionalSelected,
    onBusinessClick,
    handleChangePriceFilterValues,
    priceFilterValues,
    handleUpdateProfessionals,
    isCustomerMode,
    handleCustomProductBannerClick,
    productLoading,
    setProductLoading,
    openAlertErrorStatus
  } = props

  const sortedCategories = useMemo(() => {
    const cats = business?.categories ? [...business.categories] : []
    if (business?.vertical === 'school') {
      const todayDow = dayjs().day()
      const upcomingDiff = (prepDay) => {
        if (prepDay === null || prepDay === undefined || prepDay === '') return null
        return (Number(prepDay) - todayDow + 7) % 7
      }
      return cats.sort((a, b) => {
        const aDiff = upcomingDiff(a?.preparation_day_of_week)
        const bDiff = upcomingDiff(b?.preparation_day_of_week)
        if (aDiff !== null && bDiff !== null) return (aDiff - bDiff) || ((a.rank || 0) - (b.rank || 0))
        if (aDiff !== null) return -1
        if (bDiff !== null) return 1
        return (a.rank || 0) - (b.rank || 0)
      })
    }
    return cats.sort((a, b) => (a.rank || 0) - (b.rank || 0))
  }, [business?.categories, business?.vertical])

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice }] = useUtils()
  const [orderState] = useOrder()
  const windowSize = useWindowSize()
  const [isCartModal, setisCartModal] = useState(false)
  const [openSearchProducts, setOpenSearchProducts] = useState(false)
  const [categoryClicked, setCategoryClicked] = useState(false)
  const isUseParentCategory = (configs?.use_parent_category?.value === 'true' || configs?.use_parent_category?.value === '1') && !useKioskApp
  const [openPopover, setOpenPopover] = useState(false)

  const frontLayout = business?.front_layout
  const businessLayout = {
    layoutOne: frontLayout === layoutOne && isUseParentCategory
  }
  const showCartOnProductList = false
  const hasProductCart = currentCart?.products?.length > 0
  const hideBusinessNearCity = theme?.business_view?.components?.near_business?.hidden ?? true
  const hidePreviousOrdered = theme?.business_view?.components?.products_ordered?.hidden
  const hideBusinessHeaderBanner = theme?.business_view?.components?.header?.hidden || (!business?.loading && !business?.header)

  const BusinessLayoutCategories = businessLayout.layoutOne
    ? CategoriesLayoutGroceries
    : BusinessProductsCategories

  const BusinessLayoutProductsList = businessLayout.layoutOne
    ? ProductListLayoutGroceries
    : BusinessProductsList

  const CategoriesPopoverUI = <CategoriesLayoutGroceries
    isPopover
    categories={[
      ...sortedCategories
    ]}
    categorySelected={categorySelected}
    onClickCategory={onClickCategory}
    featured={featuredProducts}
    openBusinessInformation={openBusinessInformation}
    openCategories={openCategories}
    business={business}
    currentCart={currentCart}
    setCategoryClicked={setCategoryClicked}
  />

  const handleTogglePopover = () => {
    setOpenPopover(!openPopover)
  }

  const handleSaveProduct = () => {
    if (windowSize.width < 993) {
      return
    }
    const productContainer = document.getElementsByClassName('bp-list')[0]
    scrollTo(productContainer, 500, 1250)
  }

  useEffect(() => {
    handleSaveProduct()
  }, [categorySelected])

  useEffect(() => {
    if (windowSize.width < 993 && categoryClicked && document.getElementsByClassName('category-title')) {
      const categoryTitle = document.getElementsByClassName('category-title')[0]
      if (categoryTitle) {
        categoryTitle.scrollIntoView({
          behavior: 'instant',
          block: 'start',
          inline: 'nearest'
        })
      }
    } else {
      const wrapperCategories = document.getElementById('wrapper-categories')
      if (wrapperCategories) {
        const extraHeight = hideBusinessHeaderBanner ? 56 : 110
        window.scrollTo({
          top: wrapperCategories.offsetTop - extraHeight,
          behavior: 'instant'
        })
      }
    }
  }, [categoryClicked])

  return (
    <>
      {!isLoading && business?.id && (
        <WrappLayout isCartOnProductsList={isCartOnProductsList}>
          {((!hideBusinessNearCity && !useKioskApp) || props.forceShowNearBusiness) && !isCustomerMode && !isCustomLayout && (
            <NearBusiness>
              <BusinessesListing
                logosLayout
                propsToFetch={['id', 'logo', 'location', 'timezone', 'schedule', 'open', 'slug']}
                cityId={businessState?.business?.city_id}
                onBusinessClick={onBusinessClick}
                actualSlug={businessState?.business?.slug}
              />
            </NearBusiness>
          )}
          <div className='bp-list'>
            {!useKioskApp && (
              <BusinessBasicInformation
                {...props}
                businessState={businessState}
                setOpenBusinessInformation={setOpenBusinessInformation}
                openBusinessInformation={openBusinessInformation}
                handleChangeSearch={handleChangeSearch}
                searchValue={searchValue}
                sortByOptions={sortByOptions}
                handleChangeSortBy={handleChangeSortBy}
                categoryState={categoryState}
                errorQuantityProducts={errorQuantityProducts}
                sortByValue={sortByValue}
                categoryClicked={categoryClicked}
                categorySelected={categorySelected}
                setCategoryClicked={setCategoryClicked}
              />
            )}
            {!useKioskApp && !hasProductCart && freeDeliveryProgress?.status === 'awareness' && (
              <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
            )}
            {businessState?.business?.vertical === 'school' && (
              <StudentSelector business={businessState?.business} />
            )}
            {!businessLayout.layoutOne && businessState?.business?.id && (
              <PageBannerWrapper>
                <PageBanner
                  title={t('OFFERS', 'Offers')}
                  position='web_business_page'
                  businessId={businessState?.business?.id}
                  isCustomerMode={isCustomerMode}
                  handleCustomProductBannerClick={handleCustomProductBannerClick}
                  business={businessState?.business}
                />
              </PageBannerWrapper>
            )}

            {!businessLayout.layoutOne && !business?.loading && business?.previously_products?.length > 0 && !hidePreviousOrdered && (
              <OrderItAgain
                onProductClick={onProductClick}
                productList={business?.previously_products}
                businessId={business?.id}
                isGroceries={businessLayout.layoutOne}
                isHideDescription
              />
            )}
            {!businessLayout.layoutOne && !business?.loading && featuredProducts && categoryState?.products?.find(product => product.featured) && (
              <WrapAllCategories id='categoryfeatured'>
                <h1>{t('FEATURED_ITEMS', 'Featured Items')}</h1>
                <ProductListWrapper>
                  <ProductList>
                    <AutoScroll scrollId='featured'>
                      {categoryState.products?.map((product, i) => product.featured && (
                        <SingleProductCard
                          key={i}
                          isSoldOut={(product.inventoried && !product.quantity)}
                          product={product}
                          useKioskApp={useKioskApp}
                          businessId={business?.id}
                          onProductClick={onProductClick}
                          isCartOnProductsList={isCartOnProductsList}
                          handleUpdateProducts={handleUpdateProducts}
                          productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                          isFeatured
                        />
                      ))}
                      {isLazy && !categoryState?.loading && categoryState?.products?.filter(product => product.featured)?.length > 9 && (
                        <SingleProductCard
                          useCustomFunctionality
                          onCustomClick={() => onClickCategory({ id: 'featured', name: t('FEATURED', 'Featured') })}
                          isCartOnProductsList={isCartOnProductsList}
                          handleUpdateProducts={handleUpdateProducts}
                          customText={t('MORE', 'More')}
                        />
                      )}
                    </AutoScroll>
                  </ProductList>
                </ProductListWrapper>
              </WrapAllCategories>
            )}

            {!businessLayout.layoutOne && business?.reviews?.reviews.length > 0 && (
              <BusinessReviews
                businessId={business?.id}
                reviews={business?.reviews?.reviews}
                businessName={business?.name}
                stars={business?.reviews?.total}
                totalReviews={business?.reviews?.total}
              />
            )}
            {!businessLayout.layoutOne && (
              <BusinessContent isCustomLayout={isCustomLayout || useKioskApp} id='wrapper-categories'>
                <BusinessCategoryProductWrapper showCartOnProductList={showCartOnProductList}>
                  {business?.professionals?.length > 0 && !useKioskApp && (
                    <>
                      <ProfessionalBusinessFilter
                        sortByOptions={sortByOptions}
                        handleChangeSortBy={handleChangeSortBy}
                        sortByValue={sortByValue}
                        handleChangeSearch={handleChangeSearch}
                        business={business}
                        handleChangePriceFilterValues={handleChangePriceFilterValues}
                        priceFilterValues={priceFilterValues}
                      />
                      <ProfessionalFilterWrapper>
                        <ProfessionalFilter
                          professionals={business?.professionals}
                          professionalSelected={professionalSelected}
                          handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                          handleUpdateProfessionals={handleUpdateProfessionals}
                          cart={currentCart}
                          openAlertErrorStatus={openAlertErrorStatus}
                        />
                      </ProfessionalFilterWrapper>
                    </>
                  )}
                  <CategoriesPopover
                    CategoriesPopoverUI={() => CategoriesPopoverUI}
                    open={openPopover}
                    onClick={() => handleTogglePopover()}
                    onClose={() => setOpenPopover(false)}
                  />
                  <div style={{ position: 'relative' }}>
                    {!(business?.categories?.length === 0 && !categoryId) && !categorySelected?.id && (
                      <BusinessLayoutCategories
                        categories={[
                          { id: -1, name: <Icon name="menuAltRight" />, isList: true },
                          { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                          /* { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') }, */
                          ...sortedCategories
                        ]}
                        categorySelected={categorySelected}
                        onClickCategory={onClickCategory}
                        handleTogglePopover={handleTogglePopover}
                        featured={featuredProducts}
                        useKioskApp={useKioskApp}
                        openBusinessInformation={openBusinessInformation}
                        business={business}
                        currentCart={currentCart}
                        wContainerStyle={useKioskApp && 'calc(100% - 50px)'}
                        isProfessional={business?.professionals?.length > 0 && !useKioskApp}
                      />
                    )}
                    {!(business?.categories?.length === 0 && !categoryId) && categorySelected?.id && (
                      <BackButton>
                        <Button
                          color='primary'
                          initialIcon
                          onClick={() => {
                            setCategoryClicked(false)
                            onClickCategory({ id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') })
                          }}
                        >
                          <Icon name="arrowLeft" />
                          <div>{t('GO_TO_ALL_CATEGORIES', 'Go to all categories')}</div>
                        </Button>
                      </BackButton>
                    )}
                    {useKioskApp && (
                      <WrapperSearchAbsolute id='WrapperSearchAbsolute'>
                        <SearchIconWrapper
                          onClick={() => setOpenSearchProducts(true)}
                        >
                          <Icon name="search" />
                        </SearchIconWrapper>
                        {openSearchProducts && (
                          <SearchProductsOriginal
                            {...props}
                            businessState={businessState}
                            setOpenBusinessInformation={setOpenBusinessInformation}
                            openBusinessInformation={openBusinessInformation}
                            handleChangeSearch={handleChangeSearch}
                            searchValue={searchValue}
                            sortByOptions={sortByOptions}
                            handleChangeSortBy={handleChangeSortBy}
                            categoryState={categoryState}
                            errorQuantityProducts={errorQuantityProducts}
                            sortByValue={sortByValue}
                            onChange={(val) => handleChangeSortBy && handleChangeSortBy(val)}
                            business={businessState.business}
                            onClose={() => {
                              handleChangeSearch('')
                              setOpenSearchProducts(false)
                            }}
                          />
                        )}
                      </WrapperSearchAbsolute>
                    )}
                  </div>
                  <WrapContent id='businessProductList' categoryClicked={categoryClicked}>
                    <BusinessLayoutProductsList
                      categories={[
                        { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                        /* { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') }, */
                        ...sortedCategories
                      ]}
                      isLazy={isLazy}
                      category={categorySelected}
                      categoryState={categoryState}
                      useKioskApp={useKioskApp}
                      businessId={business?.id}
                      errors={errors}
                      onProductClick={onProductClick}
                      handleSearchRedirect={handleSearchRedirect}
                      searchValue={searchValue}
                      isCartOnProductsList={isCartOnProductsList}
                      handleClearSearch={handleChangeSearch}
                      errorQuantityProducts={errorQuantityProducts}
                      business={business}
                      currentCart={currentCart}
                      setSubcategoriesSelected={setSubcategoriesSelected}
                      subcategoriesSelected={subcategoriesSelected}
                      onClickCategory={onClickCategory}
                      handleUpdateProducts={handleUpdateProducts}
                      professionalSelected={professionalSelected}
                      handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                    />
                  </WrapContent>
                </BusinessCategoryProductWrapper>
                {(windowSize.width >= 1000 && windowSize.height >= 600) && showCartOnProductList && (
                  <BusinessCartContainer isProfessional={business?.professionals?.length > 0 && !useKioskApp}>
                    <BusinessCartContent maxHeight={window.innerHeight - 100}>
                      {currentCart?.products?.length > 0 || (currentCart?.reservation && orderState?.options?.type === 9)
                        ? (
                          <>
                            <Title>{t('YOUR_CART', 'Your cart')}</Title>
                            <Cart
                              isStore
                              isCustomMode
                              isForceOpenCart
                              forceHideCheckoutButton
                              useKioskApp={useKioskApp}
                              cart={currentCart}
                              freeDeliveryProgress={freeDeliveryProgress}
                              isCartPending={currentCart?.status === 2}
                              isProducts={currentCart.products.length}
                              isCartOnProductsList={isCartOnProductsList}
                              handleCartOpen={handleCartOpen}
                              businessConfigs={business?.configs}
                              productLoading={productLoading}
                              setProductLoading={setProductLoading}
                              showUpsellingInBusinessInfo
                              showDiscountInCart
                            />
                          </>
                          )
                        : (
                        <EmptyCart>
                          <div className='empty-content'>
                            <Icon name="cart3" />
                            <p>{t('ADD_PRODUCTS_IN_YOUR_CART', 'Add products in your cart')}</p>
                          </div>
                          {freeDeliveryProgress?.status === 'awareness' && (
                            <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
                          )}
                          <EmptyBtnWrapper>
                            <span>{parsePrice(0)}</span>
                            <Button outline color='red'>{t('EMPTY_CART', 'Empty cart')}</Button>
                          </EmptyBtnWrapper>
                          {productLoading && (
                            <SpinnerCart emptyCart>
                              <SpinnerLoader
                                style={{ height: 100 }}
                              />
                            </SpinnerCart>
                          )}
                        </EmptyCart>
                          )}
                    </BusinessCartContent>
                  </BusinessCartContainer>
                )}
              </BusinessContent>
            )}

            {businessLayout.layoutOne && (
              <>
                {business?.professionals?.length > 0 && (
                  <ProfessionalFilterWrapper isTop>
                    <ProfessionalFilter
                      professionals={business?.professionals}
                      professionalSelected={professionalSelected}
                      handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                      handleUpdateProfessionals={handleUpdateProfessionals}
                    />
                  </ProfessionalFilterWrapper>
                )}
                <BusinessContent>
                  <BusinessCategoriesContainer offSticky>
                    {!(business?.categories?.length === 0 && !categoryId) && (
                      <>
                        {(!categoryClicked || windowSize.width >= 993) && (
                          <BusinessLayoutCategories
                            component='categories'
                            categories={[
                              { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                              { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') },
                              ...sortedCategories
                            ]}
                            categorySelected={categorySelected}
                            onClickCategory={onClickCategory}
                            featured={featuredProducts}
                            openBusinessInformation={openBusinessInformation}
                            openCategories={openCategories}
                            business={business}
                            currentCart={currentCart}
                            useKioskApp={useKioskApp}
                            setCategoryClicked={setCategoryClicked}
                          />
                        )}
                      </>
                    )}
                  </BusinessCategoriesContainer>
                  {(categoryClicked || windowSize.width >= 993) && (
                    <BusinessCategoryProductWrapper>
                      <WrapContent isGroceries id='groceries'>
                        <BusinessLayoutProductsList
                          categories={[
                            { id: null, name: t('ALL', theme?.defaultLanguages?.ALL || 'All') },
                            /* { id: 'featured', name: t('FEATURED', theme?.defaultLanguages?.FEATURED || 'Featured') }, */
                            ...sortedCategories
                          ]}
                          category={categorySelected}
                          onClickCategory={onClickCategory}
                          categoriesState={props.categoriesState}
                          categoryState={categoryState}
                          businessId={business?.id}
                          errors={errors}
                          onProductClick={onProductClick}
                          handleSearchRedirect={handleSearchRedirect}
                          searchValue={searchValue}
                          isCartOnProductsList={isCartOnProductsList && currentCart?.products?.length > 0}
                          handleClearSearch={handleChangeSearch}
                          errorQuantityProducts={errorQuantityProducts}
                          business={business}
                          currentCart={currentCart}
                          handleUpdateProducts={handleUpdateProducts}
                          professionalSelected={professionalSelected}
                          handleChangeProfessionalSelected={handleChangeProfessionalSelected}
                        />
                      </WrapContent>
                    </BusinessCategoryProductWrapper>
                  )}
                </BusinessContent>
              </>

            )}
          </div>
        </WrappLayout>
      )}

      {isLoading && !isError && (
        <>
          {!isCustomLayout && !useKioskApp && (
            <BusinessBasicInformation
              isSkeleton
              handler={handler}
              businessState={{ business: {}, loading: true }}
              openBusinessInformation={openBusinessInformation}
            />
          )}
          <BusinessContent isCustomLayout={isCustomLayout || useKioskApp} id='wrapper-categories'>
            <BusinessCategoryProductWrapper showCartOnProductList={showCartOnProductList}>
              <div style={{ position: 'relative' }}>
                <BusinessProductsCategories
                  isSkeleton
                  categories={[]}
                  openBusinessInformation={openBusinessInformation}
                  isCustomerMode={isCustomerMode}
                />
              </div>
            </BusinessCategoryProductWrapper>
          </BusinessContent>
          {(categoryClicked || windowSize.width >= 993) && (
            <WrapContent>
              <BusinessProductsList
                categories={[]}
                useKioskApp={useKioskApp}
                category={categorySelected}
                categoryState={categoryState}
                isBusinessLoading={isLoading}
                handleUpdateProducts={handleUpdateProducts}
                errorQuantityProducts={errorQuantityProducts}
              />
            </WrapContent>
          )}
        </>
      )}
      {isCartModal && (
        <Modal
          width='40%'
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
                  cart={currentCart}
                  freeDeliveryProgress={freeDeliveryProgress}
                  useKioskApp={useKioskApp}
                  isCartPending={currentCart?.status === 2}
                  isProducts={currentCart.products.length}
                  isCartOnProductsList={isCartOnProductsList}
                  handleCartOpen={handleCartOpen}
                  onClickCheckout={() => setisCartModal(false)}
                  businessConfigs={business?.configs}
                  productLoading={productLoading}
                  setProductLoading={setProductLoading}
                  showUpsellingInBusinessInfo
                  showDiscountInCart
                />
              </>
                )
              : (
              <EmptyCart>
                <div className='empty-content'>
                  <Icon name="cart3" />
                  <p>{t('ADD_PRODUCTS_IN_YOUR_CART', 'Add products in your cart')}</p>
                </div>
                {freeDeliveryProgress?.status === 'awareness' && (
                  <FreeDeliveryProgress {...freeDeliveryProgress} variant='full' />
                )}
                <EmptyBtnWrapper>
                  <span>{parsePrice(0)}</span>
                  <Button outline color='red'>{t('EMPTY_CART', 'Empty cart')}</Button>
                </EmptyBtnWrapper>
              </EmptyCart>
                )}
          </BusinessCartContent>
        </Modal>
      )}
    </>
  )
}
