import React, { useState } from 'react'
import moment from 'moment'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
  BusinessReviewsContainer,
  ReviewOf,
  Content,
  Review,
  ReviewsNotFound,
  SkeletonContainer,
  ReviewsHeaderWrapper,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  ReviewsProgressBar,
  ReviewsMarkPoint,
  ReviewTime,
  ReviewItemHeader,
  ReviewItemContent,
  SearchContainer,
  ReviewStars,
  ReviewRatingWrapper
} from './styles'
import { getUtils } from './utils'
import { AutoScroll } from '~ui/src/components/AutoScroll'
import { Modal } from '~ui/src/components/Modal'

import { BusinessReviews as BusinessReviewController } from '~components/components/BusinessReviews'
import { useLanguage } from '~components/contexts/LanguageContext'

import { Icon } from '~ui-icon'

export const BusinessReviewsUI = (props) => {
  const { totalReviews, stars, reviewsList, handleClickOption, onChangeReview, isColumnMode } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const { ratingIcon } = getUtils()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOnChange = (evt) => {
    if (evt.target.value) onChangeReview(evt.target.value)
    else onChangeReview('')
  }
  const handleClickRaiting = (raiting) => {
    if (raiting) handleClickOption(raiting)
  }

  const showRanking = false
  const showReviewDate = !theme?.business_view?.components?.reviews?.components?.review_date?.hidden
  const showCustomerComments = !theme?.business_view?.components?.reviews?.components?.customer_comments?.hidden
  const showSearch = false
  const hideElement = false

  const reviewPoints = [1, 2, 3, 4, 5]

  const ReviewList = () => {
    return (
      <>
        {!reviewsList.loading
          ? reviewsList?.reviews.map((review) => (
            <Review key={review.id} id='review' reviewName={review?.name} isColumnMode={isColumnMode}>
              {showReviewDate && (
                <ReviewItemHeader isColumnMode={isColumnMode}>
                  {review?.name && (
                    <div className='review-avatar'>
                      {review?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className='review-info'>
                    {review?.name && (
                      <h2>{review?.name}</h2>
                    )}
                    <ReviewStars reviewName={review?.name}>
                      {[...Array(5)].map((_, index) => (
                        <Icon name="starFilled"
                          key={index}
                          className='star'
                          style={{
                            color: index < Math.round(review?.total) ? theme?.colors?.primary : '#CED4DA',
                            fontSize: '16px'
                          }}
                        />
                      ))}
                      {review?.name && <ReviewTime>{moment(review?.created_at).format('DD/MM/YY')}</ReviewTime>}
                    </ReviewStars>
                    {!review?.name && <ReviewTime className='review-time'>{moment(review?.created_at).format('DD/MM/YY')}</ReviewTime>}
                  </div>
                </ReviewItemHeader>
              )}
              {showCustomerComments && (
                <ReviewItemContent isEmpty={!review?.comment?.trim()}>
                  {review?.comment?.trim() || t('NO_COMMENT', 'No comment')}
                </ReviewItemContent>
              )}
            </Review>
          ))
          : (
            <>
              {[...Array(2)].map((item, i) => (
                <SkeletonContainer key={i}>
                  <div>
                    <Skeleton width={100} height={30} />
                    <Skeleton width={100} />
                  </div>
                  <div>
                    <Skeleton width={150} height={50} />
                  </div>
                </SkeletonContainer>
              ))}

            </>
            )}
        {!reviewsList.loading && reviewsList?.reviews.length === 0 && (
          <ReviewsNotFound>{t('NO_REVIEWS', 'No reviews')}</ReviewsNotFound>
        )}
      </>
    )
  }

  return (
    <BusinessReviewsContainer>
      {reviewsList.error
        ? <h2>{t('ERROR_UNKNOWN', 'An error has occurred')}</h2>
        : (
          <>
            <ReviewsHeaderWrapper noReviews={reviewsList?.reviews.length === 0} isColumnMode={isColumnMode}>
              {
                !reviewsList.loading
                  ? (
                    <>
                      <h1>{t('REVIEWS', 'Reviews')}</h1>
                      {!isColumnMode && (<h2><span onClick={() => setIsModalOpen(true)}>{reviewsList?.reviews.length > 250 ? `${t('250_PLUS', '250+')} ${t('RATINGS', 'Ratings')}` : `${reviewsList?.reviews.length} ${t('RATINGS', 'Ratings')}`}</span></h2>)}
                    </>
                    )
                  : (
                    <Skeleton width={100} height={30} />
                    )
              }
            </ReviewsHeaderWrapper>
            {showSearch && (
              <ReviewOf>
                {!reviewsList.loading
                  ? (
                    <SearchContainer>
                      <input
                        type='text'
                        onChange={handleOnChange}
                        placeholder={t('SEARCH', 'Search')}
                        style={{ backgroundImage: `url(${theme?.images?.general?.searchIcon})` }}
                      />
                    </SearchContainer>
                    )
                  : <Skeleton width={200} height={30} />}
              </ReviewOf>
            )}
            {showRanking && (
              <ReviewsProgressWrapper>
                <p>{t('CUSTOMER_REVIEWS', 'Customers reviews')}</p>
                <ReviewsProgressContent>
                  <ReviewsProgressBar style={{ width: `${(stars / 5) * 100}%` }} />
                  {reviewPoints.map((reviewPoint, i) => {
                    const isLastReviewPoint = i === reviewPoints?.length - 1
                    return (
                      <ReviewsMarkPoint
                        key={i}
                        onClick={() => handleClickRaiting(i + 1)}
                        style={{
                          left: theme.rtl !== isLastReviewPoint ? 'initial' : `${25 * (isLastReviewPoint ? 0 : i)}%`,
                          right: theme.rtl !== isLastReviewPoint ? `${25 * (isLastReviewPoint ? 0 : i)}%` : 'initial'
                        }}
                      >
                        <ReviewStars>
                          {reviewPoint}
                          <Icon name="starFilled" className='start' />
                        </ReviewStars>
                      </ReviewsMarkPoint>
                    )
                  })}
                </ReviewsProgressContent>
              </ReviewsProgressWrapper>
            )}
            {!hideElement && (
              <Content id='content' isColumnMode={isColumnMode}>
                <div className='reviews-container'>
                  {isColumnMode
                    ? (
                      <div className='reviews-container-column'>
                        <ReviewList />
                      </div>
                      )
                    : (
                    <AutoScroll scrollId='reviews' isColumnMode={isColumnMode}>
                      <ReviewList />
                    </AutoScroll>
                      )}
                </div>
              </Content>
            )}
          </>
          )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          width='480px'
          padding='30px 40px'
        >
          <BusinessReviewsContainer>
            <ReviewsHeaderWrapper isModal>
              <h2>{t('RANKING', 'Ranking')}</h2>
            </ReviewsHeaderWrapper>
            <ReviewRatingWrapper>
              {ratingIcon()}
              {totalReviews && <h1>{totalReviews} <p>{t('OF_THE_FIVE', 'of the 5.0')}</p></h1>}
            </ReviewRatingWrapper>
          </BusinessReviewsContainer>
        </Modal>
      )}
    </BusinessReviewsContainer>
  )
}

export const BusinessReviews = (props) => {
  const BusinessReviewProps = {
    ...props,
    UIComponent: BusinessReviewsUI
  }
  return <BusinessReviewController {...BusinessReviewProps} />
}
