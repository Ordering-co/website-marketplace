import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '../../../../../__tests__/helpers/testUtils'
import { RewardsBanner } from '../index'

const t = (_key, fallback) => fallback

describe('RewardsBanner', () => {
  it('renders rewards kicker when cash reward is enabled', () => {
    const { getByText } = renderWithProviders(
      <RewardsBanner
        showCashReward
        showLoyaltyReward={false}
        cashRewardMessageStart='Earn '
        cashRewardValue='$2'
        cashRewardMessageEnd=''
        getIcon={() => null}
        t={t}
      />
    )
    expect(getByText(/You're earning rewards with this order/i)).toBeInTheDocument()
    expect(getByText(/\$2/)).toBeInTheDocument()
  })
})
