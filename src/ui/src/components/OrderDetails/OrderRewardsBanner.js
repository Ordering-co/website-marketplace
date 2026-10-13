import React from 'react'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useConfig } from '~components/contexts/ConfigContext'

import { RewardsBanner } from '../RewardsBanner'
import { getRewardValues } from '../RewardsBanner/getRewardValues'
import { getUtils } from '../PaymentOptionWallet/utils'

const EARNED_STATUS = [1, 11, 15]
const ACTIVE_STATUS = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26]

export const OrderRewardsBanner = (props) => {
  const { order } = props
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const { getIcon } = getUtils()

  const status = parseInt(order?.status, 10)
  const isEarnedOrder = EARNED_STATUS.includes(status)
  const isActiveOrder = ACTIVE_STATUS.includes(status)
  const isDisabledRewards = configs?.disabled_rewards?.value === '1'

  const getIncludedTaxes = () => {
    if (order?.taxes?.length === 0) {
      return order?.tax_type === 1 ? (order?.summary?.tax ?? 0) : 0
    }
    return order?.taxes?.reduce((taxIncluded, tax) => {
      return taxIncluded + ((tax?.type === 1 && tax?.target === 'product') ? (tax?.summary?.tax ?? 0) : 0)
    }, 0) ?? 0
  }

  const decimals = configs?.format_number_decimal_length?.value ?? 2
  const baseAmount = (order?.summary?.subtotal ?? order?.subtotal ?? 0) + getIncludedTaxes()
  const rewardValues = getRewardValues({
    loyaltyPlansState: props.loyaltyPlansState,
    businessId: order?.business_id,
    baseAmount,
    decimals,
    disabledRewards: isDisabledRewards
  })

  if ((!isEarnedOrder && !isActiveOrder) || (!rewardValues.showLoyaltyReward && !rewardValues.showCashReward)) {
    return null
  }

  const kicker = isEarnedOrder
    ? t('REWARDS_EARNED_ON_THIS_ORDER', 'Rewards earned on this order')
    : t('REWARDS_ON_THIS_ORDER', "You're earning rewards with this order")
  const loyaltyMessage = isEarnedOrder
    ? t('LOYALTY_POINTS_EARNED', 'You earned :amount: points on this order.')
    : t('LOYALTY_POINTS_TO_EARN', "You'll earn :amount: points once this order is completed.")
  const cashMessage = isEarnedOrder
    ? t('CASHBACK_EARNED', 'You earned :amount: on this order.')
    : t('CASHBACK_TO_EARN', "You'll earn :amount: once this order is completed.")
  const footnote = isEarnedOrder
    ? t('REWARDS_REFLECTED_SOON', "You'll see them reflected in your wallet shortly.")
    : t('REWARDS_SEEN_ON_COMPLETION', "You'll see them in your wallet once your order is completed.")

  const [loyaltyRewardMessageStart, loyaltyRewardMessageEnd] = loyaltyMessage.split(':amount:')
  const [cashRewardMessageStart, cashRewardMessageEnd] = cashMessage.split(':amount:')

  return (
    <RewardsBanner
      showLoyaltyReward={rewardValues.showLoyaltyReward}
      showCashReward={rewardValues.showCashReward}
      loyaltyRewardMessageStart={loyaltyRewardMessageStart}
      loyaltyRewardValue={rewardValues.loyaltyRewardValue}
      loyaltyRewardMessageEnd={loyaltyRewardMessageEnd}
      cashRewardMessageStart={cashRewardMessageStart}
      cashRewardValue={rewardValues.cashRewardValue}
      cashRewardMessageEnd={cashRewardMessageEnd}
      getIcon={getIcon}
      t={t}
      kicker={kicker}
      footnote={footnote}
    />
  )
}
