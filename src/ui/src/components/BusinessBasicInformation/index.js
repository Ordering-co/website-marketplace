import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from 'styled-components'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

import {
  BusinessContainer,
  SearchComponentContainer,
  BusinessInfoWrapper,
  BackButton
} from './styles'
import { SearchComponent } from './SearchComponent'
import { BusinessInfoComponent } from './BusinessInfoComponent'

import { useUtils } from '~components/contexts/UtilsContext'
import { useLanguage } from '~components/contexts/LanguageContext'
import { Button } from '~ui/src/styles/Buttons'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { Modal } from '~ui/src/components/Modal'
import { BusinessInformation } from '~ui/src/components/BusinessInformation'
import { BusinessReviews } from '~ui/src/components/BusinessReviews'
import { MomentContent } from '~ui/src/components/MomentContent'
import { SearchProducts } from '~ui/src/components/SearchProducts'
import { BusinessPreorder } from '~ui/src/components/BusinessPreorder'
import { Icon } from '~ui-icon'

dayjs.extend(timezone)
dayjs.extend(isBetween)

const types = ['food', 'laundry', 'alcohol', 'groceries']

const STICKY_HYSTERESIS = 10

export const BusinessBasicInformation = (props) => {
  const {
    isSkeleton,
    businessState,
    setOpenBusinessInformation,
    openBusinessInformation,
    handleChangeSearch,
    searchValue,
    sortByOptions,
    sortByValue,
    handleChangeSortBy,
    categoryState,
    errorQuantityProducts,
    isCustomerMode,
    isCustomLayout,
    setCategoryClicked,
    categoryClicked,
    handleAddReservation,
    handleFavoriteBusiness,
    currentCart,
    showStoreSwitcher,
    handleSearchRedirect
  } = props
  const { business, loading } = businessState

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const windowSize = useWindowSize()
  const [isBusinessReviews, setIsBusinessReviews] = useState(false)
  const [isPreOrder, setIsPreOrder] = useState(false)
  const [openSearchProducts, setOpenSearchProducts] = useState(false)
  const isNameFixedRef = useRef(false)
  const nameTriggerRef = useRef(0)

  const isInfoShrunken = false
  const hideHeader = theme?.business_view?.components?.header?.hidden
  const showHeaderBanner = !hideHeader && (
    isInfoShrunken || !!business?.header || (loading && !business?.id)
  )
  const hideHeaderBanner = hideHeader || (!loading && !business?.header)

  const businessInfoComponentProps = {
    loading,
    business,
    isInfoShrunken,
    hideHeaderBanner,
    isCustomerMode,
    setIsPreOrder,
    setIsBusinessReviews,
    setOpenBusinessInformation,
    categoryState,
    searchValue,
    errorQuantityProducts,
    setOpenSearchProducts,
    handleChangeSortBy,
    sortByValue,
    sortByOptions,
    isCustomLayout,
    handleAddReservation,
    handleFavoriteBusiness,
    currentCart,
    showStoreSwitcher,
    handleSearchRedirect
  }

  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return t('GENERAL', 'General')
    const _types = []
    types.forEach(type => business[type] && _types.push(
      t(`BUSINESS_TYPE_${type?.replace(/\s/g, '_')?.toUpperCase()}`, type)
    ))
    return _types.join(', ')
  }

  useEffect(() => {
    if (businessState?.loading) return
    let timeout = null
    const currentDate = dayjs().tz(businessState?.business?.timezone)
    let lapse = null
    if (businessState?.business?.today?.enabled) {
      lapse = businessState?.business?.today?.lapses?.find(lapse => {
        const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
        const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
        return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
      })
    }
    if (lapse) {
      const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
      const timeToClose = (to.unix() - currentDate.unix()) * 1000
      timeout = setTimeout(() => {
        setIsPreOrder(true)
      }, timeToClose)
    }
    return () => {
      timeout && clearTimeout(timeout)
    }
  }, [businessState?.business])

  useEffect(() => {
    document.body.style.overflowY = openSearchProducts ? 'hidden' : 'auto'
  }, [openSearchProducts])

  const handleScroll = () => {
    const searchElement = document.getElementById('search-component-disabled')
    const cartHeaderItem = document.getElementById('cart-header-item')
    if (searchElement) {
      const limit = window.scrollY >= searchElement?.offsetTop && window.scrollY > 0
      if (limit) {
        const classAdded = searchElement.classList.contains('fixed-search')
        !classAdded && searchElement.classList.add('fixed-search')
      } else {
        searchElement && searchElement.classList.remove('fixed-search')
      }
    }
    const backArrowElement = document.getElementById('back-arrow')

    const businessNameElement = document.getElementById('business_name')
    const businessNameFeedbackElement = document.getElementById('business_name_feedback')
    if (businessNameElement) {
      const isFixed = isNameFixedRef.current
      if (!isFixed) {
        nameTriggerRef.current = businessNameElement.offsetTop - 15
      }
      const trigger = nameTriggerRef.current
      const limit = (isFixed
        ? window.scrollY > trigger - STICKY_HYSTERESIS
        : window.scrollY >= trigger) && window.scrollY > 0
      if (limit && !isFixed) {
        const reservedHeight = businessNameElement.offsetHeight
        isNameFixedRef.current = true
        businessNameElement.classList.add('fixed-name')
        backArrowElement && backArrowElement.classList.add('fixed-arrow')
        if (businessNameFeedbackElement) {
          businessNameFeedbackElement.style.height = `${reservedHeight}px`
          businessNameFeedbackElement.style.display = 'block'
        }
        if (cartHeaderItem) cartHeaderItem.classList.add('cart-header-fixed')
      } else if (!limit && isFixed) {
        isNameFixedRef.current = false
        businessNameElement.classList.remove('fixed-name')
        backArrowElement && backArrowElement.classList.remove('fixed-arrow')
        if (businessNameFeedbackElement) {
          businessNameFeedbackElement.style.display = 'none'
          businessNameFeedbackElement.style.height = ''
        }
        if (cartHeaderItem) cartHeaderItem.classList.remove('cart-header-fixed')
      }
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      const cartHeaderItem = document.getElementById('cart-header-item')
      const businessNameElement = document.getElementById('business_name')
      const businessNameFeedbackElement = document.getElementById('business_name_feedback')
      const backArrowElement = document.getElementById('back-arrow')
      const searchElement = document.getElementById('search-component-disabled')

      cartHeaderItem?.classList.remove('cart-header-fixed')
      businessNameElement?.classList.remove('fixed-name')
      backArrowElement?.classList.remove('fixed-arrow')
      searchElement?.classList.remove('fixed-search')
      if (businessNameFeedbackElement) {
        businessNameFeedbackElement.style.display = 'none'
        businessNameFeedbackElement.style.height = ''
      }
      isNameFixedRef.current = false
    }
  }, [windowSize?.width])

  useEffect(() => {
    window.scroll({
      top: window.scrollY - 1,
      left: 0
    })
  }, [sortByValue])

  return (
    <>
      {openSearchProducts && (
        <SearchProducts
          {...props}
          onClose={() => {
            handleChangeSearch && handleChangeSearch('')
            setOpenSearchProducts(false)
            window.scroll({
              top: window.scrollY - 1,
              left: 0
            })
          }}
          business={businessState.business}
        />
      )}
      <BusinessInfoWrapper>
        {showHeaderBanner && (
          <BusinessContainer bgimage={business?.header} isSkeleton={isSkeleton} id='container' isClosed={!business?.open}>
            {(!loading && !business?.open) && <h1>{t('CLOSED', 'Closed')}</h1>}
            {(isInfoShrunken) && (
              <BusinessInfoComponent {...businessInfoComponentProps} />
            )}
            {!loading && (
              <>
                {isInfoShrunken && (
                  <SearchComponentContainer>
                    <SearchComponent
                      setOpenSearchProducts={setOpenSearchProducts}
                      handleChangeSortBy={handleChangeSortBy}
                      sortByValue={sortByValue}
                      sortByOptions={sortByOptions}
                    />
                  </SearchComponentContainer>
                )}
              </>
            )}
          </BusinessContainer>
        )}
        {(!isInfoShrunken) && (
          <BusinessInfoComponent {...businessInfoComponentProps} />
        )}
      </BusinessInfoWrapper>
      {(business?.front_layout === 'groceries' && windowSize.width <= 992 && categoryClicked) && (
        <BackButton>
          <Button
            color='primary'
            initialIcon
            onClick={() => setCategoryClicked(false)}
          >
            <Icon name="arrowLeft" />
            <div>{t('GO_TO_ALL_CATEGORIES', 'Go to all categories')}</div>
          </Button>
        </BackButton>
      )}
      {openBusinessInformation && (
        <Modal
          width='70%'
          open={openBusinessInformation}
          onClose={setOpenBusinessInformation}
          padding='30px'
        >
          <BusinessInformation
            business={business}
            getBusinessType={getBusinessType}
            optimizeImage={optimizeImage}
            onClose={setOpenBusinessInformation}
          />
        </Modal>
      )}
      {isBusinessReviews && (
        <Modal
          width='460px'
          open={isBusinessReviews}
          onClose={() => setIsBusinessReviews(false)}
          padding='20px 0px 20px 10px'
        >
          <BusinessReviews
            businessId={business.id}
            reviews={business.reviews?.reviews}
            businessName={business.name}
            stars={business.reviews?.total}
            isColumnMode
          />
        </Modal>
      )}
      {isPreOrder && (
        <Modal
          open={isPreOrder}
          width={isCustomerMode ? '700px' : '760px'}
          onClose={() => setIsPreOrder(false)}
          padding={isCustomerMode && '20px'}
        >
          {isCustomerMode
            ? (
            <MomentContent onClose={() => setIsPreOrder(false)} />
              )
            : (
            <BusinessPreorder
              business={business}
              handleClick={() => setIsPreOrder(false)}
            />
              )}
        </Modal>
      )}
    </>
  )
}
