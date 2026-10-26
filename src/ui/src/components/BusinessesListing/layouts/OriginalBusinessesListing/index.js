import React, { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Filters, FiltersInner, FilterItem } from '../../../BusinessListingSearch/styles'
import { resolveSearchQuery } from '../../../../../../utils/searchQueryLocation'

import {
  BusinessContainer,
  BusinessList,
  WrapperSearch,
  BusinessesTitle,
  HightestRatedWrapper,
  SearchContainer,
  BusinessLogo,
  BusinessLogosContainer,
  BusinessBanner,
  BusinessLogosWrapper,
  AddressFormWrapper,
  Title,
  TypesContainer,
  TypeButton,
  IconTypeButton,
  TypesWrapper,
  AdditionalTypesContainer,
  FiltersContainer,
  FiltersSearch,
  SearchRedirectArea,
  EmptyStateWrapper
} from './styles'

import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { BusinessList as BusinessListController } from '~components/components/BusinessList'

import { OrdersSection } from './OrdersSection'

import { useWindowSize } from '~ui/hooks/useWindowSize'
import { Button } from '~ui/src/styles/Buttons'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { Modal } from '~ui/src/components/Modal'
import { Alert } from '~ui/src/components/Confirm'
import { SearchBar } from '~ui/src/components/SearchBar'
import { getCateringValues } from '~ui/utils'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { BusinessTypes } from '~ui/src/components/BusinessTypes'
import { BusinessController } from '~ui/src/components/BusinessController'
import { BusinessesMap } from '~ui/src/components/BusinessesMap'
import { HighestRated } from '~ui/src/components/HighestRated'
import { BusinessPreorder } from '~ui/src/components/BusinessPreorder'
import { PageBanner } from '~ui/src/components/PageBanner'
import { CitiesControl } from '~ui/src/components/CitiesControl'
import { OrderContextUI } from '~ui/src/components/OrderContextUI'
import { AddressList } from '~ui/src/components/AddressList'
import { AddressForm } from '~ui/src/components/AddressForm'
import { OrderProgress } from '~ui/src/components/OrderProgress'
import { CustomOrderBanner } from '~ui/src/components/CustomOrderBanner'
import { CustomOrderModal } from '~ui/src/components/CustomOrderModal'
import { Icon } from '~ui-icon'

const PIXELS_TO_SCROLL = 300

