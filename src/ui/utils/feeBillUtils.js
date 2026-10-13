export const getFeeAmount = (fee) => {
  if (fee?.summary?.amount != null) return fee.summary.amount
  const fixed = Number(fee?.summary?.fixed) || 0
  const percentage = Number(fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) || 0
  return fixed + percentage
}

export const getFeeKey = (fee, index) =>
  `${fee?.type ?? 'fee'}-${fee?.id ?? fee?.fee_id ?? 'null'}-${fee?.name ?? index}-${index}`

export const shouldShowFeeRateDetails = (fee) => fee?.fixed > 0 || fee?.percentage > 0

export const shouldShowFeeItem = (fee) =>
  parseFloat(getFeeAmount(fee)) !== 0 ||
  (fee?.fee_id === null && fee?.type === 'product' && fee?.percentage > 0)
