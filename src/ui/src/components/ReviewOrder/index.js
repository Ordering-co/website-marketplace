import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import { useForm } from 'react-hook-form'
import {
  ReviewOrderContainer,
  Comments,
  Send,
  BusinessLogo,
  WrapperBusinessLogo,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  ReviewsProgressBar,
  ReviewsMarkPoint,
  LogoAndReviewWrapper,
  CommentsList,
  CommentButton,
  ContinueContainer,
  MultiLogosContainer,
  Divider,
  Wrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { OrderReview as ReviewOrderController } from '~components/components/OrderReview'
import { Alert } from '~ui/src/components/Confirm'
import { TextArea } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'
import { reviewCommentList } from '~ui/utils'

import { Icon } from '~ui-icon'

const ReviewOrderUI = (props) => {
  const { stars, order, handleSendReview, formState, closeReviewOrder, setIsReviewed, setStars, useSimpleRating = true } = props
  const [, t] = useLanguage()
  const [{ optimizeImage, parseDate }] = useUtils()
  const theme = useTheme()
  const { handleSubmit, errors } = useForm()
  const [alertState, setAlertState] = useState({ open: false, content: [], success: false })
  const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')

  const commentsList = reviewCommentList('order')

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), middleNode: false, left: 0, right: 'initial' },
    { key: 2, text: t('BAD', 'Bad'), middleNode: true, left: '25%', right: '75%' },
    { key: 3, text: t('OKAY', 'Okay'), middleNode: true, left: '50%', right: '50%' },
    { key: 4, text: t('GOOD', 'Good'), middleNode: true, left: '75%', right: '25%' },
    { key: 5, text: t('GREAT', 'Great'), middleNode: false, left: 'initial', right: 0 }
  ]

  const handleChangeStars = (value) => {
    if (value) setStars({ ...stars, quality: value, punctuality: value, service: value, packaging: value, comments: '' })
    setComments([])
  }

  const handleChangeComment = (commentItem) => {
    const found = comments.find((comment) => comment?.key === commentItem.key)
    if (found) {
      const _comments = comments.filter((comment) => comment?.key !== commentItem.key)
      setComments(_comments)
    } else {
      setComments([...comments, commentItem])
    }
  }

  const isSelectedComment = (commentKey) => {
    const found = comments.find((comment) => comment?.key === commentKey)
    return found
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsReviewed && setIsReviewed(true)
      closeReviewOrder && closeReviewOrder()
    }
  }, [formState])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setAlertState({
        open: true,
        success: false,
        content: Object.values(errors).map(error => error.message)
      })
    }
  }, [errors])

  const onSubmit = values => {
    if (Object.values(stars).some((value) => value === 0)) {
      setAlertState({
        open: true,
        content: stars.quality === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    setAlertState({ ...alertState, success: true })
    handleSendReview()
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
  }

  useEffect(() => {
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setStars({ ...stars, comments: _comment })
  }, [comments, extraComment])

  return (
    <Wrapper>
      <p className='subtitle'>{order?.business?.name}  •  {order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'MM/DD/YY hh:mm A' })
        : parseDate(order?.delivery_datetime, { utc: false })}</p>
      <LogoAndReviewWrapper>
        <div className='business-wrapper'>
          <div className='business-text'>
            <p className='bold'>{t('RATE_THE_BUSINESS', 'Rate the business')}</p>
            <p>{t('HOW_WAS_THE_BUSINESS_ORDER', 'How was the _business_ order?').replace('_business_', `${order?.business?.name ?? 'Business'}`)}</p>
          </div>
          <WrapperBusinessLogo isMulti={order?.business?.length > 1}>
            {order?.business?.length > 1
              ? <MultiLogosContainer>
                  {order?.business?.map((business, i) => (
                    <React.Fragment key={business?.id}>
                      <BusinessLogo isMulti bgimage={optimizeImage(business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />
                    </React.Fragment>
                  ))}
                </MultiLogosContainer>
              : <BusinessLogo bgimage={optimizeImage(order?.business?.logo || theme.images?.dummies?.businessLogo, 'h_200,c_limit')} />}
          </WrapperBusinessLogo>
        </div>
        <ReviewsProgressWrapper useSimpleRating={useSimpleRating}>
          {!useSimpleRating && <p>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</p>}
            {useSimpleRating
              ? (
                <div className='rating-container'>
                  <div
                    onClick={() => handleChangeStars(5)}
                    style={{
                      color: stars?.quality === 5 ? theme?.colors?.primary : '#000'
                    }}
                  >
                    <Icon name="likeOutline" />
                  </div>
                  <div
                    onClick={() => handleChangeStars(2)}
                    style={{
                      color: stars?.quality === 2 ? theme?.colors?.primary : '#000'
                    }}
                  >
                    <Icon name="dislikeOutline" />
                  </div>
                </div>
                )
              : (
                <ReviewsProgressContent>
                  <ReviewsProgressBar style={{ width: `${(stars?.quality === 0 ? 0 : (stars?.quality - 1) / 4) * 100}%` }} />
                  {
                    qualificationList?.map(qualification => (
                      <ReviewsMarkPoint
                        key={qualification?.key}
                        style={{
                          left: theme?.rtl ? (qualification?.middleNode ? 'initial' : qualification?.right) : qualification?.left,
                          right: theme?.rtl ? qualification?.left : (qualification?.middleNode ? 'initial' : qualification?.right)
                        }}
                        active={stars?.quality === qualification?.key}
                        pass={stars?.quality >= qualification?.key}
                        className={qualification?.middleNode ? 'mark-point' : ''}
                        onClick={() => handleChangeStars(qualification?.key)}
                      >
                        <span>{qualification?.text}<span /></span>
                      </ReviewsMarkPoint>
                    ))
                  }
                </ReviewsProgressContent>
                )}
        </ReviewsProgressWrapper>
        <Divider />
        <p className='comments-title'>{t('COMMENTS', 'Comments')}</p>
        <CommentsList>
          {
            commentsList[stars?.quality || 5]?.list?.map((commentItem, i) => (
              <CommentButton
                key={i}
                color={isSelectedComment(commentItem?.key) ? 'primary' : 'white'}
                active={isSelectedComment(commentItem?.key)}
                onClick={() => handleChangeComment(commentItem)}
                initialIcon
              >
                {commentItem.content}
                {isSelectedComment(commentItem?.key) && <Icon name="closeMd" />}
              </CommentButton>
            ))
          }
        </CommentsList>
      </LogoAndReviewWrapper>
      <Divider />
      <ReviewOrderContainer onSubmit={handleSubmit(onSubmit)}>
        <Comments>
          <p className='extra-comment-title'>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</p>
          <TextArea
            name='comments'
            placeholder={t('COMMENT', 'Comment')}
            value={extraComment}
            onChange={(e) => setExtraComment(e.target.value)}
            autoComplete='off'
          />
        </Comments>
        <Send useSimpleRating={useSimpleRating}>
          {!useSimpleRating && <span onClick={closeReviewOrder}>{t('SKIP', 'Skip')}</span>}
          <Button
            color={!formState.loading ? 'primary' : 'secondary'}
            type='submit'
            disabled={formState.loading}
            className='review-sent'
          >
            {!formState.loading
              ? <ContinueContainer><p>{t('CONTINUE', 'Continue')}</p>{!useSimpleRating && <Icon name="arrowRight" />}</ContinueContainer>
              : t('LOADING', 'Loading')}
          </Button>
        </Send>
        <Alert
          title={t('ORDER_REVIEW', 'Order Review')}
          content={alertState.content}
          acceptText={t('ACCEPT', 'Accept')}
          open={alertState.open}
          onClose={() => closeAlert()}
          onAccept={() => closeAlert()}
          closeOnBackdrop={false}
        />
      </ReviewOrderContainer>
    </Wrapper>
  )
}

export const ReviewOrder = (props) => {
  const ReviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI,
    isToast: true,
    defaultStar: props?.defaultStar ?? 0
  }

  return <ReviewOrderController {...ReviewOrderProps} />
}

export default ReviewOrder
