import React, { useState, useEffect, useCallback } from 'react'
import {
  BusinessListContainer,
  WrapperSearch,
  FilterWrapper,
  TypeFilterWrapper,
  PriceFilterWrapper,
  PriceFilterListWrapper,
  PreorderAndBusinessWrapper,
  PreorderWrapper,
  PreorderContent,
  AddressWrapper,
  AddressHeader,
  AddressContent,
  OrderTypeWrapper,
  MomentWrapper,
  SelectWrapper,
  BusinessList,
  EmptyStateWrapper,
  ErrorMessage,
  BusinessListWrapper,
  HightestRatedWrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { useSession } from '~components/contexts/SessionContext'
import { useConfig } from '~components/contexts/ConfigContext'
import { getMaxPreorderDays } from '~components/utils/configHelpers'
import { BusinessList as BusinessListController } from '~components/components/BusinessList'

import { MomentControl } from '~ui/src/components/MomentControl'
import { HighestRated } from '~ui/src/components/HighestRated'
import { SearchBar } from '~ui/src/components/SearchBar'
import { BusinessPreorder } from '~ui/src/components/BusinessPreorder'
import { BusinessTypeFilter } from '~ui/src/components/BusinessTypeFilter'
import { priceList } from '~ui/utils'
import { Button } from '~ui/src/styles/Buttons'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { Modal } from '~ui/src/components/Modal'
import { AddressList } from '~ui/src/components/AddressList'
import { AddressForm } from '~ui/src/components/AddressForm'
import { BusinessController } from '~ui/src/components/BusinessController'
import { OrderTypeSelectorHeader } from '~ui/src/components/OrderTypeSelectorHeader'
import { Icon } from '~ui-icon'

const PIXELS_TO_SCROLL = 300

const BusinessListingUI = (props) => {
  const {
    handleChangeBusinessType,
    priceLevelSelected,
    handleChangePriceLevel,
    businessesList,
    paginationProps,
    searchValue,
    getBusinesses,
    isCustomLayout,
    isCustomerMode,
    onBusinessClick,
    handleChangeSearch,
    handleBusinessClick,
    businessTypeSelected,
    handleUpdateBusinessList,
    onRedirectPage
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ auth }] = useSession()
  const [configState] = useConfig()

  const configTypes = configState?.configs?.order_types_allowed?.value.split('|').map(value => Number(value)) || []

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState([])
  const [isPreorder, setIsPreorder] = useState(false)
  const [preorderBusiness, setPreorderBusiness] = useState(null)
  const [hasHighRatedBusiness, setHasHighRatedBusiness] = useState(true)
  const hasAddress = Boolean(orderState?.options?.address?.address)

  const limitDays = getMaxPreorderDays(configState?.configs, orderState?.options?.type)

  const currentDate = new Date()
  const time = limitDays > 1
    ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
    : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)

  const handleClickAddress = () => {
    setModalIsOpen(true)
  }

  const handleClosePreorder = () => {
    setIsPreorder(false)
    setPreorderBusiness(null)
  }

  useEffect(() => {
    if (preorderBusiness) setIsPreorder(true)
  }, [preorderBusiness])

  const handleScroll = useCallback(() => {
    const innerHeightScrolltop = window.innerHeight + document.documentElement?.scrollTop + PIXELS_TO_SCROLL
    const badScrollPosition = innerHeightScrolltop < document.documentElement?.offsetHeight
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)
    if (badScrollPosition || businessesList.loading || businessesList.error?.length > 0 || !hasMore) return
    getBusinesses()
  }, [businessesList.loading, paginationProps])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!businessesList?.businesses?.length) return
    const ids = [...favoriteIds]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  return (
    <>
      <BusinessListContainer>
        <h1>{t('SELECT_BUSINESS', 'Select a business')}</h1>
        <WrapperSearch>
          <SearchBar
            lazyLoad
            search={searchValue}
            onSearch={handleChangeSearch}
            placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
            handleCustomEnter={term => configState?.configs?.advanced_business_search_enabled?.value === '1' && onRedirectPage({ page: 'business_search' })}
          />
          {configState?.configs?.advanced_business_search_enabled?.value === '1' && (
            <Icon name="filter" onClick={() => onRedirectPage({ page: 'business_search' })} />
          )}
        </WrapperSearch>
        <FilterWrapper>
          <TypeFilterWrapper>
            <h3>{t('POPULAR_SERVICES', 'Popular services')}</h3>
            <BusinessTypeFilter
              businessTypes={props.businessTypes}
              defaultBusinessType={props.defaultBusinessType}
              handleChangeBusinessType={handleChangeBusinessType}
              isAppoint
            />
          </TypeFilterWrapper>
          <PriceFilterWrapper>
            <h3>{t('PRICE', 'Price')}</h3>
            <PriceFilterListWrapper>
              {priceList.map((price, i) => (
                <Button
                  key={i}
                  color={(priceLevelSelected === price?.level) ? 'primary' : 'lightGray'}
                  onClick={() => handleChangePriceLevel(price?.level)}
                >
                  {price.content}
                  {(priceLevelSelected === price?.level) && <Icon name="closeX" />}
                </Button>
              ))}
            </PriceFilterListWrapper>
          </PriceFilterWrapper>
        </FilterWrapper>
        <PreorderAndBusinessWrapper>
          <PreorderWrapper>
            <PreorderContent>
              <h2>{t('AVAILABLE_APPOINTMENTS', 'Available appointments')}</h2>
              <AddressWrapper>
                <AddressHeader>
                  <h2>{t('ADDRESS', 'Address')}</h2>
                  <span onClick={() => setModalIsOpen(true)}>{t('CHANGE', 'Change')}</span>
                </AddressHeader>
                <AddressContent>
                  <Icon name="house" />
                  <span>{orderState.options?.address?.address}</span>
                </AddressContent>
              </AddressWrapper>
              <MomentWrapper>
                <MomentControl
                  isAppoint
                  maxDate={currentDate}
                />
              </MomentWrapper>
              <OrderTypeWrapper>
                <h2>{t('SERVICE_TYPE', 'Service type')}</h2>
                <SelectWrapper>
                  <OrderTypeSelectorHeader
                    configTypes={!configState?.loading && configTypes?.length > 0 ? configTypes : null}
                    defaultValue={!(!configState?.loading && configTypes?.length > 0) && 1}
                  />
                </SelectWrapper>
              </OrderTypeWrapper>
            </PreorderContent>
          </PreorderWrapper>
          <BusinessListWrapper>
            {businessesList.businesses.length > 0 && !props.franchiseId && (
              <HightestRatedWrapper noHeight={!hasHighRatedBusiness}>
                <HighestRated
                  handleClickAddress={handleClickAddress}
                  setHasHighRatedBusiness={setHasHighRatedBusiness}
                  onBusinessClick={onBusinessClick}
                  isCustomerMode={isCustomerMode}
                  favoriteIds={favoriteIds}
                  initialBuisnessType={businessTypeSelected}
                  initialPricelevel={priceLevelSelected}
                  setFavoriteIds={setFavoriteIds}
                />
              </HightestRatedWrapper>
            )}
            <h2>{t('ALL_BUSINESSES', 'All Businesses')}</h2>
            <BusinessList>
              {
                !businessesList.loading && businessesList.businesses.length === 0 && (
                  <EmptyStateWrapper>
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
                    className='card'
                    business={business}
                    isBusinessOpen={business.open}
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
                    setFavoriteIds={setFavoriteIds}
                  />
                ))
              }
              {businessesList.loading && (
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
              {businessesList.error && businessesList.error.length > 0 && businessesList.businesses.length === 0 && (
                businessesList.error.map((e, i) => (
                  <ErrorMessage key={i}>{t('ERROR', 'ERROR')}: [{e?.message || e}]</ErrorMessage>
                ))
              )}
            </BusinessList>
          </BusinessListWrapper>

        </PreorderAndBusinessWrapper>
      </BusinessListContainer>
      {modalIsOpen && (
        <Modal
          width='768px'
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
        >
          {
            auth
              ? (
                <AddressList
                  isModal
                  changeOrderAddressWithDefault
                  // userId={isNaN(userCustomer?.id) ? null : userCustomer?.id}
                  onCancel={() => setModalIsOpen(false)}
                />
                )
              : (
                  <AddressForm
                    useValidationFileds
                    address={orderState?.options?.address || {}}
                    onCancel={() => setModalIsOpen(false)}
                    onSaveAddress={() => setModalIsOpen(false)}
                  />
                )
          }
        </Modal>
      )}
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
          />
        </Modal>
      )}
    </>
  )
}

export const AppointmentsBusinessListing = (props) => {
  const businessListingProps = {
    ...props,
    UIComponent: BusinessListingUI
  }
  return <BusinessListController {...businessListingProps} />
}
