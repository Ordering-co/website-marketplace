const truncToDecimals = (value, decimals) => parseFloat((Math.trunc(value * 100) / 100).toFixed(decimals))

const getPlanRate = (plan, businessId) => {
  const planOnBusiness = plan?.businesses?.find(b => b.business_id === businessId && b.accumulates)
  return planOnBusiness?.accumulation_rate ?? (!!planOnBusiness && plan?.accumulation_rate) ?? 0
}

export const getRewardValues = ({ loyaltyPlansState, businessId, baseAmount, decimals = 2, disabledRewards = false }) => {
  const creditPointPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'credit_point')
  const cashPlan = loyaltyPlansState?.result?.find(loyal => loyal.type === 'cashback' || loyal.type === 'cash')
  const loyaltyRewardValue = truncToDecimals((baseAmount ?? 0) * getPlanRate(creditPointPlan, businessId), decimals)
  const cashRewardValue = truncToDecimals((baseAmount ?? 0) * getPlanRate(cashPlan, businessId), decimals)
  return {
    loyaltyRewardValue,
    cashRewardValue,
    showLoyaltyReward: !disabledRewards && !!loyaltyRewardValue && isFinite(loyaltyRewardValue),
    showCashReward: !disabledRewards && !!cashRewardValue && isFinite(cashRewardValue)
  }
}
