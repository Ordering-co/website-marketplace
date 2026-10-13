import React, { useState, useEffect } from 'react'
import { useTheme } from 'styled-components'
import { useForm } from 'react-hook-form'
import {
  ReviewProductContainer,
  ActionBlock,
  CommentButton,
  SingleProductReviewContainer,
  LogoAndReviewWrapper,
  ReviewsProgressWrapper,
  HandIconWrapper,
  AdditionCommentsWrapper,
  AddCommentHideShow,
  Comments,
  CommentsList,
  WrapperProductLogo,
  ProductLogo,
  Divider
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { ReviewProduct as ReviewProductController } from '~components/components/ReviewProduct'
import { useUtils } from '~components/contexts/UtilsContext'
import { TextArea } from '~ui/src/styles/Inputs'
import { Button } from '~ui/src/styles/Buttons'
import { Alert } from '~ui/src/components/Confirm'
import { reviewCommentList } from '~ui/utils'

import { Icon } from '~ui-icon'

const SingleProductReview = (props) => {
  const {
    product,
    order,
    handleChangeFormState,
    formState,
    singleProduct
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ optimizeImage }] = useUtils()
  const [isLike, setIsLike] = useState(true)
  const [isExtraComment, setIsExtraComment] = useState(singleProduct)
  const [comments, setComments] = useState([])
  const [extraComment, setExtraComment] = useState('')
  const [currentValue, setCurrentValue] = useState(5)

  const commentsList = reviewCommentList('product')

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
    const value = isLike ? 5 : 1
    setCurrentValue(value)
    if (value !== currentValue) setComments([])
    if (comments?.length === 0 && !extraComment && formState.changes?.length === 0 && isLike) return
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    let found = false
    const _changes = formState.changes.map(item => {
      if (item?.product_id === product?.product_id) {
        found = true
        return {
          product_id: product?.product_id,
          comment: _comment,
          qualification: isLike ? 5 : 1
        }
      }
      return item
    })
    if (!found) {
      _changes.push({
        product_id: product?.product_id,
        comment: _comment,
        qualification: isLike ? 5 : 1
      })
    }
    handleChangeFormState && handleChangeFormState(_changes)
  }, [comments, extraComment, isLike])

  return (
    <SingleProductReviewContainer>
      <LogoAndReviewWrapper>
        <div className='product-wrapper'>
          <div className='product-text'>
            <p className='bold'>{t('RATE_YOUR_ITEM', 'Rate your item')}</p>
            <p>{t('HOW_WAS_PRODUCT', 'How was the _product_?').replace('_product_', `${product?.name ?? 'Product'}`)}</p>
          </div>
          {(product?.images || theme.images?.dummies?.product) && (
            <WrapperProductLogo>
              <ProductLogo bgimage={optimizeImage(product?.images || theme.images?.dummies?.product, 'h_200,c_limit')} />
            </WrapperProductLogo>
          )}
        </div>
        <ReviewsProgressWrapper useSimpleRating>
          <div className='rating-container'>
            <HandIconWrapper onClick={() => setIsLike(true)} active={isLike}>
              <Icon name="likeOutline" />
            </HandIconWrapper>
            <HandIconWrapper onClick={() => setIsLike(false)} active={!isLike}>
              <Icon name="dislikeOutline" />
            </HandIconWrapper>
          </div>
        </ReviewsProgressWrapper>
        <Divider />
        <p className='comments-title'>{t('COMMENTS', 'Comments')}</p>
        <CommentsList>
          {
            commentsList[isLike ? 'like' : 'dislike']?.map((commentItem, i) => (
              <CommentButton
                key={i}
                type='button'
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
      <AdditionCommentsWrapper>
        <AddCommentHideShow
          onClick={() => setIsExtraComment(!isExtraComment)}
          active={isExtraComment}
        >
          {t('ADDITIONAL_COMMENTS', 'Additional comments')}
        </AddCommentHideShow>
        {
          isExtraComment && (
            <Comments>
              <p>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</p>
              <TextArea
                name='comments'
                value={extraComment || ''}
                onChange={(e) => setExtraComment(e.target.value)}
                autoComplete='off'
              />
            </Comments>
          )
        }
      </AdditionCommentsWrapper>
      {order?.products?.length > 1 && <Divider />}
    </SingleProductReviewContainer>
  )
}

const ReviewProductUI = (props) => {
  const {
    order,
    closeReviewProduct,
    formState,
    handleSendProductReview,
    setIsProductReviewed
  } = props

  const [, t] = useLanguage()
  const [{ parseDate }] = useUtils()
  const { handleSubmit, errors } = useForm()
  const [alertState, setAlertState] = useState({ open: false, content: [], success: false })

  const onSubmit = values => {
    setAlertState({ ...alertState, success: true })
    handleSendProductReview()
  }

  const closeAlert = () => {
    setAlertState({
      open: false,
      content: []
    })
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
      setIsProductReviewed && setIsProductReviewed(true)
      closeReviewProduct && closeReviewProduct()
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

  return (
    <ReviewProductContainer onSubmit={handleSubmit(onSubmit)}>
      <p className='subtitle'>{order?.business?.name}  •  {order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'MM/DD/YY hh:mm A' })
        : parseDate(order?.delivery_datetime, { utc: false })}</p>
      {order?.products && order.products.length > 0 && order?.products.map(productsOrder => (
        productsOrder?.length
          ? productsOrder?.map((product, i) => !product?.deleted && (
            <SingleProductReview
            {...props}
            key={i}
            product={product}
            singleProduct={order?.products?.length === 1}
          />
          ))
          : !productsOrder?.deleted && (
          <SingleProductReview
            {...props}
            key={productsOrder?.id}
            product={productsOrder}
            singleProduct={order?.products?.length === 1}
          />
            )
      ))}
      <ActionBlock>
        <Button
          color={!formState.loading ? 'primary' : 'secondary'}
          type='submit'
          disabled={formState.loading || formState?.changes?.length === 0}
          className='review-sent'
        >
          {!formState.loading
            ? t('CONTINUE', 'Continue')
            : t('LOADING', 'Loading')}
        </Button>
      </ActionBlock>
      <Alert
        title={t('PRODUCT_REVIEW', 'Product Review')}
        content={alertState.content}
        acceptText={t('ACCEPT', 'Accept')}
        open={alertState.open}
        onClose={() => closeAlert()}
        onAccept={() => closeAlert()}
        closeOnBackdrop={false}
      />
    </ReviewProductContainer>
  )
}

export const ReviewProduct = (props) => {
  const reviewProductProps = {
    ...props,
    UIComponent: ReviewProductUI,
    isToast: true
  }
  return <ReviewProductController {...reviewProductProps} />
}

export default ReviewProduct
