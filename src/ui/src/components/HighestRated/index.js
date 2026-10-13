import React, { useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  HighestRatedContainer,
  BusinessList,
  Title,
  BusinessListWrapper,
  Description
} from './styles'

import { useTheme } from 'styled-components'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { BusinessList as BusinessListController } from '~components/components/BusinessList'

import { AutoScroll } from '~ui/src/components/AutoScroll'
import { Modal } from '~ui/src/components/Modal'
import { getCateringValues } from '~ui/utils'
import { Button } from '~ui/src/styles/Buttons'
import { BusinessPreorder } from '~ui/src/components/BusinessPreorder'
import { BusinessController } from '~ui/src/components/BusinessController'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'

const HighestRatedUI = (props) => {
  const {
    scrollId,
    businessesList,
    handleBusinessClick,
    isCustomLayout,
    handleClickAddress,
    isCustomerMode,
    favoriteIds,
    setFavoriteIds,
    businessUrlTemplate,
    title,
    description
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [isPreorder, setIsPreorder] = useState(false)
  const [preorderBusiness, setPreorderBusiness] = useState(null)

  const businesses = businessesList?.businesses ?? []
  const isAllBusinessesWithoutReviews = businesses.length > 0 &&
    businesses.every((business) => (business?.reviews?.total ?? 0) === 0)
  const cateringTypeString = orderState?.options?.type === 7
    ? 'catering_delivery'
    : orderState?.options?.type === 8
      ? 'catering_pickup'
      : null
  const cateringValues = preorderBusiness?.configs && getCateringValues(cateringTypeString, preorderBusiness?.configs)

  const handleClosePreorder = () => {
    setIsPreorder(false)
    setPreorderBusiness(null)
  }

  useEffect(() => {
    if (preorderBusiness) setIsPreorder(true)
  }, [preorderBusiness])

  useEffect(() => {
    if (!businessesList?.businesses?.length) return
    const ids = [...(favoriteIds ?? [])]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds && setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  const businesslist = useMemo(
    () => businesses.filter((business) => (business?.reviews?.total ?? 0) > 0 || scrollId),
    [businesses, scrollId]
  )

  const showEmptyState = handleClickAddress &&
    !isCustomerMode &&
    !businessesList.loading &&
    (businesses.length === 0 || (isAllBusinessesWithoutReviews && !scrollId))
  const showSection = businessesList?.loading || businesslist.length > 0 || showEmptyState

  if (!businessesList?.loading && (businessesList.error || businesslist.length === 0)) return null

  return (
    <>
      {showSection && (
      <HighestRatedContainer>
        <Title>
          {businessesList?.loading
            ? <Skeleton width={220} height={24} />
            : (title ?? t('EVERYONES_FAVORITE', 'Everyone\'s favorite'))}
        </Title>
        {description && (
          <Description>
            {businessesList?.loading ? <Skeleton width={120} height={14} /> : description}
          </Description>
        )}
        <BusinessListWrapper>
          <BusinessList id={scrollId ?? 'highestRated'}>
            {
              showEmptyState && (
                <NotFoundSource
                  variant='empty'
                  content={t('NO_HIGHEST_RATED_BUSINESSES', 'No highly rated businesses in this area yet')}
                  subtitle={t('NO_BUSINESSES_AVAILABLE_DESC', 'Try changing your address or filters.')}
                >
                  <Button
                    outline
                    color='primary'
                    onClick={() => handleClickAddress()}
                  >
                    {t('CHANGE_ADDRESS', 'Select other Address')}
                  </Button>
                </NotFoundSource>
              )
            }
            <AutoScroll scrollId={scrollId ?? 'highestRated'}>
              {
                !businessesList?.loading && businesslist?.map((business, index) => (
                    <BusinessController
                      key={business.id}
                      className='card'
                      business={business}
                      isBusinessOpen={business.open && business?.enabled !== false}
                      handleCustomClick={handleBusinessClick}
                      orderType={orderState?.options?.type}
                      isCustomLayout={isCustomLayout}
                      isCustomerMode={isCustomerMode}
                      favoriteIds={favoriteIds}
                      setFavoriteIds={setFavoriteIds}
                      onPreorderBusiness={setPreorderBusiness}
                      businessUrlTemplate={businessUrlTemplate}
                      m={index === businesslist?.length - 1 ? '10px 0px 10px 20px' : '10px 20px'}
                    />
                ))
              }
            </AutoScroll>
            {businessesList.loading && (
              [...Array(8).keys()].map(i => (
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
        </BusinessListWrapper>
      </HighestRatedContainer>
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
            cateringPreorder={!!cateringTypeString}
            {...cateringValues}
          />
        </Modal>
      )}
    </>
  )
}

const HighestRatedController = (props) => {
  const highestRatedProps = {
    ...props,
    UIComponent: HighestRatedUI,
    avoidRefreshUserInfo: true
  }
  return <BusinessListController {...highestRatedProps} />
}

export const HighestRated = (props) => {
  const theme = useTheme()
  const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
  if (hideHighestBusiness) return null
  return <HighestRatedController {...props} />
}
