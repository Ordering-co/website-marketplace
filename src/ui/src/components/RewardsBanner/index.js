import React from 'react'
import {
  RewardsBannerContainer,
  RewardsBannerRow,
  RewardsBannerCard
} from './styles'

import { Icon } from '~ui-icon'

export const RewardsBanner = (props) => {
  const {
    showLoyaltyReward,
    showCashReward,
    loyaltyRewardMessageStart,
    loyaltyRewardValue,
    loyaltyRewardMessageEnd,
    cashRewardMessageStart,
    cashRewardValue,
    cashRewardMessageEnd,
    getIcon,
    t,
    compact,
    kicker,
    footnote
  } = props

  // Only render resolved rewards — there is no loading/skeleton state anymore
  // . The banner appears once a real points/cashback value exists.
  const showBanner = showLoyaltyReward || showCashReward

  if (!showBanner) {
    return null
  }

  const kickerText = kicker || t('REWARDS_ON_THIS_ORDER', "You're earning rewards with this order")

  return (
    <RewardsBannerContainer $compact={compact}>
      <p className='rewards-kicker'>
        {kickerText}
      </p>
      <RewardsBannerRow $compact={compact}>
        {showLoyaltyReward && (
          <RewardsBannerCard $compact={compact}>
            <div className='icon'>
              <Icon name="trophyFilled" size={40} />
            </div>
            <span>
              {loyaltyRewardMessageStart}
              <span className='red'>{loyaltyRewardValue}</span>
              {loyaltyRewardMessageEnd}
            </span>
          </RewardsBannerCard>
        )}
        {showCashReward && (
          <RewardsBannerCard $compact={compact}>
            <div className='icon'>
              {getIcon('cash')}
            </div>
            <span>
              {cashRewardMessageStart}
              <span className='red'>{cashRewardValue}</span>
              {' '}{t('WALLET_CREDITS', 'Wallet credits')}
              {cashRewardMessageEnd}
            </span>
          </RewardsBannerCard>
        )}
      </RewardsBannerRow>
      {footnote && (
        <p className='rewards-footnote'>
          {footnote}
        </p>
      )}
    </RewardsBannerContainer>
  )
}
