import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import { useForm } from 'react-hook-form'
import {
  ReviewDriverContainer,
  Comments,
  Send,
  DriverPhoto,
  WrapperDriverPhoto,
  ReviewsProgressWrapper,
  ReviewsProgressContent,
  ReviewsProgressBar,
  ReviewsMarkPoint,
  LogoAndReviewWrapper,
  CommentsList,
  CommentButton,
  ContinueContainer,
  Divider,
  Wrapper
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useUtils } from '~components/contexts/UtilsContext'
import { ReviewDriver as ReviewDriverController } from '~components/components/ReviewDriver'
import { reviewCommentList } from '~ui/utils'
import { Alert } from '~ui/src/components/Confirm'
import { TextArea } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'

import { Icon } from '~ui-icon'

const ReviewDriverUI = (props) => {
  const {
    dirverReviews,
    order,
    formState,
    setDriverReviews,
    closeReviewDriver,
    setIsDriverReviewed,
    handleSendDriverReview,
    useSimpleRating = true
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage, parseDate }] = useUtils()
  const { handleSubmit, errors } = useForm()
  const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')
  const [alertState, setAlertState] = useState({ open: false, content: [], success: false })

  const commentsList = reviewCommentList('driver')

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), middleNode: false, left: 0, right: 'initial' },
    { key: 2, text: t('BAD', 'Bad'), middleNode: true, left: '25%', right: '75%' },
    { key: 3, text: t('OKAY', 'Okay'), middleNode: true, left: '50%', right: '50%' },
    { key: 4, text: t('GOOD', 'Good'), middleNode: true, left: '75%', right: '25%' },
    { key: 5, text: t('GREAT', 'Great'), middleNode: false, left: 'initial', right: 0 }
  ]

  const handleChangeStars = (index) => {
    if (index) setDriverReviews({ ...dirverReviews, qualification: index, comment: '' })
    setComments([])
  }

  const onSubmit = values => {
    if (dirverReviews?.qualification === 0) {
      setAlertState({
        open: true,
        content: [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`]
      })
      return
    }
    setAlertState({ ...alertState, success: true })
    handleSendDriverReview()
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

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
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
      setIsDriverReviewed && setIsDriverReviewed(true)
      closeReviewDriver && closeReviewDriver()
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

  useEffect(() => {
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setDriverReviews({ ...dirverReviews, comment: _comment })
  }, [comments, extraComment])

  return (
    <Wrapper>
      <p className='subtitle'>{order?.business?.name}  •  {order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'MM/DD/YY hh:mm A' })
        : parseDate(order?.delivery_datetime, { utc: false })}</p>
      <LogoAndReviewWrapper>
        <div className='driver-wrapper'>
          <div className='driver-text'>
            <p className='bold'>{t('RATE_YOUR_ORDER', 'Rate your order')}</p>
            <p>{t('HOW_WAS_DRIVER_DELIVERY', 'How was _driver_ delivery?').replace('_driver_', `${order?.driver?.name ?? 'Driver'} ${order?.driver?.last_name ?? ''}`)}</p>
          </div>
          <WrapperDriverPhoto>
            {(order?.driver?.photo)
              ? (
              <DriverPhoto bgimage={optimizeImage(order?.driver?.photo, 'h_200,c_limit')} />
                )
              : <Icon name="user" />}
          </WrapperDriverPhoto>
        </div>
        <ReviewsProgressWrapper useSimpleRating={useSimpleRating}>
          {!useSimpleRating && <p>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</p>}
            {useSimpleRating
              ? (
                <div className='rating-container'>
                  <div
                    onClick={() => handleChangeStars(5)}
                    style={{
                      color: dirverReviews?.qualification === 5 ? theme?.colors?.primary : '#000'
                    }}
                  >
                    <Icon name="likeOutline" />
                  </div>
                  <div
                    onClick={() => handleChangeStars(2)}
                    style={{
                      color: dirverReviews?.qualification === 2 ? theme?.colors?.primary : '#000'
                    }}
                  >
                    <Icon name="dislikeOutline" />
                  </div>
                </div>
                )
              : (
                <ReviewsProgressContent>
                  <ReviewsProgressBar style={{ width: `${(dirverReviews?.qualification?.quality === 0 ? 0 : (dirverReviews?.qualification?.quality - 1) / 4) * 100}%` }} />
                  {
                    qualificationList?.map(qualification => (
                      <ReviewsMarkPoint
                        key={qualification?.key}
                        style={{
                          left: theme?.rtl ? (qualification?.middleNode ? 'initial' : qualification?.right) : qualification?.left,
                          right: theme?.rtl ? qualification?.left : (qualification?.middleNode ? 'initial' : qualification?.right)
                        }}
                        active={dirverReviews?.qualification?.quality === qualification?.key}
                        pass={dirverReviews?.qualification?.quality >= qualification?.key}
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
            commentsList[dirverReviews?.qualification || 5]?.list?.map((commentItem, i) => (
              <CommentButton
                key={i}
                color={isSelectedComment(commentItem?.key) ? 'primary' : 'white'}
                active={isSelectedComment(commentItem.key)}
                onClick={() => handleChangeComment(commentItem)}
                initialIcon
              >
                {commentItem.content}
                {
                  isSelectedComment(commentItem.key) && <Icon name="closeMd" />
                }
              </CommentButton>
            ))
          }
        </CommentsList>
      </LogoAndReviewWrapper>
      <Divider />
      <ReviewDriverContainer onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            color={!formState.loading ? 'primary' : 'secondary'}
            type='submit'
            disabled={formState.loading}
            className='review-sent'
          >
            {!formState.loading
              ? <ContinueContainer><p>{t('CONTINUE', 'Continue')}</p></ContinueContainer>
              : t('LOADING', 'Loading')}
          </Button>
        </Send>
        <Alert
          title={t('DRIVER_REVIEW', 'Driver Review')}
          content={alertState.content}
          acceptText={t('ACCEPT', 'Accept')}
          open={alertState.open}
          onClose={() => closeAlert()}
          onAccept={() => closeAlert()}
          closeOnBackdrop={false}
        />
      </ReviewDriverContainer>
    </Wrapper>
  )
}

export const ReviewDriver = (props) => {
  const reviewDriverProps = {
    ...props,
    UIComponent: ReviewDriverUI,
    isToast: true
  }

  return <ReviewDriverController {...reviewDriverProps} />
}

export default ReviewDriver