const VisualFilters = ({ onRedirectToBusinessSearch }) => {
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()

  const filterOptionsEnabled = configs?.filter_search_options?.value?.split('|') || []

  const handleFilterClick = (filterType) => {
    onRedirectToBusinessSearch(`?openFilter=${filterType}`)
  }

  return (
    <Filters fullWidth>
      <FiltersInner>
        <AutoScroll scrollId='visualFilters'>
          {filterOptionsEnabled.includes('price_range') && (
            <FilterItem
              onClick={() => handleFilterClick('price_range')}
              isShowMap={false}
            >
              {t('PRICE', 'Price')}
            </FilterItem>
          )}
          {filterOptionsEnabled.includes('brands') && (
            <FilterItem
              onClick={() => handleFilterClick('brands')}
              isShowMap={false}
            >
              {t('BRANDS', 'Brands')}
            </FilterItem>
          )}
          {orderState?.options?.type === 1 && filterOptionsEnabled.includes('max_delivery_fee') && (
            <FilterItem
              onClick={() => handleFilterClick('max_delivery_fee')}
              isShowMap={false}
            >
              {t('DELIVERY_FEE', 'Delivery fee')}
            </FilterItem>
          )}
          {[1, 2].includes(orderState?.options?.type) && filterOptionsEnabled.includes('max_delivery_time') && (
            <FilterItem
              onClick={() => handleFilterClick('max_delivery_time')}
              isShowMap={false}
            >
              {orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
            </FilterItem>
          )}
          {filterOptionsEnabled.includes('max_distance') && (
            <FilterItem
              onClick={() => handleFilterClick('max_distance')}
              isShowMap={false}
            >
              {t('MAX_DISTANCE', 'Max distance')}
            </FilterItem>
          )}
          {filterOptionsEnabled.includes('business_categories') && (
            <FilterItem
              onClick={() => handleFilterClick('business_types')}
              isShowMap={false}
            >
              {t('CATEGORIES', 'Categories')}
            </FilterItem>
          )}
        </AutoScroll>
      </FiltersInner>
    </Filters>
  )
}

const BusinessesListingUI = (props) => {
  const {
    businessesList,
    paginationProps,
    searchValue,
    getBusinesses,
    isCustomLayout,
    isCustomerMode,
    onRedirectPage,
    handleChangeSearch,
    handleChangeBusinessType,
    handleBusinessClick,
    onBusinessClick,
    handleUpdateBusinessList,
    getCities,
    citiesState,
    logosLayout,
    actualSlug,
    orderTypes,
    businessUrlTemplate,
    businessTypeSelected,
    customLocation
  } = props
  const allOrderTypes = [1, 2, 3, 4, 5]
  const pickupTypes = [2, 3, 4, 5]
  const [, t] = useLanguage()
  const [orderState, { changeCityFilter, changeType }] = useOrder()
  const [{ auth }] = useSession()
  const [{ configs }] = useConfig()
  const windowSize = useWindowSize()
  const theme = useTheme()
  const [modals, setModals] = useState({ listOpen: false, formOpen: false, citiesOpen: false })
  const [alertState, setAlertState] = useState({ open: false, content: [] })
  const [activeMap, setActiveMap] = useState(false)
  const [mapErrors, setMapErrors] = useState('')
  const [isPreorder, setIsPreorder] = useState(false)
  const [preorderBusiness, setPreorderBusiness] = useState(null)
  const [isPickupSelected, setIsPickupSelected] = useState(pickupTypes.includes(orderState?.options?.type))
  const userCustomer = JSON.parse(window.localStorage.getItem('user-customer'))
  const [favoriteIds, setFavoriteIds] = useState([])
  const [showCustomOrder, setShowCustomOrder] = useState(false)
  const customOrderEnabled = auth && configs?.custom_order_enabled?.value === '1'
  const hasAddress = Boolean(orderState?.options?.address?.address)
  const hideCities = true
  const hideSearch = theme?.business_listing_view?.components?.search?.hidden
  const hideFilter = theme?.business_listing_view?.components?.filter?.hidden || hideSearch
  const hidePreviousOrders = theme?.business_listing_view?.components?.previous_orders_block?.hidden
  const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
  const hideSearchSection = hideCities && hideSearch && hideFilter
  const businessesIds = businessesList.businesses &&
    businessesList.businesses?.filter(Boolean).map(business => business.id)
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const configTypes = configs?.order_types_allowed?.value.split('|').filter(value => (allOrderTypes.includes(Number(value)))).map(value => Number(value)) || []
  const cateringValues = preorderBusiness?.configs && getCateringValues(cateringTypeString, preorderBusiness?.configs)
  const advancedSearchDisabled = false
  const handleScroll = useCallback(() => {
    const innerHeightScrolltop = window.innerHeight + document.documentElement?.scrollTop + PIXELS_TO_SCROLL
    const badScrollPosition = innerHeightScrolltop < document.documentElement?.offsetHeight
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)
    if (badScrollPosition || businessesList.loading || businessesList.error?.length > 0 || !hasMore) return
    getBusinesses()
  }, [businessesList, paginationProps])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleClickAddress = (e) => {
    if (auth) {
      setModals({ ...modals, listOpen: true })
    } else {
      setModals({ ...modals, formOpen: true })
    }
  }

  const toggleMap = () => {
    setActiveMap(!activeMap)
  }

  const handleCloseAlerts = () => {
    setAlertState({ open: false, content: [] })
    setMapErrors('')
  }

  const handleMapErrors = (errKey) => {
    setAlertState({
      open: true,
      content: [t(errKey, mapErrors[errKey])]
    })
  }

  useEffect(() => {
    if (mapErrors) {
      handleMapErrors(mapErrors)
      setActiveMap(false)
    }
  }, [mapErrors])

  const getCustomArray = (list) => {
    const isArray = Array.isArray(list)
    return isArray ? list : Object.values(list)
  }

  const handleClosePreorder = () => {
    setIsPreorder(false)
    setPreorderBusiness(null)
  }

  const handleOpenCities = () => {
    if (!citiesState?.cities?.length) {
      getCities()
    }
    setModals({ ...modals, citiesOpen: true })
  }

  const handleChangeCity = (cityId) => {
    changeCityFilter(cityId === orderState?.options?.city_id ? null : cityId)
  }

  const handleChangeType = async (value) => {
    if (!orderState?.loading) {
      await changeType(value)
      if (value === 1) {
        setIsPickupSelected(false)
      }
    }
  }

  const handleChangeToPickup = () => {
    const firstEnabledPickupType = orderTypes.find(type => configTypes?.includes(type.value) && type.value !== 1)?.value
    handleChangeType(firstEnabledPickupType)
    setIsPickupSelected(true)
  }

  const handleAdvancedSearchRedirect = (event) => {
    event?.preventDefault?.()
    if (advancedSearchDisabled) return
    redirectToBusinessSearch()
  }

  const redirectToBusinessSearch = (search = '') => {
    const orderLocation = orderState?.options?.address?.location
    onRedirectPage({
      page: 'business_search',
      search: resolveSearchQuery(search, orderLocation, customLocation)
    })
  }

  useEffect(() => {
    if (preorderBusiness) setIsPreorder(true)
  }, [preorderBusiness])

  useEffect(() => {
    setActiveMap(false)
    if (!businessesList?.businesses?.length) return
    if (props.franchiseId) {
      const skipRedirect = window.localStorage.getItem('change_store_redirect') === 'true'
      if (skipRedirect) {
        window.localStorage.removeItem('change_store_redirect')
        window.localStorage.removeItem('single_business')
      } else {
        const target = businessesList.businesses.find(b => b?.open) || businessesList.businesses[0]
        onBusinessClick(target)
        window.localStorage.setItem('single_business', true)
        return
      }
    }
    if (businessesList?.businesses?.length === 1 && configs?.activate_single_store_automatically?.value === '1') {
      onBusinessClick(businessesList?.businesses[0])
      window.localStorage.setItem('single_business', true)
      return
    }
    window.localStorage.removeItem('single_business')
    const ids = [...favoriteIds]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  useEffect(() => {
    if (!citiesState?.cities?.length || !orderState?.options?.city_id) return
    const selectedCity = citiesState?.cities?.find(city => city?.id === orderState?.options?.city_id)
    if (!selectedCity || !selectedCity?.enabled) changeCityFilter(null)
  }, [citiesState, orderState?.options?.city_id])

  useEffect(() => {
    if (pickupTypes.includes(orderState?.options?.type) && isCustomerMode) {
      setIsPickupSelected(true)
    }
  }, [orderState?.options?.type])

  const OrderTypesComponent = () => {
    return (
      <>
        {orderTypes && (configTypes ? orderTypes.filter(type => configTypes?.includes(type.value) && type.value !== 1) : orderTypes).map((item, i) => (
          <Button
            key={item.value}
            onClick={() => handleChangeType(item.value)}
            color={orderState?.options?.type === item?.value ? 'primary' : 'secondary'}
            disabled={orderState?.loading}
            className={orderState?.options?.type !== item?.value ? 'activated' : ''}
          >
            {item.text}
          </Button>
        ))}
      </>
    )
  }

  if (logosLayout) {
    return (
      <BusinessLogosWrapper>
        <BusinessLogosContainer>
          <AutoScroll scrollId='businessLogos'>
            {businessesList?.loading
              ? <>
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
                <Skeleton height={100} width={100} style={{ marginRight: 15 }} />
              </>
              : <>
                {businessesList.businesses
                  ?.filter(business => business?.open)
                  ?.map(business => (
                    <BusinessLogo
                      key={business?.id}
                      isActive={actualSlug === business?.slug}
                      bgimage={business?.logo || theme.images?.dummies?.businessLogo}
                      onClick={() => onBusinessClick(business)}
                    />
                  ))}
              </>}
          </AutoScroll>
        </BusinessLogosContainer>
      </BusinessLogosWrapper>
    )
  }

  return (
    <BusinessContainer>
      {windowSize.width < 576 && (
        <BusinessBanner>
          <OrderContextUI isBusinessList />
        </BusinessBanner>
      )}
      {!isCustomerMode && (
        <OrderProgress
          franchiseId={props.franchiseId}
          userCustomerId={userCustomer?.id}
          asDashboard={isCustomerMode}
          isCustomerMode={isCustomerMode}
        />
      )}
      {customOrderEnabled && !businessTypeSelected && (
        <CustomOrderBanner onCustomOrderClick={() => setShowCustomOrder(true)} maxHeight='180px' />
      )}
      <BusinessTypes
        images={props.images}
        businessTypes={props.businessTypes}
        defaultBusinessType={props.defaultBusinessType}
        handleChangeBusinessType={handleChangeBusinessType}
      />

      {!isCustomerMode && !hideSearchSection && (
        <>
          <WrapperSearch isCustomLayout={isCustomLayout} isCustomerMode={isCustomerMode} $hasMobileSearch={!hideSearch}>
            {!hideSearch && windowSize.width <= 1200 && (
              <SearchRedirectArea>
                <SearchBar
                  lazyLoad
                  search={searchValue}
                  isCustomLayout={isCustomLayout}
                  starbucksStyle
                  placeholder={t('SEARCH_TITLE', 'Search')}
                  onSearch={handleChangeSearch}
                  handleCustomEnter={!advancedSearchDisabled
                    ? handleAdvancedSearchRedirect
                    : null}
                />
              </SearchRedirectArea>
            )}
            {!hideCities && citiesState?.cities?.length > 0 && (
              <Button color='primary' onClick={handleOpenCities}>
                {citiesState?.cities?.find(city => city?.id === orderState?.options?.city_id)?.name || t('SELECT_A_CITY', 'Select a city')}
              </Button>
            )}
            {isCustomLayout && (
              <Icon name="map" onClick={toggleMap} />
            )}
          </WrapperSearch>
          {activeMap && (
            <BusinessesMap
              businessList={businessesList.businesses}
              userLocation={orderState?.options?.address?.location}
              setErrors={setMapErrors}
            />
          )}
        </>
      )}
      <FiltersContainer>
        <div className='filters-scroll'>
          <VisualFilters onRedirectToBusinessSearch={redirectToBusinessSearch} />
        </div>
        {!isCustomerMode && !hideSearch && windowSize.width > 1200 && (
          <FiltersSearch>
            <SearchRedirectArea>
              <SearchBar
                lazyLoad
                search={searchValue}
                isCustomLayout={isCustomLayout}
                starbucksStyle
                placeholder={t('SEARCH_TITLE', 'Search')}
                onSearch={handleChangeSearch}
                handleCustomEnter={!advancedSearchDisabled
                  ? handleAdvancedSearchRedirect
                  : null}
              />
            </SearchRedirectArea>
          </FiltersSearch>
        )}
      </FiltersContainer>

      {!businessTypeSelected && (
        <PageBanner
          position='web_business_listing'
          isCustomerMode={isCustomerMode}
          isHorizontal
        />
      )}
      {(userCustomer && orderState?.options?.address?.address && isCustomerMode) && (
        <>
          {(configTypes.includes(1) || configTypes.some(type => pickupTypes.includes(type))) && (
            <Title>{t('DELIVERY_TYPE', 'Delivery Type')}</Title>
          )}
          <TypesContainer>
            {configTypes.includes(1) && (
              <TypeButton onClick={() => handleChangeType(1)} disabled={orderState?.loading} activated={!isPickupSelected}>
                <IconTypeButton activated={!isPickupSelected}>
                  <img
                    src={theme?.images?.general?.deliveryIco}
                    width={20}
                    height={20}
                  />
                </IconTypeButton>
                <p>{t('DELIVERY', 'Delivery')}</p>
              </TypeButton>
            )}
            {configTypes.some(type => pickupTypes.includes(type)) && (
              <TypeButton
                disabled={orderState?.loading}
                activated={isPickupSelected}
                onClick={() => handleChangeToPickup()}
              >
                <IconTypeButton activated={isPickupSelected}>
                  <img
                    src={theme?.images?.general?.pickupIco}
                    width={22}
                    height={22}
                  />
                </IconTypeButton>
                <p>{t('PICKUP', 'Pickup')}</p>
              </TypeButton>
            )}
          </TypesContainer>
          {isPickupSelected && (
            <TypesWrapper>
              <p>{t('WHAT_PICKUP_YOU_NEED', 'What kind of pickup do you need?')}</p>
              <AdditionalTypesContainer>
                <OrderTypesComponent />
              </AdditionalTypesContainer>
            </TypesWrapper>
          )}
        </>
      )}
      {isCustomerMode && !hidePreviousOrders && !businessesList.loading && !businessTypeSelected && (
        <OrdersSection
          titleContent={t('PREVIOUS_ORDERS', 'Previous orders')}
          onRedirectPage={onRedirectPage}
          businessesIds={businessesIds}
          getCustomArray={getCustomArray}
          businessesList={businessesList}
          isCustomerMode={isCustomerMode}
          userCustomer={userCustomer}
          disableSkeletons
        />
      )}
      {!props.franchiseId && !hideHighestBusiness && !businessTypeSelected && (
        <HightestRatedWrapper>
          <HighestRated
            propsToFetch={props.propsToFetch}
            initialOrderByValue='rating'
            handleClickAddress={handleClickAddress}
            onBusinessClick={onBusinessClick}
            isCustomerMode={isCustomerMode}
            favoriteIds={favoriteIds}
            setFavoriteIds={setFavoriteIds}
            disabledCities
            businessUrlTemplate={businessUrlTemplate}
          />
        </HightestRatedWrapper>
      )}
      {!props.franchiseId && !hideHighestBusiness && !businessTypeSelected && (
        <HightestRatedWrapper>
          <HighestRated
            scrollId='featured'
            title={t('TOP_BUSINESSES', 'Top Businesses')}
            description={t('TOP_BUSINESSES_DESCRIPTION', 'Sponsored')}
            propsToFetch={props.propsToFetch}
            isFeatured
            handleClickAddress={handleClickAddress}
            onBusinessClick={onBusinessClick}
            isCustomerMode={isCustomerMode}
            favoriteIds={favoriteIds}
            setFavoriteIds={setFavoriteIds}
            disabledCities
            businessUrlTemplate={businessUrlTemplate}
          />
        </HightestRatedWrapper>
      )}
      {isCustomerMode && (
        <SearchContainer>
          {isCustomLayout && (
            <BusinessesTitle isCustomerMode={isCustomerMode}>
              {isCustomerMode ? t('SELECT_THE_BUSINESS', 'Select the business') : t('BUSINESSES', 'businesses')}
            </BusinessesTitle>
          )}
          <WrapperSearch isCustomLayout={isCustomLayout} isCustomerMode={isCustomerMode}>
            <SearchBar
              lazyLoad
              search={searchValue}
              isCustomLayout={isCustomLayout}
              placeholder={t('SEARCH_TITLE', 'Search')}
              onSearch={handleChangeSearch}
            />
            {configs?.advanced_business_search_enabled?.value === '1' && (
              <Icon name="filter" onClick={() => redirectToBusinessSearch()} />
            )}
            {isCustomLayout && (
              <Icon name="map" onClick={toggleMap} />
            )}
            {!hideCities && citiesState?.cities?.length > 0 && (
              <Button color='primary' onClick={handleOpenCities}>
                {citiesState?.cities?.find(city => city?.id === orderState?.options?.city_id)?.name || t('SELECT_A_CITY', 'Select a city')}
              </Button>
            )}
          </WrapperSearch>
        </SearchContainer>
      )}
      {isCustomerMode && activeMap && (
        <BusinessesMap
          businessList={businessesList.businesses}
          userLocation={orderState?.options?.address?.location}
          setErrors={setMapErrors}
        />
      )}
      <>
        {(!isCustomLayout && isCustomerMode && businessesList?.businesses?.length > 0) && (
          <BusinessesTitle>
            {t('BUSINESSES', 'Businesses')}
          </BusinessesTitle>
        )}
        <BusinessesTitle>
          {t('ALL_BUSINESSES', 'All Businesses')}
        </BusinessesTitle>
        <BusinessList>
          {
            !businessesList.loading && businessesList.businesses.length === 0 && businessesList?.fetched && (
              <EmptyStateWrapper data-resume-recover='businesses'>
                <NotFoundSource
                  variant='empty'
                  content={hasAddress
                    ? t('NO_BUSINESSES_AVAILABLE', 'No businesses available at this address')
                    : t('ADD_ADDRESS_TO_SEE_BUSINESSES', 'Add your address to see businesses near you')}
                  subtitle={hasAddress
                    ? t('NO_BUSINESSES_AVAILABLE_DESC', 'Try changing your address or filters.')
                    : t('ADD_ADDRESS_TO_SEE_BUSINESSES_DESC', "We'll show you the places that deliver to you.")}
                >
                  <Button
                    outline
                    color='primary'
                    onClick={() => handleClickAddress()}
                  >
                    {hasAddress
                      ? t('CHANGE_ADDRESS', 'Change address')
                      : t('ADD_ADDRESS', 'Add address')}
                  </Button>
                </NotFoundSource>
              </EmptyStateWrapper>
            )
          }
          {
            businessesList.businesses?.map((business) => (
              <BusinessController
                key={business.id}
                fromBusinessListing
                className='card'
                business={business}
                isBusinessOpen={business.open && business?.enabled !== false}
                handleCustomClick={handleBusinessClick}
                orderType={orderState?.options?.type}
                isCustomLayout={isCustomLayout}
                isCustomerMode={isCustomerMode}
                onPreorderBusiness={setPreorderBusiness}
                businessHeader={business?.header}
                businessFeatured={business?.featured}
                businessOffers={business?.offers}
                businessLogo={business?.logo}
                businessReviews={business?.reviews?.total}
                businessDeliveryPrice={business?.delivery_price}
                businessDeliveryTime={business?.delivery_time}
                businessPickupTime={business?.pickup_time}
                businessDistance={business?.distance}
                handleUpdateBusinessList={handleUpdateBusinessList}
                favoriteIds={favoriteIds}
                businessUrlTemplate={businessUrlTemplate}
                setFavoriteIds={setFavoriteIds}
              />
            ))
          }
          {(businessesList.loading || !businessesList?.fetched) && (
            [...Array(paginationProps?.nextPageItems > 4 ? paginationProps.nextPageItems : 8).keys()].map(i => (
              <BusinessController
                key={i}
                className='card'
                business={{}}
                isSkeleton
                orderType={orderState?.options?.type}
              />
            ))
          )}
        </BusinessList>
      </>
      {isPreorder && (
        <Modal
          open={isPreorder}
          width='760px'
          onClose={() => handleClosePreorder()}
        >
          <BusinessPreorder
            business={preorderBusiness}
            handleClick={handleBusinessClick}
            showButton
            cateringPreorder={!!cateringTypeString}
            {...cateringValues}
          />
        </Modal>
      )}
      {modals.citiesOpen && (
        <Modal
          open={modals.citiesOpen}
          width='70%'
          onClose={() => setModals({ ...modals, citiesOpen: false })}
          padding='0px'
          hideCloseDefault
        >
          <CitiesControl
            cities={citiesState?.cities}
            handleChangeCity={handleChangeCity}
            onClose={() => setModals({ ...modals, citiesOpen: false })}
          />
        </Modal>
      )}
      {(modals.formOpen || modals.listOpen) && (
        <Modal
          {...(!auth && { title: t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?') })}
          open={modals.formOpen || modals.listOpen}
          width='70%'
          onClose={() => setModals({ ...modals, formOpen: false, listOpen: false })}
        >
          {modals.listOpen
            ? (
              <AddressList
                isModal
                changeOrderAddressWithDefault
                userId={isNaN(userCustomer?.id) ? null : userCustomer?.id}
                onCancel={() => setModals({ ...modals, listOpen: false })}
                isCustomerMode={isCustomerMode}
              />
              )
            : (
              <AddressFormWrapper>
                <AddressForm
                  useValidationFileds
                  address={orderState?.options?.address || {}}
                  onCancel={() => setModals({ ...modals, formOpen: false })}
                  onSaveAddress={() => setModals({ ...modals, formOpen: false })}
                  isCustomerMode={isCustomerMode}
                />
              </AddressFormWrapper>
              )}
        </Modal>
      )}

      <Alert
        title={!mapErrors ? t('SEARCH', 'Search') : t('BUSINESSES_MAP', 'Businesses Map')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => handleCloseAlerts()}
        onAccept={() => handleCloseAlerts()}
        closeOnBackdrop={false}
      />
      {customOrderEnabled && (
        <CustomOrderModal
          open={showCustomOrder}
          onClose={() => setShowCustomOrder(false)}
        />
      )}
    </BusinessContainer>
  )
}

export const OriginalBusinessesListing = (props) => {
  const [, t] = useLanguage()
  const businessListingProps = {
    ...props,
    UIComponent: BusinessesListingUI,
    paginationSettings: { initialPage: 1, pageSize: 25, controlType: 'infinity' },
    orderTypes: props.orderTypes || [
      {
        value: 1,
        text: t('DELIVERY', 'Delivery'),
        description: t('ORDERTYPE_DESCRIPTION_DELIVERY', 'We bring your order to your door')
      },
      {
        value: 2,
        text: t('PICKUP', 'Pickup'),
        description: t('ORDERTYPE_DESCRIPTION_PICKUP', 'Order ahead and pick it up at the store')
      },
      {
        value: 3,
        text: t('EAT_IN', 'Eat in'),
        description: t('ORDERTYPE_DESCRIPTION_EATIN', 'Order ahead and enjoy it at the restaurant')
      },
      {
        value: 4,
        text: t('CURBSIDE', 'Curbside'),
        description: t('ORDERTYPE_DESCRIPTION_CURBSIDE', 'We bring your order out to your car')
      },
      {
        value: 5,
        text: t('DRIVE_THRU', 'Drive thru'),
        description: t('ORDERTYPE_DESCRIPTION_DRIVETHRU', 'Pick up your order without leaving your car')
      }
    ]
  }
  return <BusinessListController {...businessListingProps} />
}
