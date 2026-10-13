import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
  PromotionsContainer,
  PromotionTitle,
  SingleOfferContainer,
  ExpiresAt,
  OfferInformation,
  SearchBarContainer,
  BusinessLogo,
  SingleBusinessOffer,
  AvailableBusinesses,
  Description,
  OfferData,
  Code,
  BusinessInfo,
  OfferView,
  OfferInfoWrapper,
  OfferViewList,
  OfferWrapper,
  OfferDescriptionWrapper
} from './styles'

import { PromotionsController } from '~components/components/PromotionsController'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useSite } from '~components/contexts/SiteContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { useEvent } from '~components/contexts/EventContext'
import { SearchBar } from '~ui/src/components/SearchBar'
import { Button } from '~ui/src/styles/Buttons'
import { Modal } from '~ui/src/components/Modal'
import { NotFoundSource } from '~ui/src/components/NotFoundSource'
import { checkSiteUrl } from '~ui/utils'

const PromotionsUI = (props) => {
  const {
    offersState,
    handleSearchValue,
    searchValue,
    offerSelected,
    setOfferSelected,
    businessSlug
  } = props
  const [, t] = useLanguage()
  const [{ parseDate, parsePrice }] = useUtils()
  const [events] = useEvent()
  const [openModal, setOpenModal] = useState(false)
  const [{ site }] = useSite()

  const businessUrlTemplate = checkSiteUrl(site?.business_url_template, '/store/:business_slug')

  const handleClickOffer = (offer) => {
    setOpenModal(true)
    setOfferSelected(offer)
  }

  const handleBusinessClick = (business) => {
    if (businessUrlTemplate === '/store/:business_slug' || businessUrlTemplate === '/:business_slug') {
      events.emit('go_to_page', { page: 'business', params: { business_slug: business.slug } })
    } else {
      events.emit('go_to_page', { page: 'business', search: `?${businessUrlTemplate.split('?')[1].replace(':business_slug', '')}${business.slug}` })
    }
  }

  const filterBusinessesBySlug = (list) => {
    if (!businessSlug || !list) return list
    return list.filter(b => String(b?.id) === String(businessSlug) || b?.slug === businessSlug)
  }

  const filteredOffers = offersState?.offers?.filter(offer => offer?.name?.toLowerCase()?.includes(searchValue?.toLowerCase()))
  const hasOffers = (offersState?.offers?.length ?? 0) > 0
  const isSearchEmpty = hasOffers && !!searchValue && (filteredOffers?.length ?? 0) === 0
  const isListEmpty = !offersState?.loading && !offersState?.error && (filteredOffers?.length ?? 0) === 0

  const targetString = offerSelected?.target === 1
    ? t('SUBTOTAL', 'Subtotal')
    : offerSelected?.target === 2
      ? t('DELIVERY_FEE', 'Delivery fee')
      : t('SERVICE_FEE', 'Service fee')

  return (
    <PromotionsContainer>
      <PromotionTitle>
        {t('OFFERS', 'Offers')}
      </PromotionTitle>
      {!offersState?.loading && offersState.offers?.length > 0 && (
        <SearchBarContainer>
          <SearchBar
            placeholder={t('SEARCH_PROMOTION', 'Search promotion')}
            onSearch={handleSearchValue}
          />
        </SearchBarContainer>
      )}

      {offersState?.loading && (
        <>
          {[...Array(5).keys()].map((key, i) => (
            <SingleOfferContainer key={i}>
              <OfferInformation>
                <Skeleton height={20} width={150} />
                <Skeleton height={15} width={225} />
                <Skeleton height={15} width={380} />
              </OfferInformation>
              <Skeleton height={44} width={110} />
            </SingleOfferContainer>
          ))}
        </>
      )}
      {offersState?.error && (
        <NotFoundSource
          content={Array.isArray(offersState.error) ? offersState.error.join(', ') : offersState.error}
        />
      )}
      {!offersState?.error && isSearchEmpty && (
        <NotFoundSource
          variant='empty'
          content={t('NO_PROMOTIONS_MATCH_SEARCH', 'No promotions match your search')}
          subtitle={t('TRY_A_DIFFERENT_SEARCH', 'Try a different search term.')}
        />
      )}
      {!offersState?.error && isListEmpty && !isSearchEmpty && (
        <NotFoundSource
          variant='empty'
          content={t('NO_PROMOTIONS_AVAILABLE', 'No promotions available right now')}
          subtitle={t('NO_PROMOTIONS_AVAILABLE_DESC', 'Check back later for new offers in your area.')}
        />
      )}
      {!offersState?.loading && offersState.offers?.length > 0 && filteredOffers?.map(offer => (
        <OfferWrapper key={offer.id}>
          <SingleOfferContainer>
            <OfferInformation id='offer-info'>
              <ExpiresAt>
                <span>{t('EXPIRES', 'Expires')} {parseDate(offer?.end, { outputFormat: 'MMM DD, YYYY' })} <span className='or-while-stocks-last'>{t('OR_WHILE_STOCKS_LAST', 'or while stocks last.')}</span></span>
              </ExpiresAt>
              <h2>{offer?.name}</h2>
              <AvailableBusinesses>
                <p>{t('APPLY_FOR', 'Apply for')}:</p>
                <p>
                  {(filterBusinessesBySlug(offer.businesses) || []).map((business, i, arr) => (
                    <React.Fragment key={business?.id}>{' '}{business?.name}{i + 1 < arr.length ? ',' : ''}</React.Fragment>
                  ))}
                </p>
              </AvailableBusinesses>
            </OfferInformation>
            <OfferInfoWrapper id='offer-wrap'>
              {offer?.image && (
                <BusinessLogo bgimage={offer.image} />
              )}
            </OfferInfoWrapper>
          </SingleOfferContainer>
          <OfferDescriptionWrapper>
            <Description>{offer?.description}</Description>
            <Button
              color='primary'
              onClick={() => handleClickOffer(offer)}
            >
              {t('USE_COUPON', 'Use coupon')}
            </Button>
          </OfferDescriptionWrapper>
        </OfferWrapper>
      ))}
      {openModal && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          padding='30px'
        >
          <OfferView>
            {offerSelected?.image && (
              <BusinessLogo bgimage={offerSelected.image} fromModal />
            )}
            <ExpiresAt>
              <span>{t('EXPIRES', 'Expires')}: {parseDate(offerSelected?.end, { outputFormat: 'MMM DD, YYYY' })} <span className='or-while-stocks-last'>{t('OR_WHILE_STOCKS_LAST', 'or while stocks last.')}</span></span>
            </ExpiresAt>
            <OfferData>
              {offerSelected?.type === 2 && (
                <Code>
                  <span>{offerSelected.coupon}</span>
                </Code>
              )}
              <div className='offer-data-content'>
                {offerSelected?.description && (
                  <p className='description'>{offerSelected?.description}</p>
                )}
                <p className='terms-and-conditions'>{t('TERMS_AND_CONDITIONS', 'Terms and conditions')}</p>
                <div className='offer-data-content-info'>
                  <p>
                    {`${offerSelected?.name} / ${t('VALUE_OF_OFFER', 'Value of offer')}: ${offerSelected?.rate_type === 1 ? `${offerSelected?.rate}%` : `${parsePrice(offerSelected?.rate)}`}`}
                  </p>
                  <p>{t('APPLIES_TO', 'Applies to')}: {targetString}</p>
                  {offerSelected?.auto && (
                    <p>{t('OFFER_AUTOMATIC', 'This offer applies automatic')}</p>
                  )}
                  {offerSelected?.minimum && (
                    <p>{t('MINIMUM_PURCHASE_FOR_OFFER', 'Minimum purchase for use this offer')}: {parsePrice(offerSelected?.minimum)}</p>
                  )}
                  {offerSelected?.max_discount && (
                    <p>{t('MAX_DISCOUNT_ALLOWED', 'Max discount allowed')}: {parsePrice(offerSelected?.max_discount)}</p>
                  )}
                </div>
              </div>
            </OfferData>
            {!businessSlug && (
              <h2>
                {t('AVAILABLE_BUSINESSES_FOR_OFFER', 'Available businesses for this offer')}
              </h2>
            )}
            <OfferViewList>
              {filterBusinessesBySlug(offerSelected?.businesses)?.map(business => {
                return (
                  <SingleBusinessOffer key={business.id}>
                    {business?.logo && (
                      <BusinessLogo bgimage={business.logo} />
                    )}
                    <BusinessInfo>
                      <p>{business.name}</p>
                      <Button
                        onClick={() => handleBusinessClick(business)}
                        color='primary'
                      >
                        {t('USE_COUPON', 'Use coupon')}
                      </Button>
                    </BusinessInfo>
                  </SingleBusinessOffer>
                )
              })}
            </OfferViewList>
          </OfferView>
        </Modal>
      )}
    </PromotionsContainer>
  )
}

export const Promotions = (props) => {
  const PromotionsProps = {
    ...props,
    UIComponent: PromotionsUI
  }

  return (
    <PromotionsController {...PromotionsProps} />
  )
}
