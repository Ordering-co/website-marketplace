import React, { useEffect, useState } from 'react'

import { useLanguage } from '~components/contexts/LanguageContext'
import { useApi } from '~components/contexts/ApiContext'
import { useSession } from '~components/contexts/SessionContext'
import { Icon } from '~ui-icon'
import { sendOrderSurvey, sendDriverSurvey } from './surveyRequests'
import {
  SurveyContainer,
  IntroWrapper,
  BagImage,
  IntroText,
  RateButton,
  SkipLink,
  QuestionsWrapper,
  QuestionBlock,
  QuestionLabel,
  QuestionTitle,
  Stars,
  Thumbs,
  SubQuestion,
  Chips,
  Chip,
  CommentBox,
  SurveyHint,
  SubmitButton,
  SkipRow
} from './styles'

const STARS = [1, 2, 3, 4, 5]

export const SatisfactionSurvey = (props) => {
  const { order, hashKey, image } = props

  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ token, user }] = useSession()

  const [phase, setPhase] = useState(order?.review ? 'done' : 'intro')
  const [product, setProduct] = useState({ stars: 0, chips: [], comment: '' })
  const [delivery, setDelivery] = useState({ thumb: null, chips: [], comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const hasDriver = !!order?.driver

  const productDislikeChips = [
    { key: 'different_or_incomplete', content: t('TRACKING_SURVEY_PROD_DISLIKE_0', 'Different or incomplete product') },
    { key: 'bad_taste', content: t('TRACKING_SURVEY_PROD_DISLIKE_1', 'Bad taste') },
    { key: 'small_portion', content: t('TRACKING_SURVEY_PROD_DISLIKE_2', 'Small portion') },
    { key: 'quality_issues', content: t('TRACKING_SURVEY_PROD_DISLIKE_3', 'Quality issues') }
  ]
  const productLikeChips = [
    { key: 'quality_ingredients', content: t('TRACKING_SURVEY_PROD_LIKE_0', 'Quality ingredients') },
    { key: 'good_taste', content: t('TRACKING_SURVEY_PROD_LIKE_1', 'Good taste') },
    { key: 'value_for_money', content: t('TRACKING_SURVEY_PROD_LIKE_2', 'Value for money') },
    { key: 'adequate_portion', content: t('TRACKING_SURVEY_PROD_LIKE_3', 'Adequate portion') }
  ]
  const deliveryProblemChips = [
    { key: 'delivery_time', content: t('TRACKING_SURVEY_DELIV_PROBLEM_0', 'Delivery time') },
    { key: 'never_arrived', content: t('TRACKING_SURVEY_DELIV_PROBLEM_1', 'The order never arrived') },
    { key: 'tracking_issues', content: t('TRACKING_SURVEY_DELIV_PROBLEM_2', 'Tracking issues') },
    { key: 'damaged_order', content: t('TRACKING_SURVEY_DELIV_PROBLEM_3', 'Damaged order') },
    { key: 'rider_service', content: t('TRACKING_SURVEY_DELIV_PROBLEM_4', 'Driver service') }
  ]
  const deliveryBestChips = [
    { key: 'punctuality', content: t('TRACKING_SURVEY_DELIV_BEST_0', 'Punctuality') },
    { key: 'delivery_tracking', content: t('TRACKING_SURVEY_DELIV_BEST_1', 'Delivery tracking') },
    { key: 'fast_delivery', content: t('TRACKING_SURVEY_DELIV_BEST_2', 'Fast delivery') },
    { key: 'good_package_condition', content: t('TRACKING_SURVEY_DELIV_BEST_3', 'Good package condition') },
    { key: 'rider_service', content: t('TRACKING_SURVEY_DELIV_BEST_4', 'Driver service') }
  ]

  const productChipList = product.stars >= 4 ? productLikeChips : productDislikeChips
  const productSubTitle = product.stars >= 4
    ? t('TRACKING_SURVEY_PROD_LIKE_TITLE', 'What would you highlight about your order?')
    : t('TRACKING_SURVEY_PROD_DISLIKE_TITLE', 'What was the problem?')
  const deliveryChipList = delivery.thumb === 'up' ? deliveryBestChips : deliveryProblemChips
  const deliverySubTitle = delivery.thumb === 'up'
    ? t('TRACKING_SURVEY_DELIV_BEST_TITLE', 'What was the best part?')
    : t('TRACKING_SURVEY_DELIV_PROBLEM_TITLE', 'What was the problem?')

  const productAnswered = product.stars > 0
  const deliveryAnswered = !!delivery.thumb
  const productComplete = productAnswered && product.chips.length > 0
  const deliveryComplete = !hasDriver || (deliveryAnswered && delivery.chips.length > 0)
  const canSubmit = productComplete && deliveryComplete
  const missingReason = (productAnswered && product.chips.length === 0) || (hasDriver && deliveryAnswered && delivery.chips.length === 0)
  const showHint = (productAnswered || deliveryAnswered) && !canSubmit

  const toggleChip = (setter, chip) => {
    setter(prev => {
      const exists = prev.chips.find(item => item.key === chip.key)
      return { ...prev, chips: exists ? prev.chips.filter(item => item.key !== chip.key) : [...prev.chips, chip] }
    })
  }
  const isChipActive = (list, chip) => !!list.find(item => item.key === chip.key)
  const handleSetStars = (value) => setProduct({ stars: value, chips: [], comment: '' })
  const handleSetThumb = (value) => setDelivery({ thumb: value, chips: [], comment: '' })
  const handleDecline = () => setPhase('declined')

  const handleSubmit = async () => {
    const willProduct = product.stars > 0
    const willDelivery = !!delivery.thumb && hasDriver
    if (!willProduct && !willDelivery) {
      setPhase('done')
      return
    }
    setError(false)
    setSubmitting(true)
    const auth = { ordering, token, hashKey, userId: user?.id }
    try {
      const results = await Promise.all([
        willProduct ? sendOrderSurvey(auth, order, product) : Promise.resolve(true),
        willDelivery ? sendDriverSurvey(auth, order, delivery) : Promise.resolve(true)
      ])
      setSubmitting(false)
      if (results.every(Boolean)) setPhase('done')
      else setError(true)
    } catch (e) {
      setSubmitting(false)
      setError(true)
    }
  }

  useEffect(() => {
    if (order?.review) setPhase('done')
  }, [order?.review])

  return (
    <SurveyContainer data-doc-section='order-tracking-survey' data-phase={phase}>
      <IntroWrapper>
        {image && <BagImage src={image} alt='' />}
        {phase === 'intro' && (
          <>
            <IntroText>{t('TRACKING_SURVEY_INTRO', 'Tell us how your delivery and order experience went.')}</IntroText>
            <RateButton type='button' onClick={() => setPhase('survey')} data-doc-control='order-tracking-survey-start'>
              {t('TRACKING_SURVEY_RATE', 'Rate')}
            </RateButton>
            <SkipLink onClick={handleDecline}>{t('TRACKING_SURVEY_NOT_NOW', 'Not now')}</SkipLink>
          </>
        )}
        {phase === 'declined' && (
          <IntroText className='highlight'>{t('TRACKING_SURVEY_ENJOY_ORDER', 'Enjoy your order.')}</IntroText>
        )}
        {phase === 'done' && (
          <IntroText className='highlight'>{t('TRACKING_SURVEY_THANKS', 'Thank you for your feedback!')}</IntroText>
        )}
      </IntroWrapper>

      {phase === 'survey' && (
        <QuestionsWrapper>
          <QuestionBlock>
            <QuestionLabel>{t('TRACKING_SURVEY_YOUR_ORDER', 'Your order')}</QuestionLabel>
            <QuestionTitle>{t('TRACKING_SURVEY_Q_PRODUCT', 'How was what you ordered?')}</QuestionTitle>
            <Stars>
              {STARS.map(value => (
                <span key={value} onClick={() => handleSetStars(value)} data-doc-control={`order-tracking-survey-star-${value}`}>
                  <Icon name={value <= product.stars ? 'starFilledAi' : 'starOutline'} />
                </span>
              ))}
            </Stars>
            {product.stars > 0 && (
              <SubQuestion>
                <p className='sub-title'>{productSubTitle}</p>
                <Chips>
                  {productChipList.map(chip => (
                    <Chip
                      key={chip.key}
                      type='button'
                      active={isChipActive(product.chips, chip)}
                      onClick={() => toggleChip(setProduct, chip)}
                    >
                      {chip.content}
                    </Chip>
                  ))}
                </Chips>
                <CommentBox
                  placeholder={t('TRACKING_SURVEY_OPTIONAL_COMMENT', 'Optional comment')}
                  value={product.comment}
                  onChange={(e) => { const value = e.target.value; setProduct(prev => ({ ...prev, comment: value })) }}
                />
              </SubQuestion>
            )}
          </QuestionBlock>

          {hasDriver && (
            <QuestionBlock>
              <QuestionLabel>{t('TRACKING_SURVEY_DELIVERY', 'The delivery')}</QuestionLabel>
              <QuestionTitle>{t('TRACKING_SURVEY_Q_DELIVERY', 'How was the delivery?')}</QuestionTitle>
              <Thumbs>
                <button
                  type='button'
                  className={delivery.thumb === 'up' ? 'active' : ''}
                  onClick={() => handleSetThumb('up')}
                  aria-label={t('TRACKING_SURVEY_THUMB_UP', 'Good')}
                  data-doc-control='order-tracking-survey-thumb-up'
                >
                  <Icon name='likeOutline' />
                </button>
                <button
                  type='button'
                  className={delivery.thumb === 'down' ? 'active' : ''}
                  onClick={() => handleSetThumb('down')}
                  aria-label={t('TRACKING_SURVEY_THUMB_DOWN', 'Bad')}
                  data-doc-control='order-tracking-survey-thumb-down'
                >
                  <Icon name='dislikeOutline' />
                </button>
              </Thumbs>
              {delivery.thumb && (
                <SubQuestion>
                  <p className='sub-title'>{deliverySubTitle}</p>
                  <Chips>
                    {deliveryChipList.map(chip => (
                      <Chip
                        key={chip.key}
                        type='button'
                        active={isChipActive(delivery.chips, chip)}
                        onClick={() => toggleChip(setDelivery, chip)}
                      >
                        {chip.content}
                      </Chip>
                    ))}
                  </Chips>
                  <CommentBox
                    placeholder={t('TRACKING_SURVEY_OPTIONAL_COMMENT', 'Optional comment')}
                    value={delivery.comment}
                    onChange={(e) => { const value = e.target.value; setDelivery(prev => ({ ...prev, comment: value })) }}
                  />
                </SubQuestion>
              )}
            </QuestionBlock>
          )}

          {showHint && (
            <SurveyHint>
              {missingReason
                ? t('TRACKING_SURVEY_SELECT_REASON', 'Select at least one reason to continue.')
                : t('TRACKING_SURVEY_ANSWER_BOTH', 'Answer both questions to send your feedback.')}
            </SurveyHint>
          )}
          {error && (
            <SurveyHint className='error'>{t('TRACKING_SURVEY_ERROR', 'We could not send your feedback. Please try again.')}</SurveyHint>
          )}
          <SubmitButton type='button' disabled={!canSubmit || submitting} onClick={handleSubmit} data-doc-control='order-tracking-survey-submit'>
            {submitting ? t('LOADING', 'Loading') : t('TRACKING_SURVEY_SEND', 'Send feedback')}
          </SubmitButton>
          <SkipRow>
            <SkipLink onClick={handleDecline}>{t('TRACKING_SURVEY_SKIP', 'Skip survey')}</SkipLink>
          </SkipRow>
        </QuestionsWrapper>
      )}
    </SurveyContainer>
  )
}
