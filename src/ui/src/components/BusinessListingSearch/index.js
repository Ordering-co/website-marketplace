import React, { useState, useEffect, useCallback, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from 'styled-components'
import {
  BusinessListingSearchContainer,
  FiltersContainer,
  Filters,
  FiltersInner,
  FiltersResultContainer,
  SortContainer,
  BusinessList,
  SortItem,
  ProductsList,
  BusinessInfo,
  Metadata,
  BusinessInfoItem,
  SingleBusinessSearch,
  BusinessProductsListContainer,
  BusinessListWrapper,
  BusinessProductsListWrapper,
  NotFoundWrapper,
  BusinessName,
  BusinessLogo,
  BrandContainer,
  BrandListWrapper,
  BrandItem,
  NoResult,
  PriceFilterWrapper,
  PriceFilterListWrapper,
  PreviouslyOrderedContainer,
  SearchBarContainer,
  BusinessBanner,
  HightestRatedWrapper,
  FilterItem,
  ButtonContainer,
  MapWrap,
  MapWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useSession } from '~components/contexts/SessionContext'
import { BusinessSearchList } from '~components/components/BusinessSearchList'
import { useConfig } from '~components/contexts/ConfigContext'

import { SearchBar } from '~ui/src/components/SearchBar'
import { BusinessController } from '~ui/src/components/BusinessController'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { BusinessTypeFilter } from '~ui/src/components/BusinessTypeFilter'
import { MyOrders } from '~ui/src/components/MyOrders'
import { generalUtilities, removeQueryToUrl } from '~ui/utils'
import { Button } from '~ui/src/styles/Buttons'
import { SingleProductCard } from '~ui/src/components/SingleProductCard'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { Modal } from '~ui/src/components/Modal'
import { ProductForm } from '~ui/src/components/ProductForm'
import { PageBanner } from '~ui/src/components/PageBanner'
import { OrderContextUI } from '~ui/src/components/OrderContextUI'
import { HighestRated } from '~ui/src/components/HighestRated'
import { OrderProgress } from '~ui/src/components/OrderProgress'
import { Locations } from '~ui/src/components/Locations'

import { MaxSectionItem } from './MaxSectionItem'

import { Icon } from '~ui-icon'

const PIXELS_TO_SCROLL = 300

export const BusinessListingSearchUI = (props) => {
  const {
    businessesSearchList,
    onBusinessClick,
    handleChangeFilters,
    filters,
    handleChangeTermValue,
    termValue,
    paginationProps,
    handleSearchbusinessAndProducts,
    brandList,
    onRedirectPage,
    onProductRedirect,
    handleUpdateBusinessList,
    handleUpdateProducts,
    businessUrlTemplate,
    isShowMap,
    customLocation
  } = props

  const [orderState] = useOrder()
  const [, t] = useLanguage()
  const theme = useTheme()
  const [curProduct, setCurProduct] = useState({ business: null, product: null })
  const [openFilter, setOpenFilter] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [{ parsePrice, optimizeImage, parseDistance }] = useUtils()
  const [{ auth }] = useSession()
  const { width } = useWindowSize()
  const [{ configs }] = useConfig()
  const { convertHoursToMinutes } = generalUtilities()
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [mapCenter, setMapCenter] = useState(null)
  const [isTypingSearch, setIsTypingSearch] = useState(false)
  const [inputTerm, setInputTerm] = useState(termValue || '')
  const [isResettingSearch, setIsResettingSearch] = useState(false)
  const isFetchingRef = useRef(false)
  const defaultLocation = {
    lat: configs?.location_default_latitude?.value ? Number(configs?.location_default_latitude?.value) : 40.7744146,
    lng: configs?.location_default_longitude?.value ? Number(configs?.location_default_longitude?.value) : -73.9678064
  }

  const showInfoWindowOnMap = false
  const hidePreviousOrders = true
  const hideProductList = isShowMap || !(termValue?.length > 2)
  const hideBusinessListFilters = true
  const maxDeliveryFeeOptions = [1, 2, 5, 'default']
  const currency = configs.format_number_currency?.value
  const maxDistanceOptions = configs?.distance_unit?.value === 'km' ? [1000, 2000, 5000, 'default'] : [1609, 3218, 8046, 'default']
  const maxTimeOptions = [5, 15, 30, 'default']
  const sortItems = [
    { text: t('PICKED_FOR_YOU', 'Picked for you (default)'), value: 'distance' },
    { text: t('DELIVERY_TIME', 'Delivery time'), value: 'delivery_time' },
    { text: t('PICKUP_TIME', 'Pickup time'), value: 'pickup_time' }
  ]

  const priceList = [
    { level: '1', content: `${currency}` },
    { level: '2', content: `${Array(2).fill(currency).join('')}` },
    { level: '3', content: `${Array(3).fill(currency).join('')}` },
    { level: '4', content: `${Array(4).fill(currency).join('')}` },
    { level: '5', content: `${Array(5).fill(currency).join('')}` }
  ]

  const filterOptionsEnabled = configs?.filter_search_options?.value?.split('|') || []

  const isInitialSearchLoading = inputTerm.length < 3 && (businessesSearchList.loading || isResettingSearch)
  const isSearchTermLoading = inputTerm.length >= 3 && (businessesSearchList.loading || isTypingSearch)
  const showSkeleton = isInitialSearchLoading || isSearchTermLoading
  const showBusinessList = !showSkeleton && businessesSearchList.businesses?.length > 0
  const noResults = !showSkeleton && !businessesSearchList.lengthError && businessesSearchList?.businesses?.length === 0
  const currentCart = Object.values(orderState?.carts).find(cart => cart?.business?.slug === curProduct?.business?.slug) ?? {}

  const handleScroll = useCallback(() => {
    const isLargeScreen = width >= 993
    const container = (isShowMap && isLargeScreen) ? document.querySelector('.business-list-container') : window

    const innerHeightScrolltop = ((isShowMap && isLargeScreen) ? container?.clientHeight : window.innerHeight) +
      ((isShowMap && isLargeScreen) ? container?.scrollTop : document.documentElement?.scrollTop) + PIXELS_TO_SCROLL

    const badScrollPosition = innerHeightScrolltop < ((isShowMap && isLargeScreen) ? container?.scrollHeight : document.documentElement?.offsetHeight)
    const hasMore = !(paginationProps?.totalPages === paginationProps?.currentPage)

    if (badScrollPosition || businessesSearchList?.loading || isFetchingRef.current || businessesSearchList.error?.length > 0 || !hasMore) return
    handleLoadMore()
  }, [businessesSearchList.loading, paginationProps, isShowMap, width, termValue])

  useEffect(() => {
    if (!isTypingSearch && !isResettingSearch) {
      setInputTerm(termValue || '')
    }
  }, [termValue, isTypingSearch, isResettingSearch])

  useEffect(() => {
    if (!businessesSearchList.loading) {
      isFetchingRef.current = false
      setIsTypingSearch(false)
      setIsResettingSearch(false)
    }
  }, [businessesSearchList.loading])

  const handleSearchTermChange = (val) => {
    const normalizedVal = val || ''
    const hadMinSearchTerm = termValue?.length >= 3
    setInputTerm(normalizedVal)
    if (normalizedVal.length >= 3) {
      setIsResettingSearch(false)
      setIsTypingSearch(true)
    } else if (hadMinSearchTerm) {
      setIsResettingSearch(true)
      setIsTypingSearch(true)
    } else {
      setIsTypingSearch(false)
      setIsResettingSearch(false)
    }
    handleChangeTermValue(normalizedVal)
  }

  const handleLoadMore = () => {
    if (businessesSearchList?.loading || isFetchingRef.current) return
    isFetchingRef.current = true
    handleSearchbusinessAndProducts(false, {}, termValue)
  }

  const handleBusinessClick = (business) => {
    setSelectedBusiness(business)
    if (business?.location) {
      setMapCenter({
        lat: typeof business.location.lat === 'string'
          ? parseFloat(business.location.lat)
          : business.location.lat,
        lng: typeof business.location.lng === 'string'
          ? parseFloat(business.location.lng)
          : business.location.lng
      })
    }
  }

  const handleChangeBrandFilter = (brandId) => {
    let franchiseIds = [...filters?.franchise_ids]
    if (filters?.franchise_ids?.includes(brandId)) franchiseIds = filters?.franchise_ids?.filter(item => item !== brandId)
    else franchiseIds.push(brandId)
    handleChangeFilters && handleChangeFilters('franchise_ids', franchiseIds)
  }

  const handleChangePriceRange = (value) => {
    if (value === filters?.price_level) handleChangeFilters('price_level', null)
    else handleChangeFilters('price_level', value)
  }

  const onProductClick = (product, business) => {
    setCurProduct({ business, product })
  }

  const handleRedirectToCart = (product, code) => {
    setCurProduct({ business: null, product: null })
    onBusinessClick(curProduct?.business)
  }

  const closeModalProductForm = () => {
    setCurProduct({ business: null, product: null })
  }

  useEffect(() => {
    const isLargeScreen = width >= 993
    const container = (isShowMap && isLargeScreen) ? document.querySelector('.business-list-container') : window
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [handleScroll, isShowMap, width])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const openFilterParam = searchParams.get('openFilter')
    if (openFilterParam) {
      setActiveFilter(openFilterParam)
      setOpenFilter(true)
      removeQueryToUrl(['openFilter'])
    }
  }, [])

  const handleOpenFilter = (filterType) => {
    setActiveFilter(filterType)
    setOpenFilter(true)
  }

  const handleCloseFilter = () => {
    setActiveFilter(null)
    setOpenFilter(false)
  }

  const filterResetActions = {
    sort: () => handleChangeFilters('orderBy', null),
    price_range: () => handleChangeFilters('price_level', null),
    brands: () => handleChangeFilters('franchise_ids', []),
    max_delivery_fee: () => handleChangeFilters('max_delivery_price', null),
    max_delivery_time: () => handleChangeFilters('max_eta', null),
    max_distance: () => handleChangeFilters('max_distance', null),
    business_types: () => handleChangeFilters('business_types', [])
  }

  const handleResetActiveFilter = () => {
    filterResetActions[activeFilter]?.()
    handleCloseFilter()
  }

  const hasActiveFilters = useCallback(() => {
    const hasSearchTerm = termValue?.length > 2
    const hasOtherFilters = Object.keys(filters).some(key => {
      const value = filters[key]
      return value !== null &&
             value !== undefined &&
             value !== '' &&
             (Array.isArray(value) ? value.length > 0 : true) &&
             key !== 'orderBy'
    })
    return hasSearchTerm || hasOtherFilters
  }, [filters, termValue])

  const filtersComponent = (fromModal = false) => {
    return (
      <Filters fullWidth={!isShowMap} fromModal={fromModal}>
        <FiltersInner>
          <AutoScroll scrollId={`businessSearchFilters-${fromModal ? 'modal' : 'main'}`}>
        {/* {filterOptionsEnabled.includes('sort') && (
          <FilterItem
            onClick={() => handleOpenFilter('sort')}
            active={filters?.orderBy}
          >
            {t('SORT', 'Sort')}
          </FilterItem>
        )} */}
        {filterOptionsEnabled.includes('price_range') && (
          <FilterItem
            onClick={() => handleOpenFilter('price_range')}
            active={filters?.price_level}
            isShowMap={isShowMap}
          >
            {t('PRICE', 'Price')}
          </FilterItem>
        )}
        {filterOptionsEnabled.includes('brands') && (
          <FilterItem
            onClick={() => handleOpenFilter('brands')}
            active={filters?.franchise_ids?.length > 0}
            isShowMap={isShowMap}
          >
            {t('BRANDS', 'Brands')}
          </FilterItem>
        )}
        {orderState?.options?.type === 1 && filterOptionsEnabled.includes('max_delivery_fee') && (
          <FilterItem
            onClick={() => handleOpenFilter('max_delivery_fee')}
            active={filters?.max_delivery_price}
            isShowMap={isShowMap}
          >
            {t('DELIVERY_FEE', 'Delivery fee')}
          </FilterItem>
        )}
        {[1, 2].includes(orderState?.options?.type) && filterOptionsEnabled.includes('max_delivery_time') && (
          <FilterItem
            onClick={() => handleOpenFilter('max_delivery_time')}
            active={filters?.max_eta}
            isShowMap={isShowMap}
          >
            {orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
          </FilterItem>
        )}
        {filterOptionsEnabled.includes('max_distance') && (
          <FilterItem
            onClick={() => handleOpenFilter('max_distance')}
            active={filters?.max_distance}
            isShowMap={isShowMap}
          >
            {t('MAX_DISTANCE', 'Max distance')}
          </FilterItem>
        )}
        {filterOptionsEnabled.includes('business_categories') && (
          <FilterItem
            onClick={() => handleOpenFilter('business_types')}
            active={filters?.business_types?.length > 0}
            isShowMap={isShowMap}
          >
            {t('CATEGORIES', 'Categories')}
          </FilterItem>
        )}
          </AutoScroll>
        </FiltersInner>
      </Filters>
    )
  }

  return (
    <BusinessListingSearchContainer isShowMap={isShowMap}>
      {width < 576 && (
        <BusinessBanner>
          <OrderContextUI isBusinessList />
        </BusinessBanner>
      )}
      {!isShowMap && (
        <OrderProgress
          franchiseId={props.franchiseId}
        />
      )}
      {!isShowMap && (
        <SearchBarContainer>
          {filtersComponent()}
          <SearchBar
            lazyLoad
            starbucksStyle
            isCustomLayout
            forceFocus
            placeholder={t('SEARCH', 'Search')}
            onSearch={handleSearchTermChange}
            onSearchStart={(val) => {
              const normalizedVal = val || ''
              const hadMinSearchTerm = termValue?.length >= 3
              setInputTerm(normalizedVal)
              if (normalizedVal.length >= 3) {
                setIsResettingSearch(false)
                setIsTypingSearch(true)
              } else if (hadMinSearchTerm) {
                setIsResettingSearch(true)
                setIsTypingSearch(true)
              } else {
                setIsResettingSearch(false)
                setIsTypingSearch(false)
              }
            }}
            search={termValue}
          />
        </SearchBarContainer>
      )}
      {!hideBusinessListFilters && (
        <PageBanner
          position='web_business_listing'
          isHorizontal
        />
      )}
      {!props.franchiseId && !hideBusinessListFilters && !isShowMap && (
        <HightestRatedWrapper>
          <HighestRated
            propsToFetch={props.propsToFetch}
            initialOrderByValue='rating'
            onBusinessClick={onBusinessClick}
            disabledCities
            businessUrlTemplate={businessUrlTemplate}
          />
        </HightestRatedWrapper>
      )}
      {!props.franchiseId && !hideBusinessListFilters && !isShowMap && (
        <HightestRatedWrapper>
          <HighestRated
            scrollId='featured'
            title={t('TOP_BUSINESSES', 'Top Businesses')}
            description={t('TOP_BUSINESSES_DESCRIPTION', 'Sponsored')}
            propsToFetch={props.propsToFetch}
            isFeatured
            onBusinessClick={onBusinessClick}
            disabledCities
            businessUrlTemplate={businessUrlTemplate}
          />
        </HightestRatedWrapper>
      )}
      <FiltersContainer>
        <FiltersResultContainer fullWidth={!isShowMap}>
          {!isShowMap && auth && termValue?.length === 0 && !hidePreviousOrders && (
            <PreviouslyOrderedContainer>
              <MyOrders
                isFromBusinessListingSearch
                hideOrders
                businessesSearchList={businessesSearchList}
                onRedirectPage={onRedirectPage}
                onProductRedirect={onProductRedirect}
                onBusinessClick={onBusinessClick}
                businessUrlTemplate={businessUrlTemplate}
              />
            </PreviouslyOrderedContainer>
          )}
          <BusinessListWrapper
            className="business-list-container"
            fullWidth={!isShowMap || (!businessesSearchList.loading && businessesSearchList.businesses?.length === 0)}
            isShowMap={isShowMap}
            hideProductList={hideProductList}
          >
            {isShowMap && (
              <SearchBarContainer>
                {filtersComponent()}
              </SearchBarContainer>
            )}
            {showBusinessList && !isShowMap && (
              <>
                {hasActiveFilters()
                  ? (
                      <h2>{paginationProps?.totalItems ?? businessesSearchList.businesses.length} {t('RESULTS', 'Results')}</h2>
                    )
                  : (
                      <h2>{t('ALL_BUSINESS', 'All Business')}</h2>
                    )}
              </>
            )}
            <BusinessList noResults={noResults} hideProductList={hideProductList}>
              {
                noResults && (
                  <NotFoundWrapper>
                    <NotFoundSource
                      variant='empty'
                      content={t('NO_BUSINESSES_AVAILABLE', 'No businesses available at this address')}
                      subtitle={t('NO_BUSINESSES_AVAILABLE_DESC', 'Try changing your address or filters.')}
                    />
                  </NotFoundWrapper>
                )
              }
              {showBusinessList && (
                <>
                  {businessesSearchList.businesses.map((business, i) => (
                    <BusinessController
                      fromBusinessListingSearch
                      key={business.id}
                      isShowMap={isShowMap}
                      fromBusinessListing
                      className='card'
                      business={business}
                      isBusinessOpen={business.open}
                      handleCustomClick={onBusinessClick}
                      orderType={orderState?.options?.type}
                      handleUpdateBusinessList={handleUpdateBusinessList}
                      businessUrlTemplate={businessUrlTemplate}
                      hideProductList={hideProductList}
                    />
                  ))}
                  {!hideProductList && !businessesSearchList.loading && paginationProps?.totalPages && paginationProps?.currentPage < paginationProps?.totalPages && (
                    <BusinessController
                      typeButton
                    >
                      <Button
                        className='load-orders'
                        outline
                        color='primary'
                        onClick={handleLoadMore}
                      >
                        {t('LOAD_MORE_BUSINESS', 'Load more business')}
                      </Button>
                    </BusinessController>
                  )}
                </>
              )}
              {showSkeleton && (
                [...Array(3).keys()].map(i => (
                  <BusinessController
                    key={`skeleton-${i}`}
                    fromBusinessListingSearch
                    className='card'
                    business={{}}
                    isSkeleton
                    isShowMap={isShowMap}
                    orderType={orderState?.options?.type}
                    firstCard={i === 0 && width > 681}
                    hideProductList={hideProductList}
                  />
                ))
              )}
            </BusinessList>
          </BusinessListWrapper>
          {isShowMap && !businessesSearchList.loading && (
            <MapWrap>
              <MapWrapper id='map-canvas'>
                <Locations
                  businessList={businessesSearchList?.businesses || []}
                  userLocation={mapCenter || orderState?.options?.address?.location || customLocation || defaultLocation}
                  onBusinessClick={showInfoWindowOnMap ? handleBusinessClick : onBusinessClick}
                  selectedBusiness={selectedBusiness}
                  forceCenter={mapCenter !== null}
                  listenLocations
                />
              </MapWrapper>
            </MapWrap>
          )}
          {!hideProductList && (
            <ProductsList>
              {businessesSearchList.businesses?.map(business => {
                const hasProducts = business?.categories?.some(category => category?.products?.length > 0)
                return (
                <SingleBusinessSearch key={`card-${business?.id}`}>
                  <BusinessInfo>
                    {(business?.logo || theme.images?.dummies?.businessLogo) && (
                      <BusinessLogo bgimage={optimizeImage(business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
                    )}
                    <BusinessInfoItem>
                      <BusinessName>{business?.name}</BusinessName>
                      <Metadata>
                        {orderState?.options?.type === 1 && (
                          <p>
                            <span>{t('DELIVERY_FEE', 'Delivery fee')}</span>
                            {business && parsePrice(business?.delivery_price)}
                          </p>
                        )}
                        <p className='bullet'>
                          <Icon name="dot" />
                          {convertHoursToMinutes(orderState?.options?.type === 1 ? business?.delivery_time : business?.pickup_time)}
                        </p>
                        <p className='bullet'>
                          <Icon name="dot" />
                          {parseDistance(business?.distance)}
                        </p>
                      </Metadata>
                    </BusinessInfoItem>
                    <Button
                      onClick={() => onBusinessClick(business)}
                      color='green'
                    >
                      {t('GO_TO_THE_STORE', 'Go to the store')}
                    </Button>
                  </BusinessInfo>
                  {hasProducts && (
                    <BusinessProductsListWrapper>
                      <BusinessProductsListContainer>
                        <AutoScroll scrollId={`products-${business?.id}`}>
                          {business?.categories?.map(category => category?.products?.map(product => (
                            <SingleProductCard
                              key={product?.id}
                              isSoldOut={(product.inventoried && !product.quantity)}
                              product={product}
                              businessId={business?.id}
                              onProductClick={(product) => onProductClick(product, business)}
                              handleUpdateProducts={(productId, changes) => handleUpdateProducts(productId, category?.id, business?.id, changes)}
                            />
                          )))}
                        </AutoScroll>
                      </BusinessProductsListContainer>
                    </BusinessProductsListWrapper>
                  )}
                </SingleBusinessSearch>
                )
              })}
              {showSkeleton && businessesSearchList?.loading && (
                [...Array(3)].map((item, i) => (
                  <SingleBusinessSearch key={`skeleton:${i}`}>
                    <BusinessInfo>
                      <BusinessLogo isSkeleton>
                        <Skeleton />
                      </BusinessLogo>
                      <BusinessInfoItem>
                        <BusinessName>
                          <Skeleton width={50} />
                        </BusinessName>
                        <Metadata>
                          <Skeleton width={65} />
                          <Skeleton width={65} />
                          <Skeleton width={65} />
                        </Metadata>
                      </BusinessInfoItem>
                    </BusinessInfo>
                    <BusinessProductsListWrapper>
                      <BusinessProductsListContainer>
                        {[...Array(3)].map((item, j) => (
                          <SingleProductCard
                            key={`skeleton-card:${j}-${i}`}
                            isSkeleton
                          />
                        ))}
                      </BusinessProductsListContainer>
                    </BusinessProductsListWrapper>
                  </SingleBusinessSearch>
                ))
              )}
            </ProductsList>
          )}
        </FiltersResultContainer>
      </FiltersContainer>
      {!!curProduct?.product && (
        <Modal
          width={props?.useKioskApp ? '80%' : '760px'}
          open={!!curProduct?.product}
          closeOnBackdrop
          onClose={() => closeModalProductForm()}
          padding='0'
          isProductForm
          disableOverflowX
        >
          {(!!curProduct?.product) && (
            <ProductForm
              businessSlug={curProduct?.business?.slug}
              useKioskApp={props?.useKioskApp}
              product={curProduct?.product}
              businessId={curProduct?.business?.id}
              categoryId={curProduct?.product?.category_id}
              productId={curProduct?.product?.id}
              onSave={handleRedirectToCart}
              handleUpdateProducts={(productId, changes) => handleUpdateProducts(productId, curProduct?.product?.category_id, curProduct?.business?.id, changes)}
              productAddedToCartLength={currentCart?.products?.reduce((productsLength, Cproduct) => { return productsLength + (Cproduct?.id === curProduct?.product?.id ? Cproduct?.quantity : 0) }, 0) || 0}
            />
          )}
        </Modal>
      )}
      {openFilter && (
        <Modal
          open={openFilter}
          onClose={handleCloseFilter}
          title={activeFilter === 'max_delivery_time'
            ? (orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time'))
            : activeFilter === 'max_delivery_fee' ? t('DELIVERY_FEE', 'Delivery fee') : t(activeFilter?.toUpperCase(), activeFilter?.replace('_', ' '))}
          padding='30px'
          titleStyle={{ paddingLeft: '0px', marginBottom: '10px', fontWeight: '600' }}
          maxWidth='650px'
        >
          {activeFilter === 'sort' && (
            <SortContainer>
              {sortItems?.filter(item => !(orderState?.options?.type === 1 && item?.value === 'pickup_time') && !(orderState?.options?.type === 2 && item?.value === 'delivery_time'))?.map(item => (
                <SortItem
                  key={item?.value}
                  onClick={() => handleChangeFilters('orderBy', item?.value)}
                  active={filters?.orderBy?.includes(item?.value)}
                >
                  {item?.text}  {(filters?.orderBy?.includes(item?.value)) && <>{filters?.orderBy?.includes('-') ? <Icon name="arrowUp" /> : <Icon name="arrowDown" />}</>}
                </SortItem>
              ))}
            </SortContainer>
          )}
          {activeFilter === 'brands' && (
            <BrandContainer>
              <BrandListWrapper>
                {brandList?.loading && (
                  <>
                    {[...Array(5).keys()].map(index => (
                      <BrandItem key={index}>
                        <Skeleton width={120} height={15} />
                        <Skeleton width={16} height={16} />
                      </BrandItem>
                    ))}
                  </>
                )}
                {!brandList?.loading && brandList?.brands.map((brand, i) => brand?.enabled && (
                  <BrandItem key={i} onClick={() => handleChangeBrandFilter(brand?.id)} active={filters?.franchise_ids?.includes(brand?.id)}>
                    <span>{brand?.name}</span>
                    {filters?.franchise_ids?.includes(brand?.id) && <Icon name="check2" />}
                  </BrandItem>
                ))}
                {!brandList?.loading && ((brandList?.brands?.filter(brand => brand?.enabled))?.length === 0) && (
                  <NoResult>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</NoResult>
                )}
              </BrandListWrapper>
            </BrandContainer>
          )}
          {activeFilter === 'price_range' && (
            <PriceFilterWrapper>
              <PriceFilterListWrapper>
                {priceList.map((price, i) => (
                  <Button
                    key={i}
                    color={(filters?.price_level === price?.level) ? 'green' : 'darkGray'}
                    onClick={() => handleChangePriceRange(price?.level)}
                  >
                    {price.content}
                    {(filters?.price_level === price?.level) && <Icon name="closeX" />}
                  </Button>
                ))}
              </PriceFilterListWrapper>
            </PriceFilterWrapper>
          )}
          {activeFilter === 'max_delivery_fee' && (
            <MaxSectionItem
              description={t('DELIVERY_FEE_DESCRIPTION', 'Delivery fees vary of each restaurant based on your location and other factors.')}
              options={maxDeliveryFeeOptions}
              filter='max_delivery_price'
              filters={filters}
              handleChangeFilters={handleChangeFilters}
              defaultOpen
            />
          )}
          {activeFilter === 'max_delivery_time' && (
            <MaxSectionItem
              title={orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
              options={maxTimeOptions}
              filter='max_eta'
              filters={filters}
              handleChangeFilters={handleChangeFilters}
              defaultOpen
            />
          )}
          {activeFilter === 'max_distance' && (
            <MaxSectionItem
              title={t('MAX_DISTANCE', 'Max distance')}
              options={maxDistanceOptions}
              filter='max_distance'
              filters={filters}
              handleChangeFilters={handleChangeFilters}
              defaultOpen
            />
          )}
          {activeFilter === 'business_types' && (
            <BusinessTypeFilter
              isSearchMode
              filters={filters}
              handleChangeFilters={handleChangeFilters}
            />
          )}
          <ButtonContainer>
            <Button color='primary' onClick={handleCloseFilter}>
              {t('VIEW_RESULTS', 'View Results')}
            </Button>
            <p onClick={handleResetActiveFilter}>
              {t('RESET', 'Reset')}
            </p>
          </ButtonContainer>
        </Modal>
      )}
    </BusinessListingSearchContainer>
  )
}

export const BusinessListingSearch = (props) => {
  const BusinessListSearch = {
    ...props,
    UIComponent: BusinessListingSearchUI,
    paginationSettings: { initialPage: 1, pageSize: 25, controlType: 'infinity' }
  }
  return <BusinessSearchList {...BusinessListSearch} />
}
