const buildHeaders = ({ ordering, token, hashKey }) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-App-X': ordering?.appId,
    'X-INTERNAL-PRODUCT-X': ordering?.appInternalName
  }
  if (token) headers.Authorization = `Bearer ${token}`
  if (hashKey && !token) headers['X-uuid-access-X'] = hashKey
  return headers
}

const post = async (url, auth, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(auth),
    body: JSON.stringify(body)
  })
  const json = await response.json().catch(() => ({ error: true }))
  return !json?.error
}

export const sendOrderSurvey = (auth, order, product) => post(
  `${auth.ordering?.root}/business/${order?.business_id}/reviews`,
  auth,
  {
    order_id: order?.id,
    user_id: auth.userId,
    quality: product.stars,
    delivery: product.stars,
    service: product.stars,
    package: product.stars,
    quality_tags: product.chips.map(chip => chip.key),
    comment: product.comment?.trim() || undefined
  }
)

export const sendDriverSurvey = (auth, order, delivery) => post(
  `${auth.ordering?.root}/users/${order?.driver?.id}/user_reviews`,
  auth,
  {
    order_id: order?.id,
    user_id: order?.driver?.id,
    qualification: delivery.thumb === 'up' ? 5 : 1,
    tags: delivery.chips.map(chip => chip.key),
    comment: delivery.comment?.trim() || undefined
  }
)
